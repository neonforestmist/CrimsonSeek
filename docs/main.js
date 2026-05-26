const auditLayout = document.querySelector("#auditLayout");

const ARENA_ORDER = [
  "chatgpt-claude",
  "mac-windows",
  "iphone-android",
  "ai-jobs",
  "phones-school",
  "ai-investment",
];

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
      ${renderAuditSidebar()}
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

function renderAuditSidebar() {
  return `
    <aside class="audit-starter-sidebar" aria-label="Examples">
      <a class="sidebar-brand" href="./index.html">
        <span class="brand-mark material-symbols-rounded" aria-hidden="true">swords</span>
        <span>CrimsonSeek</span>
      </a>
      <a class="sidebar-primary" href="./index.html">
        ${renderArenaMark("custom", false)}
        <span>Bring Anything</span>
      </a>
      <div class="sidebar-section-label">Examples</div>
      <div class="sidebar-list">
        ${ARENA_ORDER.map((id) => {
          const meta = ARENA_META[id];
          const selected = id === auditState.audit.arenaId;
          return `
            <a class="sidebar-item ${selected ? "is-selected" : ""}" href="./audit.html?id=${escapeAttribute(id)}">
              ${renderArenaMark(meta.icon, selected)}
              <span>${escapeHtml(meta.title)}</span>
              ${selected ? '<span class="sidebar-dot" aria-hidden="true"></span>' : ""}
            </a>
          `;
        }).join("")}
      </div>
    </aside>
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

function renderArenaMark(icon, active) {
  const activeClass = active ? " is-active" : "";
  const icons = {
    custom: '<span class="material-symbols-rounded">edit_square</span>',
    openai:
      '<svg viewBox="0 0 24 24"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zM3.5992 18.3038a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z"/></svg>',
    windows:
      '<svg viewBox="0 0 24 24"><path d="M3,12V6.75L9,5.43v6.48L3,12M20,3v8.75L10,11.9V5.21L20,3M3,13l6,.09V19.9L3,18.75V13m17,.25V22L10,20.09v-7Z"/></svg>',
    phone:
      '<svg class="stroke-svg" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.35"/><path d="M10.5 5.25h3"/><path d="M11.25 18.25h1.5"/></svg>',
    briefcase:
      '<svg class="stroke-svg" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></svg>',
    school:
      '<svg class="stroke-svg" viewBox="0 0 24 24"><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 10h.01"/></svg>',
    money:
      '<svg class="stroke-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5c-.55-.9-1.55-1.5-3-1.5-1.8 0-3 .85-3 2.25 0 1.3 1.05 1.8 3 2.25 1.95.45 3 .95 3 2.25S13.8 17 12 17c-1.45 0-2.45-.6-3-1.5"/></svg>',
  };

  return `<span class="mini-arena-mark${activeClass}" aria-hidden="true">${icons[icon] || icons.custom}</span>`;
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
