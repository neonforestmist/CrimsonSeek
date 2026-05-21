"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronDown,
  Globe2,
  ListFilter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SiteFilterMode = "all" | "include" | "exclude";

export interface SiteFilter {
  mode: SiteFilterMode;
  domains: string[];
  priorityDomains?: string[];
}

interface Props {
  value: SiteFilter;
  onChange: (next: SiteFilter) => void;
}

const MODES: { id: SiteFilterMode; label: string; help: string }[] = [
  { id: "all", label: "Search the web", help: "No domain filter" },
  {
    id: "include",
    label: "Specific sites",
    help: "Only search the sites you list",
  },
  { id: "exclude", label: "Exclude sites", help: "Skip the sites you list" },
];

const MODE_DETAILS: Record<
  SiteFilterMode,
  { selectLabel: string; heading: string; body: string; note: string }
> = {
  all: {
    selectLabel: "None",
    heading: "Search the whole web",
    body: "Leave domain filters off and let the search range across the web.",
    note: "No include or exclude filter will be sent.",
  },
  include: {
    selectLabel: "Include Only These Domains",
    heading: "Include Only These Domains",
    body: "Search only within these domains, one per line. Leave empty to search all domains.",
    note: "Only these domains will be searched.",
  },
  exclude: {
    selectLabel: "Exclude These Domains",
    heading: "Exclude These Domains",
    body: "Exclude these domains from search results, one per line.",
    note: "These domains will be filtered out.",
  },
};

const EXAMPLE_DOMAINS = ["reddit.com", "theverge.com", "apple.com"];
const PRIORITY_EXAMPLES = [
  "scholar.google.com",
  "pubmed.ncbi.nlm.nih.gov",
  "nature.com",
];

export function SitesSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [draftMode, setDraftMode] = useState<SiteFilterMode>(value.mode);
  const [draft, setDraft] = useState(value.domains.join("\n"));
  const [priorityDraft, setPriorityDraft] = useState(
    value.priorityDomains?.join("\n") ?? ""
  );
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const domains = useMemo(() => normalizeDomains(value.domains), [value.domains]);
  const priorityDomains = useMemo(
    () => normalizeDomains(value.priorityDomains ?? []),
    [value.priorityDomains]
  );
  const activeCount = value.mode === "all" ? priorityDomains.length : domains.length;
  const label =
    value.mode === "all"
      ? priorityDomains.length > 0
        ? `Sites (${priorityDomains.length})`
        : "Sites"
      : value.mode === "include"
        ? `Sites (${activeCount})`
        : `Exclude (${activeCount})`;

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const update = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const edge = 14;
      const width = Math.min(520, window.innerWidth - edge * 2);
      const left = Math.min(Math.max(rect.left, edge), window.innerWidth - width - edge);
      setPos({ top: rect.bottom + 8, left });
    };
    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closePanel();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closePanel() {
    setOpen(false);
    setModeMenuOpen(false);
  }

  function openPanel() {
    setDraftMode(value.mode);
    setDraft(value.domains.join("\n"));
    setPriorityDraft(value.priorityDomains?.join("\n") ?? "");
    setModeMenuOpen(false);
    setOpen(true);
  }

  function applyDraft() {
    const nextDomains = normalizeDomains(draft.split(/\n|,/));
    const nextPriorityDomains = normalizeDomains(priorityDraft.split(/\n|,/));
    onChange({
      mode: draftMode === "all" || nextDomains.length === 0 ? "all" : draftMode,
      domains: draftMode === "all" ? [] : nextDomains,
      priorityDomains: nextPriorityDomains,
    });
    closePanel();
  }

  const panel =
    open && pos && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 100,
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
            className="w-[min(520px,calc(100vw-28px))] rounded-2xl p-2"
          >
            <ManagePanel
              draft={draft}
              draftMode={draftMode}
              modeMenuOpen={modeMenuOpen}
              priorityDraft={priorityDraft}
              setDraft={setDraft}
              setDraftMode={setDraftMode}
              setModeMenuOpen={setModeMenuOpen}
              setPriorityDraft={setPriorityDraft}
              onCancel={closePanel}
              onApply={applyDraft}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (open) {
            closePanel();
          } else {
            openPanel();
          }
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-divider/70 bg-white/72 px-3.5 py-1.5 text-[12.5px] font-medium tracking-tight shadow-[0_1px_2px_rgba(21,18,14,0.04)] transition-all duration-300 hover:bg-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60",
          open || activeCount > 0 ? "text-ink" : "text-ink-soft hover:text-ink"
        )}
      >
        <Globe2 className="h-3.5 w-3.5 text-ink-muted" />
        {label}
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

function ManagePanel({
  draft,
  draftMode,
  modeMenuOpen,
  priorityDraft,
  setDraft,
  setDraftMode,
  setModeMenuOpen,
  setPriorityDraft,
  onCancel,
  onApply,
}: {
  draft: string;
  draftMode: SiteFilterMode;
  modeMenuOpen: boolean;
  priorityDraft: string;
  setDraft: (next: string) => void;
  setDraftMode: (next: SiteFilterMode) => void;
  setModeMenuOpen: (next: boolean | ((current: boolean) => boolean)) => void;
  setPriorityDraft: (next: string) => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  const mode = MODE_DETAILS[draftMode];

  return (
    <div className="p-2">
      <div className="mb-3 flex items-start gap-2">
        <ListFilter className="mt-0.5 h-4 w-4 flex-none text-accent-600" strokeWidth={2.2} />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
            Domain Filter Mode
          </div>
          <div className="mt-0.5 text-[12px] leading-snug text-ink-muted">
            Choose to include or exclude domains. Only one filter mode is used at a time.
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setModeMenuOpen((next) => !next)}
          className="flex w-full items-center justify-between rounded-xl border border-divider bg-white/82 px-3 py-2.5 text-left text-[13.5px] font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_1px_2px_rgba(21,18,14,0.04)] transition-colors hover:bg-white"
          aria-expanded={modeMenuOpen}
        >
          {mode.selectLabel}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-ink-muted transition-transform duration-200",
              modeMenuOpen && "rotate-180"
            )}
            strokeWidth={2.2}
          />
        </button>
        {modeMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-divider/70 bg-white/95 p-1 text-ink shadow-[0_14px_32px_-18px_rgba(21,18,14,0.32),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
            {MODES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setDraftMode(option.id);
                  setModeMenuOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition-colors",
                  draftMode === option.id
                    ? "bg-canvas-soft text-ink"
                    : "text-ink-muted hover:bg-canvas-soft/70 hover:text-ink"
                )}
              >
                {draftMode === option.id && <Check className="h-3.5 w-3.5 text-accent-500" strokeWidth={2.4} />}
                <span className={draftMode === option.id ? "" : "ml-5"}>
                  {MODE_DETAILS[option.id].selectLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {draftMode !== "all" ? (
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-ink">{mode.heading}</div>
          <p className="mt-1 text-[12px] leading-snug text-ink-muted">{mode.body}</p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={EXAMPLE_DOMAINS.join("\n")}
            className="mt-2 min-h-24 w-full resize-y rounded-xl border border-accent-200/70 bg-white/82 px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-accent-400 focus:ring-2 focus:ring-accent-300/25"
            aria-label="Domains"
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-divider/60 bg-white/54 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-muted">
          {mode.body}
        </div>
      )}

      <div className="mt-4">
        <div className="text-[13px] font-semibold text-ink">
          Prioritize These Domains
        </div>
        <p className="mt-1 text-[12px] leading-snug text-ink-muted">
          Give higher priority to these domains, one per line. This becomes Linkup query guidance.
        </p>
        <textarea
          value={priorityDraft}
          onChange={(e) => setPriorityDraft(e.target.value)}
          placeholder={PRIORITY_EXAMPLES.join("\n")}
          className="mt-2 min-h-20 w-full resize-y rounded-xl border border-accent-200/70 bg-white/82 px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-accent-400 focus:ring-2 focus:ring-accent-300/25"
          aria-label="Priority domains"
        />
      </div>

      <div className="mt-2 text-[11px] text-ink-faint">{mode.note}</div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-lg bg-accent-700 px-3 py-1.5 text-sm font-medium text-white shadow-[0_10px_20px_-14px_rgba(150,47,24,0.9)] hover:bg-accent-800"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function normalizeDomains(input: string[]) {
  const seen = new Set<string>();
  return input
    .map((raw) =>
      raw
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .replace(/\/.*$/, "")
        .toLowerCase()
    )
    .filter((domain) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain))
    .filter((domain) => {
      if (seen.has(domain)) return false;
      seen.add(domain);
      return true;
    })
    .slice(0, 100);
}
