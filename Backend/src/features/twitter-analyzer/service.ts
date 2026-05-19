import { env } from "../../config/env.js";
import { ai, GEMINI_TEXT_MODEL } from "../../lib/gemini.js";
import { geminiDigestSchema, geminiResponseSchema } from "./schema.js";
import type { Tweet, TwitterDigestResult } from "./types.js";

const TWITTER_BASE = "https://api.twitterapi.io";
const FETCH_TIMEOUT_MS = 15_000;

function twitterHeaders(): Record<string, string> {
  if (!env.TWITTERAPI_IO_KEY) {
    throw new Error("TWITTERAPI_IO_KEY is not configured.");
  }
  return { "x-api-key": env.TWITTERAPI_IO_KEY };
}

function normalizeTweet(raw: Record<string, unknown>): Tweet {
  const metrics = raw.public_metrics as Record<string, unknown> | undefined;
  return {
    id: String(raw.id ?? raw.tweet_id ?? raw.id_str ?? ""),
    text: String(raw.text ?? raw.full_text ?? ""),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    likeCount: Number(raw.likeCount ?? metrics?.like_count ?? raw.favorite_count ?? 0),
    retweetCount: Number(raw.retweetCount ?? metrics?.retweet_count ?? raw.retweet_count ?? 0),
    replyCount: Number(raw.replyCount ?? metrics?.reply_count ?? raw.reply_count ?? 0),
  };
}

async function fetchTweets(username: string): Promise<Tweet[]> {
  const url = new URL(`${TWITTER_BASE}/twitter/user/last_tweets`);
  url.searchParams.set("userName", username);

  const response = await fetch(url.toString(), {
    headers: twitterHeaders(),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (response.status === 404) {
    throw new Error(`Twitter user @${username} was not found.`);
  }

  if (!response.ok) {
    throw new Error(`Twitter API returned ${response.status}. Try again later.`);
  }

  const body = (await response.json()) as Record<string, unknown>;

  const rawData = body?.data as Record<string, unknown> | undefined;
  const rawTweets = (rawData?.tweets ?? body?.tweets ?? []) as Record<string, unknown>[];

  return rawTweets.map(normalizeTweet).filter((t) => t.text.trim().length > 0);
}

function buildPrompt(tweets: Tweet[]): string {
  const lines = tweets
    .map((t, i) => `[${i + 1}] ${t.text}\n  ❤️ ${t.likeCount}  🔁 ${t.retweetCount}  💬 ${t.replyCount}`)
    .join("\n\n");

  return `Analyze these ${tweets.length} tweets from a Twitter/X user and return a structured JSON digest.

${lines}

Fields:
- summary: 2-3 sentence overview of what this person tweets about
- mainTopics: 3-6 concise topic strings
- writingStyle: one sentence describing their tone and writing style
- sentiment: overall emotional tone — "positive", "neutral", "negative", or "mixed"
- engagementInsight: one sentence about what content gets the most likes or retweets
- notableTweets: up to 3 objects { text, reason } highlighting the most interesting tweets`;
}

export async function analyzeTwitterTimeline(username: string): Promise<TwitterDigestResult> {
  const tweets = await fetchTweets(username);

  if (tweets.length === 0) {
    throw new Error(`No public tweets found for @${username}. The account may be private or empty.`);
  }

  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: buildPrompt(tweets) }] }],
    config: {
      temperature: 0.3,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema,
    },
  });

  const text =
    response.text ?? response.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ?? "";

  if (!text) {
    throw new Error("Gemini returned an empty analysis.");
  }

  const digest = geminiDigestSchema.parse(JSON.parse(text));

  return {
    username,
    tweetCount: tweets.length,
    ...digest,
  };
}
