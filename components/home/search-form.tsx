"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  Brain,
  Code2,
  Glasses,
  Info,
  Search,
  Smartphone,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { DepthSelector } from "@/components/home/depth-selector";
import { YearSelector, type DateRange } from "@/components/home/year-selector";
import { SitesSelector, type SiteFilter } from "@/components/home/sites-selector";
import { AnimatedPlaceholder } from "@/components/home/animated-placeholder";
import { DEPTH_OPTIONS, type Depth } from "@/lib/linkup";

interface ExamplePreset {
  icon: LucideIcon;
  label: string;
  query: string;
  depth: Depth;
  range: (today: Date) => DateRange;
}

const todayIso = (d: Date) => d.toISOString().slice(0, 10);
const startOfYear = (year: number) => `${year}-01-01`;

const EXAMPLES: ExamplePreset[] = [
  {
    icon: Smartphone,
    label: "iPhone 17 Pro reviews",
    query: "iPhone 17 Pro reviews and reception",
    depth: "standard",
    range: (t) => ({
      fromDate: startOfYear(t.getFullYear()),
      toDate: todayIso(t),
      label: "This year",
    }),
  },
  {
    icon: Brain,
    label: "GPT-5 launch reception",
    query: "GPT-5 launch reception, reviews, and reactions",
    depth: "deep",
    range: (t) => ({
      fromDate: startOfYear(t.getFullYear()),
      toDate: todayIso(t),
      label: "This year",
    }),
  },
  {
    icon: Glasses,
    label: "Vision Pro a year in",
    query: "Apple Vision Pro one year later, public reaction and adoption",
    depth: "deep",
    range: (t) => ({
      fromDate: `${t.getFullYear() - 1}-01-01`,
      toDate: todayIso(t),
      label: "Last year",
    }),
  },
  {
    icon: Truck,
    label: "Cybertruck owner reactions",
    query: "Tesla Cybertruck owner reactions after delivery",
    depth: "standard",
    range: (t) => ({
      fromDate: startOfYear(t.getFullYear()),
      toDate: todayIso(t),
      label: "This year",
    }),
  },
  {
    icon: Code2,
    label: "Rust vs Zig in 2026",
    query: "Rust vs Zig adoption and developer reactions in 2026",
    depth: "deep",
    range: (t) => ({
      fromDate: startOfYear(t.getFullYear()),
      toDate: todayIso(t),
      label: "This year",
    }),
  },
];

export function SearchForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState<Depth>("standard");
  const [range, setRange] = useState<DateRange>({ label: "Anytime" });
  const [sites, setSites] = useState<SiteFilter>({
    mode: "all",
    domains: [],
    priorityDomains: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function submit() {
    const finalQuery = query.trim();
    if (!finalQuery) return;
    setSubmitting(true);

    const params = new URLSearchParams({ q: finalQuery, depth });
    if (range.fromDate) params.set("from", range.fromDate);
    if (range.toDate) params.set("to", range.toDate);
    if (range.label) params.set("rangeLabel", range.label);
    if (sites.mode === "include" && sites.domains.length > 0) {
      params.set("includeDomains", sites.domains.join(","));
    }
    if (sites.mode === "exclude" && sites.domains.length > 0) {
      params.set("excludeDomains", sites.domains.join(","));
    }
    if (sites.priorityDomains && sites.priorityDomains.length > 0) {
      params.set("priorityDomains", sites.priorityDomains.join(","));
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  function applyExample(ex: ExamplePreset) {
    const now = new Date();
    setQuery(ex.query);
    setDepth(ex.depth);
    setRange(ex.range(now));
    setLastApplied(ex.label);
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    queueMicrotask(() => {
      const len = ex.query.length;
      el.setSelectionRange(len, len);
    });
  }

  const canSubmit = query.trim().length > 0 && !submitting;
  const placeholderHidden = focused || query.length > 0;

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div
          className={`relative overflow-hidden rounded-[22px] border border-divider/75 bg-white/86 shadow-[0_1px_2px_rgba(21,18,14,0.05),0_20px_50px_-34px_rgba(21,18,14,0.48)] transition-transform duration-300 ${
            focused ? "-translate-y-[1px]" : ""
          }`}
          style={{
            boxShadow: focused
              ? "0 0 0 3px rgba(217,79,48,0.13), 0 1px 2px rgba(21,18,14,0.05), 0 22px 54px -34px rgba(21,18,14,0.52)"
              : undefined,
          }}
        >
          {/* Input row */}
          <div className="relative flex items-center gap-2 px-3 pb-3 pt-3 sm:gap-3 sm:px-5 sm:pb-3.5 sm:pt-4">
            <Search
              className="h-[18px] w-[18px] flex-shrink-0 text-ink-faint"
              strokeWidth={2.25}
            />
            <div className="relative min-w-0 flex-1">
              <AnimatedPlaceholder hidden={placeholderHidden} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=""
                className="relative w-full bg-transparent py-1 text-[16px] text-ink placeholder:text-transparent focus:outline-none sm:text-[17px]"
                aria-label="Search the web"
              />
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-10 sm:w-10 ${
                canSubmit
                  ? "bg-accent-500 text-white shadow-[0_1px_2px_rgba(150,47,24,0.16),0_10px_18px_-12px_rgba(217,79,48,0.8)] hover:bg-accent-600 hover:scale-[1.04] active:scale-[0.96]"
                  : "cursor-not-allowed bg-canvas-soft/70 text-ink-faint"
              }`}
              aria-label="Search"
            >
              <ArrowUp className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Hairline divider */}
          <div
            aria-hidden
            className="relative mx-1 h-px"
            style={{ background: "rgba(21, 18, 14, 0.07)" }}
          />

          {/* Controls row - labeled Effort + Time. Wraps on mobile. */}
          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 sm:px-4 sm:py-2.5">
            <ControlLabel>Effort</ControlLabel>
            <DepthSelector value={depth} onChange={setDepth} />
            <EffortInfo />

            <span
              aria-hidden
              className="mx-1 hidden h-4 w-px bg-ink/10 sm:block"
            />

            <ControlLabel>Time</ControlLabel>
            <YearSelector value={range} onChange={setRange} />

            <span
              aria-hidden
              className="mx-1 hidden h-4 w-px bg-ink/10 sm:block"
            />

            <ControlLabel>Sites</ControlLabel>
            <SitesSelector value={sites} onChange={setSites} />
          </div>
        </div>
      </form>

      {/* Examples */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          <Sparkles className="h-3 w-3" />
          Examples
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 px-2">
          {EXAMPLES.map((ex) => {
            const Icon = ex.icon;
            const isLast = lastApplied === ex.label;
            return (
              <button
                key={ex.label}
                type="button"
                onClick={() => applyExample(ex)}
                className={`inline-flex items-center gap-1.5 rounded-full border border-divider/70 bg-white/62 px-3 py-1.5 text-[13px] font-medium shadow-[0_1px_2px_rgba(21,18,14,0.04)] transition-colors hover:bg-white ${
                  isLast
                    ? "text-accent-700"
                    : "text-ink-soft hover:text-ink"
                }`}
                aria-pressed={isLast}
                aria-label={`Use preset: ${ex.label}`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isLast ? "text-accent-600" : "text-ink-muted"
                  }`}
                  strokeWidth={2.2}
                />
                {ex.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Local primitives ──────────────────────────────────────── */

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="select-none text-[12.5px] font-medium tracking-tight text-ink-muted">
      {children}
      <span className="text-ink-faint">:</span>
    </span>
  );
}

/**
 * Info button that reveals a small tooltip on hover/focus describing the
 * three effort tiers.
 *
 * The tooltip is *portaled* to `document.body` and positioned via
 * `getBoundingClientRect`, because the search container has
 * `backdrop-filter` which establishes a new stacking context - an
 * absolute child with `z-20` still can't escape it, so the example pills
 * below would render on top. Portaling sidesteps the whole stacking
 * problem.
 */
function EffortInfo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; centerX: number } | null>(null);

  // Recompute coords whenever the tooltip opens (or the user scrolls
  // while it's open). Cheap because `open` flips infrequently.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    function measure() {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      setAnchor({ top: r.bottom + 10, centerX: r.left + r.width / 2 });
    }
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  const tooltip =
    open && anchor && typeof document !== "undefined"
      ? createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: anchor.top,
              left: anchor.centerX,
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
            className="pointer-events-none w-64 rounded-xl bg-ink px-3.5 py-3 text-[12px] leading-relaxed text-canvas shadow-[0_12px_28px_-8px_rgba(21,18,14,0.45)]"
          >
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
            <span className="block font-semibold text-white">Search effort</span>
            <span className="mt-1.5 block text-canvas/75">
              Higher effort returns more citations and runs deeper.
            </span>
            <ul className="mt-2 space-y-0.5 text-[11.5px] text-canvas/70">
              <li>
                <span className="font-semibold text-canvas">Fast</span> · ~
                {DEPTH_OPTIONS.fast.maxResults} sources, sub-second
              </li>
              <li>
                <span className="font-semibold text-canvas">Standard</span> · ~
                {DEPTH_OPTIONS.standard.maxResults} sources, balanced
              </li>
              <li>
                <span className="font-semibold text-canvas">Deep</span> · ~
                {DEPTH_OPTIONS.deep.maxResults} sources, multi-step
              </li>
            </ul>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="About search effort"
        aria-describedby={open ? "effort-tooltip" : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-white/55 hover:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/50"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {tooltip}
    </>
  );
}
