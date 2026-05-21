"use client";

import {
  ArrowUpRight,
  CalendarRange,
  Gauge,
  Globe2,
  ListChecks,
  SlidersHorizontal,
} from "lucide-react";
import { Reveal } from "./reveal";

/**
 * "Built on Linkup", text LEFT, modular API cells RIGHT.
 *
 * No kicker. The headline carries the credit. The widget is deliberately
 * product-facing rather than a raw endpoint example, so the section reads
 * as capability, not docs.
 */

export function ApiSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.95fr_1.55fr] lg:items-center lg:gap-20">
        <Reveal>
          <h2 className="text-balance text-[44px] font-semibold leading-[1.0] text-ink md:text-[58px]">
            Modular search
            <br />
            for serious
            <br />
            analysis.
          </h2>
          <p className="mt-7 max-w-md text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
            Linkup offers a verbose and modular Web Search API for
            sophisticated analysis. CrimsonSeek can tune depth, time, and source
            focus while keeping citations and structured answers attached to the
            live web.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://docs.linkup.so"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[13.5px] font-semibold text-canvas transition-transform hover:scale-[1.03]"
            >
              API docs
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ApiModularityGrid />
        </Reveal>
      </div>
    </section>
  );
}

const API_MODULES = [
  {
    icon: Gauge,
    name: "Effort and depth",
    tag: "Fast / Standard / Deep",
    body: "Choose how hard retrieval should work, from a quick pulse check to multi-step research across messy evidence.",
    proof: "Search intensity",
    illustration: <DepthModuleIllustration />,
  },
  {
    icon: CalendarRange,
    name: "Time windows",
    tag: "Year / range / custom",
    body: "Compare what changed by year, isolate launch windows, or keep old hype from polluting a current read.",
    proof: "Comparable periods",
    illustration: <TimeModuleIllustration />,
  },
  {
    icon: Globe2,
    name: "Specific sites",
    tag: "Domains / sources / forums",
    body: "Bias retrieval toward the places that matter, including trusted domains, communities, reviews, and source sets.",
    proof: "Source focus",
    illustration: <SitesModuleIllustration />,
  },
];

function ApiModularityGrid() {
  return (
    <div className="relative">
      <div className="absolute left-4 right-4 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-accent-400/45 to-transparent sm:block" />
      <div className="grid gap-5 sm:grid-cols-3">
        {API_MODULES.map((item, i) => (
          <ApiModuleTile key={item.name} index={i + 1} {...item} />
        ))}
      </div>
    </div>
  );
}

function ApiModuleTile({
  icon: Icon,
  name,
  tag,
  body,
  illustration,
  proof,
  index,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
  tag: string;
  body: string;
  illustration: React.ReactNode;
  proof: string;
  index: number;
}) {
  return (
    <div className="group relative flex h-full flex-col rounded-[22px] border border-divider/70 bg-white/62 p-3 shadow-[0_1px_2px_rgba(21,18,14,0.04),0_22px_54px_-34px_rgba(21,18,14,0.42)] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1">
      <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-semibold uppercase text-ink-faint">
        <span>Module {String(index).padStart(2, "0")}</span>
        <ListChecks className="h-3.5 w-3.5 text-accent-500" strokeWidth={2.3} />
      </div>
      <div
        className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-white/65"
        style={{
          backgroundImage:
            "linear-gradient(rgba(21,18,14,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(21,18,14,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          boxShadow:
            "inset 0 0 0 1px rgba(21,18,14,0.06), 0 1px 2px rgba(21,18,14,0.04), 0 14px 32px -16px rgba(21,18,14,0.10)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {illustration}
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-2 text-ink">
        <Icon className="h-4 w-4 self-center text-accent-600" strokeWidth={2.25} />
        <span className="text-[18px] font-semibold tracking-tight">
          {name}
        </span>
      </div>
      <div className="mt-1 text-[12.5px] font-medium text-ink-faint">
        {tag}
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
        {body}
      </p>
      <div className="mt-auto pt-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.035] px-2.5 py-1 text-[12px] font-medium text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          {proof}
        </div>
      </div>
    </div>
  );
}

function DepthModuleIllustration() {
  return (
    <div className="flex w-full items-end justify-center gap-3 px-6">
      {[34, 52, 74].map((height, i) => (
        <div key={height} className="flex flex-col items-center gap-2">
          <div
            className="w-8 rounded-t-full bg-accent-500/80 shadow-[0_10px_22px_-14px_rgba(217,79,48,0.9)]"
            style={{ height }}
          />
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" style={{ opacity: 0.45 + i * 0.2 }} />
        </div>
      ))}
    </div>
  );
}

function TimeModuleIllustration() {
  return (
    <svg viewBox="0 0 120 96" className="h-full w-full text-accent-500" fill="none">
      <rect x="26" y="24" width="68" height="48" rx="10" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      <path d="M26 38h68" stroke="currentColor" strokeWidth="2" opacity="0.65" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={42 + i * 13} cy={53} r={3.5} fill="currentColor" opacity={i === 2 ? 1 : 0.35} />
      ))}
      <path d="M40 18v12M80 18v12" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function SitesModuleIllustration() {
  return (
    <svg viewBox="0 0 120 96" className="h-full w-full text-accent-500" fill="none">
      <circle cx="60" cy="48" r="10" fill="currentColor" />
      {[
        [28, 28],
        [92, 28],
        [32, 70],
        [88, 70],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <line x1="60" y1="48" x2={x} y2={y} stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
          <circle cx={x} cy={y} r="5" fill="currentColor" opacity="0.75" />
        </g>
      ))}
      <SlidersHorizontal x="48" y="36" className="h-6 w-6 text-white" strokeWidth={2.4} />
    </svg>
  );
}
