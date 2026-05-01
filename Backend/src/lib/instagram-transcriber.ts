import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createPartFromUri, FileState } from "@google/genai";
import { z } from "zod";
import { env } from "../config/env.js";
import { ai } from "./gemini.js";

const execFileAsync = promisify(execFile);

const MAX_DOWNLOAD_BYTES = 500 * 1024 * 1024;
const GEMINI_FILE_POLL_INTERVAL_MS = 2_500;
const GEMINI_FILE_MAX_POLLS = 48;

export type InstagramTranscriberStep =
  | "queued"
  | "resolving"
  | "downloading"
  | "optimizing"
  | "uploading"
  | "transcribing"
  | "completed"
  | "failed";

export type InstagramTranscriberProgress = {
  step: InstagramTranscriberStep;
  message: string;
};

export type InstagramTranscriptSegment = {
  start: string;
  end: string;
  text: string;
};

export type InstagramTranscriptionResult = {
  sourceUrl: string;
  shortcode: string;
  resolver: string;
  mediaBytes: number;
  uploadedMimeType: string;
  language: string;
  transcript: string;
  segments: InstagramTranscriptSegment[];
  summary: string;
  hooks: string[];
  quotes: string[];
};

type ResolvedInstagramMedia = {
  mediaUrl: string;
  shortcode: string;
  resolver: string;
  thumbnailUrl?: string;
};

type TranscriptionProgressHandler = (progress: InstagramTranscriberProgress) => void;

const transcriptSchema = z.object({
  language: z.string().min(1).default("unknown"),
  transcript: z.string().default(""),
  segments: z
    .array(
      z.object({
        start: z.string().default("00:00"),
        end: z.string().default("00:00"),
        text: z.string().default(""),
      }),
    )
    .default([]),
  summary: z.string().default(""),
  hooks: z.array(z.string()).default([]),
  quotes: z.array(z.string()).default([]),
});

export function extractInstagramShortcode(inputUrl: string) {
  let parsed: URL;

  try {
    parsed = new URL(inputUrl);
  } catch {
    throw new Error("Enter a valid Instagram Reel URL.");
  }

  const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

  if (!["instagram.com", "instagr.am"].includes(hostname)) {
    throw new Error("Only Instagram URLs are supported.");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  const markerIndex = parts.findIndex((part) => ["reel", "reels", "p", "tv"].includes(part));
  const shortcode = markerIndex >= 0 ? parts[markerIndex + 1] : undefined;

  if (!shortcode || !/^[A-Za-z0-9_-]+$/.test(shortcode)) {
    throw new Error("Could not find an Instagram Reel shortcode in that URL.");
  }

  return shortcode;
}

function normalizeInstagramUrl(inputUrl: string) {
  const shortcode = extractInstagramShortcode(inputUrl);
  return {
    shortcode,
    url: `https://www.instagram.com/reel/${shortcode}/`,
  };
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

async function resolveWithInstaloader(url: string, shortcode: string): Promise<ResolvedInstagramMedia> {
  const script = [
    "import json, sys",
    "from instaloader import Instaloader, Post",
    "loader = Instaloader(download_videos=False, download_video_thumbnails=False, save_metadata=False, quiet=True)",
    "post = Post.from_shortcode(loader.context, sys.argv[1])",
    "print(json.dumps({'videoUrl': post.video_url, 'thumbnailUrl': post.url}))",
  ].join("\n");

  const { stdout } = await execFileAsync("python3", ["-c", script, shortcode], {
    timeout: 45_000,
    maxBuffer: 1024 * 1024,
  });

  const parsed = JSON.parse(stdout.trim()) as { videoUrl?: unknown; thumbnailUrl?: unknown };

  if (!isHttpUrl(parsed.videoUrl)) {
    throw new Error("Instaloader did not return a downloadable video URL.");
  }

  return {
    mediaUrl: parsed.videoUrl,
    shortcode,
    resolver: "instaloader",
    thumbnailUrl: isHttpUrl(parsed.thumbnailUrl) ? parsed.thumbnailUrl : undefined,
  };
}

async function resolveWithInstagramUrlDirect(url: string, shortcode: string): Promise<ResolvedInstagramMedia> {
  const { instagramGetUrl } = await import("instagram-url-direct");
  const result = await instagramGetUrl(url);
  const video = result.media_details?.find((item) => item.type === "video" && isHttpUrl(item.url));
  const fallbackUrl = result.url_list?.find(isHttpUrl);
  const mediaUrl = video?.url ?? fallbackUrl;

  if (!isHttpUrl(mediaUrl)) {
    throw new Error("instagram-url-direct did not return a downloadable video URL.");
  }

  return {
    mediaUrl,
    shortcode,
    resolver: "instagram-url-direct",
    thumbnailUrl: isHttpUrl(video?.thumbnail) ? video.thumbnail : undefined,
  };
}

async function resolveWithReelflow(url: string, shortcode: string): Promise<ResolvedInstagramMedia> {
  const { getVideoInfo } = await import("reelflow");
  const result = await getVideoInfo(url);

  if (!isHttpUrl(result.videoUrl)) {
    throw new Error("reelflow did not return a downloadable video URL.");
  }

  return {
    mediaUrl: result.videoUrl,
    shortcode,
    resolver: "reelflow",
    thumbnailUrl: isHttpUrl(result.thumbnailUrl) ? result.thumbnailUrl : isHttpUrl(result.thumbnail) ? result.thumbnail : undefined,
  };
}

async function resolveWithCommand(command: string, args: string[], shortcode: string): Promise<ResolvedInstagramMedia> {
  const { stdout } = await execFileAsync(command, args, {
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  });
  const mediaUrl = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(isHttpUrl);

  if (!mediaUrl) {
    throw new Error(`${command} did not return a downloadable video URL.`);
  }

  return {
    mediaUrl,
    shortcode,
    resolver: command,
  };
}

async function resolveInstagramMedia(inputUrl: string): Promise<ResolvedInstagramMedia> {
  const { shortcode, url } = normalizeInstagramUrl(inputUrl);
  const providers: Array<() => Promise<ResolvedInstagramMedia>> = [
    () => resolveWithInstaloader(url, shortcode),
    () => resolveWithInstagramUrlDirect(url, shortcode),
    () => resolveWithReelflow(url, shortcode),
    () => resolveWithCommand("yt-dlp", ["--no-playlist", "--no-warnings", "-g", url], shortcode),
    () => resolveWithCommand("gallery-dl", ["-g", url], shortcode),
  ];
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      return await provider();
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  console.warn("Instagram resolver chain failed", errors);
  throw new Error(
    "Could not resolve that public Reel into a video URL. The Reel may be removed, restricted, rate-limited, or temporarily blocked by Instagram.",
  );
}

async function downloadMedia(mediaUrl: string, destinationPath: string) {
  const response = await fetch(mediaUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      accept: "video/mp4,video/*,*/*;q=0.8",
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Instagram CDN download failed with HTTP ${response.status}.`);
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);

  if (contentLength > MAX_DOWNLOAD_BYTES) {
    throw new Error("This Reel is too large to process safely.");
  }

  let downloadedBytes = 0;
  const sizeGuard = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      downloadedBytes += chunk.byteLength;

      if (downloadedBytes > MAX_DOWNLOAD_BYTES) {
        callback(new Error("This Reel is too large to process safely."));
        return;
      }

      callback(null, chunk);
    },
  });

  await pipeline(Readable.from(response.body as AsyncIterable<Uint8Array>), sizeGuard, createWriteStream(destinationPath));

  return downloadedBytes || contentLength;
}

async function tryExtractAudio(videoPath: string, audioPath: string) {
  try {
    await execFileAsync(
      "ffmpeg",
      ["-y", "-i", videoPath, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "96k", audioPath],
      {
        timeout: 120_000,
        maxBuffer: 1024 * 1024,
      },
    );

    return {
      path: audioPath,
      mimeType: "audio/mpeg",
      optimized: true,
    };
  } catch (error) {
    console.warn("ffmpeg audio extraction failed, falling back to video upload.", error);

    return {
      path: videoPath,
      mimeType: "video/mp4",
      optimized: false,
    };
  }
}

async function waitForGeminiFile(name: string) {
  for (let attempt = 0; attempt < GEMINI_FILE_MAX_POLLS; attempt += 1) {
    const file = await ai.files.get({ name });

    if (file.state === FileState.ACTIVE || !file.state) {
      return file;
    }

    if (file.state === FileState.FAILED) {
      throw new Error(file.error?.message ?? "Gemini failed to process the uploaded media file.");
    }

    await new Promise((resolve) => setTimeout(resolve, GEMINI_FILE_POLL_INTERVAL_MS));
  }

  throw new Error("Gemini took too long to process the uploaded media file.");
}

function cleanJsonText(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
}

async function transcribeWithGemini(filePath: string, mimeType: string) {
  const uploaded = await ai.files.upload({
    file: filePath,
    config: {
      mimeType,
      displayName: `instagram-reel-${randomUUID()}`,
    },
  });

  if (!uploaded.name || !uploaded.uri) {
    throw new Error("Gemini did not return an uploaded file reference.");
  }

  const activeFile = await waitForGeminiFile(uploaded.name);
  const fileUri = activeFile.uri ?? uploaded.uri;
  const fileMimeType = activeFile.mimeType ?? mimeType;

  try {
    const response = await ai.models.generateContent({
      model: env.GEMINI_TRANSCRIPTION_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            createPartFromUri(fileUri, fileMimeType),
            {
              text:
                "Transcribe the spoken audio in this Instagram Reel. Return only JSON with language, transcript, timestamped segments, summary, hooks, and memorable quotes. If there is music or silence, ignore it unless there are lyrics or spoken words.",
            },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        maxOutputTokens: 32768,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            language: { type: "string" },
            transcript: { type: "string" },
            segments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  start: { type: "string" },
                  end: { type: "string" },
                  text: { type: "string" },
                },
                required: ["start", "end", "text"],
              },
            },
            summary: { type: "string" },
            hooks: { type: "array", items: { type: "string" } },
            quotes: { type: "array", items: { type: "string" } },
          },
          required: ["language", "transcript", "segments", "summary", "hooks", "quotes"],
        },
      },
    });

    const text = response.text ?? response.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty transcription.");
    }

    return transcriptSchema.parse(JSON.parse(cleanJsonText(text)));
  } finally {
    await ai.files.delete({ name: uploaded.name }).catch((error) => {
      console.warn("Failed to delete Gemini uploaded file", error);
    });
  }
}

export async function transcribeInstagramReel(input: {
  url: string;
  onProgress: TranscriptionProgressHandler;
}): Promise<InstagramTranscriptionResult> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in Backend/.env.");
  }

  const jobId = randomUUID();
  const workDir = path.join(tmpdir(), "aitools-instagram-transcriber", jobId);
  const videoPath = path.join(workDir, "source.mp4");
  const audioPath = path.join(workDir, "audio.mp3");

  await mkdir(workDir, { recursive: true });

  try {
    input.onProgress({
      step: "resolving",
      message: "Resolving the public Instagram Reel into a temporary media URL.",
    });
    const media = await resolveInstagramMedia(input.url);

    input.onProgress({
      step: "downloading",
      message: `Downloading the Reel video using ${media.resolver}.`,
    });
    const downloadedBytes = await downloadMedia(media.mediaUrl, videoPath);

    input.onProgress({
      step: "optimizing",
      message: "Extracting lightweight audio for faster Gemini transcription.",
    });
    const uploadFile = await tryExtractAudio(videoPath, audioPath);
    const fileStats = await stat(uploadFile.path);

    input.onProgress({
      step: "uploading",
      message: uploadFile.optimized
        ? "Uploading the optimized audio to Gemini."
        : "ffmpeg is unavailable, uploading the downloaded video to Gemini.",
    });

    input.onProgress({
      step: "transcribing",
      message: "Gemini is transcribing the Reel and structuring the result.",
    });
    const transcription = await transcribeWithGemini(uploadFile.path, uploadFile.mimeType);

    return {
      sourceUrl: input.url,
      shortcode: media.shortcode,
      resolver: media.resolver,
      mediaBytes: uploadFile.optimized ? fileStats.size : downloadedBytes,
      uploadedMimeType: uploadFile.mimeType,
      language: transcription.language,
      transcript: transcription.transcript,
      segments: transcription.segments,
      summary: transcription.summary,
      hooks: transcription.hooks,
      quotes: transcription.quotes,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch((error) => {
      console.warn("Failed to clean Instagram transcriber temp files", error);
    });
  }
}
