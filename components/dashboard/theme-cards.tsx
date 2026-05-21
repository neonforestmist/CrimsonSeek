"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SentimentBreakdown } from "@/lib/linkup";

interface Props {
  themes: SentimentBreakdown["themes"];
}

const ICON = {
  positive: TrendingUp,
  neutral: Minus,
  negative: TrendingDown,
};

const SENTIMENT_COLOR = {
  positive: "#10b981",
  neutral: "#94a3b8",
  negative: "#f43f5e",
};

const SENTIMENT_PILL = {
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200/70",
  negative: "bg-rose-50 text-rose-700 ring-rose-200/70",
};

const REACTION_LABEL = {
  positive: "supportive",
  neutral: "context",
  negative: "critical",
};

export function ThemeCards({ themes }: Props) {
  const chartData = themes.map((t) => ({
    name: t.title,
    value: t.share_of_voice,
    sentiment: t.sentiment,
  }));

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          What people are talking about
        </h2>
        <span className="text-xs text-ink-muted">{themes.length} themes</span>
      </div>

      <GlassCard intensity="elevated" className="mb-4" padding="p-6">
        <div className="mb-3 text-xs text-ink-muted">Share of conversation</div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                tick={{ fill: "#52525b", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
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
                cursor={{ fill: "rgba(24,24,27,0.04)" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={SENTIMENT_COLOR[entry.sentiment]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2">
        {themes.map((t, i) => {
          const Icon = ICON[t.sentiment];
          return (
            <GlassCard
              key={`${t.title}-${i}`}
              padding="p-5"
              intensity="subtle"
              className="transition-all hover:bg-white"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h4 className="text-[15px] font-semibold tracking-tight text-ink">
                  {t.title}
                </h4>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset ${SENTIMENT_PILL[t.sentiment]}`}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {REACTION_LABEL[t.sentiment]}
                </span>
              </div>
              <p className="mb-3 text-[13px] leading-relaxed text-ink-soft">
                {t.summary}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                <div className="h-1 flex-1 rounded-full bg-canvas-soft">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${t.share_of_voice}%`,
                      background: SENTIMENT_COLOR[t.sentiment],
                    }}
                  />
                </div>
                <span className="font-mono tabular-nums">
                  {Math.round(t.share_of_voice)}%
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
