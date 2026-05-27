import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ArenaMark } from "@/components/arena/arena-mark";
import { AUDITS_BY_ARENA_ID } from "@/components/arena/debate-audits";
import { ARENAS, type ArenaPreset } from "@/components/arena/arena-data";

export const metadata = {
  title: "Evidence Audits | CrimsonSeek",
  description:
    "Saved CrimsonSeek debate audits with source material, citation trails, and Linkup-backed counterarguments.",
};

export default function ExamplesPage() {
  const auditedArenas = ARENAS.map((arena) => ({
    arena,
    audit: AUDITS_BY_ARENA_ID[arena.id],
  })).filter((item) => item.audit);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-divider/80 bg-white/72 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-accent-200 hover:text-accent-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Debate
      </Link>

      <section className="mb-8 border-b border-divider/75 pb-8">
        <div className="max-w-4xl">
          <h1 className="text-balance text-[40px] font-semibold leading-[0.98] text-ink sm:text-[56px] md:text-[72px]">
            Evidence audits
          </h1>
          <p className="mt-5 max-w-3xl text-[16px] leading-7 text-ink-soft sm:text-[18px]">
            Each saved debate now carries the source material inside the argument body, then keeps the full source trail one click away for inspection.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3" aria-label="Evidence audit library">
        {auditedArenas.map(({ arena, audit }) => (
          <AuditCard key={arena.id} arena={arena} audit={audit!} />
        ))}
      </section>
    </main>
  );
}

function AuditCard({
  arena,
  audit,
}: {
  arena: ArenaPreset;
  audit: NonNullable<(typeof AUDITS_BY_ARENA_ID)[ArenaPreset["id"]]>;
}) {
  const sourceCount = audit.searchMoments.reduce(
    (count, moment) => count + moment.evidence.length,
    0
  );

  return (
    <Link
      href={`/?audit=${arena.id}#thread`}
      className="group flex min-h-[312px] flex-col justify-between overflow-hidden rounded-lg border border-divider/75 bg-white/86 shadow-[0_1px_2px_rgba(21,18,14,0.04)] transition-all hover:border-accent-300 hover:bg-white hover:shadow-[0_24px_56px_-38px_rgba(217,79,48,0.74)]"
    >
      <span className="flex flex-1 flex-col p-5">
        <span className="mb-4 flex items-start justify-between gap-4">
          <span className="flex min-w-0 items-center gap-3">
            <ArenaMark id={arena.id} className="h-12 w-12 flex-shrink-0" />
            <span className="min-w-0">
              <span className="block text-xl font-semibold leading-6 text-ink">{arena.title}</span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-accent-700">
                {audit.searchMoments.length} checks / {sourceCount} sources
              </span>
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-accent-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>

        <span className="block text-sm font-semibold leading-6 text-ink">
          {audit.crimsonPosition}
        </span>
        <span className="mt-3 block text-sm leading-6 text-ink-muted">
          {audit.verdict}
        </span>

        <span className="mt-auto flex items-center justify-between gap-3 border-t border-divider/70 pt-4 text-sm font-semibold text-accent-700">
          <span>View sample debate audit</span>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
