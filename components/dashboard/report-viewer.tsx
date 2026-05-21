"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenText,
  CalendarRange,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Layers3,
  Link2,
  Search,
  MessageSquareQuote,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import type {
  Depth,
  FullSearchResult,
  LinkupImageResult,
  LinkupSource,
  SentimentBreakdown,
} from "@/lib/linkup";
import { cn, hostnameOf } from "@/lib/utils";
import {
  downloadCuratedReportPdf,
  type ReportPdfVariant,
} from "@/components/dashboard/report-pdf";

interface ReportViewerProps {
  result: FullSearchResult;
  query: string;
  depth: Depth;
  fromDate?: string;
  toDate?: string;
  rangeLabel: string;
}

const DEPTH_LABEL: Record<Depth, string> = {
  fast: "Fast scan",
  standard: "Standard report",
  deep: "Deep report",
};

const TONE_LABEL: Record<SentimentBreakdown["overall_tone"], string> = {
  very_positive: "Strong support",
  positive: "Supportive",
  mixed: "Mixed",
  negative: "Critical",
  very_negative: "Strong pushback",
};

const SENTIMENT_COLOR = {
  positive: "#188038",
  neutral: "#5f6368",
  negative: "#d93025",
};

const REACTION_LABEL = {
  positive: "supportive",
  neutral: "neutral",
  negative: "critical",
};

const CRIMSON = "#d94f30";

const NAV_ITEMS = [
  {
    href: "#overview",
    label: "Answer",
    icon: BookOpenText,
  },
  {
    href: "#crimson-search",
    label: "Results",
    icon: Search,
  },
  {
    href: "#signals",
    label: "Public read",
    icon: BarChart3,
  },
  {
    href: "#media",
    label: "Images",
    icon: ImageIcon,
  },
  {
    href: "#themes",
    label: "Themes",
    icon: Layers3,
  },
  {
    href: "#sources",
    label: "Sources",
    icon: Link2,
  },
  {
    href: "#downloads",
    label: "PDFs",
    icon: Download,
  },
];

export function ReportViewer({
  result,
  query,
  depth,
  fromDate,
  toDate,
  rangeLabel,
}: ReportViewerProps) {
  const [copied, setCopied] = useState(false);
  const sentiment = result.sentiment;
  const sources = result.answer.sources;
  const images = result.images ?? [];
  const themes = sentiment?.themes ?? [];
  const navItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (item.href === "#signals") return Boolean(sentiment);
        if (item.href === "#themes") return themes.length > 0;
        return true;
      }),
    [sentiment, themes.length]
  );

  const metrics = useMemo(
    () => [
      {
        label: "Sources",
        value: sources.length,
        detail: `${DEPTH_LABEL[depth]} coverage`,
        color: CRIMSON,
      },
      {
        label: "Images",
        value: images.length,
        detail: images.length ? "Visual evidence found" : "No image hits yet",
        color: "#188038",
      },
      {
        label: "Energy",
        value: sentiment ? Math.round(sentiment.hype_score) : "n/a",
        detail: "Conversation energy",
        color: "#f9ab00",
      },
      {
        label: "Friction",
        value: sentiment ? Math.round(sentiment.controversy_score) : "n/a",
        detail: "Pushback level",
        color: "#d93025",
      },
    ],
    [depth, images.length, sentiment, sources.length]
  );

  function downloadPdf(variant: ReportPdfVariant) {
    downloadCuratedReportPdf({
      result,
      query,
      depth,
      rangeLabel,
      variant,
    });
  }

  async function copyCitations() {
    const citationText = sources
      .map((source, index) => `${index + 1}. ${source.name} - ${source.url}`)
      .join("\n");
    await navigator.clipboard?.writeText(citationText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="report-grid grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="no-print hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100svh-112px)] overflow-y-auto rounded-lg border border-[#dadce0] bg-white p-2.5 shadow-[0_1px_2px_rgba(60,64,67,0.16)]">
          <div className="mb-3 flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-[#202124]">
            <PanelLeft className="h-4 w-4 text-[#d94f30]" />
            Linkup output
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[#3c4043] transition-colors hover:bg-[#fff8f5]"
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-[#5f6368]" />
                  <span className="min-w-0 text-sm font-medium leading-snug">
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
          <div className="mt-3 space-y-1.5 rounded-md bg-[#fff8f5] px-3 py-3 text-xs leading-relaxed text-[#5f6368]">
            <div className="font-semibold text-[#202124]">Report setup</div>
            <InfoLine label="Search" value={query} />
            <InfoLine label="Depth" value={DEPTH_LABEL[depth]} />
            <InfoLine label="Time" value={rangeLabel} />
            <InfoLine label="Evidence" value="Sources, public read, images" />
          </div>
        </div>
      </aside>

      <MobileSectionNav items={navItems} />

      <article className="min-w-0 space-y-7">
        <section
          id="overview"
          className="print-surface scroll-mt-24 overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-[0_1px_2px_rgba(60,64,67,0.14),0_8px_24px_-20px_rgba(60,64,67,0.7)]"
        >
          <div className="flex flex-col gap-3 border-b border-[#e8eaed] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#5f6368]">
                <FileText className="h-4 w-4 text-[#d94f30]" />
                Report viewer
              </div>
              <h2 className="mt-1 text-xl font-semibold text-[#202124]">
                {query}
              </h2>
            </div>
            <div className="no-print grid grid-cols-1 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
              <button
                type="button"
                onClick={copyCitations}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#dadce0] bg-white px-3 text-sm font-medium text-[#3c4043] transition-colors hover:bg-[#fff8f5]"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-[#188038]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy sources"}
              </button>
              <button
                type="button"
                onClick={() => downloadPdf("full")}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#d94f30] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#b93b1f]"
              >
                <Download className="h-4 w-4" />
                Save as PDF
              </button>
            </div>
          </div>

          <TimeScopeLinks
            fromDate={fromDate}
            toDate={toDate}
            rangeLabel={rangeLabel}
          />

          <div className="grid border-b border-[#e8eaed] sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-b border-[#e8eaed] px-5 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="text-xs font-medium text-[#5f6368]">
                  {metric.label}
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-3xl font-semibold tabular-nums text-[#202124]">
                    {metric.value}
                  </span>
                  <span
                    aria-hidden
                    className="mb-1.5 h-2 w-2 rounded-full"
                    style={{ background: metric.color }}
                  />
                </div>
                <div className="mt-1 text-xs text-[#5f6368]">{metric.detail}</div>
              </div>
            ))}
          </div>

          <div className="px-5 py-6 md:px-8 md:py-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-[#f1f3f4] px-2.5 py-1 text-xs font-medium text-[#3c4043]">
              <Sparkles className="h-3.5 w-3.5 text-[#d94f30]" />
              Executive summary
            </div>
            <div className="whitespace-pre-wrap text-[16px] leading-[1.72] text-[#202124]">
              {result.answer.answer}
            </div>
          </div>
        </section>

        <CrimsonSearch
          query={query}
          sources={sources}
        />

        {sentiment ? (
          <section
            id="signals"
            className="grid scroll-mt-24 gap-4 xl:grid-cols-[1.08fr_0.92fr]"
          >
            <SentimentPanel sentiment={sentiment} />
            <SignalMap sentiment={sentiment} />
          </section>
        ) : null}

        <section id="media" className="scroll-mt-24 space-y-3">
          <SectionHeader
            icon={ImageIcon}
            title="Image evidence"
            meta={`${images.length} visual hits`}
          />
          {images.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {images.slice(0, 6).map((image, index) => (
                <EvidenceImageCard
                  key={`${image.url}-${index}`}
                  image={image}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel text="No Linkup image results were returned for this report yet." />
          )}
          {result.imagesError && (
            <div className="text-xs text-[#d93025]">{result.imagesError}</div>
          )}
        </section>

        {themes.length > 0 && (
          <section id="themes" className="scroll-mt-24 space-y-3">
            <SectionHeader
              icon={Layers3}
              title="Conversation themes"
              meta={`${themes.length} themes`}
            />
            <ThemeMatrix themes={themes} />
          </section>
        )}

        {sentiment?.notable_quotes?.length ? (
          <section className="space-y-3">
            <SectionHeader
              icon={MessageSquareQuote}
              title="Notable quotes"
              meta={`${sentiment.notable_quotes.length} excerpts`}
            />
            <div className="grid gap-3 md:grid-cols-3">
              {sentiment.notable_quotes.slice(0, 3).map((quote, index) => (
                <QuoteCard
                  key={`${quote.source}-${index}`}
                  quote={quote}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section id="sources" className="scroll-mt-24 space-y-3">
          <SectionHeader
            icon={Link2}
            title="Source table"
            meta={`${sources.length} citations`}
          />
          <SourceTable sources={sources} />
        </section>

        <section id="downloads" className="scroll-mt-24 space-y-3">
          <SectionHeader icon={Download} title="PDF downloads" meta="Curated files" />
          <div className="grid gap-3 md:grid-cols-3">
            <ExportTile
              title="Full report"
              detail="Summary, signals, images, themes, quotes, and citations."
              action="Download PDF"
              onClick={() => downloadPdf("full")}
            />
            <ExportTile
              title="Evidence appendix"
              detail="Image evidence and source table for stakeholder review."
              action="Download appendix"
              onClick={() => downloadPdf("appendix")}
            />
            <ExportTile
              title="Citation packet"
              detail="Compact reference list with titles, domains, and links."
              action="Download packet"
              onClick={() => downloadPdf("citations")}
            />
          </div>
        </section>
      </article>
    </div>
  );
}

function MobileSectionNav({ items }: { items: typeof NAV_ITEMS }) {
  return (
    <div className="no-print sticky top-14 z-30 -mx-4 border-y border-[#dadce0] bg-[#fbf3ea]/94 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:hidden">
      <nav
        aria-label="Report sections"
        className="flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex h-9 flex-none items-center gap-1.5 rounded-full border border-[#dadce0] bg-white px-3 text-sm font-medium text-[#3c4043] shadow-[0_1px_2px_rgba(60,64,67,0.08)] transition-colors hover:border-[#d94f30] hover:bg-[#fff8f5] hover:text-[#b93b1f]"
            >
              <Icon className="h-3.5 w-3.5 text-[#d94f30]" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-[#a18b80]">
        {label}
      </div>
      <div className="truncate font-medium text-[#3c4043]" title={value}>
        {value}
      </div>
    </div>
  );
}

function TimeScopeLinks({
  fromDate,
  toDate,
  rangeLabel,
}: {
  fromDate?: string;
  toDate?: string;
  rangeLabel: string;
}) {
  const baseYear =
    Number.parseInt(toDate?.slice(0, 4) ?? fromDate?.slice(0, 4) ?? "", 10) ||
    new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, index) => baseYear - index).filter(
    (year) => year >= 2000
  );
  const allTimeActive = !fromDate && !toDate;
  const activeYear = !allTimeActive ? baseYear : null;

  return (
    <div className="no-print border-b border-[#e8eaed] px-5 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm text-[#5f6368]">
          <CalendarRange className="h-4 w-4 text-[#d94f30]" />
          <span className="font-medium">Time window</span>
          <span className="text-[#8a837a]">{rangeLabel}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <TimeScopePill active={allTimeActive}>
            All time
          </TimeScopePill>
          {years.map((year) => {
            const active = activeYear === year;
            return (
              <TimeScopePill key={year} active={active}>
                {year}
              </TimeScopePill>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimeScopePill({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 cursor-default items-center gap-1.5 rounded-full border px-3 text-sm font-medium",
        active
          ? "border-[#d94f30] bg-[#fff1ec] text-[#b93b1f]"
          : "border-[#dadce0] bg-white text-[#5f6368]"
      )}
    >
      {children}
    </button>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  meta,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#fff1ec] text-[#d94f30]">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold text-[#202124]">{title}</h2>
      </div>
      <span className="text-xs font-medium text-[#5f6368]">{meta}</span>
    </div>
  );
}

type CrimsonSearchFilter = "mixed" | "positive" | "negative";

interface CrimsonSearchResult {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  sentiment: CrimsonSearchFilter;
}

const SEARCH_TABS: Array<{
  value: CrimsonSearchFilter;
  label: string;
}> = [
  { value: "mixed", label: "Mixed" },
  { value: "positive", label: "Positive" },
  { value: "negative", label: "Negative" },
];

function CrimsonSearch({
  query,
  sources,
}: {
  query: string;
  sources: LinkupSource[];
}) {
  const [filter, setFilter] = useState<CrimsonSearchFilter>("mixed");
  const [expanded, setExpanded] = useState(false);
  const results = useMemo(
    () => buildCrimsonSearchResults({ query, sources }),
    [query, sources]
  );
  const filteredResults =
    filter === "mixed"
      ? results
      : results.filter((result) => result.sentiment === filter);
  const visibleResults = expanded ? filteredResults : filteredResults.slice(0, 3);

  return (
    <section
      id="crimson-search"
      className="scroll-mt-24 overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-[0_1px_2px_rgba(60,64,67,0.12)]"
    >
      <div className="border-b border-[#e8eaed] px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[24px] font-semibold text-[#202124]">
            Crimson
          </span>
          <span className="crimson-mark text-[24px] font-semibold">Search</span>
        </div>
        <div className="flex min-h-11 items-center gap-3 rounded-full border border-[#dadce0] bg-white px-4 shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
          <Search className="h-4 w-4 flex-shrink-0 text-[#d94f30]" />
          <div className="min-w-0 flex-1 truncate text-sm text-[#202124]">
            {query}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SEARCH_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setFilter(tab.value);
                setExpanded(false);
              }}
              className={cn(
                "h-8 rounded-full border px-3 text-sm font-medium transition-colors",
                filter === tab.value
                  ? "border-[#d94f30] bg-[#fff1ec] text-[#b93b1f]"
                  : "border-[#dadce0] bg-white text-[#5f6368] hover:bg-[#fff8f5]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#e8eaed]">
        {visibleResults.length ? (
          visibleResults.map((result, index) => (
            <a
              key={`${result.url}-${index}`}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block px-5 py-4 transition-colors hover:bg-[#fff8f5]"
            >
              <div className="text-xs text-[#5f6368]">{result.displayUrl}</div>
              <div className="mt-1 text-[18px] font-medium leading-snug text-[#b93b1f] group-hover:underline">
                {result.title}
              </div>
              <p className={cn(
                "mt-1 max-w-3xl text-sm leading-relaxed text-[#3c4043]",
                !expanded && "line-clamp-3"
              )}>
                {result.snippet}
              </p>
            </a>
          ))
        ) : (
          <div className="px-5 py-5 text-sm leading-relaxed text-[#5f6368]">
            No clearly useful {filter === "mixed" ? "source" : filter} result
            surfaced in this report.
          </div>
        )}
      </div>
      {filteredResults.length > 3 && (
        <div className="border-t border-[#e8eaed] px-5 py-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-sm font-semibold text-[#b93b1f] hover:underline"
          >
            {expanded
              ? "Collapse results"
              : `Expand useful results (${filteredResults.length - 3} more)`}
          </button>
        </div>
      )}
    </section>
  );
}

function buildCrimsonSearchResults({
  query,
  sources,
}: {
  query: string;
  sources: LinkupSource[];
}): CrimsonSearchResult[] {
  const relevantSources = sources.filter((source) =>
    isRelevantSearchSource(source, query)
  );
  const usefulSources = relevantSources.filter(isUsefulSearchSource);
  const usefulFallback = sources.filter(isUsefulSearchSource);
  const sourcePool = usefulSources.length
    ? usefulSources
    : relevantSources.length
      ? relevantSources
      : usefulFallback.length
        ? usefulFallback
        : sources;
  const seen = new Set<string>();

  return sourcePool
    .filter((source) => {
      const key = source.url || source.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((source) => ({
      title: cleanResultText(source.name),
      url: source.url,
      displayUrl: hostnameOf(source.url),
      snippet: cleanResultText(
        source.snippet ?? "Useful source surfaced by Linkup for this report."
      ),
      sentiment: inferSourceLane(source),
    }));
}

function isRelevantSearchSource(source: LinkupSource, query: string) {
  const text = `${source.name} ${source.snippet ?? ""} ${source.url}`.toLowerCase();
  const title = source.name.toLowerCase();
  const q = query.toLowerCase();

  if (q.includes("iphone 17 pro")) {
    const proMatch = /\biphone\s+17[\s-]+pro\b|\b17[\s-]+pro\b|\bpro[\s-]+max\b/.test(
      text
    );
    const adjacentModelTitle =
      /\b17e\b|\biphone\s+air\b/.test(title) &&
      !/\b17[\s-]+pro\b|\bpro[\s-]+max\b/.test(title);
    return proMatch && !adjacentModelTitle;
  }
  if (q.includes("vision pro")) {
    return text.includes("vision") && text.includes("pro");
  }
  if (q.includes("gpt-5")) {
    return text.includes("gpt-5") || text.includes("gpt 5");
  }
  if (q.includes("cybertruck")) {
    return text.includes("cybertruck");
  }
  if (q.includes("rust") && q.includes("zig")) {
    return text.includes("rust") || text.includes("zig");
  }

  return true;
}

function isUsefulSearchSource(source: LinkupSource) {
  const text = `${source.name} ${source.snippet ?? ""}`.toLowerCase();
  const host = hostnameOf(source.url).toLowerCase();
  const seoPatterns = [
    /\b\d+\s+(ways|tips|tricks|hacks|secrets|things|reasons|ideas|facts|best)\b/,
    /\b(top|best)\s+\d+\b/,
    /\bthe best\b.{0,48}\b(to buy|for|of|in)\b/,
    /\bbest\s+\w+s?\s+\b(to buy|for|of|in)\b/,
    /\beverything you need to know\b/,
    /\bultimate guide\b/,
    /\bbuying guide\b/,
    /\bcomplete guide\b/,
    /\bwhat you need to know\b/,
    /\bshould you buy\b/,
    /\bbest deals\b/,
    /\bhot selling\b/,
    /\bon sale\b/,
    /\baffiliate\b/,
    /\bcoupon\b/,
    /\bshopping\b/,
    /\bsponsored\b/,
  ];
  const lowValueDomain = /(coupon|deals|shopping|affiliate|pinterest|facebook)\./.test(
    host
  );
  return !lowValueDomain && !seoPatterns.some((pattern) => pattern.test(text));
}

function inferSourceLane(source: LinkupSource): CrimsonSearchFilter {
  const text = `${source.name} ${source.snippet ?? ""}`.toLowerCase();
  const negative = [
    "concern",
    "risk",
    "problem",
    "criticism",
    "skeptic",
    "controvers",
    "complaint",
    "issue",
    "backlash",
  ];
  const positive = [
    "praise",
    "impressed",
    "strong",
    "award",
    "best",
    "positive",
    "improvement",
    "adoption",
    "useful",
    "faster",
    "reliable",
  ];

  if (negative.some((word) => text.includes(word))) return "negative";
  if (positive.some((word) => text.includes(word))) return "positive";
  return "mixed";
}

function cleanResultText(value: string) {
  return value
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function SentimentPanel({ sentiment }: { sentiment: SentimentBreakdown }) {
  const segments = [
    {
      label: "Supportive",
      value: sentiment.positive_pct,
      color: SENTIMENT_COLOR.positive,
    },
    {
      label: "Neutral",
      value: sentiment.neutral_pct,
      color: SENTIMENT_COLOR.neutral,
    },
    {
      label: "Critical",
      value: sentiment.negative_pct,
      color: SENTIMENT_COLOR.negative,
    },
  ];

  return (
    <div className="rounded-lg border border-[#dadce0] bg-white p-5 shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-[#5f6368]">Public read</div>
          <div className="mt-1 text-2xl font-semibold text-[#202124]">
            {TONE_LABEL[sentiment.overall_tone]}
          </div>
        </div>
        <div className="rounded-md bg-[#fff8f5] px-3 py-2 text-right">
          <div className="text-2xl font-semibold tabular-nums text-[#188038]">
            {Math.round(sentiment.positive_pct)}%
          </div>
          <div className="text-xs text-[#5f6368]">supportive</div>
        </div>
      </div>

      <div className="flex h-4 overflow-hidden rounded-full bg-[#f1f3f4]">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="h-full"
            style={{
              width: `${segment.value}%`,
              background: segment.color,
            }}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.label}>
            <div className="flex items-center gap-1.5 text-xs text-[#5f6368]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: segment.color }}
              />
              {segment.label}
            </div>
            <div className="mt-1 text-lg font-semibold tabular-nums text-[#202124]">
              {Math.round(segment.value)}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-[#e8eaed] pt-4 text-sm leading-relaxed text-[#3c4043]">
        {sentiment.one_line_verdict}
      </div>
    </div>
  );
}

function SignalMap({ sentiment }: { sentiment: SentimentBreakdown }) {
  const x = Math.min(96, Math.max(4, sentiment.hype_score));
  const y = 100 - Math.min(92, Math.max(8, sentiment.controversy_score));

  return (
    <div className="rounded-lg border border-[#dadce0] bg-white p-5 shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-[#5f6368]">Signal map</div>
          <div className="mt-1 text-xl font-semibold text-[#202124]">
            Energy versus friction
          </div>
        </div>
        <div className="text-right text-xs text-[#5f6368]">
          <div>Energy {Math.round(sentiment.hype_score)}</div>
          <div>Friction {Math.round(sentiment.controversy_score)}</div>
        </div>
      </div>
      <div className="relative h-56 rounded-lg border border-[#e8eaed] bg-[linear-gradient(90deg,#fff8f5_1px,transparent_1px),linear-gradient(0deg,#fff8f5_1px,transparent_1px)] bg-[size:25%_25%]">
        <div className="absolute left-3 top-3 text-[11px] font-medium text-[#5f6368]">
          higher friction
        </div>
        <div className="absolute bottom-3 right-3 text-[11px] font-medium text-[#5f6368]">
          higher energy
        </div>
        <span
          className="absolute h-5 w-5 rounded-full border-4 border-white bg-[#d94f30] shadow-[0_2px_8px_rgba(217,79,48,0.38)]"
          style={{ left: `calc(${x}% - 10px)`, top: `calc(${y}% - 10px)` }}
        />
      </div>
    </div>
  );
}

function EvidenceImageCard({
  image,
  index,
}: {
  image: LinkupImageResult;
  index: number;
}) {
  const simulated = Boolean(image.palette?.length) || image.url.includes("demo.crimsonseek.local");
  const href = image.sourceUrl ?? image.url;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-[0_1px_2px_rgba(60,64,67,0.12)] transition-shadow hover:shadow-[0_2px_8px_rgba(60,64,67,0.18)]"
    >
      {simulated ? (
        <SimulatedImage image={image} index={index} />
      ) : (
        <img
          src={image.url}
          alt={image.name}
          className="aspect-[4/3] w-full bg-[#f1f3f4] object-cover"
          loading="lazy"
        />
      )}
      <div className="p-3">
        <div className="line-clamp-2 text-sm font-semibold text-[#202124]">
          {image.name}
        </div>
        <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5f6368]">
          {image.caption ?? image.sourceName ?? hostnameOf(image.url)}
        </div>
      </div>
    </a>
  );
}

function SimulatedImage({
  image,
  index,
}: {
  image: LinkupImageResult;
  index: number;
}) {
  const palette = image.palette ?? ["#d94f30", "#f7967a", "#fff1ec"];

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 54%, ${palette[2]} 100%)`,
      }}
    >
      <div className="absolute inset-x-4 top-4 h-8 rounded-md bg-white/82 shadow-sm" />
      <div className="absolute left-4 top-16 h-24 w-[42%] rounded-md bg-white/72" />
      <div className="absolute right-4 top-16 h-10 w-[38%] rounded-md bg-white/70" />
      <div className="absolute bottom-4 right-4 h-16 w-[48%] rounded-md bg-white/76" />
      <div className="absolute bottom-5 left-5 rounded-md bg-[#202124]/86 px-2.5 py-1 text-xs font-semibold text-white">
        Image {index + 1}
      </div>
    </div>
  );
}

function ThemeMatrix({ themes }: { themes: SentimentBreakdown["themes"] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
      {themes.map((theme, index) => (
        <div
          key={`${theme.title}-${index}`}
          className="grid gap-3 border-b border-[#e8eaed] px-4 py-4 last:border-b-0 md:grid-cols-[170px_minmax(0,1fr)_90px]"
        >
          <div>
            <div className="font-semibold text-[#202124]">{theme.title}</div>
            <div
              className={cn(
                "mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                theme.sentiment === "positive" && "bg-[#e6f4ea] text-[#137333]",
                theme.sentiment === "neutral" && "bg-[#f1f3f4] text-[#5f6368]",
                theme.sentiment === "negative" && "bg-[#fce8e6] text-[#a50e0e]"
              )}
            >
              {REACTION_LABEL[theme.sentiment]}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#3c4043]">{theme.summary}</p>
          <div>
            <div className="text-right text-sm font-semibold tabular-nums text-[#202124]">
              {Math.round(theme.share_of_voice)}%
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1f3f4]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${theme.share_of_voice}%`,
                  background: SENTIMENT_COLOR[theme.sentiment],
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteCard({
  quote,
}: {
  quote: SentimentBreakdown["notable_quotes"][number];
}) {
  return (
    <div className="rounded-lg border border-[#dadce0] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
      <div
        className={cn(
          "mb-3 h-1 w-10 rounded-full",
          quote.sentiment === "positive" && "bg-[#188038]",
          quote.sentiment === "neutral" && "bg-[#5f6368]",
          quote.sentiment === "negative" && "bg-[#d93025]"
        )}
      />
      <p className="text-sm leading-relaxed text-[#202124]">"{quote.quote}"</p>
      <div className="mt-3 text-xs font-medium text-[#5f6368]">{quote.source}</div>
    </div>
  );
}

function SourceTable({ sources }: { sources: LinkupSource[] }) {
  if (!sources.length) {
    return <EmptyPanel text="No citations were returned for this report." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
      {sources.map((source, index) => (
        <a
          key={`${source.url}-${index}`}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="grid gap-3 border-b border-[#e8eaed] px-4 py-4 transition-colors last:border-b-0 hover:bg-[#fff8f5] md:grid-cols-[42px_minmax(0,1fr)_160px]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f1f3f4] text-xs font-semibold tabular-nums text-[#5f6368]">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="line-clamp-1 font-semibold text-[#202124]">
              {source.name}
            </div>
            {source.snippet && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#5f6368]">
                {source.snippet}
              </p>
            )}
          </div>
          <div className="flex items-start justify-between gap-2 text-sm text-[#5f6368] md:justify-end">
            <span className="truncate md:max-w-[130px]">{hostnameOf(source.url)}</span>
            <Link2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
}

function ExportTile({
  title,
  detail,
  action,
  onClick,
}: {
  title: string;
  detail: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#dadce0] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.12)]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#fff1ec] text-[#d94f30]">
        <Download className="h-4 w-4" />
      </div>
      <div className="font-semibold text-[#202124]">{title}</div>
      <p className="mt-1 min-h-[40px] text-sm leading-relaxed text-[#5f6368]">
        {detail}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="no-print mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-[#dadce0] bg-white px-3 text-sm font-medium text-[#b93b1f] transition-colors hover:bg-[#fff8f5]"
      >
        <Download className="h-4 w-4" />
        {action}
      </button>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#dadce0] bg-white/70 px-4 py-5 text-sm text-[#5f6368]">
      {text}
    </div>
  );
}
