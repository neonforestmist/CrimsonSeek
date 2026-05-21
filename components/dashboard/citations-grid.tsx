"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpRight } from "lucide-react";
import { faviconFor, hostnameOf } from "@/lib/utils";
import type { LinkupSource } from "@/lib/linkup";

interface Props {
  sources: LinkupSource[];
}

export function CitationsGrid({ sources }: Props) {
  if (!sources.length) return null;

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Citations
        </h2>
        <span className="text-xs text-ink-muted">{sources.length} sources</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sources.map((source, i) => (
          <a
            key={`${source.url}-${i}`}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <GlassCard
              padding="p-4"
              intensity="subtle"
              className="h-full transition-all duration-200 group-hover:bg-white group-hover:translate-y-[-1px] group-hover:surface-shadow"
            >
              <div className="mb-2 flex items-start gap-3">
                <img
                  src={faviconFor(source.url, source.favicon)}
                  alt=""
                  width={18}
                  height={18}
                  className="mt-1 h-4.5 w-4.5 flex-shrink-0 rounded"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
                    <span className="truncate">{hostnameOf(source.url)}</span>
                    <ArrowUpRight className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="line-clamp-2 text-sm font-medium text-ink">
                    {source.name}
                  </div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-canvas-soft px-1.5 py-0.5 text-[10px] font-mono text-ink-muted">
                  {i + 1}
                </span>
              </div>
              {source.snippet && (
                <p className="line-clamp-3 text-[12.5px] leading-relaxed text-ink-muted">
                  {source.snippet}
                </p>
              )}
            </GlassCard>
          </a>
        ))}
      </div>
    </div>
  );
}
