import { readFile, writeFile } from "node:fs/promises";

const API_URL = process.env.CRIMSONSEEK_API_URL ?? "http://localhost:3000/api/debate";
const MIN_SAVED_EVIDENCE = 2;
const MAX_SOURCE_SNIPPET_CHARS = 520;
const RECENT_YEAR = new Date().getUTCFullYear();
const PRIOR_YEAR = RECENT_YEAR - 1;
const STALE_MODEL_REFERENCE_PATTERN =
  /\b(ChatGPT[-\s]?3(?:\.5)?|GPT[-\s]?3(?:\.5)?|GPT[-\s]?4|Claude\s*[123]|Opus\s*[123]|o3(?:[-\s]?pro)?|o4[-\s]?mini|deprecated|legacy architecture|legacy model)\b/i;

const configs = [
  {
    arenaId: "chatgpt-claude",
    exportName: "chatgptClaudeAudit",
    file: "components/arena/audits/chatgpt-claude.ts",
    title: "ChatGPT vs Claude",
    userPosition: "ChatGPT is better than Claude for serious work.",
    turns: [
      "ChatGPT is better than Claude for serious work because it has the broader product ecosystem, tools, and everyday reliability.",
      "Claude may write nicely, but serious work needs coding, file analysis, search, and team workflows in one place.",
      "If a company has to standardize, ChatGPT is safer because employees already know it and OpenAI keeps shipping integrations.",
    ],
  },
  {
    arenaId: "mac-windows",
    exportName: "macWindowsAudit",
    file: "components/arena/audits/mac-windows.ts",
    title: "Mac vs Windows",
    userPosition: "Macs are better than Windows PCs for most people.",
    turns: [
      "Macs are better than Windows PCs for most people because the hardware is simpler, quieter, and lasts.",
      "Most people do not need huge device choice. They need a machine that works cleanly with phones, photos, messages, and support.",
      "Windows flexibility sounds nice, but the average buyer wants fewer decisions and fewer driver or update headaches.",
    ],
  },
  {
    arenaId: "iphone-android",
    exportName: "iphoneAndroidAudit",
    file: "components/arena/audits/iphone-android.ts",
    title: "iPhone vs Android",
    userPosition: "iPhone is better than Android for most people.",
    turns: [
      "iPhone is better than Android for most people because the ecosystem is polished, secure, and predictable.",
      "Android choice is overrated when people mostly want great cameras, long updates, and apps that work well.",
      "Resale value, accessories, Apple Stores, family features, and privacy make iPhone the lower-risk phone.",
    ],
  },
  {
    arenaId: "ai-jobs",
    exportName: "aiJobsAudit",
    file: "components/arena/audits/ai-jobs.ts",
    title: "AI in Jobs",
    userPosition: "AI will create more good jobs than it destroys.",
    turns: [
      "AI will create more good jobs than it destroys because it raises productivity and creates new roles around automation.",
      "Exposure to AI does not mean replacement. It means workers can offload boring tasks and move up the value chain.",
      "Companies and schools can retrain people, so the upside should outweigh the disruption.",
    ],
  },
  {
    arenaId: "phones-school",
    exportName: "phonesSchoolAudit",
    file: "components/arena/audits/phones-school.ts",
    title: "Phones in School",
    userPosition: "Schools should ban phones during the school day.",
    turns: [
      "Schools should ban phones during the school day because students cannot focus with a social slot machine nearby.",
      "Exceptions make bans messy, but teachers need simple rules and a real break from notifications and group chats.",
      "Digital self-control can wait. Classrooms should protect attention first.",
    ],
  },
  {
    arenaId: "ai-investment",
    exportName: "aiInvestmentAudit",
    file: "components/arena/audits/ai-investment.ts",
    title: "AI Worth the Investment",
    userPosition: "AI is worth the investment for most companies right now.",
    turns: [
      "AI is worth the investment for most companies right now because the learning curve matters and tools are getting cheaper.",
      "Even small gains in writing, coding, support, analysis, and sales prep can justify licenses and training.",
      "Companies that wait will lose process knowledge while competitors build habits, data pipelines, and governance.",
    ],
  },
];

const requestedArenaIds = new Set(
  (process.env.CRIMSONSEEK_ONLY_ARENAS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);
const selectedConfigs = requestedArenaIds.size
  ? configs.filter((config) => requestedArenaIds.has(config.arenaId))
  : configs;

if (!selectedConfigs.length) {
  throw new Error(`No audit configs matched CRIMSONSEEK_ONLY_ARENAS=${[...requestedArenaIds].join(",")}`);
}

const generated = requestedArenaIds.size ? await readExistingDocsAudits() : {};

for (const config of selectedConfigs) {
  console.log(`\n== ${config.title} ==`);
  const audit = await buildAudit(config);
  generated[config.arenaId] = audit;
  await writeFile(config.file, formatAuditModule(config.exportName, audit));
  console.log(`wrote ${config.file}`);
}

await writeFile(
  "docs/audits.js",
  `window.CRIMSONSEEK_AUDITS = ${JSON.stringify(generated, null, 2)};\n`
);
console.log("\nwrote docs/audits.js");

async function buildAudit(config) {
  const messages = [];
  const searchMoments = [];
  const stances = [];

  for (const [index, turn] of config.turns.entries()) {
    const userMessage = {
      id: `user-${index + 1}`,
      role: "user",
      content: ascii(turn),
    };
    messages.push(userMessage);
    console.log(`turn ${index + 1}: requesting countercase`);

    const data = await requestDebateWithSources(config.arenaId, turn, messages);
    const momentId = uniqueMomentId(slug(data.stance || `evidence-${index + 1}`), searchMoments);
    const evidence = normalizeEvidence(data.evidence ?? []);
    const domains = evidence.map((item) => domainFromUrl(item.url)).filter(Boolean);
    const label = ascii(data.stance || `Evidence check ${index + 1}`);

    searchMoments.push({
      id: momentId,
      label,
      query: ascii(data.searchQuery || `${config.title} counter-evidence`),
      summary: ascii(
        `Fresh Linkup check using ${domains.slice(0, 3).join(", ") || "the attached source trail"}. CrimsonSeek pulls the source material into the reply body instead of leaving it as a detached footnote.`
      ),
      evidence,
    });
    stances.push(label);

    messages.push({
      id: `assistant-${index + 1}`,
      role: "assistant",
      searchMomentId: momentId,
      content: ascii(data.reply),
    });
    console.log(`turn ${index + 1}: ${evidence.length} sources`);
  }

  return {
    arenaId: config.arenaId,
    userPosition: ascii(config.userPosition),
    crimsonPosition: ascii(
      `CrimsonSeek argues the strongest current countercase in the ${config.title} debate, with source material woven directly into the reply.`
    ),
    verdict: ascii(
      `This regenerated ${config.title} audit keeps the original debate lane but rebuilds the source trail from live evidence checks. The strongest countercase is no longer a list of links; it is the cited material itself, embedded in the argument.`
    ),
    searchMoments,
    messages,
  };
}

async function requestDebateWithSources(arenaId, claim, messages) {
  let lastData = null;
  let lastError = null;
  let bestData = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const requestClaim =
      attempt === 0
        ? claim
        : `${claim}\n\nFor this saved audit, match the user's length. This is a short claim, so keep the counter tight. Write in clear, natural language a smart 10th grader could follow first, then adapt to the user's tone if they are more technical, casual, or terse. Prefer ${PRIOR_YEAR}/${RECENT_YEAR} source material, current product/model/policy evidence, primary sources, benchmark pages, institutional research, official docs, reputable reporting, or hands-on testing. Avoid stale GPT-3, GPT-3.5, GPT-4, Claude 1/2/3, Opus 1/2/3, o3, o4-mini, o3-pro, unavailable, deprecated, legacy, or API-only references unless they are explicitly historical or developer/API-only. Do not invent model names, release names, version numbers, dates, prices, or benchmark scores; if you name one, it must appear verbatim in the source material you cite. Write human, coherent counterarguments with Gemini-authored inline citations in {{source material}}(1) format. Do not cite page titles, domains, source names, or URLs as source material. Do not use ellipses or broken source fragments.`;
    let data;
    try {
      data = await requestDebate(arenaId, requestClaim, messages);
    } catch (error) {
      lastError = error;
      console.log(`retry ${attempt + 1}: ${error.message}`);
      await wait(2200 * (attempt + 1));
      continue;
    }
    lastData = data;
    if (normalizeEvidence(data.evidence ?? []).length > normalizeEvidence(bestData?.evidence ?? []).length) {
      bestData = data;
    }
    const quality = savedAuditQuality(data, arenaId);
    const evidenceCount = (data.evidence ?? []).length;
    if (quality.ok) {
      return data;
    }
    console.log(
      `retry ${attempt + 1}: ${quality.reason} (${evidenceCount} sources)`
    );
  }

  if (bestData && savedAuditQuality(bestData, arenaId).ok) return bestData;
  if (lastError) throw lastError;
  throw new Error(
    `Debate request returned no usable source trail after retries: ${lastData?.stance ?? "unknown stance"}`
  );
}

async function requestDebate(arenaId, claim, messages) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      arenaId,
      claim,
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || `Debate request failed with ${res.status}`);
  }
  return json;
}

function normalizeEvidence(items) {
  return items.slice(0, 5).map((item) => ({
    title: ascii(item.title || "Untitled source"),
    url: ascii(item.url || ""),
    snippet: compactSourceSnippet(item.snippet || ""),
    sourceQuality: ascii(item.sourceQuality || "Evidence-bearing source"),
  }));
}

function savedAuditQuality(data, arenaId) {
  const reply = String(data.reply ?? "");
  const evidence = normalizeEvidence(data.evidence ?? []);
  const evidenceCount = evidence.length;

  if (evidenceCount < MIN_SAVED_EVIDENCE) {
    return { ok: false, reason: `only ${evidenceCount} high-quality sources` };
  }

  if (evidence.some((item) => item.snippet.length > MAX_SOURCE_SNIPPET_CHARS)) {
    return { ok: false, reason: "source snippet exceeded compact saved length" };
  }

  if (/I could not get a clean structured response/i.test(reply)) {
    return { ok: false, reason: "fallback response leaked into saved audit" };
  }

  if (/\u2026|\.{3,}/.test(reply)) {
    return { ok: false, reason: "reply contains ellipses" };
  }

  if (/\[\d+(?:\s*,\s*\d+)*\]/.test(reply)) {
    return { ok: false, reason: "reply contains bracket-only citations" };
  }

  if (
    arenaId === "chatgpt-claude" &&
    STALE_MODEL_REFERENCE_PATTERN.test(
      `${reply} ${evidence.map((item) => `${item.title} ${item.snippet}`).join(" ")}`
    )
  ) {
    return { ok: false, reason: "stale model references appeared in current model audit" };
  }

  const unsupportedModelReference = findUnsupportedModelReference(reply, evidence);
  if (unsupportedModelReference) {
    return { ok: false, reason: `model/version not present in evidence: ${unsupportedModelReference}` };
  }

  let validCitations = 0;
  for (const match of reply.matchAll(/\{\{([^}]{8,640})\}\}\((\d+)\)/g)) {
    const material = match[1] || "";
    const number = Number(match[2]) - 1;
    if (number >= 0 && number < evidenceCount && citationMaterialLooksClean(material)) {
      validCitations += 1;
    }
  }

  if (validCitations < 2) {
    return { ok: false, reason: "fewer than two integrated citations" };
  }

  return { ok: true, reason: "usable saved audit" };
}

function citationMaterialLooksClean(material) {
  if (/\u2026|\.{3,}/.test(material)) return false;
  if (/\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|org|edu|gov|gov\.uk|ai|io|net|co)\b)/i.test(material)) {
    return false;
  }
  if (/\b(source|article|report|page|blog post|website)\s+\d*$/i.test(material)) {
    return false;
  }
  return true;
}

function findUnsupportedModelReference(reply, evidence) {
  const evidenceText = evidence
    .map((item) => `${item.title} ${item.snippet}`)
    .join(" ")
    .toLowerCase();
  const references = [
    ...reply.matchAll(/\b(?:GPT|OpenAI)\s*-?\s*\d+(?:\.\d+)?(?:[-\s]?(?:mini|pro|turbo|max|high))?\b/gi),
    ...reply.matchAll(/\bo\d(?:[-\s]?(?:mini|pro))?\b/gi),
    ...reply.matchAll(/\bClaude\s+(?:Opus|Sonnet|Haiku)\s+\d+(?:\.\d+)?\b/gi),
    ...reply.matchAll(/\bClaude\s+\d+(?:\.\d+)?\b/gi),
  ]
    .map((match) => match[0].replace(/\s+/g, " ").trim())
    .filter(Boolean);

  for (const reference of references) {
    if (!evidenceText.includes(reference.toLowerCase())) return reference;
  }

  return null;
}

function formatAuditModule(exportName, audit) {
  return [
    'import type { DebateAudit } from "@/components/arena/audit-types";',
    "",
    `export const ${exportName}: DebateAudit = ${JSON.stringify(audit, null, 2)};`,
    "",
  ].join("\n");
}

async function readExistingDocsAudits() {
  const existing = await readFile("docs/audits.js", "utf8").catch(() => "");
  const match = existing.match(/window\.CRIMSONSEEK_AUDITS\s*=\s*([\s\S]*);\s*$/);
  if (!match) return {};
  return JSON.parse(match[1]);
}

function uniqueMomentId(base, moments) {
  let candidate = base || "evidence-check";
  let suffix = 2;
  const seen = new Set(moments.map((moment) => moment.id));
  while (seen.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function slug(value) {
  const clean = ascii(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || "evidence-check";
}

function lowerFirst(value) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function ascii(value) {
  return normalizeCitationSpacing(decodeHtmlEntities(String(value ?? "")))
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2026|\.{3,}/g, " ")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function cleanSourceSnippet(value) {
  return ascii(value)
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

function compactSourceSnippet(value) {
  const clean = cleanSourceSnippet(value);
  if (clean.length <= MAX_SOURCE_SNIPPET_CHARS) return clean;

  const sentences = clean.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [clean];
  let compact = "";
  for (const sentence of sentences) {
    const next = [compact, sentence.trim()].filter(Boolean).join(" ");
    if (next.length > MAX_SOURCE_SNIPPET_CHARS) break;
    compact = next;
  }

  if (compact.length >= 180) return compact.trim();

  let clipped = "";
  for (const word of clean.split(/\s+/)) {
    const next = [clipped, word].filter(Boolean).join(" ");
    if (next.length > MAX_SOURCE_SNIPPET_CHARS) break;
    clipped = next;
  }

  if (!/[.!?]$/.test(clipped)) {
    clipped = `${clipped.replace(/[,;:]$/, "")}.`;
  }
  return clipped.trim();
}

function normalizeCitationSpacing(value) {
  return value
    .replace(/\{\{\s+/g, "{{")
    .replace(/\s+\}\}/g, "}}")
    .replace(/([A-Za-z0-9.,;:!?])\s*(\{\{)/g, "$1 $2")
    .replace(/\}\}\((\d+)\)\s*(?=\{\{)/g, "}}($1) ")
    .replace(/\}\}\((\d+)\)(?=[A-Za-z0-9])/g, "}}($1) ");
}

function decodeHtmlEntities(value) {
  let decoded = value;
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
