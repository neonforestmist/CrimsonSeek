"use client";

import { GlassCard } from "@/components/ui/glass-card";

interface Props {
  answer: string;
}

export function AnswerCard({ answer }: Props) {
  return (
    <GlassCard intensity="elevated" padding="p-8 md:p-10">
      <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        <span className="inline-block h-1 w-1 rounded-full bg-accent-500" />
        Answer
      </div>
      <div className="whitespace-pre-wrap text-[17px] leading-[1.65] text-ink">
        {answer}
      </div>
    </GlassCard>
  );
}
