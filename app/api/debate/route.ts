import { NextResponse } from "next/server";
import { z } from "zod";
import {
  GeminiJsonParseError,
  generateGeminiText,
  parseJsonObject,
} from "@/lib/gemini";
import {
  fetchSourcedAnswer,
  type Depth,
  type LinkupSource,
  type SourcedAnswer,
} from "@/lib/linkup";
import { assessSourceQuality, type SourceQuality } from "@/lib/source-quality";
import { hostnameOf } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const DebateRequestSchema = z.object({
  arenaId: z.string().min(1).max(80),
  claim: z.string().min(1).max(4000),
  messages: z.array(MessageSchema).max(16).optional(),
});

const GeminiDebateSchema = z.object({
  reply: z.string().min(1),
  stance: z.string().min(1).max(80),
});

const GeminiPlanSchema = z.object({
  searchMode: z.enum(["search", "skip"]),
  stance: z.string().min(1).max(80),
  searchBrief: z.string().max(1400).nullable().optional(),
  noSearchReason: z
    .enum(["none", "greeting", "junk", "too_vague", "pure_preference", "timeless_reasoning", "meta_instruction"])
    .optional(),
  noSearchReply: z.string().max(500).nullable().optional(),
  sourceBudget: z.number().int().min(0).max(5),
  maxResults: z.number().int().min(0).max(12),
  recency: z.enum(["strict_recent", "recent_first", "evergreen"]),
  replyTarget: z.enum(["short", "medium", "long"]),
  targetWords: z.number().int().min(35).max(420),
  targetParagraphs: z.number().int().min(1).max(5),
  reason: z.string().min(1).max(500),
});

type ArenaBrief = {
  title: string;
  job: string;
  evidenceFocus: string;
  priorityDomains: string[];
};

type DebateEvidence = {
  id: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  sourceQuality: string;
};

const ARENAS: Record<string, ArenaBrief> = {
  custom: {
    title: "Open Debate",
    job: "Infer the user's debate topic from the claim, then argue the strongest fair opposing side. Do not treat the query like general search. Make it a debate about public evidence, tradeoffs, and counterexamples.",
    evidenceFocus:
      "current web evidence, reputable reporting, primary sources, reviews, studies, expert analysis, firsthand communities, surveys, institutional reports, counterexamples, and public reactions relevant to the user's claim",
    priorityDomains: [],
  },
  "chatgpt-claude": {
    title: "ChatGPT vs Claude",
    job: "Argue the opposing side in a model preference debate. If the user favors ChatGPT, build the Claude case. If the user favors Claude, build the ChatGPT case.",
    evidenceFocus:
      "ChatGPT Claude comparisons, benchmarks, coding performance, writing quality, reliability, context windows, enterprise use, pricing, and user reactions",
    priorityDomains: [
      "anthropic.com",
      "openai.com",
      "artificialanalysis.ai",
      "lmarena.ai",
      "livebench.ai",
      "swebench.com",
      "theverge.com",
      "techcrunch.com",
    ],
  },
  "mac-windows": {
    title: "Mac vs Windows",
    job: "Argue the opposing side in a computer platform debate using real product evidence, total cost, user workflows, gaming, business compatibility, repairability, and reliability.",
    evidenceFocus:
      "Mac Windows comparisons, ownership cost, productivity workflows, gaming performance, enterprise compatibility, repairability, hardware options, battery life, security, and user reviews",
    priorityDomains: [
      "apple.com",
      "microsoft.com",
      "pcmag.com",
      "tomshardware.com",
      "theverge.com",
      "cnet.com",
      "windowscentral.com",
      "macrumors.com",
    ],
  },
  "iphone-android": {
    title: "iPhone vs Android",
    job: "Argue the opposing side in a smartphone ecosystem debate using reviews, owner complaints, pricing, repairability, device choice, privacy, app ecosystem, and long-term updates.",
    evidenceFocus:
      "iPhone Android comparisons, phone reviews, camera tests, battery life, repair costs, resale value, privacy, app ecosystem, customization, update support, and user reactions",
    priorityDomains: [
      "apple.com",
      "android.com",
      "samsung.com",
      "theverge.com",
      "cnet.com",
      "macrumors.com",
      "androidauthority.com",
      "ifixit.com",
    ],
  },
  "ai-jobs": {
    title: "AI in Jobs",
    job: "Argue the opposing side in a debate about whether AI creates good jobs or harms workers.",
    evidenceFocus:
      "AI labor impact, job displacement, productivity claims, wages, deskilling, workplace surveillance, worker surveys, adoption data, layoffs, and employee experience",
    priorityDomains: [
      "bls.gov",
      "oecd.org",
      "ilo.org",
      "pewresearch.org",
      "mckinsey.com",
      "weforum.org",
      "brookings.edu",
      "nber.org",
    ],
  },
  "phones-school": {
    title: "Phones in School",
    job: "Argue the opposing side in a school phone policy debate. If the user supports bans, test safety, equity, enforcement, and accessibility. If the user opposes bans, test distraction, learning loss, bullying, and teacher experience.",
    evidenceFocus:
      "school phone bans, student attention, academic performance, mental health, cyberbullying, emergency contact, equity, accessibility, teacher surveys, policy results, and parent reactions",
    priorityDomains: [
      "unesco.org",
      "ed.gov",
      "gov.uk",
      "educationweek.org",
      "pewresearch.org",
      "apa.org",
      "jamanetwork.com",
    ],
  },
  "ai-investment": {
    title: "AI Worth the Investment",
    job: "Argue the opposing side in a business AI spending debate using ROI, implementation cost, reliability, governance, adoption, productivity measurement, and failed rollouts.",
    evidenceFocus:
      "enterprise AI ROI, AI budgets, implementation costs, productivity impact, governance risk, adoption blockers, reliability, hallucinations, automation outcomes, and executive surveys",
    priorityDomains: [
      "mckinsey.com",
      "bain.com",
      "bcg.com",
      "gartner.com",
      "deloitte.com",
      "mit.edu",
      "hbr.org",
      "ibm.com",
    ],
  },
};

const LOW_VALUE_DOMAINS = [
  "medium.com",
  "substack.com",
  "quora.com",
  "pinterest.com",
  "facebook.com",
  "forbes.com",
  "linkedin.com",
];
const DEBATE_SEARCH_DEPTH: Depth = "standard";
const DEBATE_MAX_RESULTS = 10;
const MIN_HIGH_QUALITY_EVIDENCE = 2;
const MAX_SOURCE_BUDGET = 5;
const DEFAULT_SOURCE_BUDGET = 3;
const STALE_MODEL_REFERENCE_PATTERN =
  /\b(ChatGPT[-\s]?3(?:\.5)?|GPT[-\s]?3(?:\.5)?|GPT[-\s]?4|Claude\s*[123]|Opus\s*[123]|o3(?:[-\s]?pro)?|o4[-\s]?mini|deprecated|legacy architecture|legacy model)\b/i;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = DebateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "A debate claim is required." },
      { status: 400 }
    );
  }

  const { arenaId, claim } = parsed.data;
  const messages = parsed.data.messages ?? [];
  const arena = ARENAS[arenaId] ?? ARENAS["chatgpt-claude"];

  try {
    const plan = await planDebate({
      arena,
      arenaId,
      claim,
      messages,
    });
    const retrievalQuery = buildRetrievalQuery(arena, claim, plan);
    const displaySearchQuery = buildDisplaySearchQuery(arena, claim);
    const shouldSearch = plan.searchMode === "search" && plan.sourceBudget > 0;

    if (!shouldSearch) {
      return NextResponse.json({
        reply: buildNoSearchReply(claim, plan),
        stance: plan.stance,
        searchQuery: displaySearchQuery,
        evidence: [],
      });
    }

    const { answer, evidence } = shouldSearch
      ? await fetchHighQualityEvidence({
          arena,
          arenaId,
          retrievalQuery,
          plan,
        })
      : { answer: { answer: "", sources: [] }, evidence: [] };

    const prompt = buildGeminiPrompt({
      arena,
      claim,
      messages,
      searchQuery: retrievalQuery,
      answer: evidence.length
        ? stripCitationMarkers(shapeText(answer.answer, 900))
        : "No high-confidence source summary is available because the retrieved sources did not pass the quality filter.",
      evidence,
      plan,
    });

    try {
      const raw = await generateGeminiText({
        system: DEBATE_SYSTEM,
        prompt,
        json: true,
        temperature: 0.76,
        maxOutputTokens: maxOutputTokensForPlan(plan),
      });

      const debate = GeminiDebateSchema.parse(parseJsonObject<unknown>(raw));
      const normalizedReply = normalizeDebateReply(debate.reply, evidence);
      const finalReply = findUnsupportedModelReference(normalizedReply, evidence)
        ? buildFallbackDebate({ arena, claim, evidence, plan }).reply
        : normalizedReply;

      return NextResponse.json({
        reply: finalReply,
        stance: debate.stance,
        searchQuery: displaySearchQuery,
        evidence,
      });
    } catch (err) {
      if (isGeminiFormatError(err)) {
        const fallback = buildFallbackDebate({
          arena,
          claim,
          evidence,
          plan,
        });

        return NextResponse.json({
          reply: fallback.reply,
          stance: fallback.stance,
          searchQuery: displaySearchQuery,
          evidence,
        });
      }

      throw err;
    }
  } catch (err) {
    const message = friendlyErrorMessage(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const DEBATE_SYSTEM = [
  "You are CrimsonSeek, an evidence-backed debate opponent.",
  "You are sharp, fair, adversarial, and natural-sounding. Write like a thoughtful human who has actually read the evidence.",
  "Default to clear, 10th-grade-readable language: plain words, natural rhythm, and no academic fog. Do not sound childish or condescending.",
  "Adapt to the user's tone and sophistication as the conversation develops. If they are casual, be casual. If they are technical, meet the technical level. If they are terse, stay tight.",
  "The user has taken a position. Your job is to argue the strongest opposing position.",
  "Your job is not to summarize search results. Your job is to stress-test the user's claim and make the countercase feel hard to ignore.",
  "Use only the provided high-confidence evidence. Gemini must choose and write the inline citations itself by weaving short source material directly into the sentence with this exact internal markup: {{specific source material}}(1) or {{specific source material}}(2).",
  "The words inside {{ }} must be a sentence-native citation anchor: usually 3-14 words, under 90 characters, and a concise fact, quote fragment, metric, policy detail, benchmark result, or source-backed detail from the provided source material.",
  "The highlighted source material must read as part of your sentence. Do not paste a whole source sentence, title-like phrase, or detached snippet just because it came from the source.",
  "Never write bare citation markers like [1], [2], or a dangling (1). Never use a citation unless the cited source directly supports that exact sentence.",
  "Never put ellipses in cited source material. If a source snippet contains ellipses or an incomplete fragment, rewrite the usable fact cleanly in your own words before citing it.",
  "Do not use page titles, URLs, domains, publication names, or source labels as cited material. Cite the claim the source supports.",
  "Prefer sources labeled primary, official, editorial, benchmark, academic, research, or institutional evidence.",
  "Do not cite low-quality, affiliate, generic blog, caution, or unverified sources.",
  "If the user's point is partly right, concede the strong part quickly, then attack the weak assumption.",
  "Prefer concrete tradeoffs, numbers, documented failures, user complaints, institutional findings, or expert evidence over generic debate phrasing.",
  "Never cite a source for a claim unless the source title, snippet, or sourced answer directly supports that claim.",
  "If the retrieved evidence mostly supports the user, concede that clearly and attack only the unresolved assumptions.",
  "For current product, model, policy, market, or school debates, prefer recent evidence. Do not lean on GPT-4, Claude 3, Opus 3, o3, or o4-mini-era references for current model superiority unless you explicitly frame them as historical context.",
  "Do not invent model names, version numbers, release names, product features, dates, prices, or benchmark scores. If you name a specific model or version, that exact name must appear in the provided evidence list.",
  "Do not invent sources, studies, numbers, or links.",
  "Do not use em dashes.",
].join(" ");

async function planDebate({
  arena,
  arenaId,
  claim,
  messages,
}: {
  arena: ArenaBrief;
  arenaId: string;
  claim: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const fallback = fallbackDebatePlan(arena, arenaId, claim);

  try {
    const raw = await generateGeminiText({
      system: [
        "You are CrimsonSeek's debate architect.",
        "Before any web search happens, decide whether the latest user message deserves live evidence, how many sources are actually needed, how recent the evidence must be, and how long the counter should be.",
        "Do not argue the case yet. Return only the planning JSON.",
        "If the user message is junk, too vague, a greeting, meta-instruction, or not a debatable claim, set searchMode to skip, use sourceBudget 0, and write a concise noSearchReply in CrimsonSeek's voice.",
        "Match the user's length. A short claim should get a short answer. A long, developed claim can get a longer answer.",
        "Plan for a clear human tone first, roughly readable by a smart 10th grader, then adapt to the user's tone and vocabulary.",
        "For current product, AI model, policy, market, or technology claims, prefer strict recent evidence first.",
        "For ChatGPT vs Claude, avoid unavailable, deprecated, API-only, o3/o4-mini-era, or stale model references as consumer-facing proof.",
      ].join(" "),
      prompt: buildPlanPrompt({ arena, arenaId, claim, messages }),
      json: true,
      temperature: 0.28,
      maxOutputTokens: 760,
    });

    return normalizeDebatePlan(
      GeminiPlanSchema.parse(parseJsonObject<unknown>(raw)),
      arenaId,
      claim
    );
  } catch {
    return fallback;
  }
}

function buildPlanPrompt({
  arena,
  arenaId,
  claim,
  messages,
}: {
  arena: ArenaBrief;
  arenaId: string;
  claim: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const context = messages
    .slice(-6)
    .map((message) => `${message.role.toUpperCase()}: ${shapeText(message.content, 600)}`)
    .join("\n");
  const today = currentDateIso();

  return [
    `Current date: ${today}`,
    `Arena: ${arena.title}`,
    `Arena id: ${arenaId}`,
    `Arena job: ${arena.job}`,
    `Evidence focus: ${arena.evidenceFocus}`,
    `Latest user claim: ${claim}`,
    "",
    "Recent context:",
    context || "No prior context.",
    "",
    "Planning rules:",
    "- sourceBudget 0 means do not call Linkup. Use it for junk, greetings, meta messages, or claims too vague to search.",
    "- Use sourceBudget 2 for short claims that need evidence, 3 for normal claims, 4 or 5 only when the user makes a detailed or high-stakes argument.",
    "- targetWords should roughly match the user's effort: 45-80 for short one-line claims, 90-145 for normal claims, 180-300 for long developed claims.",
    "- strict_recent means search recent news/current pages first, then broaden only if needed. Use it for model/product/tool/policy/current-market claims.",
    "- recent_first means prefer the last year or two but allow older strong sources if the topic is not purely current.",
    "- evergreen means older canonical sources are fine.",
    "- searchBrief should be written for Linkup. It must say what evidence would weaken the user's claim and any stale references to avoid.",
    "- noSearchReply should be a natural CrimsonSeek reply only when searchMode is skip. It must not mention sources or citations.",
    "",
    "Return strict JSON:",
    `{"searchMode":"search|skip","stance":"short counterposition label","searchBrief":"Linkup retrieval brief or null","noSearchReason":"none|greeting|junk|too_vague|pure_preference|timeless_reasoning|meta_instruction","noSearchReply":"short reply or null","sourceBudget":2,"maxResults":7,"recency":"strict_recent|recent_first|evergreen","replyTarget":"short|medium|long","targetWords":90,"targetParagraphs":1,"reason":"why this plan fits"}`,
  ].join("\n");
}

function fallbackDebatePlan(arena: ArenaBrief, arenaId: string, claim: string) {
  const words = wordCount(claim);
  const junk = isNonDebatableClaim(claim);
  const current = isCurrentSensitiveArena(arenaId);
  const sourceBudget = junk ? 0 : words < 18 ? 2 : words < 65 ? DEFAULT_SOURCE_BUDGET : 4;
  const replyTarget = words < 18 ? "short" : words < 65 ? "medium" : "long";

  return normalizeDebatePlan(
    {
      searchMode: junk ? "skip" : "search",
      stance: "Evidence-first countercase",
      searchBrief: `${arena.title}: find current, high-quality evidence that pressure-tests this claim: ${claim}`,
      noSearchReason: junk ? "too_vague" : "none",
      noSearchReply: junk ? buildNoSearchReply(claim) : null,
      sourceBudget,
      maxResults: Math.min(12, sourceBudget + 5),
      recency: current ? "strict_recent" : "recent_first",
      replyTarget,
      targetWords: targetWordsForClaim(claim),
      targetParagraphs: targetParagraphsForWords(targetWordsForClaim(claim)),
      reason: junk
        ? "The latest user message is not specific enough for live evidence."
        : "Heuristic fallback plan based on claim length and arena.",
    },
    arenaId,
    claim
  );
}

function normalizeDebatePlan(
  plan: z.infer<typeof GeminiPlanSchema>,
  arenaId: string,
  claim: string
) {
  const replyTarget = plan.replyTarget || (wordCount(claim) < 18 ? "short" : wordCount(claim) < 65 ? "medium" : "long");
  const targetWords = clampTargetWordsForReplyTarget(
    replyTarget,
    plan.targetWords || targetWordsForClaim(claim)
  );
  const searchMode = isNonDebatableClaim(claim) ? "skip" as const : plan.searchMode;
  const sourceBudget =
    searchMode === "skip"
      ? 0
      : clamp(plan.sourceBudget || DEFAULT_SOURCE_BUDGET, MIN_HIGH_QUALITY_EVIDENCE, MAX_SOURCE_BUDGET);

  return {
    ...plan,
    searchMode,
    searchBrief:
      shapeText(plan.searchBrief || `${ARENAS[arenaId]?.title ?? "Open debate"}: find current, high-quality evidence that pressure-tests this claim: ${claim}`, 1400),
    noSearchReason: plan.noSearchReason || (searchMode === "skip" ? "too_vague" : "none"),
    noSearchReply: plan.noSearchReply ? stripCitationMarkers(shapeText(plan.noSearchReply, 500)) : null,
    sourceBudget,
    maxResults: sourceBudget ? clamp(plan.maxResults || sourceBudget + 5, sourceBudget, 12) : 0,
    recency: isCurrentSensitiveArena(arenaId) ? "strict_recent" as const : plan.recency,
    replyTarget,
    targetWords,
    targetParagraphs: clamp(
      plan.targetParagraphs || targetParagraphsForWords(targetWords),
      1,
      5
    ),
  };
}

function buildRetrievalQuery(
  arena: ArenaBrief,
  claim: string,
  plan: z.infer<typeof GeminiPlanSchema>
) {
  const windows = recencyWindows(plan);

  return [
    "CrimsonSeek retrieval brief.",
    `Current date: ${currentDateIso()}. Start with ${windows[0]?.label ?? "the best available"} evidence. Broaden only if the recent set is weak.`,
    `User claim to challenge: ${claim}`,
    `Debate lane: ${arena.title}. ${arena.job}`,
    `Evidence focus: ${arena.evidenceFocus}.`,
    `Planner brief: ${plan.searchBrief}`,
    `Source budget: ${plan.sourceBudget}. Return only the strongest citation-ready sources needed for a ${plan.replyTarget} answer.`,
    "Find sources that can make the strongest fair countercase against the claim.",
    "Prefer primary sources, reputable reporting, expert analysis, benchmark data, regulatory or institutional reports, and sources with concrete examples.",
    "For AI model/tool comparisons, prioritize current model families, current benchmark pages, recent product announcements, current pricing, and current user or enterprise evidence. Avoid GPT-3, GPT-3.5, GPT-4, Claude 1/2/3, Opus 1/2/3, o3, o4-mini, o3-pro, unavailable, deprecated, legacy, or API-only references unless the user is making a historical or developer-API claim.",
    arena.priorityDomains.length
      ? `When relevant, prioritize these domains: ${arena.priorityDomains.join(", ")}.`
      : "",
    "Include disagreements and tradeoffs. Look for evidence that would surprise someone who only saw the polished first page of search results.",
    "Avoid SEO listicles, affiliate rankings, shallow comparison pages, recycled summaries, sponsored pages, forum threads, Medium-style opinion posts, and vague blogs unless they contain original reporting, real user evidence, or data.",
    "Return complete, citation-ready material that is useful for a debate opponent: source-backed claims, counterexamples, constraints, numbers, and concrete tradeoffs. Avoid snippets that are mostly ellipses or broken sentence fragments.",
  ].join("\n");
}

function buildDisplaySearchQuery(arena: ArenaBrief, claim: string) {
  return shapeText(`${arena.title}: counter-evidence for "${claim}"`, 140);
}

function buildGeminiPrompt({
  arena,
  claim,
  messages,
  searchQuery,
  answer,
  evidence,
  plan,
}: {
  arena: ArenaBrief;
  claim: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  searchQuery: string;
  answer: string;
  evidence: DebateEvidence[];
  plan: z.infer<typeof GeminiPlanSchema>;
}) {
  const windows = recencyWindows(plan);
  const history = messages
    .slice(-8)
    .map((message) => `${message.role.toUpperCase()}: ${shapeText(message.content, 700)}`)
    .join("\n");
  const sources = evidence
    .map(
      (item) =>
        `[${item.id}] ${item.title} (${item.domain})\nQuality: ${item.sourceQuality}\nSource material to weave: ${item.snippet}`
    )
    .join("\n\n");

  return [
    `Arena: ${arena.title}`,
    `Arena job: ${arena.job}`,
    `Current date: ${currentDateIso()}`,
    `Planner stance: ${plan.stance}`,
    `Planner reason: ${plan.reason}`,
    `Answer length target: ${plan.replyTarget}, about ${plan.targetWords} words across ${plan.targetParagraphs} paragraph${plan.targetParagraphs === 1 ? "" : "s"}. Match the user's effort instead of defaulting long.`,
    `Hard length band: keep the reply between ${Math.floor(plan.targetWords * 0.75)} and ${Math.ceil(plan.targetWords * 1.25)} words unless the user explicitly asks for more.`,
    "Tone target: start with clear, natural, 10th-grade-readable language. Then adapt to the user's tone, vocabulary, and seriousness without becoming stiff.",
    `Citation budget: use ${citationBudgetForPlan(plan)} citation${citationBudgetForPlan(plan) === 1 ? "" : "s"} if evidence exists.`,
    `Recency preference: start with ${windows[0]?.label ?? "the strongest available evidence"}; older sources are allowed only when the recent set is weak, canonical, primary, or clearly historical.`,
    `Latest user claim: ${claim}`,
    "",
    "Conversation context:",
    history || "No prior context.",
    "",
    "Evidence search query:",
    searchQuery,
    "",
    "Sourced answer:",
    answer,
    "",
    "High-confidence evidence list:",
    sources || "No high-confidence source list available. If you cannot cite high-confidence evidence, say that clearly and make a cautious counterargument without invented citations.",
    "",
    "Citation style:",
    "When you use a source, weave a short source-backed anchor into the body text as `{{specific source material}}(number)`. Good: `{{20 hours and 41 minutes in battery testing}}(1)` or `{{calls, texts, and notifications from Android or iPhone}}(2)`. Bad: `Gartner says this (2)` or a pasted full source sentence.",
    "The source material inside `{{ }}` should usually be 3-14 words and must stay under 90 characters. It should feel like a natural highlighted clause inside your sentence, not a citation dump.",
    "Every citation must be written by you from the evidence list. Do not write bare `[1]`, `[2]`, `(1)`, or bracket-only citations.",
    "If evidence is provided, cite only source-backed factual claims. If a sentence is analysis or rhetoric, leave it uncited. If the source does not directly support the sentence, rewrite the sentence or remove the citation.",
    "Do not put ellipses (`...` or `…`) inside the reply or the cited material. If the source material is choppy, paraphrase the complete supported fact cleanly.",
    "Do not cite page titles, source names, domains, or URLs. The material inside `{{ }}` must be the fact, metric, policy detail, benchmark result, or source-backed claim used by the argument.",
    "For AI-model debates, do not use GPT-3, GPT-3.5, GPT-4, Claude 1/2/3, Opus 1/2/3, o3, o4-mini, o3-pro, unavailable, deprecated, legacy, or API-only references as normal-user current proof unless the sentence explicitly says it is historical or developer/API-only.",
    "For AI-model debates, any specific model name, product version, release name, benchmark number, date, or price you mention must appear verbatim in the evidence list. If the evidence is vague, write more generally instead of filling in a model/version yourself.",
    "Sound coherent and human: make the argument flow, concede one fair point when useful, then press the stronger countercase. Do not sound like a source summary.",
    "Use simple connective tissue between facts so the reply reads like a person talking, not a report. Define or soften specialized terms unless the user already uses that level of language.",
    "If searchMode is skip or the source list is empty, do not cite. Briefly challenge the claim, ask for a sharper claim if needed, and do not pretend you searched.",
    "Do not add a separate bibliography.",
    "",
    "Return strict JSON with this shape:",
    `{"reply":"A ${plan.replyTarget}, coherent counterargument that matches the user's length and uses citations formatted like {{source material}}(1) only when evidence is provided.","stance":"short label for your counterposition"}`,
  ].join("\n");
}

async function fetchHighQualityEvidence({
  arena,
  arenaId,
  retrievalQuery,
  plan,
}: {
  arena: ArenaBrief;
  arenaId: string;
  retrievalQuery: string;
  plan: z.infer<typeof GeminiPlanSchema>;
}) {
  const targetEvidenceCount = clamp(
    plan.sourceBudget,
    MIN_HIGH_QUALITY_EVIDENCE,
    MAX_SOURCE_BUDGET
  );
  const windows = recencyWindows(plan);
  const attempts = windows.flatMap((dateWindow, index) => [
    {
      depth: debateDepth(arenaId, plan, index),
      maxResults: plan.maxResults || DEBATE_MAX_RESULTS,
      includeDomains: arena.priorityDomains.length ? arena.priorityDomains : undefined,
      priorityDomains: arena.priorityDomains,
      dateWindow,
    },
    {
      depth: debateDepth(arenaId, plan, index),
      maxResults: plan.maxResults || DEBATE_MAX_RESULTS,
      priorityDomains: arena.priorityDomains,
      dateWindow,
    },
    {
      depth: debateDepth(arenaId, plan, index),
      maxResults: plan.maxResults || DEBATE_MAX_RESULTS,
      priorityDomains: undefined,
      dateWindow,
    },
  ]);

  let bestAnswer: SourcedAnswer | null = null;
  let bestEvidence: DebateEvidence[] = [];

  for (const attempt of attempts) {
    const answer = await fetchSourcedAnswer({
      query: retrievalQuery,
      depth: attempt.depth,
      maxResults: attempt.maxResults,
      fromDate: attempt.dateWindow?.fromDate,
      toDate: attempt.dateWindow?.toDate,
      includeDomains: attempt.includeDomains,
      priorityDomains: attempt.priorityDomains,
      excludeDomains: LOW_VALUE_DOMAINS,
    });
    const evidence = buildEvidence(answer.sources, answer.answer, arenaId, targetEvidenceCount, plan);

    if (!bestAnswer || evidence.length > bestEvidence.length) {
      bestAnswer = answer;
      bestEvidence = evidence;
    }

    if (evidence.length >= targetEvidenceCount) break;
  }

  return {
    answer: bestAnswer ?? { answer: "", sources: [] },
    evidence: bestEvidence,
  };
}

function buildEvidence(
  sources: LinkupSource[],
  answer: string,
  arenaId: string,
  sourceBudget: number,
  plan: z.infer<typeof GeminiPlanSchema>
) {
  const seen = new Set<string>();
  const evidence: DebateEvidence[] = [];

  for (const source of sources) {
    const urlKey = source.url.trim().toLowerCase();
    if (!urlKey || seen.has(urlKey)) continue;
    seen.add(urlKey);

    const quality = assessSourceQuality(source);
    if (!isHighQualityEvidence(quality)) continue;
    const sourceMaterial = cleanSourceSnippet(source.snippet ?? "");
    if (!sourceMaterial) continue;
    if (shouldFilterStaleModelSource(arenaId, plan) && isStaleModelSource(source, sourceMaterial)) {
      continue;
    }
    if (!isTopicallyRelevantSource(arenaId, plan, source, sourceMaterial)) {
      continue;
    }

    evidence.push({
      id: evidence.length + 1,
      title: shapeText(cleanSourceText(source.name), 120),
      url: source.url,
      domain: hostnameOf(source.url),
      snippet: sourceMaterial,
      sourceQuality: sourceQualityLabel(quality),
    });

    if (evidence.length === sourceBudget) break;
  }

  return evidence;
}

function isStaleModelSource(source: LinkupSource, sourceMaterial: string) {
  return STALE_MODEL_REFERENCE_PATTERN.test(`${source.name} ${sourceMaterial}`);
}

function shouldFilterStaleModelSource(arenaId: string, plan: z.infer<typeof GeminiPlanSchema>) {
  return (
    arenaId === "chatgpt-claude" ||
    /\b(ChatGPT|Claude|Gemini|OpenAI|Anthropic|LLM|AI model|model comparison)\b/i.test(
      `${plan.stance} ${plan.searchBrief ?? ""} ${plan.reason}`
    )
  );
}

function isHighQualityEvidence(quality: SourceQuality) {
  return quality.tier === "strong";
}

function sourceQualityLabel(quality: SourceQuality) {
  if (quality.tier === "strong") return quality.role;
  if (quality.tier === "context") return quality.role;
  return quality.role;
}

function buildFallbackDebate({
  arena,
  claim,
  evidence,
  plan,
}: {
  arena: ArenaBrief;
  claim: string;
  evidence: DebateEvidence[];
  plan: z.infer<typeof GeminiPlanSchema>;
}) {
  const cited = evidence.slice(0, Math.max(1, citationBudgetForPlan(plan)));
  const sourceLine = cited.length
    ? `The strongest available source material points to these checks: ${sourceMaterialLine(cited)}`
    : "I could not find enough high-confidence sources to cite for this point, so the safest counter is cautious: your claim still needs evidence that survives primary, institutional, reputable editorial, benchmark, or firsthand-community scrutiny.";

  const short = plan.replyTarget === "short";
  return {
    reply: short
      ? [
          `Your claim, "${shapeText(claim, 180)}", still needs a counterweight: ${shapeText(sourceLine, 420)}`,
          `The weak spot is whether your argument survives the actual tradeoffs, not just the cleanest version of the point.`,
        ].join("\n\n")
      : [
          `Your claim, "${shapeText(claim, 220)}", still needs to survive the ${arena.title} test: ${arena.job.toLowerCase()}`,
          shapeText(sourceLine, 700),
          `The question is whether your claim explains the tradeoffs, counterexamples, and implementation limits in the sources, not just the most favorable version of the argument.`,
        ].join("\n\n"),
    stance: "Evidence-first skepticism",
  };
}

function buildNoSearchReply(
  claim: string,
  plan?: { noSearchReply?: string | null; reason?: string; noSearchReason?: string }
) {
  const planned = plan?.noSearchReply
    ? stripCitationMarkers(shapeText(plan.noSearchReply, 500))
    : "";
  if (planned && planned.length >= 18) return planned;

  const clean = shapeText(claim, 140);
  if (isNonDebatableClaim(clean)) {
    return `Give me a real claim to pressure-test. "${clean}" does not give CrimsonSeek enough to argue against or search responsibly.`;
  }

  return `That is not specific enough for a source-backed counter yet. Make it a clear claim, and CrimsonSeek will argue the strongest opposing side instead of pretending a vague prompt deserves citations.`;
}

function normalizeDebateReply(reply: string, evidence: DebateEvidence[]) {
  const withSourceMaterial = decodeHtmlEntities(reply).replace(
    /\{\{([^}]{1,640})\}\}\((\d{1,2})\)/g,
    (match, markedMaterial, markedNumber) => {
      const sourceIndex = Number(markedNumber) - 1;
      const item = evidence[sourceIndex];
      const material = cleanCitationMaterial(markedMaterial);

      if (!item || !material) return stripCitationMarkers(match);
      if (!citationMaterialLooksClean(material)) return material;
      if (!citationLooksRelevant(material, item)) return material;

      return `{{${material}}}(${sourceIndex + 1})`;
    }
  );
  const polished = polishCitationSpacing(stripLooseCitationMarkers(withSourceMaterial));

  if (!evidence.length) {
    return stripCitationMarkers(polished);
  }

  if (hasValidCitation(polished, evidence)) {
    return polished;
  }

  return stripCitationMarkers(polished);
}

function hasValidCitation(content: string, evidence: DebateEvidence[]) {
  for (const match of content.matchAll(/\{\{[^}]{1,640}\}\}\((\d+)\)/g)) {
    const sourceIndex = Number(match[1]) - 1;
    if (sourceIndex >= 0 && sourceIndex < evidence.length) return true;
  }
  return false;
}

function findUnsupportedModelReference(reply: string, evidence: DebateEvidence[]) {
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

function sourceMaterialLine(evidence: DebateEvidence[]) {
  return evidence
    .map((item) => `{{${sourceMaterialExcerpt(item.snippet)}}}(${item.id})`)
    .join(" ");
}

function sourceMaterialExcerpt(value: string) {
  return compactCitationAnchor(firstUsefulSentence(cleanCitationMaterial(value)));
}

function debateDepth(
  arenaId: string,
  plan: z.infer<typeof GeminiPlanSchema>,
  windowIndex: number
): Depth {
  void arenaId;
  if (plan.replyTarget === "long" && windowIndex > 0) return "deep";
  return DEBATE_SEARCH_DEPTH;
}

function isGeminiFormatError(err: unknown) {
  return err instanceof GeminiJsonParseError || err instanceof z.ZodError;
}

function shapeText(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;

  const sliced = compact.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const clean = lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced;
  return clean;
}

function cleanSourceText(value: string) {
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
}

function cleanSourceSnippet(value: string) {
  return cleanSourceText(value)
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

function cleanCitationMaterial(value: string) {
  return cleanSourceSnippet(value)
    .replace(/\s*\[(?:source\s*)?\d+\]/gi, "")
    .replace(/^[\s"'([{]+|[\s"')\]}.,;:]+$/g, "")
    .trim();
}

function polishCitationSpacing(value: string) {
  return value
    .replace(/\{\{\s+/g, "{{")
    .replace(/\s+\}\}/g, "}}")
    .replace(/([A-Za-z0-9.,;:!?])\s*(\{\{)/g, "$1 $2")
    .replace(/\}\}\((\d+)\)\s*(?=\{\{)/g, "}}($1) ")
    .replace(/\}\}\((\d+)\)(?=[A-Za-z0-9])/g, "}}($1) ");
}

function stripLooseCitationMarkers(value: string) {
  return value
    .replace(/\(([^()\n]{8,260})\)\s*\[\d+(?:\s*,\s*\d+)*\]/g, "$1")
    .replace(/\[\d+(?:\s*,\s*\d+)*\]/g, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function citationLooksRelevant(material: string, item: DebateEvidence) {
  const sourceText = `${item.title} ${item.snippet}`.toLowerCase();
  const materialText = material.toLowerCase();
  const numbers = materialText.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [];

  if (numbers.length) {
    return numbers.every((number) => sourceText.includes(number));
  }

  const tokens = keyTokens(materialText);
  if (!tokens.length) return false;

  const overlap = tokens.filter((token) => sourceText.includes(token)).length;
  return overlap >= Math.min(2, tokens.length);
}

const ARENA_REQUIRED_TOPIC_PATTERNS: Record<string, RegExp[]> = {
  "chatgpt-claude": [
    /\b(chatgpt|openai|claude|anthropic|llm|model|coding|code|benchmark|context|connector|workspace|slack|github)\b/i,
  ],
  "mac-windows": [
    /\b(mac|macos|apple silicon|windows|pc|laptop|surface|thinkpad|xps|battery|gaming|steam|phone link|passkey|driver|repair)\b/i,
  ],
  "iphone-android": [
    /\b(iphone|ios|android|pixel|galaxy|samsung|phone|smartphone|app store|play protect|camera|repair|update|security|privacy)\b/i,
  ],
  "ai-jobs": [
    /(?=.*\b(ai|artificial intelligence|generative ai|genai|automation)\b)(?=.*\b(jobs?|labor|employment|workers?|wages?|productivity|occupation|displacement|freelance)\b)/i,
  ],
  "phones-school": [
    /\b(phone|phones|cellphone|cell phone|smartphone|mobile device|device policy|school phone|school cellphone|bell-to-bell|pouch|cyberbullying)\b/i,
  ],
  "ai-investment": [
    /(?=.*\b(ai|artificial intelligence|generative ai|genai)\b)(?=.*\b(roi|return|productivity|enterprise|implementation|infrastructure|governance|adoption|budget|spending|pilot|investment|value)\b)/i,
  ],
};

function isTopicallyRelevantSource(
  arenaId: string,
  plan: z.infer<typeof GeminiPlanSchema>,
  source: LinkupSource,
  sourceMaterial: string
) {
  const patterns = ARENA_REQUIRED_TOPIC_PATTERNS[arenaId];
  if (!patterns?.length) return true;

  void plan;
  const text = `${source.name} ${source.url} ${sourceMaterial}`;
  return patterns.some((pattern) => pattern.test(text));
}

function citationMaterialLooksClean(material: string) {
  if (material.length > 90) return false;
  const words = wordCount(material);
  if (words < 3 || words > 14) return false;
  if (/\u2026|\.{3,}/.test(material)) return false;
  if (/\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|org|edu|gov|gov\.uk|ai|io|net|co)\b)/i.test(material)) {
    return false;
  }
  if (/\b(source|article|report|page|blog post|website)\s+\d*$/i.test(material)) return false;
  return true;
}

function compactCitationAnchor(value: string) {
  const clean = cleanCitationMaterial(value)
    .replace(/^(according to|the report says|the source says|the article says)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);

  if (clean.length <= 90 && words.length <= 14) return clean;

  const clipped = words.slice(0, 14).join(" ");
  return clipped.length <= 90
    ? clipped.replace(/[,;:]$/, "")
    : clipped.slice(0, 90).replace(/\s+\S*$/, "").replace(/[,;:]$/, "");
}

function keyTokens(value: string) {
  return [...new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 4)
      .filter(
        (token) =>
          ![
            "about",
            "after",
            "again",
            "because",
            "before",
            "could",
            "their",
            "there",
            "these",
            "those",
            "which",
            "would",
          ].includes(token)
      )
  )];
}

function firstUsefulSentence(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const sentence = clean.match(/^.{40,260}?[.!?](?=\s|$)/)?.[0];
  return sentence ? sentence.trim() : clean;
}

function recencyWindows(plan: z.infer<typeof GeminiPlanSchema>) {
  const today = currentDateIso();
  const windows =
    plan.recency === "strict_recent"
      ? [
          dateWindowFromDays(30, "the last 30 days"),
          dateWindowFromDays(120, "the last 120 days"),
          dateWindowFromDays(365, "the last year"),
          dateWindowFromYears(2, "the last two years"),
          undefined,
        ]
      : plan.recency === "recent_first"
        ? [
            dateWindowFromDays(365, "the last year"),
            dateWindowFromYears(2, "the last two years"),
            undefined,
          ]
        : [
            dateWindowFromYears(2, "the last two years"),
            undefined,
          ];

  return windows.map((window) => window ?? { fromDate: undefined, toDate: today, label: "older canonical context if recent evidence is weak" });
}

function dateWindowFromDays(days: number, label: string) {
  const toDate = new Date(currentDateIso());
  const fromDate = new Date(toDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - days);

  return {
    fromDate: fromDate.toISOString().slice(0, 10),
    toDate: toDate.toISOString().slice(0, 10),
    label,
  };
}

function dateWindowFromYears(years: number, label: string) {
  const toDate = new Date(currentDateIso());
  const fromDate = new Date(toDate);
  fromDate.setUTCFullYear(fromDate.getUTCFullYear() - years);

  return {
    fromDate: fromDate.toISOString().slice(0, 10),
    toDate: toDate.toISOString().slice(0, 10),
    label,
  };
}

function currentDateIso() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function targetWordsForClaim(claim: string) {
  const words = wordCount(claim);
  if (words < 10) return 50;
  if (words < 25) return 75;
  if (words < 70) return 125;
  return 240;
}

function targetParagraphsForWords(words: number) {
  if (words <= 95) return 1;
  if (words <= 190) return 2;
  if (words <= 320) return 3;
  return 4;
}

function clampTargetWordsForReplyTarget(
  replyTarget: "short" | "medium" | "long",
  targetWords: number
) {
  if (replyTarget === "short") return clamp(targetWords, 45, 110);
  if (replyTarget === "medium") return clamp(targetWords, 95, 190);
  return clamp(targetWords, 180, 420);
}

function citationBudgetForPlan(plan: z.infer<typeof GeminiPlanSchema>) {
  if (plan.sourceBudget <= 0) return 0;
  if (plan.replyTarget === "short") return Math.min(2, plan.sourceBudget);
  if (plan.replyTarget === "medium") return Math.min(3, plan.sourceBudget);
  return Math.min(5, plan.sourceBudget);
}

function maxOutputTokensForPlan(plan: z.infer<typeof GeminiPlanSchema>) {
  return clamp(Math.ceil(plan.targetWords * 4.5), 500, 1800);
}

function isCurrentSensitiveArena(arenaId: string) {
  return [
    "chatgpt-claude",
    "mac-windows",
    "iphone-android",
    "ai-investment",
    "ai-jobs",
    "phones-school",
  ].includes(arenaId);
}

function isNonDebatableClaim(claim: string) {
  const clean = claim.trim();
  if (clean.length < 8) return true;
  if (wordCount(clean) < 3) return true;
  return /^(hi|hello|hey|test|ok|okay|thanks|thank you|lol|asdf|what|why)$/i.test(clean);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function decodeHtmlEntities(value: string) {
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

function stripCitationMarkers(value: string) {
  return decodeHtmlEntities(value)
    .replace(/\{\{([^}]{1,640})\}\}\(\d+\)/g, "$1")
    .replace(/\(([^()\n]{8,260})\)\s*\[\d+(?:\s*,\s*\d+)*\]/g, "$1")
    .replace(/\[\d+(?:\s*,\s*\d+)*\]/g, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function friendlyErrorMessage(err: unknown) {
  const raw = err instanceof Error ? err.message : "Unknown debate error";
  const redacted = redactSecrets(raw);

  if (/LINKUP_API_KEY/i.test(redacted)) {
    return "Debate search is not configured on the server.";
  }

  if (/GEMINI_API_KEY/i.test(redacted)) {
    return "Debate model is not configured on the server.";
  }

  if (/Linkup\s+\d+/i.test(redacted)) {
    return `Evidence search failed. ${redacted.replace(/Linkup\s+\d+:\s*/i, "")}`;
  }

  if (/Gemini/i.test(redacted)) {
    return `Debate model failed. ${redacted}`;
  }

  return `Debate request failed. ${redacted}`;
}

function redactSecrets(message: string) {
  const envSecrets = [process.env.GEMINI_API_KEY, process.env.LINKUP_API_KEY]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim());

  let redacted = message;
  for (const secret of envSecrets) {
    redacted = redacted.split(secret).join("[redacted]");
  }

  return redacted
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[redacted]")
    .replace(/key=([^&\s"]+)/gi, "key=[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]");
}
