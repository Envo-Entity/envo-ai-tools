import { TwitterDigestResult, TwitterSentiment } from "@/lib/api";

const SENTIMENT_STYLES: Record<TwitterSentiment, { label: string; color: string }> = {
  positive: { label: "Positive", color: "#6ee7b7" },
  neutral: { label: "Neutral", color: "#94a3b8" },
  negative: { label: "Negative", color: "#fca5a5" },
  mixed: { label: "Mixed", color: "#fcd34d" },
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
      <h2 className="font-title text-2xl tracking-[-0.04em]">{title}</h2>
      <div className="mt-3">{children}</div>
    </article>
  );
}

type Props = { result: TwitterDigestResult };

export function AnalysisResult({ result }: Props) {
  const sentiment = SENTIMENT_STYLES[result.sentiment];

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
            Analysis complete
          </p>
          <p className="font-body mt-1 text-sm text-[color:var(--color-text-secondary)]">
            @{result.username} · {result.tweetCount} tweets analyzed
          </p>
        </div>
        <div
          className="font-body inline-flex w-fit items-center rounded-full border px-4 py-1.5 text-sm"
          style={{ borderColor: `${sentiment.color}50`, color: sentiment.color }}
        >
          {sentiment.label}
        </div>
      </div>

      <SectionCard title="Summary">
        <p className="font-body text-sm leading-7 text-[color:var(--color-text-secondary)]">
          {result.summary}
        </p>
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Main Topics">
          <div className="flex flex-wrap gap-2">
            {result.mainTopics.map((topic) => (
              <span
                key={topic}
                className="font-body rounded-full border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs text-[color:var(--color-text-secondary)]"
              >
                {topic}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Writing Style">
          <p className="font-body text-sm leading-7 text-[color:var(--color-text-secondary)]">
            {result.writingStyle}
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Engagement Insight">
        <p className="font-body text-sm leading-7 text-[color:var(--color-text-secondary)]">
          {result.engagementInsight}
        </p>
      </SectionCard>

      {result.notableTweets.length > 0 && (
        <SectionCard title="Notable Tweets">
          <div className="grid gap-3">
            {result.notableTweets.map((tweet, i) => (
              <div
                key={i}
                className="rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-4"
              >
                <p className="font-body text-sm leading-7 text-[color:var(--color-text)]">
                  {tweet.text}
                </p>
                <p className="font-body mt-2 text-xs text-[color:var(--color-accent)]">
                  {tweet.reason}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
