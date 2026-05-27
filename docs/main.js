const auditLayout = document.querySelector("#auditLayout");
const examplesGrid = document.querySelector("#examplesGrid");

const ARENA_META = {
  "chatgpt-claude": {
    title: "ChatGPT vs Claude",
    prompt: "ChatGPT is better than Claude for serious work.",
    stanceHint:
      "CrimsonSeek takes Claude's side and looks for evidence against your model preference.",
    icon: "openai",
  },
  "mac-windows": {
    title: "Mac vs Windows",
    prompt: "Macs are better than Windows PCs for most people.",
    stanceHint:
      "CrimsonSeek takes the Windows side and tests the claim against cost, repairability, gaming, compatibility, and upgrade paths.",
    icon: "apple-windows",
  },
  "iphone-android": {
    title: "iPhone vs Android",
    prompt: "iPhone is better than Android for most people.",
    stanceHint:
      "CrimsonSeek takes Android's side and looks for evidence on cost, customization, repair, choice, and hardware variety.",
    icon: "phone",
  },
  "ai-jobs": {
    title: "AI in Jobs",
    prompt: "AI will create more good jobs than it destroys.",
    stanceHint:
      "CrimsonSeek argues the risk side with evidence on displacement, deskilling, surveillance, wage pressure, and uneven gains.",
    icon: "briefcase",
  },
  "phones-school": {
    title: "Phones in School",
    prompt: "Schools should ban phones during the school day.",
    stanceHint:
      "CrimsonSeek argues against a blanket ban and looks for evidence on safety, accessibility, enforcement, and student autonomy.",
    icon: "school",
  },
  "ai-investment": {
    title: "AI Worth the Investment",
    prompt: "AI is worth the investment for most companies right now.",
    stanceHint:
      "CrimsonSeek takes the skeptical CFO position and tests the claim against ROI, implementation cost, reliability, and adoption risk.",
    icon: "money",
  },
};

const WEAK_SOURCE_LABEL_PATTERN = /use with caution|needs review|unclassified|low-confidence|low value|seo/i;
const WEAK_SOURCE_DOMAIN_PATTERN = /(^|\.)?(linkedin|medium|substack|quora|pinterest|facebook|forbes)\.com$/i;

let auditState = null;
let activeMomentId = null;
let activeSourceIndex = null;
let sourcesOpen = false;
let pendingSourceScrollFrame = 0;
let pendingSourceScrollSecondFrame = 0;

if (examplesGrid && window.CRIMSONSEEK_AUDITS) {
  renderExamples();
}

if (auditLayout && window.CRIMSONSEEK_AUDITS) {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id") || "mac-windows";
  const audit = window.CRIMSONSEEK_AUDITS[requestedId] || window.CRIMSONSEEK_AUDITS["mac-windows"];

  auditState = buildAuditState(audit);
  const requestedMoment = params.get("moment");
  activeMomentId = requestedMoment || auditState.searchMoments[0]?.id || null;
  sourcesOpen = Boolean(requestedMoment);
  const requestedSource = Number(params.get("source"));
  if (Number.isInteger(requestedSource) && requestedSource > 0) {
    activeSourceIndex = requestedSource - 1;
    sourcesOpen = true;
  }
  document.title = `${auditState.meta.title} | CrimsonSeek`;

  auditLayout.addEventListener("click", handleAuditClick);
  renderAudit();
}

function renderExamples() {
  const audits = Object.values(window.CRIMSONSEEK_AUDITS);
  examplesGrid.innerHTML = audits.map((audit) => {
    const meta = ARENA_META[audit.arenaId] || {
      title: audit.userPosition,
      prompt: audit.userPosition,
      stanceHint: audit.crimsonPosition,
      icon: "custom",
    };
    const sourceCount = audit.searchMoments.reduce(
      (count, moment) => count + visibleEvidence(moment.evidence).length,
      0
    );
    const firstMoment = audit.searchMoments[0]?.id || "";
    const auditHref = firstMoment
      ? `./audit.html?id=${escapeAttribute(audit.arenaId)}&moment=${escapeAttribute(firstMoment)}&source=1#thread`
      : `./audit.html?id=${escapeAttribute(audit.arenaId)}#thread`;

    return `
      <a class="example-card audit-example-card" href="${auditHref}">
        <span class="card-body">
          <span class="card-heading">
            <span class="arena-mark" aria-hidden="true">
              ${arenaIconMarkup(meta.icon)}
            </span>
            <span>
              <span>${escapeHtml(meta.title)}</span>
              <small>${audit.searchMoments.length} checks / ${sourceCount} sources</small>
            </span>
          </span>
          <span class="card-copy strong-copy">${escapeHtml(audit.crimsonPosition)}</span>
          <span class="card-copy verdict-copy">${escapeHtml(audit.verdict)}</span>
        </span>
        <span class="card-footer"><span>View sample debate audit</span><span aria-hidden="true">↗</span></span>
      </a>
    `;
  }).join("");
}

function buildAuditState(audit) {
  const meta = ARENA_META[audit.arenaId] || {
    title: "Debate Audit",
    prompt: audit.userPosition,
    stanceHint: audit.crimsonPosition,
    icon: "custom",
  };
  const searchMoments = audit.searchMoments.map(cleanSearchMoment);
  const momentsById = new Map(searchMoments.map((moment) => [moment.id, moment]));
  const messages = audit.messages.map((message) => ({
    ...message,
    stance: message.role === "assistant" ? "CrimsonSeek counter" : "Your position",
    content: weaveSavedSourceMaterial(
      cleanProviderCopy(message.content),
      message.searchMomentId ? momentsById.get(message.searchMomentId) || null : null
    ),
  }));

  return {
    audit,
    meta,
    messages,
    momentsById,
    searchMoments,
  };
}

function handleAuditClick(event) {
  const closeButton = event.target.closest("[data-close-sources]");
  if (closeButton) {
    sourcesOpen = false;
    activeSourceIndex = null;
    syncAuditUrl();
    renderAudit();
    return;
  }

  const sourceNumber = event.target.closest("[data-source-index]");
  if (sourceNumber) {
    activeMomentId = sourceNumber.dataset.momentId;
    activeSourceIndex = Number(sourceNumber.dataset.sourceIndex);
    sourcesOpen = true;
    syncAuditUrl();
    renderAudit();
    return;
  }

  const sourceControl = event.target.closest("[data-moment-id]");
  if (sourceControl) {
    const momentId = sourceControl.dataset.momentId;
    if (sourcesOpen && activeMomentId === momentId && activeSourceIndex === null) {
      sourcesOpen = false;
    } else {
      activeMomentId = momentId;
      activeSourceIndex = null;
      sourcesOpen = true;
    }
    syncAuditUrl();
    renderAudit();
  }
}

function renderAudit() {
  const activeMoment =
    auditState.searchMoments.find((moment) => moment.id === activeMomentId) ||
    auditState.searchMoments[0] ||
    null;
  const activeEvidence = activeMoment ? visibleEvidence(activeMoment.evidence) : [];
  if (
    activeSourceIndex !== null &&
    (activeSourceIndex < 0 || activeSourceIndex >= activeEvidence.length)
  ) {
    activeSourceIndex = null;
  }
  const hasSources = sourcesOpen && Boolean(activeMoment);
  document.body.classList.toggle("sources-open", hasSources);

  auditLayout.innerHTML = `
    <div class="audit-app-grid">
      <section class="audit-workspace ${hasSources ? "has-sources" : ""}">
        <main id="thread" class="debate-thread-panel ${hasSources ? "is-connected" : ""}" aria-label="Saved debate thread">
          <header class="debate-thread-header">
            <div class="thread-title-block">
              <div class="thread-title">
                <span class="material-symbols-rounded" aria-hidden="true">forum</span>
                Debate thread
              </div>
              <p>${escapeHtml(auditState.meta.stanceHint)}</p>
            </div>
            <a class="thread-action" href="./examples.html">
              <span aria-hidden="true">←</span>
              Examples
            </a>
          </header>
          <div class="thread-scroll">
            <div class="message-stack">
              ${auditState.messages.map((message) => renderMessage(message)).join("")}
            </div>
          </div>
        </main>
        ${hasSources ? '<div class="source-backdrop" data-close-sources aria-hidden="true"></div>' : ""}
        ${hasSources ? renderEvidenceRail(activeMoment) : ""}
      </section>
    </div>
  `;

  if (hasSources && activeSourceIndex !== null) {
    scheduleSourceCardScroll(activeMoment.id, activeSourceIndex);
  } else {
    cancelScheduledSourceScroll();
  }
}

function renderMessage(message) {
  const isUser = message.role === "user";
  const moment = message.searchMomentId ? auditState.momentsById.get(message.searchMomentId) : null;
  const active = Boolean(sourcesOpen && moment && moment.id === activeMomentId);
  const evidenceItems = moment ? moment.evidence : [];

  return `
    <div class="message-row ${isUser ? "is-user" : ""}">
      <div class="message-avatar ${isUser ? "is-user" : ""}" aria-hidden="true">
        <span class="material-symbols-rounded">${isUser ? "person" : "smart_toy"}</span>
      </div>
      <article class="message-card ${isUser ? "is-user" : "is-counter"}">
        <div class="message-stance">${escapeHtml(message.stance)}</div>
        ${moment ? renderSourceControl(moment, active) : ""}
        <div class="message-content">
          ${renderMessageContent(message.content, moment, evidenceItems)}
          ${moment ? renderSourceReferenceRow(moment, active) : ""}
        </div>
      </article>
    </div>
  `;
}

function renderSourceControl(moment, active) {
  return `
    <button
      type="button"
      class="message-source-button ${active ? "is-active" : ""}"
      data-moment-id="${escapeAttribute(moment.id)}"
      aria-controls="evidence-rail"
      aria-pressed="${active ? "true" : "false"}"
    >
      <span class="source-button-icon">
        <span class="material-symbols-rounded" aria-hidden="true">cell_tower</span>
      </span>
      <span class="source-button-copy">
        <span>Sources</span>
        <small>${escapeHtml(moment.label)}</small>
      </span>
      <span class="source-count">${moment.evidence.length} ${plural(moment.evidence.length, "source")}</span>
      <span class="material-symbols-rounded source-chevron" aria-hidden="true">chevron_right</span>
    </button>
  `;
}

function renderMessageContent(content, moment, evidenceItems) {
  const cleaned = cleanMessageContent(content);
  const paragraphs = cleaned.split(/\n{2,}/).filter(Boolean);

  return `
    <div class="message-paragraphs">
      ${paragraphs
        .map(
          (paragraph) => `
            <p>${renderCitationSegments(paragraph, moment, evidenceItems)}</p>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCitationSegments(text, moment, evidenceItems) {
  const pattern = /\{\{([^}]{1,640})\}\}\((\d+)\)/g;
  let output = "";
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const matchIndex = match.index || 0;
    output += escapeHtml(text.slice(lastIndex, matchIndex));

    const sourceMaterial = match[1] || null;
    const number = Number(match[2]);
    const sourceIndex = number - 1;
    const item = evidenceItems[sourceIndex];

    if (moment && item) {
      const material = sourceMaterial ? cleanSourceSnippet(sourceMaterial) : "";
      output += `<span class="citation-cluster"><span class="citation-material">${escapeHtml(material)}</span><button type="button" class="citation-link" data-moment-id="${escapeAttribute(moment.id)}" data-source-index="${sourceIndex}" title="${escapeAttribute(`${item.title} - ${domainFromUrl(item.url)}`)}" aria-label="Show source ${number}: ${escapeAttribute(item.title)}">(${number})</button></span>`;
    } else {
      output += escapeHtml(sourceMaterial ? cleanSourceSnippet(sourceMaterial) : match[0]);
    }

    lastIndex = matchIndex + match[0].length;
  }

  output += escapeHtml(text.slice(lastIndex));
  return output;
}

function renderSourceReferenceRow(moment, active) {
  if (!moment.evidence.length) return "";

  return `
    <div class="source-reference-row">
      <span class="source-reference-label">Sources</span>
      ${moment.evidence.map((item, index) => {
        const domain = domainFromUrl(item.url);
        const selected = active && activeSourceIndex === index;
        return `
          <button
            type="button"
            class="source-reference ${selected ? "is-selected" : ""}"
            data-moment-id="${escapeAttribute(moment.id)}"
            data-source-index="${index}"
            title="${escapeAttribute(`${item.title} - ${domain}`)}"
            aria-label="Open source ${index + 1}: ${escapeAttribute(item.title)}"
            aria-pressed="${selected ? "true" : "false"}"
          >
            ${index + 1}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderEvidenceRail(activeMoment) {
  const evidenceItems = activeMoment.evidence;
  const sourceLine =
    activeSourceIndex !== null
      ? `Source ${activeSourceIndex + 1} from this countercase.`
      : "Sources used for this countercase.";

  return `
    <aside id="evidence-rail" class="evidence-rail-panel" aria-label="Sources panel">
      <header class="evidence-rail-header">
        <div>
          <div class="rail-title">
            <span class="material-symbols-rounded" aria-hidden="true">fact_check</span>
            Sources
          </div>
          <p>${escapeHtml(sourceLine)}</p>
        </div>
        <button type="button" class="rail-close" data-close-sources aria-label="Close sources panel">
          <span class="material-symbols-rounded" aria-hidden="true">close</span>
        </button>
      </header>

      <div id="evidence-rail-scroll" class="rail-scroll">
        <section class="source-trail-card">
          <div class="source-trail-title">
            <span class="material-symbols-rounded" aria-hidden="true">travel_explore</span>
            ${escapeHtml(activeMoment.label)}
          </div>
          <p class="source-trail-context">${escapeHtml(`${auditState.meta.title} saved countercase`)}</p>
          ${activeMoment.summary ? `<p>${escapeHtml(activeMoment.summary)}</p>` : ""}
          <p>${escapeHtml(activeMoment.query)}</p>
        </section>

        ${
          evidenceItems.length
            ? `<div class="rail-source-list">
                ${evidenceItems.map((item, index) => renderSourceCard(item, index, activeMoment.id)).join("")}
              </div>`
            : `<div class="empty-sources">No sources are attached to this evidence check.</div>`
        }
      </div>
    </aside>
  `;
}

function renderSourceCard(item, index, momentId) {
  const active = activeSourceIndex === index;
  return `
    <a
      id="${escapeAttribute(sourceCardDomId(momentId, index))}"
      class="rail-source-card ${active ? "is-highlighted" : ""}"
      href="${escapeAttribute(item.url)}"
      target="_blank"
      rel="noopener noreferrer"
      aria-current="${active ? "true" : "false"}"
    >
      <div class="source-card-topline">
        <span class="source-card-pill">Source ${index + 1}</span>
        <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <div class="source-domain">${escapeHtml(domainFromUrl(item.url))}</div>
      <p>${escapeHtml(item.snippet)}</p>
      <div class="source-quality">
        <span class="material-symbols-rounded" aria-hidden="true">check_circle</span>
        ${escapeHtml(item.sourceQuality)}
      </div>
    </a>
  `;
}

function cleanSearchMoment(moment) {
  return {
    ...moment,
    summary: moment.summary ? cleanProviderCopy(moment.summary) : moment.summary,
    evidence: visibleEvidence(moment.evidence),
  };
}

function compactText(value, maxLength) {
  const compact = String(value).replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;

  const sliced = compact.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const clean = lastSpace > 48 ? sliced.slice(0, lastSpace) : sliced;
  return clean;
}

function sourceMaterialExcerpt(value) {
  return firstUsefulSentence(cleanSourceSnippet(value));
}

function hasValidCitation(content, evidenceItems) {
  for (const match of String(content).matchAll(/\{\{[^}]{1,640}\}\}\((\d+)\)/g)) {
    const sourceIndex = Number(match[1]) - 1;
    if (sourceIndex >= 0 && sourceIndex < evidenceItems.length) return true;
  }
  return false;
}

function sourceMaterialLine(evidenceItems) {
  const excerpts = evidenceItems
    .slice(0, 3)
    .map((item, index) => `{{${sourceMaterialExcerpt(item.snippet)}}}(${index + 1})`);
  return excerpts.length ? `The source trail matters here: ${excerpts.join(" ")}` : "";
}

function weaveSavedSourceMaterial(content, moment) {
  void moment;
  return stripLooseCitationMarkers(content);
}

function stripLooseCitationMarkers(value) {
  return String(value)
    .replace(/\(([^()\n]{8,260})\)\s*\[\d+(?:\s*,\s*\d+)*\]/g, "$1")
    .replace(/\[\d+(?:\s*,\s*\d+)*\]/g, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function firstUsefulSentence(value) {
  const clean = String(value).replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const sentence = clean.match(/^.{40,260}?[.!?](?=\s|$)/)?.[0];
  return sentence ? sentence.trim() : clean;
}

function cleanProviderCopy(value) {
  return cleanDisplayText(String(value))
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

function cleanMessageContent(content) {
  return cleanProviderCopy(content)
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function visibleEvidence(items) {
  return items.map(cleanEvidenceItem);
}

function isDisplayableEvidence(item) {
  if (WEAK_SOURCE_LABEL_PATTERN.test(item.sourceQuality)) return false;
  return !WEAK_SOURCE_DOMAIN_PATTERN.test(domainFromUrl(item.url));
}

function decodeHtmlEntities(value) {
  let decoded = String(value ?? "");
  for (let index = 0; index < 2; index += 1) {
    decoded = decoded
      .replace(/&nbsp;/gi, " ")
      .replace(/&#x27;|&#0*39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&");
  }
  return decoded;
}

function cleanDisplayText(value) {
  return decodeHtmlEntities(String(value ?? "")).replace(/\s+/g, " ").trim();
}

function cleanSourceSnippet(value) {
  return cleanDisplayText(value)
    .replace(/\u2026|\.{3,}/g, " ")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/)?[^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s*\[(?:source\s*)?\d+(?:\s*,\s*\d+)*\]/gi, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanEvidenceItem(item) {
  return {
    ...item,
    title: cleanDisplayText(item.title),
    snippet: cleanSourceSnippet(item.snippet),
    sourceQuality: cleanDisplayText(item.sourceQuality),
  };
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function plural(count, word) {
  return count === 1 ? word : `${word}s`;
}

function sourceCardDomId(momentId, sourceIndex) {
  return `source-${momentId}-${sourceIndex + 1}`;
}

function scrollSourceCardIntoRail(momentId, sourceIndex) {
  const card = document.getElementById(sourceCardDomId(momentId, sourceIndex));
  const railScroll = document.getElementById("evidence-rail-scroll");
  if (!card || !railScroll || !railScroll.contains(card)) return;

  const railBox = railScroll.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();
  const nextTop =
    railScroll.scrollTop + cardBox.top - railBox.top - Math.max(12, railBox.height * 0.18);
  railScroll.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
}

function scheduleSourceCardScroll(momentId, sourceIndex) {
  cancelScheduledSourceScroll();
  pendingSourceScrollFrame = window.requestAnimationFrame(() => {
    pendingSourceScrollSecondFrame = window.requestAnimationFrame(() => {
      scrollSourceCardIntoRail(momentId, sourceIndex);
      pendingSourceScrollFrame = 0;
      pendingSourceScrollSecondFrame = 0;
    });
  });
}

function cancelScheduledSourceScroll() {
  if (pendingSourceScrollFrame) {
    window.cancelAnimationFrame(pendingSourceScrollFrame);
    pendingSourceScrollFrame = 0;
  }
  if (pendingSourceScrollSecondFrame) {
    window.cancelAnimationFrame(pendingSourceScrollSecondFrame);
    pendingSourceScrollSecondFrame = 0;
  }
}

function syncAuditUrl() {
  if (!auditState) return;

  const params = new URLSearchParams();
  params.set("id", auditState.audit.arenaId);
  if (sourcesOpen && activeMomentId) params.set("moment", activeMomentId);
  if (sourcesOpen && activeSourceIndex !== null) params.set("source", String(activeSourceIndex + 1));

  window.history.replaceState(null, "", `./audit.html?${params.toString()}#thread`);
}

function arenaIconMarkup(icon) {
  const icons = {
    openai: `<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`,
    "apple-windows": `<span class="duo-icon"><svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.26.82-1.31.05-2.31-1.34-3.14-2.57-1.7-2.45-3-6.93-1.25-9.96.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.86 3.29.86.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.97-.09.06-2.17 1.26-2.15 3.85.03 3.09 2.71 4.12 2.74 4.13-.03.07-.43 1.48-1.46 2.94M13.02 3.5c.69-.83 1.83-1.46 2.87-1.5.13 1.2-.35 2.39-1.01 3.25-.66.85-1.74 1.51-2.86 1.42-.15-1.17.39-2.4 1-3.17Z"/></svg><svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 12V6.75l6-1.32v6.48L3 12Zm17-9v8.75l-10 .15V5.21L20 3ZM3 13l6 .09v6.81l-6-1.15V13Zm17 .25V22l-10-1.91v-7Z"/></svg></span>`,
    phone: `<svg class="stroke-mark" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="2.5" width="10" height="19" rx="2.35" stroke-width="2"/><path d="M10.5 5.25h3" stroke-width="2"/><path d="M11.25 18.25h1.5" stroke-width="2"/></svg>`,
    briefcase: `<svg class="stroke-mark" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12h.01" stroke-width="2.35"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke-width="2.35"/><path d="M22 13a18.15 18.15 0 0 1-20 0" stroke-width="2.35"/><rect width="20" height="14" x="2" y="6" rx="2" stroke-width="2.35"/></svg>`,
    school: `<svg class="stroke-mark" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4 6 8-4 8 4" stroke-width="2.35"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" stroke-width="2.35"/><path d="M6 10v12" stroke-width="2.35"/><path d="M18 10v12" stroke-width="2.35"/><path d="M10 22v-6h4v6" stroke-width="2.35"/></svg>`,
    money: `<svg class="stroke-mark" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.75Z" stroke-width="2.35"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" stroke-width="2.35"/><path d="M12 18V6" stroke-width="2.35"/></svg>`,
    custom: `<svg class="stroke-mark" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m14.5 17.5 3-3" stroke-width="2.35"/><path d="M5 19 19 5" stroke-width="2.35"/><path d="m14 5 5 5" stroke-width="2.35"/><path d="m5 14 5 5" stroke-width="2.35"/></svg>`,
  };
  return icons[icon] || icons.custom;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
