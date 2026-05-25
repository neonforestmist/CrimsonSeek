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
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#fbf3ea]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-[1160px] items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
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
            <span className="truncate">CrimsonSeek</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/examples"
            className="hidden rounded-md px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            Examples
          </Link>
          <span aria-hidden className="hidden h-4 w-px bg-ink/12 sm:block" />

          <a
            href="https://github.com/neonforestmist/CrimsonSeek"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CrimsonSeek GitHub repository"
            className="hidden h-9 items-center gap-1.5 rounded-full bg-ink px-3 text-[13px] font-medium text-canvas shadow-[0_1px_2px_rgba(21,18,14,0.12)] transition-colors hover:bg-ink-soft sm:inline-flex sm:px-3.5"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href="https://www.linkup.so"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkup"
            className="hidden h-9 items-center gap-1.5 rounded-full bg-accent-500 px-3.5 text-white shadow-[0_1px_2px_rgba(150,47,24,0.18),0_8px_18px_-12px_rgba(217,79,48,0.75)] transition-colors hover:bg-accent-600 sm:inline-flex sm:gap-2"
          >
            <LinkupLogo
              variant="full"
              className="h-[18px] w-auto text-white"
            />
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
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
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-accent-200 bg-accent-50 text-accent-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(150,47,24,0.08)]"
    >
      <span className="material-symbols-rounded text-[15px] leading-none">
        swords
      </span>
    </span>
  );
}
