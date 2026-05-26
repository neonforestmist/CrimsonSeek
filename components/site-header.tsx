"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Github, Menu } from "lucide-react";
import { LinkupLogo } from "@/components/linkup-logo";

export function SiteHeader() {
  const pathname = usePathname();
  const homeHasDesktopSidebar = pathname === "/";

  function openMobileStarters() {
    window.dispatchEvent(new CustomEvent("crimsonseek:open-mobile-starters"));
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-[#fbf3ea]/90 backdrop-blur-xl lg:sticky">
      <nav className="mx-auto flex h-14 max-w-[1160px] items-center justify-between gap-2 pl-3 pr-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {homeHasDesktopSidebar && (
            <button
              type="button"
              onClick={openMobileStarters}
              aria-label="Open debate starters"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link
            href="/"
            className={`flex min-w-0 items-center gap-2 text-[15px] font-semibold text-accent-600 transition-opacity hover:opacity-75 ${
              homeHasDesktopSidebar ? "lg:pointer-events-none lg:invisible" : ""
            }`}
          >
            <ExploreMark />
            <span className="truncate max-[360px]:hidden">CrimsonSeek</span>
          </Link>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-3">
          <Link
            href="/examples"
            className="inline-flex h-9 items-center rounded-full border border-divider/70 bg-white/70 px-2.5 text-[11px] font-semibold text-ink-soft transition-colors hover:border-accent-200 hover:text-ink sm:rounded-md sm:border-0 sm:bg-transparent sm:px-3 sm:py-2 sm:text-[12px] sm:uppercase sm:tracking-[0.16em]"
          >
            Examples
          </Link>
          <span aria-hidden className="hidden h-4 w-px bg-ink/12 sm:block" />

          <a
            href="https://github.com/neonforestmist/CrimsonSeek"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CrimsonSeek GitHub repository"
            className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full bg-ink text-[13px] font-medium text-canvas shadow-[0_1px_2px_rgba(21,18,14,0.12)] transition-colors hover:bg-ink-soft sm:w-auto sm:px-3.5"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href="https://www.linkup.so"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkup"
            className="inline-flex h-9 w-[4.6rem] flex-shrink-0 items-center justify-center text-accent-500 transition-colors hover:text-accent-600 sm:w-auto sm:gap-2 sm:rounded-full sm:bg-accent-500 sm:px-3.5 sm:text-white sm:shadow-[0_1px_2px_rgba(150,47,24,0.18),0_8px_18px_-12px_rgba(217,79,48,0.75)] sm:hover:bg-accent-600"
          >
            <LinkupLogo
              variant="full"
              className="h-[18px] w-auto sm:hidden"
            />
            <LinkupLogo
              variant="full"
              className="hidden h-[18px] w-auto text-white sm:block"
            />
            <ArrowUpRight className="hidden h-3.5 w-3.5 sm:block" strokeWidth={2.4} />
          </a>
        </div>
      </nav>
    </header>
  );
}

function ExploreMark() {
  return (
    <span
      aria-hidden
      className="brand-sword-mark flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-accent-200 bg-accent-50 text-accent-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(150,47,24,0.08)]"
    >
      <span className="material-symbols-rounded text-[15px] leading-none">
        swords
      </span>
    </span>
  );
}
