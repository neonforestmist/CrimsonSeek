"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { buildPresets } from "@/lib/year-presets";
import { Calendar, Check, ChevronDown } from "lucide-react";

export interface DateRange {
  fromDate?: string;
  toDate?: string;
  label: string;
}

interface Props {
  value: DateRange;
  onChange: (next: DateRange) => void;
}

export function YearSelector({ value, onChange }: Props) {
  const currentYear = new Date().getFullYear();
  const presets = useMemo(() => buildPresets(currentYear), [currentYear]);
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [from, setFrom] = useState<string>(value.fromDate ?? "");
  const [to, setTo] = useState<string>(value.toDate ?? "");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Track the button's viewport position. Re-measure on scroll/resize
  // so the panel follows the anchor (instead of slipping off-screen).
  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const update = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const width = customMode ? Math.min(440, window.innerWidth - 32) : 288;
      setPos({
        top: rect.bottom + 8,
        left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)),
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, [open, customMode]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function applyCustom() {
    if (!isValidIsoDate(from) || !isValidIsoDate(to) || from > to) return;
    const fy = from.slice(0, 4);
    const ty = to.slice(0, 4);
    onChange({
      fromDate: from,
      toDate: to,
      label: fy === ty ? `${fy}` : `${fy}-${ty}`,
    });
    setOpen(false);
    setCustomMode(false);
  }

  const panel = open && pos && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 100,
            // macOS-menu material: nearly opaque white with light vibrancy
            // boost so it reads as a solid menu, not a translucent overlay.
            background: "rgba(255, 252, 247, 0.985)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.95)",
              "0 0 0 0.5px rgba(21,18,14,0.10)",
              "0 12px 28px -8px rgba(21,18,14,0.18)",
              "0 28px 64px -20px rgba(21,18,14,0.28)",
            ].join(", "),
          }}
          className={cn(customMode ? "w-[min(calc(100vw-32px),440px)] rounded-[20px] p-4" : "w-72 rounded-2xl p-2")}
        >
          {!customMode ? (
            <>
              <div className="mb-1 px-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                Time range
              </div>
              <div className="space-y-0.5">
                {presets.map((p) => {
                  const active =
                    p.fromDate === value.fromDate && p.toDate === value.toDate;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onChange({
                          fromDate: p.fromDate,
                          toDate: p.toDate,
                          label: p.label,
                        });
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "bg-canvas-soft text-ink"
                          : "text-ink-soft hover:bg-canvas-soft/70 hover:text-ink"
                      )}
                    >
                      {p.label}
                      {active && <Check className="h-3.5 w-3.5 text-accent-500" />}
                    </button>
                  );
                })}
              </div>
              <div className="my-1 h-px bg-divider/60" />
              <button
                type="button"
                onClick={() => {
                  setFrom(value.fromDate ?? `${currentYear - 1}-01-01`);
                  setTo(value.toDate ?? `${currentYear}-12-31`);
                  setCustomMode(true);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:bg-canvas-soft/70 hover:text-ink"
              >
                Custom range…
              </button>
            </>
          ) : (
            <div>
              <div className="mb-4 flex items-start gap-2.5">
                <Calendar className="mt-0.5 h-4 w-4 flex-none text-accent-600" strokeWidth={2.15} />
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                    Custom date range
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">
                    Search results between two Linkup date parameters.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                <DateField
                  label="From date"
                  description="Start date, YYYY-MM-DD"
                  value={from}
                  onChange={setFrom}
                  placeholder={`${currentYear - 1}-01-01`}
                />
                <span className="hidden pb-2.5 text-[14px] font-semibold text-ink-muted sm:block">
                  to
                </span>
                <DateField
                  label="To date"
                  description="End date, YYYY-MM-DD"
                  value={to}
                  onChange={setTo}
                  placeholder={`${currentYear}-12-31`}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="rounded-xl px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={applyCustom}
                  className="rounded-xl bg-ink px-3.5 py-1.5 text-sm font-medium text-canvas hover:bg-ink-soft"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-divider/70 bg-white/72 px-3.5 py-1.5 text-[12.5px] font-medium tracking-tight shadow-[0_1px_2px_rgba(21,18,14,0.04)] transition-all duration-300 hover:bg-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60",
          open ? "text-ink" : "text-ink-soft hover:text-ink"
        )}
      >
        <Calendar className="h-3.5 w-3.5 text-ink-muted" />
        {value.label}
        <ChevronDown
          className={cn(
            "h-3 w-3 text-ink-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      {panel}
    </>
  );
}

function DateField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  function handleChange(raw: string) {
    onChange(raw.replace(/[^\d-]/g, "").slice(0, 10));
  }

  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-ink">{label}</span>
      <span className="mt-0.5 block text-[11px] text-ink-faint">{description}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-divider bg-white px-3 py-2.5 text-[14px] tabular-nums text-ink placeholder:text-ink-faint shadow-[inset_0_0_0_1px_rgba(21,18,14,0.02)] focus:border-accent-300 focus:outline-none focus:ring-2 focus:ring-accent-300/25"
      />
    </label>
  );
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
