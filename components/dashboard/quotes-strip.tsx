"use client";

import { GlassCard } from "@/components/ui/glass-card";
import type { SentimentBreakdown } from "@/lib/linkup";

interface Props {
  quotes: SentimentBreakdown["notable_quotes"];
}

const ACCENT = {
  positive: "before:bg-emerald-400",
  neutral: "before:bg-slate-400",
  negative: "before:bg-rose-400",
};

export function QuotesStrip({ quotes }: Props) {
  if (!quotes?.length) return null;

  return (
    <div>
      <div className="mb-4 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        Notable quotes
      </div>
      <div className="space-y-2.5">
        {quotes.map((q, i) => (
          <GlassCard
            key={i}
            padding="p-4 pl-5"
            intensity="subtle"
            className={`relative before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[2px] before:rounded-full ${ACCENT[q.sentiment]}`}
          >
            <p className="mb-2 text-[13px] italic leading-relaxed text-ink-soft">
              “{q.quote}”
            </p>
            <div className="text-[11px] uppercase tracking-wider text-ink-muted">
              {q.source}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
