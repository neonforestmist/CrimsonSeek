"use client";

import { useEffect, useState } from "react";

/**
 * Small editorial "kicker" line that sits above the hero.
 * Format: ● LIVE EDITION · {WEEKDAY} · {MONTH} {DAY}
 *
 * The date is computed on the client to keep hydration stable.
 * Before mount we render an invisible spacer with identical metrics
 * so the layout doesn't jump when the real date appears.
 */
export function LiveKicker() {
  const [dateLabel, setDateLabel] = useState<string | null>(null);

  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).formatToParts(new Date());
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    setDateLabel(`${weekday} · ${month} ${day}`.toUpperCase());
  }, []);

  return (
    <div className="editorial-kicker flex items-center justify-center gap-3 text-ink-muted">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-accent-500" />
        <span
          className="absolute inset-0 rounded-full bg-accent-500"
          style={{ animation: "pulse-dot 2.4s ease-in-out infinite" }}
        />
      </span>
      <span>Live Edition</span>
      <span aria-hidden className="text-ink-faint">·</span>
      <span className="tabular-nums">
        {dateLabel ?? <span className="opacity-0">PLACEHOLDER</span>}
      </span>
    </div>
  );
}
