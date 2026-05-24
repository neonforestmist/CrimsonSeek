import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ArenaMark } from "@/components/arena/arena-mark";
import { AUDITS_BY_ARENA_ID } from "@/components/arena/debate-audits";
import { ARENAS } from "@/components/arena/arena-data";

export const metadata = {
  title: "Examples | CrimsonSeek",
  description: "Sample CrimsonSeek debate examples backed by fast Linkup source retrieval.",
};

export default function ExamplesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-divider/80 bg-white/72 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-accent-200 hover:text-accent-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Debate
      </Link>

      <section className="mb-8 max-w-3xl">
        <h1 className="text-balance text-[40px] font-semibold leading-[0.98] text-ink sm:text-[56px] md:text-[72px]">
          Examples
        </h1>
        <p className="mt-5 text-[16px] leading-7 text-ink-soft sm:text-[18px]">
          Review sample debate threads where CrimsonSeek takes the opposing side, searches with Linkup mid-argument, and attaches the evidence it used in the source panel.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ARENAS.map((arena) => {
          const audit = AUDITS_BY_ARENA_ID[arena.id];

          return (
            <Link
              key={arena.id}
              href={`/?audit=${arena.id}#thread`}
              className="group flex min-h-[252px] flex-col justify-between rounded-lg border border-divider/75 bg-white/82 p-5 shadow-[0_1px_2px_rgba(21,18,14,0.04)] transition-all hover:border-accent-300 hover:bg-white hover:shadow-[0_20px_44px_-36px_rgba(217,79,48,0.72)]"
            >
              <span>
                <span className="mb-4 flex items-center gap-3">
                  <ArenaMark id={arena.id} className="h-12 w-12" />
                  <span className="block min-w-0 text-xl font-semibold leading-6 text-ink">
                    {arena.title}
                  </span>
                </span>
                <span className="block text-sm leading-6 text-ink-muted line-clamp-4">
                  {audit ? `CrimsonSeek argues: ${audit.crimsonPosition}` : arena.signal}
                </span>
              </span>
              <span className="mt-5 flex items-center justify-between gap-3 border-t border-divider/70 pt-4">
                <span className="text-sm font-semibold leading-6 text-ink-soft">
                  View a sample debate audit
                </span>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-accent-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
