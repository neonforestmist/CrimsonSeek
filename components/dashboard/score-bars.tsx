"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Flame, Swords } from "lucide-react";

interface Props {
  hype: number;
  controversy: number;
}

function ScoreRow({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-ink">
          <Icon className="h-3.5 w-3.5 text-ink-muted" />
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-mono tabular-nums text-ink-muted">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-canvas-soft">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: gradient,
          }}
        />
      </div>
    </div>
  );
}

export function ScoreBars({ hype, controversy }: Props) {
  return (
    <GlassCard intensity="regular" padding="p-6">
      <div className="mb-5 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        Signal
      </div>
      <div className="space-y-5">
        <ScoreRow
          icon={Flame}
          label="Energy"
          value={hype}
          gradient="linear-gradient(90deg, #fb923c, #ea4f31)"
        />
        <ScoreRow
          icon={Swords}
          label="Friction"
          value={controversy}
          gradient="linear-gradient(90deg, #a78bfa, #ec4899)"
        />
      </div>
    </GlassCard>
  );
}
