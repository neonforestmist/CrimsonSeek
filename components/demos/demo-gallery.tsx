import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  CalendarRange,
  Code2,
  Glasses,
  SlidersHorizontal,
  Smartphone,
  Truck,
  type LucideIcon,
} from "lucide-react";
import {
  DEMO_SCENARIOS,
  type DemoIconName,
  type DemoScenario,
} from "@/lib/demo-results";

const ICONS: Record<DemoIconName, LucideIcon> = {
  phone: Smartphone,
  brain: Brain,
  glasses: Glasses,
  truck: Truck,
  code: Code2,
};

const DEPTH_COPY = {
  fast: "Fast",
  standard: "Standard",
  deep: "Deep",
};

export function DemoGallery() {
  return (
    <main className="relative px-4 pb-20 pt-12 sm:px-6 sm:pb-24 md:px-10 md:pt-24">
      <section className="mx-auto max-w-5xl">
        <div className="mb-9 border-b border-ink/10 pb-8 text-left">
          <h1 className="crimson-mark text-balance text-[56px] font-semibold leading-[0.96] sm:text-[76px] md:text-[88px]">
            Demos
          </h1>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-muted sm:text-[15px]">
            Choose a preset to open a Linkup-style report in a new tab. Each
            demo shows sourced answers, public read, image evidence, citations,
            and year filters.
          </p>
        </div>

        <div className="divide-y divide-ink/10 overflow-hidden rounded-lg border border-ink/10 bg-white/78 shadow-[0_1px_2px_rgba(21,18,14,0.05),0_18px_44px_-34px_rgba(21,18,14,0.38)]">
          {DEMO_SCENARIOS.map((scenario) => (
            <DemoRow
              key={scenario.slug}
              scenario={scenario}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function DemoRow({
  scenario,
}: {
  scenario: DemoScenario;
}) {
  const Icon = ICONS[scenario.icon];

  return (
    <article
      id={scenario.slug}
      className="grid gap-4 p-4 transition-colors hover:bg-white sm:grid-cols-[176px_minmax(0,1fr)] sm:p-5"
    >
      <DemoPreview scenario={scenario} />

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-50 text-accent-700">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-ink-muted">
            {scenario.eyebrow}
          </span>
        </div>

        <h2 className="text-[21px] font-semibold leading-tight text-ink sm:text-[24px]">
          {scenario.title}
        </h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          {scenario.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/demos/${scenario.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-ink px-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink-soft min-[420px]:w-auto"
          >
            Open report
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function DemoPreview({
  scenario,
}: {
  scenario: DemoScenario;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_1px_2px_rgba(21,18,14,0.05)] sm:min-h-[156px]">
      <div className="border-b border-divider bg-accent-50/70 px-3 py-2">
        <div className="flex items-center gap-2">
          <ExploreMini className="h-3.5 w-3.5 text-accent-600" />
          <div className="text-[11px] font-semibold text-accent-700">
            Search
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 p-3 min-[420px]:grid-cols-2 sm:grid-cols-1">
        <PreviewParam
          icon={SlidersHorizontal}
          label="Effort"
          value={`${DEPTH_COPY[scenario.depth]} depth`}
        />
        <PreviewParam
          icon={CalendarRange}
          label="Time"
          value={scenario.rangeLabel}
        />
      </div>
    </div>
  );
}

function ExploreMini({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="m15.9 7.9-2.15 6.15-5.65 2.05 2.15-6.15 5.65-2.05Z" />
      <circle cx="12" cy="12" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PreviewParam({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-divider/70 bg-canvas/45 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-ink-faint">
        <Icon className="h-3 w-3 text-accent-600" strokeWidth={2.2} />
        {label}
      </div>
      <div className="mt-1 text-[12px] font-semibold leading-snug text-ink-soft">
        {value}
      </div>
    </div>
  );
}
