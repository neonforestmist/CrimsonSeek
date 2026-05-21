"use client";

import { CalendarRange, CheckCircle2, ExternalLink, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/**
 * "Avoid SEO theater", text LEFT, Crimson Search mock RIGHT.
 *
 * The right visual is a search result surface that contrasts
 * factory-farmed SEO pages with more authentic sources.
 */

export function ModesSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:items-center lg:gap-20">
        <Reveal>
          <h2 className="text-balance text-[44px] font-semibold leading-[1.0] text-ink md:text-[64px]">
            Avoid the
            <br />
            SEO theater.
          </h2>
          <p className="mt-7 max-w-sm text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
            Companies can pay and optimize their way to the front of search
            results. CrimsonSeek treats search as an investigation, pushing
            past polished filler, ad driven pages, repeated summaries, and
            shallow rankings before it starts explaining what matters.
          </p>
          <div className="mt-7 flex max-w-sm items-start gap-3 rounded-2xl border border-divider/70 bg-white/55 p-4 text-[13.5px] leading-relaxed text-ink-soft shadow-[0_12px_32px_-26px_rgba(21,18,14,0.35)]">
            <CalendarRange className="mt-0.5 h-4.5 w-4.5 flex-none text-accent-600" strokeWidth={2.25} />
            Time filters make the same topic comparable by year, so old hype
            and current opinion do not collapse into one noisy blob.
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <CrimsonSearchMock />
        </Reveal>
      </div>
    </section>
  );
}

function CrimsonSearchMock() {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-divider/70 bg-white/76 p-4 shadow-[0_1px_2px_rgba(21,18,14,0.04),0_24px_62px_-38px_rgba(21,18,14,0.44)]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(21,18,14,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(21,18,14,0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.72),rgba(255,255,255,0)_42%)]" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-divider/60 bg-white/84 px-3 py-2.5">
          <Search className="h-4 w-4 text-accent-600" strokeWidth={2.2} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold text-ink">
              using mirrors to reflect light into house
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-divider/60 bg-white/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              <Search className="h-3.5 w-3.5 text-accent-600" strokeWidth={2.2} />
              ranked pages
            </div>
            <div className="space-y-3">
              {[
                "10 ways to brighten any room with mirrors",
                "19 mirror hacks every homeowner should know",
                "Best decorative mirrors for instant sunlight",
              ].map((title) => (
                <ResultRow
                  key={title}
                  muted
                  host="factoryhomeguide.test"
                  title={title}
                  body="Affiliate-heavy listicle repeating generic advice with no measurements, room context, or practical caveats."
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-divider/60 bg-white/88 p-4 shadow-[0_16px_36px_-30px_rgba(21,18,14,0.36)]">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.2} />
              Useful sources
            </div>
            <div className="space-y-3">
              {[
                {
                  host: "buildscienceforum.local",
                  title: "Angle and glare notes from daylight retrofits",
                  body: "Installers compare mirror angle, window direction, and glare control in real homes.",
                },
                {
                  host: "energyextension.edu",
                  title: "Reflecting winter light without overheating rooms",
                  body: "Practical guidance on placement, material, and seasonal tradeoffs.",
                },
                {
                  host: "homeowner-lab.local",
                  title: "Small hallway mirror test with photos",
                  body: "A measured before-and-after with cloudy day and direct-sun caveats.",
                },
              ].map((result) => (
                <ResultRow key={result.title} {...result} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  host,
  title,
  body,
  muted = false,
}: {
  host: string;
  title: string;
  body: string;
  muted?: boolean;
}) {
  return (
    <div className={muted ? "opacity-60" : ""}>
      <div className="flex items-center gap-1.5 text-[10.5px] text-ink-faint">
        <span className={muted ? "h-1.5 w-1.5 rounded-full bg-ink/20" : "h-1.5 w-1.5 rounded-full bg-accent-500"} />
        {host}
        {!muted && <ExternalLink className="h-3 w-3 text-ink-faint" strokeWidth={2.1} />}
      </div>
      <div className={muted ? "mt-0.5 text-[13px] font-semibold leading-snug text-ink-muted" : "mt-0.5 text-[13px] font-semibold leading-snug text-accent-700"}>
        {muted ? <SeoTitle title={title} /> : title}
      </div>
      <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-ink-muted">
        {body}
      </p>
    </div>
  );
}

function SeoTitle({ title }: { title: string }) {
  if (title === "10 ways to brighten any room with mirrors") {
    return (
      <>
        <SeoUnderline>10 ways</SeoUnderline> to brighten any room with mirrors
      </>
    );
  }

  if (title === "19 mirror hacks every homeowner should know") {
    return (
      <>
        <SeoUnderline>19 mirror hacks</SeoUnderline> every homeowner should know
      </>
    );
  }

  if (title === "Best decorative mirrors for instant sunlight") {
    return (
      <>
        <SeoUnderline>Best decorative mirrors</SeoUnderline> for instant sunlight
      </>
    );
  }

  return title;
}

function SeoUnderline({ children }: { children: ReactNode }) {
  return (
    <span className="decoration-accent-500/70 decoration-2 underline underline-offset-2">
      {children}
    </span>
  );
}
