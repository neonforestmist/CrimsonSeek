"use client";

import {
  CalendarRange,
  MessageCircle,
  Quote,
  Radar,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Reveal } from "./reveal";

/**
 * "What you actually see", visual LEFT, text RIGHT (zigzag against
 * the Modes section above and the API section below).
 *
 * The mock is not a screenshot. It is a real composition built from the
 * same tokens so it ages with the design system.
 */
export function DashboardSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1.45fr_0.95fr] lg:items-center lg:gap-20">
        {/* DOM order: text first so it appears ABOVE the mock when the
            grid collapses on mobile. On `lg`, we flip order so the mock
            renders in the wider left column and text in the right. */}
        <Reveal className="lg:order-2">
          <h2 className="text-balance text-[44px] font-semibold leading-[1.0] text-ink md:text-[64px]">
            See what people
            <br />
            really think.
          </h2>
          <p className="mt-7 max-w-md text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
            CrimsonSeek splits the answer from the atmosphere around it. You
            get the cited summary, then the themes, public read, friction points, and
            quotes that reveal how the internet is reacting in the time window
            you chose.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-3.5">
            {[
              { icon: Sparkles, label: "Inline-cited answer" },
              { icon: Radar, label: "Opinion signal" },
              { icon: TrendingUp, label: "Energy and friction" },
              { icon: MessageCircle, label: "Verbatim reactions" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-[13.5px] text-ink-soft"
              >
                <Icon className="h-4 w-4 text-accent-600" strokeWidth={2.1} />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-7 flex max-w-md items-center gap-2.5 rounded-2xl border border-divider/70 bg-white/55 p-4 text-[13.5px] text-ink-soft">
            <UsersRound className="h-4 w-4 flex-none text-accent-600" strokeWidth={2.2} />
            Built for viewing every opinion, from most popular to least, so the
            whole crowd stays visible.
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:order-1">
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div
      className="relative overflow-hidden rounded-[26px] border border-divider/70 bg-white/78 p-4 shadow-[0_1px_2px_rgba(21,18,14,0.04),0_28px_70px_-40px_rgba(21,18,14,0.48)] backdrop-blur-sm md:p-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(21,18,14,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(21,18,14,0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(255,255,255,0.68),rgba(255,255,255,0)_42%)]" />
      <div className="relative">
        {/* Query bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-divider/60 bg-canvas/55 px-3 py-2.5">
          <div>
            <div className="text-[10px] font-semibold uppercase text-ink-faint">
              Query
            </div>
            <div className="text-[13px] font-semibold text-ink">
              iPhone 17 Pro public read
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="rounded-full bg-white px-2 py-0.5 text-ink-soft shadow-[inset_0_0_0_1px_rgba(21,18,14,0.06)]">
              Standard
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-ink-soft shadow-[inset_0_0_0_1px_rgba(21,18,14,0.06)]">
              This year
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
          {/* Answer card */}
          <div className="rounded-2xl border border-divider/60 bg-white/78 p-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
              Cited answer
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-ink/8" />
              <div className="h-2 w-[96%] rounded-full bg-ink/8" />
              <div className="h-2 w-[88%] rounded-full bg-ink/8" />
              <div className="h-2 w-[60%] rounded-full bg-ink/8" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {["theverge.com", "macrumors.com", "reddit.com"].map((host) => (
                <div
                  key={host}
                  className="flex items-center gap-1.5 truncate rounded-md border border-divider/60 bg-white px-2 py-1 text-[9.5px] text-ink-soft"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                  {host}
                </div>
              ))}
            </div>
          </div>

          {/* Public-read card: the room's dominant read. */}
          <div className="rounded-2xl border border-divider/60 bg-white/78 p-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
              Public read
            </div>
            <div className="flex items-center justify-center py-2">
              <PublicReadDonutMock />
            </div>
            <div className="mt-2 flex justify-around text-center text-[9px]">
              <div>
                <div className="flex items-center justify-center gap-1 text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  Supportive
                </div>
                <div className="font-semibold text-ink">62%</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  Neutral
                </div>
                <div className="font-semibold text-ink">24%</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-rose-500" />
                  Critical
                </div>
                <div className="font-semibold text-ink">14%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Themes bar */}
        <div className="mt-3 rounded-2xl border border-divider/60 bg-white/78 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
              What keeps coming up
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-accent-700">
              <Quote className="h-3 w-3" strokeWidth={2.4} />
              41 quotes
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Camera finally earns the hype", value: 78, tone: "positive" as const },
              { label: "Battery claims need receipts", value: 56, tone: "neutral" as const },
              { label: "Price jump fatigue", value: 41, tone: "negative" as const },
              { label: "Design change feels familiar", value: 33, tone: "neutral" as const },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="w-40 truncate text-[11px] text-ink-soft">
                  {t.label}
                </div>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.value}%`,
                      background:
                        t.tone === "positive"
                          ? "#10b981"
                          : t.tone === "negative"
                            ? "#f43f5e"
                            : "#94a3b8",
                    }}
                  />
                </div>
                <div className="w-8 text-right font-mono text-[10px] text-ink-muted">
                  {t.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            { year: "2026", label: "Launch window", value: "76" },
            { year: "2025", label: "Pre-release rumors", value: "58" },
            { year: "2024", label: "Upgrade fatigue", value: "42" },
            { year: "2023", label: "Baseline chatter", value: "35" },
          ].map((item) => (
            <div
              key={item.year}
              className="rounded-xl border border-divider/60 bg-white/78 p-3"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-ink-faint">
                <span>{item.year}</span>
                <CalendarRange className="h-3 w-3 text-accent-600" />
              </div>
              <div className="mt-2 text-[20px] font-semibold tabular-nums text-ink">
                {item.value}
              </div>
              <div className="mt-0.5 truncate text-[10px] text-ink-muted">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicReadDonutMock() {
  const r = 26;
  const c = 2 * Math.PI * r;
  const positive = 0.62;
  const neutral = 0.24;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20">
      <circle
        cx={40}
        cy={40}
        r={r}
        fill="none"
        stroke="#f43f5e"
        strokeWidth={10}
      />
      <circle
        cx={40}
        cy={40}
        r={r}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={10}
        strokeDasharray={`${c * (positive + neutral)} ${c}`}
        strokeDashoffset={0}
        transform="rotate(-90 40 40)"
      />
      <circle
        cx={40}
        cy={40}
        r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth={10}
        strokeDasharray={`${c * positive} ${c}`}
        strokeDashoffset={0}
        transform="rotate(-90 40 40)"
      />
      <text
        x={40}
        y={44}
        textAnchor="middle"
        className="fill-ink"
        fontSize={11}
        fontWeight={600}
      >
        62%
      </text>
    </svg>
  );
}
