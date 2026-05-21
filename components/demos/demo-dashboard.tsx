"use client";

import { SearchCheck } from "lucide-react";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { DemoScenario } from "@/lib/demo-results";

const DEPTH_COPY = {
  fast: "Fast",
  standard: "Standard",
  deep: "Deep",
};

export function DemoDashboard({ scenario }: { scenario: DemoScenario }) {
  return (
    <main className="relative px-4 pb-24 pt-14 sm:px-6 md:px-10 md:pt-[72px]">
      <DashboardView
        query={scenario.query}
        depth={scenario.depth}
        fromDate={scenario.fromDate}
        toDate={scenario.toDate}
        rangeLabel={scenario.rangeLabel}
        simulatedResult={scenario.result}
        backHref="/demos"
        backLabel="Demos"
        headerSlot={<DemoCommand scenario={scenario} />}
        className="px-0 pb-0 pt-0 md:px-0 md:pt-0"
      />
    </main>
  );
}

function DemoCommand({ scenario }: { scenario: DemoScenario }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/82 p-4 shadow-[0_1px_2px_rgba(21,18,14,0.05)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-700">
            <SearchCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink">Preset report run</div>
            <dl className="mt-2 grid gap-2 text-xs text-ink-muted min-[520px]:flex min-[520px]:flex-wrap">
              <Param label="Depth" value={DEPTH_COPY[scenario.depth]} />
              <Param label="Range" value={scenario.rangeLabel} />
              <Param label="Sources" value={`${scenario.maxResults}`} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Param({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-canvas/70 px-2.5 py-1">
      <dt className="inline font-medium text-ink-soft">{label}: </dt>
      <dd className="inline break-words">{value}</dd>
    </div>
  );
}
