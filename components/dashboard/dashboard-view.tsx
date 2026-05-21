"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { FullSearchResult, Depth } from "@/lib/linkup";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ReportViewer } from "@/components/dashboard/report-viewer";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface Props {
  query: string;
  depth: Depth;
  fromDate?: string;
  toDate?: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  priorityDomains?: string[];
  rangeLabel: string;
  simulatedResult?: FullSearchResult;
  backHref?: string;
  backLabel?: string;
  statusLabel?: string;
  headerSlot?: ReactNode;
  className?: string;
}

const DEPTH_LABEL: Record<Depth, string> = {
  fast: "Low depth",
  standard: "Medium depth",
  deep: "Heavy depth",
};

export function DashboardView({
  query,
  depth,
  fromDate,
  toDate,
  includeDomains,
  excludeDomains,
  priorityDomains,
  rangeLabel,
  simulatedResult,
  backHref = "/",
  backLabel = "New search",
  statusLabel,
  headerSlot,
  className,
}: Props) {
  const [data, setData] = useState<FullSearchResult | null>(
    simulatedResult ?? null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (simulatedResult) {
      setData(simulatedResult);
      setError(null);
      return () => {
        cancelled = true;
      };
    }

    setData(null);
    setError(null);

    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        depth,
        fromDate,
        toDate,
        includeDomains,
        excludeDomains,
        priorityDomains,
      }),
    })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Search failed");
        return json as FullSearchResult;
      })
      .then((r) => {
        if (!cancelled) setData(r);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [
    query,
    depth,
    fromDate,
    toDate,
    includeDomains,
    excludeDomains,
    priorityDomains,
    simulatedResult,
  ]);

  return (
    <div className={cn("mx-auto max-w-7xl px-5 py-7 sm:px-6 md:px-10 md:py-12", className)}>
      <div className="mb-8 flex flex-col gap-5 md:mb-10 md:gap-6">
        <Link
          href={backHref}
          className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-accent-200/80 bg-white/72 px-3 text-sm font-semibold text-accent-700 shadow-[0_1px_2px_rgba(21,18,14,0.05)] transition-colors hover:border-accent-300 hover:bg-accent-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {statusLabel && (
              <div className="mb-3 text-sm font-medium text-accent-700">
                {statusLabel}
              </div>
            )}
            <h1 className="max-w-3xl text-balance text-[25px] font-semibold leading-tight text-ink sm:text-[30px] md:text-[40px]">
              {query}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center rounded-full border border-divider bg-white/70 px-2.5 py-1 text-ink-muted backdrop-blur-md">
              {DEPTH_LABEL[depth]}
            </span>
            <span className="inline-flex items-center rounded-full border border-divider bg-white/70 px-2.5 py-1 text-ink-muted backdrop-blur-md">
              {rangeLabel}
            </span>
            {includeDomains && includeDomains.length > 0 && (
              <span className="inline-flex items-center rounded-full border border-divider bg-white/70 px-2.5 py-1 text-ink-muted backdrop-blur-md">
                Include {includeDomains.length} sites
              </span>
            )}
            {excludeDomains && excludeDomains.length > 0 && (
              <span className="inline-flex items-center rounded-full border border-divider bg-white/70 px-2.5 py-1 text-ink-muted backdrop-blur-md">
                Exclude {excludeDomains.length} sites
              </span>
            )}
            {priorityDomains && priorityDomains.length > 0 && (
              <span className="inline-flex items-center rounded-full border border-divider bg-white/70 px-2.5 py-1 text-ink-muted backdrop-blur-md">
                Prioritize {priorityDomains.length} sites
              </span>
            )}
          </div>
        </div>
        {headerSlot}
      </div>

      {error && (
        <GlassCard intensity="regular" className="mb-6 border-rose-200 bg-rose-50/80">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
            <div>
              <div className="mb-1 font-semibold text-rose-900">Search failed</div>
              <p className="text-sm text-rose-800/80">{error}</p>
              <p className="mt-2 text-xs text-rose-700/70">
                Make sure <code className="rounded bg-white/70 px-1 py-0.5 font-mono">LINKUP_API_KEY</code> is set in
                <code className="ml-1 rounded bg-white/70 px-1 py-0.5 font-mono">.env</code> or
                <code className="ml-1 rounded bg-white/70 px-1 py-0.5 font-mono">.env.local</code>.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {!data && !error && <DashboardSkeleton />}

      {data && (
        <ReportViewer
          result={data}
          query={query}
          depth={depth}
          fromDate={fromDate}
          toDate={toDate}
          rangeLabel={rangeLabel}
        />
      )}
    </div>
  );
}
