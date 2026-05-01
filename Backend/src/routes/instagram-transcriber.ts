import { Router } from "express";
import { z } from "zod";
import {
  extractInstagramShortcode,
  InstagramTranscriberProgress,
  InstagramTranscriberStep,
  InstagramTranscriptionResult,
  transcribeInstagramReel,
} from "../lib/instagram-transcriber.js";
import { createId } from "../lib/ids.js";

const instagramTranscriberRouter = Router();

const createJobSchema = z.object({
  url: z.string().trim().min(1).max(2_000),
});

type InstagramTranscriptionJob = {
  id: string;
  sourceUrl: string;
  status: "running" | "completed" | "failed";
  step: InstagramTranscriberStep;
  message: string;
  createdAt: string;
  updatedAt: string;
  result: InstagramTranscriptionResult | null;
  error: string | null;
};

const jobs = new Map<string, InstagramTranscriptionJob>();
const JOB_TTL_MS = 60 * 60 * 1000;

function serializeJob(job: InstagramTranscriptionJob) {
  return {
    id: job.id,
    sourceUrl: job.sourceUrl,
    status: job.status,
    step: job.step,
    message: job.message,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    result: job.result,
    error: job.error,
  };
}

function cleanupOldJobs() {
  const cutoff = Date.now() - JOB_TTL_MS;

  for (const [id, job] of jobs) {
    if (new Date(job.updatedAt).getTime() < cutoff) {
      jobs.delete(id);
    }
  }
}

function updateJob(job: InstagramTranscriptionJob, progress: InstagramTranscriberProgress) {
  job.step = progress.step;
  job.message = progress.message;
  job.updatedAt = new Date().toISOString();
}

instagramTranscriberRouter.post("/jobs", (req, res) => {
  cleanupOldJobs();

  const parsed = createJobSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsed.error.flatten(),
    });
  }

  try {
    extractInstagramShortcode(parsed.data.url);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Enter a valid Instagram Reel URL.",
    });
  }

  const now = new Date().toISOString();
  const job: InstagramTranscriptionJob = {
    id: createId("igt"),
    sourceUrl: parsed.data.url,
    status: "running",
    step: "queued",
    message: "Queued and ready to start.",
    createdAt: now,
    updatedAt: now,
    result: null,
    error: null,
  };

  jobs.set(job.id, job);

  void transcribeInstagramReel({
    url: parsed.data.url,
    onProgress: (progress) => updateJob(job, progress),
  })
    .then((result) => {
      job.status = "completed";
      job.step = "completed";
      job.message = "Transcription complete.";
      job.result = result;
      job.updatedAt = new Date().toISOString();
    })
    .catch((error) => {
      console.error("Instagram transcription job failed", error);
      job.status = "failed";
      job.step = "failed";
      job.message = "The Reel could not be transcribed.";
      job.error = error instanceof Error ? error.message : "Unknown transcription error.";
      job.updatedAt = new Date().toISOString();
    });

  return res.status(202).json({
    job: serializeJob(job),
  });
});

instagramTranscriberRouter.get("/jobs/:jobId", (req, res) => {
  cleanupOldJobs();

  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({
      error: "Transcription job not found.",
    });
  }

  return res.json({
    job: serializeJob(job),
  });
});

export { instagramTranscriberRouter };
