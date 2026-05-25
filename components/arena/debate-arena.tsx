"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  AlertCircle,
  ArrowUp,
  Bot,
  ChevronRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Menu,
  RadioTower,
  UserRound,
  X,
} from "lucide-react";
import { ArenaMark } from "@/components/arena/arena-mark";
import { AUDITS_BY_ARENA_ID } from "@/components/arena/debate-audits";
import type { EvidenceSearchMoment } from "@/components/arena/audit-types";
import {
  ARENAS,
  CUSTOM_ARENA,
  type ArenaPreset,
  type EvidenceItem,
} from "@/components/arena/arena-data";

type DebateRole = "user" | "assistant";

interface DebateMessage {
  id: string;
  role: DebateRole;
  content: string;
  stance?: string;
  searchQuery?: string;
  searchMomentId?: string;
}

interface DebateResponse {
  reply: string;
  stance: string;
  searchQuery: string;
  evidence: EvidenceItem[];
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizePdfText(value: string) {
  return value
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "");
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "crimsonseek";
}

const WEAK_SOURCE_LABEL_PATTERN = /use with caution|needs review|unclassified|low-confidence|low value|seo/i;
const WEAK_SOURCE_DOMAIN_PATTERN = /(^|\.)?(linkedin|medium|substack|quora|pinterest|facebook|forbes)\.com$/i;

function evidenceDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isDisplayableEvidence(item: EvidenceItem) {
  if (WEAK_SOURCE_LABEL_PATTERN.test(item.sourceQuality)) return false;
  return !WEAK_SOURCE_DOMAIN_PATTERN.test(evidenceDomain(item.url));
}

function visibleEvidence(items: EvidenceItem[]) {
  return items.filter(isDisplayableEvidence);
}

function cleanProviderCopy(value: string) {
  return value
    .replace(/\bLinkup pulls\b/g, "the source trail pulls")
    .replace(/\bLinkup surfaces\b/g, "the source trail surfaces")
    .replace(/\bLinkup finds\b/g, "the source trail finds")
    .replace(/\bLinkup says\b/g, "the source trail says")
    .replace(/\bLinkup shows\b/g, "the source trail shows")
    .replace(/\bLinkup Fast\b/g, "evidence")
    .replace(/\bLinkup\b/g, "the evidence search")
    .replace(/(^|[.!?]\s+)the source trail/g, (match) =>
      match.replace("the source trail", "The source trail")
    )
    .replace(/(^|[.!?]\s+)the evidence search/g, (match) =>
      match.replace("the evidence search", "The evidence search")
    )
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSearchMoment(moment: EvidenceSearchMoment): EvidenceSearchMoment {
  return {
    ...moment,
    summary: moment.summary ? cleanProviderCopy(moment.summary) : moment.summary,
    evidence: visibleEvidence(moment.evidence),
  };
}

function MaterialSymbol({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`material-symbols-rounded leading-none ${className}`}>
      {children}
    </span>
  );
}

function SearchingEvidenceIcon() {
  return (
    <span
      aria-hidden
      className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 sm:h-10 sm:w-10"
    >
      <span className="absolute h-7 w-7 rounded-full border border-accent-300/45 animate-ping" />
      <span className="absolute h-6 w-6 rounded-full border-2 border-accent-200 border-t-accent-700 animate-spin" />
      <RadioTower className="relative h-4 w-4 animate-pulse" />
    </span>
  );
}

export function DebateArena() {
  const [selectedArenaId, setSelectedArenaId] = useState(CUSTOM_ARENA.id);
  const [selectedSideIndex, setSelectedSideIndex] = useState(0);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [input, setInput] = useState(CUSTOM_ARENA.prompt);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [searchMoments, setSearchMoments] = useState<EvidenceSearchMoment[]>([]);
  const [activeSearchMomentId, setActiveSearchMomentId] = useState<string | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null);
  const [desktopStarterSidebarOpen, setDesktopStarterSidebarOpen] = useState(true);
  const [mobileStarterSidebarOpen, setMobileStarterSidebarOpen] = useState(false);
  const [evidenceRailOpen, setEvidenceRailOpen] = useState(false);
  const [auditMode, setAuditMode] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState(
    CUSTOM_ARENA.prompt
  );
  const [hasLiveEvidence, setHasLiveEvidence] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectedArena = useMemo(
    () => [CUSTOM_ARENA, ...ARENAS].find((arena) => arena.id === selectedArenaId) ?? CUSTOM_ARENA,
    [selectedArenaId]
  );
  const selectedSide = selectedArena.sides?.[selectedSideIndex] ?? null;
  const activeArena = useMemo(
    () =>
      selectedSide
        ? {
            ...selectedArena,
            prompt: selectedSide.prompt,
            stanceHint: selectedSide.stanceHint,
          }
        : selectedArena,
    [selectedArena, selectedSide]
  );
  const activeSearchMoment = useMemo(
    () => searchMoments.find((moment) => moment.id === activeSearchMomentId) ?? null,
    [activeSearchMomentId, searchMoments]
  );
  const featuredArenas = [CUSTOM_ARENA, ...ARENAS.slice(0, 6)];
  const showEvidenceRail = evidenceRailOpen && searchMoments.length > 0;

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const requestedAudit = search.get("audit");
    const auditArena = ARENAS.find((item) => item.id === requestedAudit);
    if (auditArena) {
      loadAudit(auditArena);
      return;
    }

    const requested = search.get("example");
    const arena = [CUSTOM_ARENA, ...ARENAS].find((item) => item.id === requested);
    if (arena) selectArena(arena);
    // Run only once so user choices inside the page do not fight the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const thread = scrollRef.current;
    if (!thread) return;

    thread.scrollTo({
      top: auditMode ? 0 : thread.scrollHeight,
      behavior: auditMode ? "auto" : "smooth",
    });
  }, [messages, loading, auditMode]);

  useEffect(() => {
    const shouldLock = mobileStarterSidebarOpen || (showEvidenceRail && window.matchMedia("(max-width: 1279px)").matches);
    if (!shouldLock) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileStarterSidebarOpen, showEvidenceRail]);

  useEffect(() => {
    function openMobileStarterSidebar() {
      setEvidenceRailOpen(false);
      setMobileStarterSidebarOpen(true);
    }

    window.addEventListener("crimsonseek:open-mobile-starters", openMobileStarterSidebar);
    return () => {
      window.removeEventListener("crimsonseek:open-mobile-starters", openMobileStarterSidebar);
    };
  }, []);

  function selectArena(arena: ArenaPreset) {
    setSelectedArenaId(arena.id);
    setSelectedSideIndex(0);
    setInput(arena.sides?.[0]?.prompt ?? arena.prompt);
    setMessages([]);
    setHasLiveEvidence(false);
    setEvidence([]);
    setSearchMoments([]);
    setActiveSearchMomentId(null);
    setActiveSourceIndex(null);
    setMobileStarterSidebarOpen(false);
    setEvidenceRailOpen(false);
    setAuditMode(false);
    setLastSearchQuery(arena.sides?.[0]?.prompt ?? arena.prompt);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function loadAudit(arena: ArenaPreset) {
    const audit = AUDITS_BY_ARENA_ID[arena.id];
    if (!audit) {
      selectArena(arena);
      return;
    }
    setSelectedArenaId(arena.id);
    setSelectedSideIndex(0);
    setInput("");
    setError(null);
    setAuditMode(true);
    setMobileStarterSidebarOpen(false);
    const cleanMoments = audit.searchMoments.map(cleanSearchMoment);
    setSearchMoments(cleanMoments);
    setActiveSearchMomentId(cleanMoments[0]?.id ?? null);
    setActiveSourceIndex(null);
    setEvidenceRailOpen(false);
    setEvidence(cleanMoments[0]?.evidence ?? []);
    setLastSearchQuery(cleanMoments[0]?.query ?? arena.prompt);
    setHasLiveEvidence(Boolean(cleanMoments[0]?.evidence.length));
    setMessages(
      audit.messages.map((message) => ({
        ...message,
        content: cleanProviderCopy(message.content),
        stance: message.role === "assistant" ? "CrimsonSeek counter" : "Your position",
      }))
    );
    requestAnimationFrame(() => {
      document.getElementById("thread")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function selectSearchMoment(moment: EvidenceSearchMoment, sourceIndex: number | null = null) {
    const nextEvidence = visibleEvidence(moment.evidence);
    const hasSource = sourceIndex !== null && sourceIndex >= 0 && sourceIndex < nextEvidence.length;
    setActiveSearchMomentId(moment.id);
    setEvidence(nextEvidence);
    setActiveSourceIndex(hasSource ? sourceIndex : null);
    setLastSearchQuery(moment.query);
    setHasLiveEvidence(Boolean(nextEvidence.length));
    setMobileStarterSidebarOpen(false);
    setEvidenceRailOpen(true);
  }

  function toggleSearchMoment(moment: EvidenceSearchMoment) {
    if (evidenceRailOpen && activeSearchMomentId === moment.id) {
      setEvidenceRailOpen(false);
      setActiveSourceIndex(null);
      return;
    }

    selectSearchMoment(moment, null);
  }

  function closeMobileStarterSidebar() {
    setMobileStarterSidebarOpen(false);
  }

  async function submitArgument() {
    const claim = input.trim();
    if (!claim || loading) return;

    const userMessage: DebateMessage = {
      id: makeId("user"),
      role: "user",
      content: claim,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);
    if (nextMessages.length === 1) {
      window.setTimeout(() => {
        document.getElementById("thread")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arenaId: selectedArena.id,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          claim,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error ?? "Debate request failed");
      }

      const data = json as DebateResponse;
      const liveMoment: EvidenceSearchMoment = {
        id: makeId("evidence"),
        label: data.stance || "Live counter-evidence",
        query: data.searchQuery || claim,
        summary:
          data.evidence?.length
            ? "CrimsonSeek checked high-confidence sources that can pressure-test the latest point in this debate."
            : "CrimsonSeek searched for credible sources, but the response did not include a usable source set.",
        evidence: data.evidence ?? [],
      };
      setMessages((current) => [
        ...current,
        {
          id: makeId("assistant"),
          role: "assistant",
          content: data.reply,
          stance: data.stance,
          searchQuery: data.searchQuery,
          searchMomentId: liveMoment.id,
        },
      ]);
      setSearchMoments((current) => [...current, liveMoment]);
      setActiveSearchMomentId(liveMoment.id);
      setActiveSourceIndex(null);
      setEvidence(liveMoment.evidence);
      setLastSearchQuery(data.searchQuery || lastSearchQuery);
      setHasLiveEvidence(Boolean(data.evidence?.length));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((current) => [
        ...current,
        {
          id: makeId("assistant-error"),
          role: "assistant",
          content:
            "I could not reach the live debate engine yet. Your claim is still staged here, and the sources panel will fill in once the first evidence-backed response lands.",
          stance: "Offline fallback",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function exportConversationPdf() {
    if (!messages.length || exportingPdf) return;

    setExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 44;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const addPageIfNeeded = (height = 24) => {
        if (y + height <= pageHeight - margin) return;
        doc.addPage();
        y = margin;
      };

      const splitText = (text: string, size: number, width: number) => {
        doc.setFontSize(size);
        return doc.splitTextToSize(normalizePdfText(text), width) as string[];
      };

      const addParagraph = (
        text: string,
        options: {
          size?: number;
          style?: "normal" | "bold";
          color?: [number, number, number];
          gap?: number;
          indent?: number;
        } = {}
      ) => {
        const size = options.size ?? 10;
        const gap = options.gap ?? 12;
        const indent = options.indent ?? 0;
        doc.setFont("helvetica", options.style ?? "normal");
        doc.setFontSize(size);
        doc.setTextColor(...(options.color ?? [38, 32, 26]));
        const lines = splitText(text, size, contentWidth - indent);
        const lineHeight = size * 1.35;
        addPageIfNeeded(lines.length * lineHeight + gap);
        doc.text(lines, margin + indent, y);
        y += lines.length * lineHeight + gap;
      };

      const addSectionTitle = (title: string) => {
        addPageIfNeeded(44);
        doc.setDrawColor(221, 213, 196);
        doc.line(margin, y, pageWidth - margin, y);
        y += 18;
        addParagraph(title, { size: 13, style: "bold", gap: 14, color: [81, 26, 13] });
      };

      const addMessageCard = (message: DebateMessage) => {
        const speaker = message.role === "user" ? "You" : "CrimsonSeek";
        const label = message.stance ? `${speaker} - ${message.stance}` : speaker;
        const padding = 13;
        const titleSize = 9;
        const bodySize = 10;
        const titleLines = splitText(label, titleSize, contentWidth - padding * 2);
        const bodyLines = splitText(message.content, bodySize, contentWidth - padding * 2);
        const height =
          padding * 2 + titleLines.length * titleSize * 1.25 + 7 + bodyLines.length * bodySize * 1.38;
        addPageIfNeeded(height + 14);

        const isUser = message.role === "user";
        doc.setFillColor(isUser ? 247 : 255, isUser ? 247 : 248, isUser ? 245 : 244);
        doc.setDrawColor(isUser ? 221 : 247, isUser ? 213 : 150, isUser ? 196 : 122);
        doc.roundedRect(margin, y, contentWidth, height, 8, 8, "FD");

        let textY = y + padding + titleSize;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(titleSize);
        doc.setTextColor(isUser ? 56 : 150, isUser ? 51 : 47, isUser ? 44 : 24);
        doc.text(titleLines, margin + padding, textY);

        textY += titleLines.length * titleSize * 1.25 + 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(bodySize);
        doc.setTextColor(31, 27, 22);
        doc.text(bodyLines, margin + padding, textY);
        y += height + 14;
      };

      const addSourceCard = (item: EvidenceItem, index: number) => {
        const heading = `${index + 1}. ${item.title}`;
        const url = item.url.replace(/^https?:\/\//, "");
        const body = `${url}\n${item.snippet}\nQuality: ${item.sourceQuality}`;
        const padding = 11;
        const headingSize = 9.5;
        const bodySize = 8.5;
        const headingLines = splitText(heading, headingSize, contentWidth - padding * 2 - 18);
        const bodyLines = splitText(body, bodySize, contentWidth - padding * 2);
        const height =
          padding * 2 + headingLines.length * headingSize * 1.25 + 6 + bodyLines.length * bodySize * 1.35;
        addPageIfNeeded(height + 9);

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(221, 213, 196);
        doc.roundedRect(margin, y, contentWidth, height, 7, 7, "FD");

        let textY = y + padding + headingSize;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(headingSize);
        doc.setTextColor(150, 47, 24);
        doc.text(headingLines, margin + padding, textY);

        textY += headingLines.length * headingSize * 1.25 + 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(bodySize);
        doc.setTextColor(92, 86, 78);
        doc.text(bodyLines, margin + padding, textY);
        y += height + 9;
      };

      const exportedAt = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date());

      doc.setFillColor(255, 248, 244);
      doc.roundedRect(margin, y, contentWidth, 104, 10, 10, "F");
      y += 28;
      addParagraph("CrimsonSeek Debate", { size: 19, style: "bold", gap: 8, color: [81, 26, 13] });
      addParagraph(activeArena.title, { size: 12, style: "bold", gap: 5, color: [21, 18, 14] });
      addParagraph(`Exported ${exportedAt}`, { size: 8.5, gap: 23, color: [111, 106, 98] });

      addParagraph(activeArena.stanceHint, { size: 10.5, gap: 20, color: [56, 51, 44] });

      addSectionTitle("Conversation");
      messages.forEach((message) => addMessageCard(message));

      if (searchMoments.length) {
        addSectionTitle("Sources");
        searchMoments.forEach((moment, momentIndex) => {
          addParagraph(`Evidence check ${momentIndex + 1}: ${moment.label}`, {
            size: 10.5,
            style: "bold",
            gap: 5,
            color: [21, 18, 14],
          });
          addParagraph(moment.query, { size: 8.5, gap: 7, color: [111, 106, 98] });
          if (moment.summary) addParagraph(moment.summary, { size: 9, gap: 10, color: [56, 51, 44] });
          moment.evidence.forEach((item, itemIndex) => addSourceCard(item, itemIndex));
          if (momentIndex < searchMoments.length - 1) y += 8;
        });
      }

      const pageCount = doc.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setDrawColor(235, 226, 208);
        doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(141, 133, 121);
        doc.text(`CrimsonSeek debate export - ${page} / ${pageCount}`, margin, pageHeight - 14);
      }

      doc.save(`${slugify(activeArena.title || "crimsonseek-debate")}-debate.pdf`);
    } catch (e) {
      setError(e instanceof Error ? `PDF export failed. ${e.message}` : "PDF export failed.");
    } finally {
      setExportingPdf(false);
    }
  }

  return (
    <section
      className={`h-full min-h-0 w-full overflow-hidden transition-[padding] duration-200 ${
        desktopStarterSidebarOpen ? "lg:pl-[320px] 2xl:pl-[340px]" : "lg:pl-[86px]"
      }`}
    >
      <div
        className={`grid h-full min-h-0 min-w-0 gap-0 p-3 sm:p-4 lg:items-stretch lg:p-5 ${
          showEvidenceRail
            ? "lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]"
            : "lg:grid-cols-[minmax(0,1fr)]"
        }`}
      >
        {desktopStarterSidebarOpen ? (
          <StarterSidebar
            id="starter-sidebar"
            arenas={featuredArenas}
            selectedArenaId={selectedArena.id}
            auditMode={auditMode}
            onSelect={selectArena}
            onToggle={() => setDesktopStarterSidebarOpen(false)}
            className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-[60] lg:flex lg:w-[320px] 2xl:w-[340px]"
          />
        ) : (
          <>
            <CollapsedStarterSidebar className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-[60] lg:flex" />
            <button
              type="button"
              onClick={() => setDesktopStarterSidebarOpen(true)}
              aria-label="Expand debate starters"
              className="hidden h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-ink/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40 lg:fixed lg:left-[104px] lg:top-3 lg:z-[60] lg:inline-flex"
            >
              <Menu className="h-6 w-6" />
            </button>
          </>
        )}

        <main
          id="thread"
          className={`flex h-full min-h-0 min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-lg border border-divider/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] shadow-[0_1px_2px_rgba(21,18,14,0.05),0_26px_62px_-38px_rgba(21,18,14,0.48)] ${
            showEvidenceRail ? "xl:mr-0 xl:rounded-r-none xl:border-r-0" : ""
          }`}>
            <div className="flex-shrink-0 border-b border-divider/70 bg-white/74 px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <MaterialSymbol className="text-[18px] text-accent-600">forum</MaterialSymbol>
                      Debate thread
                    </div>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">{activeArena.stanceHint}</p>
                  </div>
                </div>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={exportConversationPdf}
                    disabled={exportingPdf}
                    className="inline-flex h-9 flex-shrink-0 items-center justify-center gap-2 rounded-full border border-divider/75 bg-white/80 px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-accent-200 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25 disabled:cursor-wait disabled:text-ink-faint"
                  >
                    {exportingPdf ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Export PDF
                  </button>
                )}
              </div>
            </div>

            <div
              ref={scrollRef}
              className={`min-h-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,79,48,0.08),transparent_35%)] px-4 py-4 sm:px-5 ${
                messages.length > 0 ? "flex-1 overflow-y-auto overscroll-contain" : "flex-1"
              }`}
            >
              {messages.length === 0 && !loading ? (
                <SetupPanel
                  arena={activeArena}
                  selectedSideIndex={selectedSideIndex}
                  setSelectedSideIndex={setSelectedSideIndex}
                  input={input}
                  setInput={setInput}
                  submitArgument={submitArgument}
                  loading={loading}
                  error={error}
                  inputRef={inputRef}
                />
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const moment = searchMoments.find((item) => item.id === message.searchMomentId) ?? null;
                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        searchMoment={moment}
                        active={Boolean(evidenceRailOpen && moment && moment.id === activeSearchMomentId)}
                        onSelectSearchMoment={selectSearchMoment}
                        onToggleSearchMoment={toggleSearchMoment}
                      />
                    );
                  })}
                  {loading && (
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <SearchingEvidenceIcon />
                      <div className="min-w-0 w-full max-w-full flex-1 rounded-lg border border-divider/70 bg-canvas/68 px-3 py-3 text-[13px] text-ink-muted sm:px-4 sm:text-sm">
                        <span className="inline-flex min-w-0 flex-wrap items-center gap-2 font-semibold text-accent-700">
                          <RadioTower className="h-4 w-4 flex-shrink-0 animate-pulse" />
                          Searching evidence
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        </span>
                        <p className="mt-1 text-xs leading-5 text-ink-muted">
                          Checking high-confidence sources before CrimsonSeek answers.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {messages.length > 0 && !auditMode && (
              <Composer
                input={input}
                setInput={setInput}
                submitArgument={submitArgument}
                loading={loading}
                error={error}
                inputRef={inputRef}
              />
            )}
        </main>

        {mobileStarterSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
              onPointerDown={closeMobileStarterSidebar}
              onClick={closeMobileStarterSidebar}
            />
            <StarterSidebar
              id="mobile-starter-sidebar"
              arenas={featuredArenas}
              selectedArenaId={selectedArena.id}
              auditMode={auditMode}
              onDismiss={closeMobileStarterSidebar}
              dialog
              onSelect={selectArena}
              className="fixed inset-y-0 left-0 z-[70] flex h-[100dvh] max-h-[100dvh] w-[min(88vw,360px)] pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)] lg:hidden"
            />
          </>
        )}

        {showEvidenceRail && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
              onClick={() => setEvidenceRailOpen(false)}
            />
            <div
              className="fixed inset-y-0 right-0 z-[70] h-[100dvh] max-h-[100dvh] w-[min(92vw,390px)] p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)] sm:p-4 xl:static xl:z-auto xl:h-full xl:max-h-full xl:w-auto xl:p-0"
              role="dialog"
              aria-modal="true"
              aria-label="Sources panel"
            >
              <EvidenceRail
                arena={activeArena}
                messages={messages}
                evidence={evidence}
                searchQuery={lastSearchQuery}
                live={hasLiveEvidence}
                activeSearchMoment={activeSearchMoment}
                activeSourceIndex={activeSourceIndex}
                onClose={() => setEvidenceRailOpen(false)}
                auditMode={auditMode}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function StarterSidebar({
  id,
  arenas,
  selectedArenaId,
  auditMode,
  onSelect,
  onToggle,
  onDismiss,
  dialog = false,
  className,
}: {
  id: string;
  arenas: ArenaPreset[];
  selectedArenaId: string;
  auditMode: boolean;
  onSelect: (arena: ArenaPreset) => void;
  onToggle?: () => void;
  onDismiss?: () => void;
  dialog?: boolean;
  className?: string;
}) {
  const [bringAnything, ...examples] = arenas;
  const activeBringAnything = bringAnything.id === selectedArenaId;

  return (
    <aside
      id={id}
      role={dialog ? "dialog" : "navigation"}
      aria-modal={dialog ? "true" : undefined}
      aria-label="Debate starters"
      className={`h-full min-h-0 flex-col border-r border-white/10 bg-ink p-3 text-canvas shadow-[0_1px_2px_rgba(21,18,14,0.12),0_28px_72px_-36px_rgba(21,18,14,0.72)] ${className ?? ""}`}
    >
      <div className="flex flex-shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/8 text-accent-300"
          >
            <MaterialSymbol className="text-[20px]">swords</MaterialSymbol>
          </span>
          <div className="min-w-0 text-[17px] font-semibold leading-none tracking-[-0.01em]">
            CrimsonSeek
          </div>
        </div>
        {onToggle || onDismiss ? (
          <button
            type="button"
            onClick={onToggle ?? onDismiss}
            aria-label={onDismiss ? "Close debate starters" : "Collapse debate starters"}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-canvas/82 transition-colors hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-canvas/82"
          >
            <Menu className="h-5 w-5" />
          </span>
        )}
      </div>

      <div className="mt-8 space-y-1">
        <button
          type="button"
          onClick={() => onSelect(bringAnything)}
          aria-pressed={activeBringAnything && !auditMode}
          aria-label={`Start a live debate for ${bringAnything.title}`}
          className={`flex h-11 w-full items-center gap-3 rounded-md px-2.5 text-left text-[15px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40 ${
            activeBringAnything
              ? "bg-white/12 text-white"
              : "text-canvas/88 hover:bg-white/8 hover:text-white"
          }`}
        >
          <ArenaMark id={bringAnything.id} active={activeBringAnything} className="h-7 w-7 flex-shrink-0" />
          <span className="min-w-0 flex-1 truncate">{bringAnything.title}</span>
        </button>
      </div>

      <div className="mt-7 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        <div className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-canvas/38">
          Debate starters
        </div>
        {examples.map((arena) => {
            const selected = arena.id === selectedArenaId;
            const liveSelected = selected && !auditMode;

            return (
              <button
                key={arena.id}
                type="button"
                onClick={() => onSelect(arena)}
                aria-pressed={liveSelected}
                aria-label={`Start a live debate for ${arena.title}`}
                className={`group flex h-[54px] w-full items-center gap-3 rounded-md px-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40 ${
                  selected
                    ? "bg-white/12 text-white"
                    : "text-canvas/74 hover:bg-white/8 hover:text-white"
                }`}
              >
                <ArenaMark id={arena.id} active={selected} className="h-8 w-8 flex-shrink-0" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{arena.title}</span>
                {selected && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-accent-300" />
                )}
              </button>
            );
        })}
      </div>
    </aside>
  );
}

function CollapsedStarterSidebar({
  className,
}: {
  className?: string;
}) {
  return (
    <aside
      aria-label="Collapsed debate starters"
      className={`h-full min-h-0 w-[86px] flex-col border-r border-white/10 bg-ink p-3 text-canvas shadow-[0_1px_2px_rgba(21,18,14,0.12),0_28px_72px_-36px_rgba(21,18,14,0.72)] ${className ?? ""}`}
    >
      <div className="flex flex-shrink-0 justify-center">
        <span
          aria-hidden
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/8 text-accent-300"
          title="CrimsonSeek"
        >
          <MaterialSymbol className="text-[24px]">swords</MaterialSymbol>
        </span>
      </div>
    </aside>
  );
}

function SetupPanel({
  arena,
  selectedSideIndex,
  setSelectedSideIndex,
  input,
  setInput,
  submitArgument,
  loading,
  error,
  inputRef,
}: {
  arena: ArenaPreset;
  selectedSideIndex: number;
  setSelectedSideIndex: (index: number) => void;
  input: string;
  setInput: (value: string) => void;
  submitArgument: () => void;
  loading: boolean;
  error: string | null;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const hasSides = Boolean(arena.sides?.length);

  function chooseSide(index: number) {
    const side = arena.sides?.[index];
    if (!side) return;
    setSelectedSideIndex(index);
    setInput(side.prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <form
      className="w-full rounded-xl border border-divider/80 bg-[linear-gradient(rgba(255,255,255,0.9),rgba(255,255,255,0.9)),linear-gradient(90deg,rgba(217,79,48,0.08)_1px,transparent_1px),linear-gradient(rgba(217,79,48,0.06)_1px,transparent_1px)] bg-[length:auto,28px_28px,28px_28px] p-3 shadow-[0_1px_2px_rgba(21,18,14,0.05),0_24px_60px_-44px_rgba(150,47,24,0.72)] sm:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        submitArgument();
      }}
    >
        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-accent-200 bg-accent-50/70 px-3 py-2 text-xs leading-5 text-accent-800">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-4 flex min-w-0 items-center gap-3">
          <ArenaMark id={arena.id} active className="h-10 w-10" />
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink">
              {hasSides ? "Pick your side." : "Bring Anything"}
            </h2>
            <p className="mt-0.5 text-sm leading-6 text-ink-muted">
              {hasSides
                ? "CrimsonSeek takes the other side and checks credible sources when evidence matters."
                : arena.kicker}
            </p>
          </div>
        </div>

        {arena.sides && (
          <div className="mb-3 inline-flex rounded-full border border-divider/80 bg-canvas/72 p-1">
            {arena.sides.map((side, index) => {
              const active = selectedSideIndex === index;
              return (
                <button
                  key={side.label}
                  type="button"
                  onClick={() => chooseSide(index)}
                  className={`min-h-9 rounded-full px-4 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25 ${
                    active
                      ? "bg-accent-500 text-white shadow-[0_1px_2px_rgba(150,47,24,0.16)]"
                      : "text-ink-muted hover:bg-white hover:text-accent-700"
                  }`}
                >
                  {side.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_78px_minmax(0,0.72fr)] lg:items-stretch">
          <label className="block rounded-lg border border-divider/75 bg-white/90 p-3 focus-within:border-accent-300 focus-within:shadow-[0_0_0_3px_rgba(217,79,48,0.12)]">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent-700">
              <MaterialSymbol className="text-[16px]">record_voice_over</MaterialSymbol>
              You
            </span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  submitArgument();
                }
              }}
              rows={4}
              placeholder={arena.prompt || "Write any claim you want CrimsonSeek to challenge..."}
              className="min-h-[108px] w-full resize-none bg-transparent text-[17px] leading-7 text-ink placeholder:text-ink-faint focus:outline-none"
              aria-label="Write your position for the debate"
            />
          </label>

          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent-200 bg-accent-500 text-sm font-black tracking-[0.08em] text-white shadow-[0_8px_18px_-12px_rgba(217,79,48,0.9)]">
              VS
            </div>
          </div>

          <div className="rounded-lg border border-accent-200 bg-accent-50/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent-800">
              <MaterialSymbol className="text-[16px]">psychology_alt</MaterialSymbol>
              CrimsonSeek
            </div>
            <p className="text-sm font-semibold leading-6 text-ink">Countercase</p>
            <p className="mt-2 text-sm leading-6 text-accent-900/78 line-clamp-4">
              {arena.stanceHint}
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25 ${
              input.trim() && !loading
                ? "bg-accent-500 text-white shadow-[0_1px_2px_rgba(150,47,24,0.16),0_10px_18px_-12px_rgba(217,79,48,0.8)] hover:bg-accent-600 active:scale-[0.98]"
                : "cursor-not-allowed bg-canvas-soft/70 text-ink-faint"
            }`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            Start debate
          </button>
        </div>
      </form>
  );
}

function Composer({
  input,
  setInput,
  submitArgument,
  loading,
  error,
  inputRef,
}: {
  input: string;
  setInput: (value: string) => void;
  submitArgument: () => void;
  loading: boolean;
  error: string | null;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <form
      className="flex-shrink-0 border-t border-divider/70 bg-white/82 p-3 sm:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        submitArgument();
      }}
    >
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-accent-200 bg-accent-50/70 px-3 py-2 text-xs leading-5 text-accent-800">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      <div className="rounded-lg border border-divider/75 bg-white/92 p-2 shadow-[0_1px_2px_rgba(21,18,14,0.04)] focus-within:border-accent-300 focus-within:shadow-[0_0_0_3px_rgba(217,79,48,0.12)]">
        <div className="mb-1 flex items-center gap-2 px-2 pt-1 text-xs font-semibold text-accent-700">
          <MaterialSymbol className="text-[16px]">shield</MaterialSymbol>
          Your next point
        </div>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              submitArgument();
            }
          }}
          rows={3}
          placeholder="Reply with your next argument..."
          className="max-h-40 min-h-[88px] w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-ink placeholder:text-ink-faint focus:outline-none"
          aria-label="Write your next debate argument"
        />
        <div className="flex flex-col gap-2 px-1 pb-1 min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between">
          <div className="min-w-0 text-xs text-ink-muted">
            Press <span className="font-semibold text-ink-soft">Cmd Enter</span> to answer back.
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25 ${
              input.trim() && !loading
                ? "bg-accent-500 text-white shadow-[0_1px_2px_rgba(150,47,24,0.16),0_10px_18px_-12px_rgba(217,79,48,0.8)] hover:bg-accent-600 active:scale-[0.98]"
                : "cursor-not-allowed bg-canvas-soft/70 text-ink-faint"
            }`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            Send reply
          </button>
        </div>
      </div>
    </form>
  );
}

function MessageBubble({
  message,
  searchMoment,
  active,
  onSelectSearchMoment,
  onToggleSearchMoment,
}: {
  message: DebateMessage;
  searchMoment: EvidenceSearchMoment | null;
  active: boolean;
  onSelectSearchMoment: (moment: EvidenceSearchMoment, sourceIndex?: number | null) => void;
  onToggleSearchMoment: (moment: EvidenceSearchMoment) => void;
}) {
  const isUser = message.role === "user";
  const Icon = isUser ? UserRound : Bot;
  const hasSearchMomentControl = !isUser && Boolean(message.searchMomentId);
  const visibleMomentEvidence = searchMoment ? visibleEvidence(searchMoment.evidence) : [];

  return (
    <div className={`flex min-w-0 items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
          isUser ? "bg-ink text-white" : "border border-accent-200 bg-accent-50 text-accent-700"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <article
        className={`min-w-0 max-w-[calc(100%-3rem)] rounded-lg border px-4 py-3 shadow-[0_1px_2px_rgba(21,18,14,0.04)] sm:max-w-[88%] ${
          isUser
            ? "border-ink/10 bg-ink text-white"
            : "border-divider/70 bg-white/78 text-ink"
        }`}
      >
        {message.stance && (
          <div
            className={`mb-2 text-xs font-semibold ${
              isUser ? "text-white/70" : "text-accent-700"
            }`}
          >
            {message.stance}
          </div>
        )}
        {hasSearchMomentControl && (
          <button
            type="button"
            onClick={() => {
              if (searchMoment) onToggleSearchMoment(searchMoment);
            }}
            disabled={!searchMoment}
            aria-controls="evidence-rail"
            aria-pressed={active}
            aria-label={
              searchMoment
                ? `Show evidence for ${searchMoment.label}`
                : "Evidence search unavailable"
            }
            className={`mb-3 flex w-full max-w-md items-center gap-3 rounded-lg border px-3 py-2 text-left text-xs leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25 ${
              active
                ? "border-accent-300 bg-accent-50 text-accent-900 shadow-[0_1px_2px_rgba(150,47,24,0.08)]"
                : searchMoment
                  ? "border-divider/70 bg-canvas/62 text-ink-muted hover:border-accent-200 hover:text-accent-700"
                  : "cursor-not-allowed border-divider/70 bg-canvas/46 text-ink-faint"
            }`}
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-white/80 bg-white/80 text-accent-700">
              <RadioTower className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Sources</span>
              <span className="block truncate text-[11px] text-ink-faint">
                {searchMoment?.label ?? "Evidence search"}
              </span>
            </span>
            <span className="hidden flex-shrink-0 rounded-full border border-white/80 bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-ink-muted sm:inline-flex">
              {searchMoment ? `${visibleMomentEvidence.length} sources` : "Missing"}
            </span>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          </button>
        )}
        <MessageContent
          content={message.content}
          searchMoment={searchMoment}
          onSelectSearchMoment={onSelectSearchMoment}
        />
      </article>
    </div>
  );
}

function MessageContent({
  content,
  searchMoment,
  onSelectSearchMoment,
}: {
  content: string;
  searchMoment: EvidenceSearchMoment | null;
  onSelectSearchMoment: (moment: EvidenceSearchMoment, sourceIndex?: number | null) => void;
}) {
  const evidenceItems = searchMoment ? visibleEvidence(searchMoment.evidence) : [];
  const cleanedContent = content
    .replace(/\s*\[(\d+)\]/g, (_match, numberValue: string) => {
      const sourceIndex = Number(numberValue) - 1;
      return sourceIndex >= 0 && sourceIndex < evidenceItems.length ? "" : ` [${numberValue}]`;
    })
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  const sourceNumbers = evidenceItems.map((_item, index) => index + 1);

  return (
    <div className="text-sm leading-6">
      <p className="whitespace-pre-wrap">{cleanedContent}</p>

      {searchMoment && sourceNumbers.length > 0 && (
        <SourceReferenceRow
          numbers={sourceNumbers}
          evidenceItems={evidenceItems}
          onSelect={(sourceIndex) => onSelectSearchMoment(searchMoment, sourceIndex)}
        />
      )}
    </div>
  );
}

function SourceReferenceRow({
  numbers,
  evidenceItems,
  onSelect,
}: {
  numbers: number[];
  evidenceItems: EvidenceItem[];
  onSelect: (sourceIndex: number) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
      <span>Sources:</span>
      {numbers.map((number) => {
        const item = evidenceItems[number - 1];
        if (!item) return null;
        const domain = item.url.replace(/^https?:\/\//, "").split("/")[0];

        return (
          <button
            key={`${item.url}-${number}`}
            type="button"
            onClick={() => onSelect(number - 1)}
            title={`${item.title} - ${domain}`}
            aria-label={`Open source ${number}: ${item.title}`}
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-accent-200 bg-accent-50 px-1.5 text-[11px] font-bold leading-none text-accent-800 shadow-[0_1px_1px_rgba(150,47,24,0.08)] transition-colors hover:border-accent-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25"
          >
            {number}
          </button>
        );
      })}
    </div>
  );
}

function EvidenceRail({
  arena,
  messages,
  evidence,
  searchQuery,
  live,
  activeSearchMoment,
  activeSourceIndex,
  onClose,
  auditMode,
}: {
  arena: ArenaPreset;
  messages: DebateMessage[];
  evidence: EvidenceItem[];
  searchQuery: string;
  live: boolean;
  activeSearchMoment: EvidenceSearchMoment | null;
  activeSourceIndex: number | null;
  onClose: () => void;
  auditMode: boolean;
}) {
  const assistantMessages = messages.filter((message) => message.role === "assistant");
  const selectedEvidence =
    activeSourceIndex !== null && evidence[activeSourceIndex]
      ? [evidence[activeSourceIndex]]
      : evidence;
  const selectedOffset =
    activeSourceIndex !== null && evidence[activeSourceIndex] ? activeSourceIndex : 0;
  const contextLine = auditMode
    ? `${arena.title} saved countercase`
    : assistantMessages.length
      ? `${assistantMessages.length} CrimsonSeek response${assistantMessages.length === 1 ? "" : "s"} in this thread`
      : "Live countercase";

  return (
    <aside id="evidence-rail" className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-divider/70 bg-white/90 p-4 shadow-[0_1px_2px_rgba(21,18,14,0.04),0_16px_42px_-30px_rgba(21,18,14,0.38)] xl:max-h-full xl:rounded-l-none xl:self-start xl:border-l">
      <div className="mb-4 flex flex-shrink-0 items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <MaterialSymbol className="text-[18px] text-accent-600">fact_check</MaterialSymbol>
            Sources
          </div>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            {activeSourceIndex !== null
              ? `Source ${activeSourceIndex + 1} from this countercase.`
              : live
                ? "Sources used for this countercase."
              : "Start a debate to pull credible sources for this exact claim."}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sources panel"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-divider/70 bg-white/78 text-ink-muted transition-colors hover:border-accent-200 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/25"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
      <div className="mb-4 rounded-lg border border-divider/70 bg-canvas/58 p-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-ink-soft">
          <MaterialSymbol className="text-[16px] text-accent-600">travel_explore</MaterialSymbol>
          {activeSearchMoment?.label ?? "Source trail"}
        </div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
          {contextLine}
        </p>
        {activeSearchMoment?.summary && (
          <p className="mb-2 text-xs leading-5 text-ink-muted">{activeSearchMoment.summary}</p>
        )}
        <p className="text-xs leading-5 text-ink-muted">{activeSearchMoment?.query ?? searchQuery}</p>
      </div>

      {selectedEvidence.length ? (
        <div className="space-y-3">
          {selectedEvidence.map((item, index) => (
          <a
            key={`${item.title}-${item.url}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-lg border border-divider/70 bg-white/68 p-3 transition-colors hover:border-accent-200 hover:bg-white"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold text-accent-700">Source {selectedOffset + index + 1}</div>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-ink-faint transition-colors group-hover:text-accent-600" />
            </div>
            <h3 className="text-sm font-semibold leading-5 text-ink">{item.title}</h3>
            <div className="mt-1 text-[11px] font-medium text-ink-faint">
              {item.url.replace(/^https?:\/\//, "").split("/")[0]}
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-ink-muted">{item.snippet}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-divider/70 bg-canvas/70 px-2 py-1 text-[11px] font-semibold text-ink-muted">
              <CheckCircle2 className="h-3 w-3 text-accent-600" />
              {item.sourceQuality}
            </div>
          </a>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-divider bg-canvas/42 p-4 text-sm leading-6 text-ink-muted">
          No sources yet. CrimsonSeek will search for direct counter-evidence once the debate starts.
        </div>
      )}
      </div>
    </aside>
  );
}
