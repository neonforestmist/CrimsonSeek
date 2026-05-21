"use client";

import { GlassCard } from "@/components/ui/glass-card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SentimentBreakdown } from "@/lib/linkup";

interface Props {
  data: SentimentBreakdown;
}

const TONE_LABEL: Record<SentimentBreakdown["overall_tone"], string> = {
  very_positive: "Strong support",
  positive: "Supportive",
  mixed: "Mixed",
  negative: "Critical",
  very_negative: "Strong pushback",
};

const TONE_DOT: Record<SentimentBreakdown["overall_tone"], string> = {
  very_positive: "bg-emerald-500",
  positive: "bg-emerald-500",
  mixed: "bg-amber-500",
  negative: "bg-rose-500",
  very_negative: "bg-rose-500",
};

const POSITIVE = "#10b981";
const NEUTRAL = "#a1a1aa";
const NEGATIVE = "#f43f5e";

export function SentimentDonut({ data }: Props) {
  const chartData = [
    { name: "Supportive", value: data.positive_pct, color: POSITIVE },
    { name: "Neutral", value: data.neutral_pct, color: NEUTRAL },
    { name: "Critical", value: data.negative_pct, color: NEGATIVE },
  ];

  return (
    <GlassCard intensity="elevated" padding="p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Public read
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-ink">
          <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[data.overall_tone]}`} />
          {TONE_LABEL[data.overall_tone]}
        </span>
      </div>

      <div className="relative mx-auto h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e7e3da",
                borderRadius: 10,
                fontSize: 12,
                color: "#18181b",
                boxShadow: "0 8px 24px -8px rgba(0,0,0,0.12)",
              }}
              formatter={(v: number) => `${v.toFixed(0)}%`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[32px] font-semibold tracking-tight text-ink leading-none">
            {Math.round(data.positive_pct)}%
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-ink-muted">
            supportive
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        {chartData.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
              {d.name}
            </div>
            <div className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
              {Math.round(d.value)}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-divider/60 pt-4">
        <div className="rounded-xl border border-divider/70 bg-canvas/60 px-3.5 py-3">
          <p className="text-[13px] italic leading-snug text-ink">
            “{data.one_line_verdict}”
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
