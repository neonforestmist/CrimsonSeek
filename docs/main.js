const auditLayout = document.querySelector("#auditLayout");

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
    icon: "windows",
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

if (auditLayout && window.CRIMSONSEEK_AUDITS) {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id") || "mac-windows";
  const audit = window.CRIMSONSEEK_AUDITS[requestedId] || window.CRIMSONSEEK_AUDITS["mac-windows"];

  auditState = buildAuditState(audit);
  activeMomentId = auditState.searchMoments[0]?.id ?? null;
  document.title = `${auditState.meta.title} | CrimsonSeek`;

  auditLayout.addEventListener("click", handleAuditClick);
  renderAudit();
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
    content: cleanProviderCopy(message.content),
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
    renderAudit();
    return;
  }

  const sourceNumber = event.target.closest("[data-source-index]");
  if (sourceNumber) {
    activeMomentId = sourceNumber.dataset.momentId;
    activeSourceIndex = Number(sourceNumber.dataset.sourceIndex);
    sourcesOpen = true;
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
    renderAudit();
  }
}

function renderAudit() {
  const activeMoment =
    auditState.searchMoments.find((moment) => moment.id === activeMomentId) ||
    auditState.searchMoments[0] ||
    null;
  const hasSources = sourcesOpen && Boolean(activeMoment);

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
          <p>${escapeHtml(cleanMessageContent(message.content, evidenceItems))}</p>
          ${moment ? renderSourceReferenceRow(moment) : ""}
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

function renderSourceReferenceRow(moment) {
  if (!moment.evidence.length) return "";

  return `
    <div class="source-reference-row">
      <span>Sources:</span>
      ${moment.evidence.map((item, index) => {
        const domain = domainFromUrl(item.url);
        return `
          <button
            type="button"
            class="source-reference"
            data-moment-id="${escapeAttribute(moment.id)}"
            data-source-index="${index}"
            title="${escapeAttribute(`${item.title} - ${domain}`)}"
            aria-label="Open source ${index + 1}: ${escapeAttribute(item.title)}"
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
  const selectedEvidence =
    activeSourceIndex !== null && evidenceItems[activeSourceIndex]
      ? [evidenceItems[activeSourceIndex]]
      : evidenceItems;
  const selectedOffset =
    activeSourceIndex !== null && evidenceItems[activeSourceIndex] ? activeSourceIndex : 0;
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

      <div class="rail-scroll">
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
          selectedEvidence.length
            ? `<div class="rail-source-list">
                ${selectedEvidence.map((item, index) => renderSourceCard(item, selectedOffset + index)).join("")}
              </div>`
            : `<div class="empty-sources">No sources are attached to this evidence check.</div>`
        }
      </div>
    </aside>
  `;
}

function renderSourceCard(item, index) {
  return `
    <a class="rail-source-card" href="${escapeAttribute(item.url)}" target="_blank" rel="noopener noreferrer">
      <div class="source-card-topline">
        <span>Source ${index + 1}</span>
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

function cleanProviderCopy(value) {
  return String(value)
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

function cleanMessageContent(content, evidenceItems) {
  return cleanProviderCopy(content)
    .replace(/\s*\[(\d+)\]/g, (_match, numberValue) => {
      const sourceIndex = Number(numberValue) - 1;
      return sourceIndex >= 0 && sourceIndex < evidenceItems.length ? "" : ` [${numberValue}]`;
    })
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function visibleEvidence(items) {
  return items.filter(isDisplayableEvidence);
}

function isDisplayableEvidence(item) {
  if (WEAK_SOURCE_LABEL_PATTERN.test(item.sourceQuality)) return false;
  return !WEAK_SOURCE_DOMAIN_PATTERN.test(domainFromUrl(item.url));
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
