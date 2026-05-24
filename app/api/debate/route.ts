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
      "aider.chat",
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
const DEBATE_SEARCH_DEPTH: Depth = "fast";
const DEBATE_MAX_RESULTS = 8;
const MIN_HIGH_QUALITY_EVIDENCE = 3;

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
  const retrievalQuery = buildRetrievalQuery(arena, claim);
  const displaySearchQuery = buildDisplaySearchQuery(arena, claim);

  try {
    const { answer, evidence } = await fetchHighQualityEvidence({
      arena,
      arenaId,
      retrievalQuery,
    });

    const prompt = buildGeminiPrompt({
      arena,
      claim,
      messages,
      searchQuery: retrievalQuery,
      answer: evidence.length
        ? shapeText(answer.answer, 900)
        : "No high-confidence source summary is available because the retrieved sources did not pass the quality filter.",
      evidence,
    });

    try {
      const raw = await generateGeminiText({
        system: DEBATE_SYSTEM,
        prompt,
        json: true,
        temperature: 0.76,
        maxOutputTokens: 1200,
      });

      const debate = GeminiDebateSchema.parse(parseJsonObject<unknown>(raw));

      return NextResponse.json({
        reply: debate.reply,
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
  "You are sharp, fair, and adversarial, but never abusive.",
  "The user has taken a position. Your job is to argue the strongest opposing position.",
  "Your job is not to summarize search results. Your job is to stress-test the user's claim and make the countercase feel hard to ignore.",
  "Use only the provided high-confidence evidence. Cite sources inline with bracket numbers like [1] or [2].",
  "Prefer sources labeled primary, official, editorial, benchmark, academic, or firsthand community evidence.",
  "Do not cite low-quality, affiliate, generic blog, caution, or unverified sources.",
  "If the user's point is partly right, concede the strong part quickly, then attack the weak assumption.",
  "Prefer concrete tradeoffs, numbers, documented failures, user complaints, institutional findings, or expert evidence over generic debate phrasing.",
  "Never cite a source for a claim unless the source title, snippet, or sourced answer directly supports that claim.",
  "If the retrieved evidence mostly supports the user, concede that clearly and attack only the unresolved assumptions.",
  "Do not invent sources, studies, numbers, or links.",
  "Do not use em dashes.",
].join(" ");

function buildRetrievalQuery(arena: ArenaBrief, claim: string) {
  return [
    "CrimsonSeek retrieval brief.",
    `User claim to challenge: ${claim}`,
    `Debate lane: ${arena.title}. ${arena.job}`,
    `Evidence focus: ${arena.evidenceFocus}.`,
    "Find sources that can make the strongest fair countercase against the claim.",
    "Prefer primary sources, reputable reporting, expert analysis, benchmark data, firsthand user communities, regulatory or institutional reports, and sources with concrete examples.",
    arena.priorityDomains.length
      ? `When relevant, prioritize these domains: ${arena.priorityDomains.join(", ")}.`
      : "",
    "Include disagreements and tradeoffs. Look for evidence that would surprise someone who only saw the polished first page of search results.",
    "Avoid SEO listicles, affiliate rankings, shallow comparison pages, recycled summaries, sponsored pages, Medium-style opinion posts, and vague blogs unless they contain original reporting, real user evidence, or data.",
    "Return material that is useful for a debate opponent: source-backed claims, counterexamples, constraints, numbers, and concrete tradeoffs.",
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
}: {
  arena: ArenaBrief;
  claim: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  searchQuery: string;
  answer: string;
  evidence: DebateEvidence[];
}) {
  const history = messages
    .slice(-8)
    .map((message) => `${message.role.toUpperCase()}: ${shapeText(message.content, 700)}`)
    .join("\n");
  const sources = evidence
    .map(
      (item) =>
        `[${item.id}] ${item.title} (${item.domain})\nQuality: ${item.sourceQuality}\nSnippet: ${item.snippet}`
    )
    .join("\n\n");

  return [
    `Arena: ${arena.title}`,
    `Arena job: ${arena.job}`,
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
    "Return strict JSON with this shape:",
    `{"reply":"3 to 6 concise paragraphs that directly attack or pressure-test the claim with citations like [1].","stance":"short label for your counterposition"}`,
  ].join("\n");
}

async function fetchHighQualityEvidence({
  arena,
  arenaId,
  retrievalQuery,
}: {
  arena: ArenaBrief;
  arenaId: string;
  retrievalQuery: string;
}) {
  const attempts = [
    {
      depth: debateDepth(arenaId),
      maxResults: DEBATE_MAX_RESULTS,
      priorityDomains: arena.priorityDomains,
    },
    {
      depth: debateDepth(arenaId),
      maxResults: DEBATE_MAX_RESULTS,
      priorityDomains: undefined,
    },
    {
      depth: "standard" as Depth,
      maxResults: 10,
      priorityDomains: undefined,
    },
  ];

  let bestAnswer: SourcedAnswer | null = null;
  let bestEvidence: DebateEvidence[] = [];

  for (const attempt of attempts) {
    const answer = await fetchSourcedAnswer({
      query: retrievalQuery,
      depth: attempt.depth,
      maxResults: attempt.maxResults,
      priorityDomains: attempt.priorityDomains,
      excludeDomains: LOW_VALUE_DOMAINS,
    });
    const evidence = buildEvidence(answer.sources, answer.answer);

    if (!bestAnswer || evidence.length > bestEvidence.length) {
      bestAnswer = answer;
      bestEvidence = evidence;
    }

    if (evidence.length >= MIN_HIGH_QUALITY_EVIDENCE) break;
  }

  return {
    answer: bestAnswer ?? { answer: "", sources: [] },
    evidence: bestEvidence,
  };
}

function buildEvidence(sources: LinkupSource[], answer: string) {
  const seen = new Set<string>();
  const evidence: DebateEvidence[] = [];

  for (const source of sources) {
    const urlKey = source.url.trim().toLowerCase();
    if (!urlKey || seen.has(urlKey)) continue;
    seen.add(urlKey);

    const quality = assessSourceQuality(source);
    if (!isHighQualityEvidence(quality)) continue;

    evidence.push({
      id: evidence.length + 1,
      title: shapeText(source.name, 120),
      url: source.url,
      domain: hostnameOf(source.url),
      snippet: shapeText(source.snippet ?? fallbackSnippet(answer), 260),
      sourceQuality: sourceQualityLabel(quality),
    });

    if (evidence.length === 6) break;
  }

  return evidence;
}

function isHighQualityEvidence(quality: SourceQuality) {
  if (quality.tier === "strong") return true;
  return quality.tier === "context" && quality.role === "Community or firsthand discussion";
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
}: {
  arena: ArenaBrief;
  claim: string;
  evidence: DebateEvidence[];
}) {
  const cited = evidence.slice(0, 3);
  const citations = cited.map((item) => `[${item.id}]`).join(" ");
  const sourceLine = cited.length
    ? `The strongest available sources point to these checks: ${cited
        .map((item) => `${item.domain} on ${item.snippet}`)
        .join(" ")}`
    : "I could not find enough high-confidence sources to cite for this point, so the safest counter is cautious: your claim still needs evidence that survives primary, institutional, reputable editorial, benchmark, or firsthand-community scrutiny.";

  return {
    reply: [
      `I could not get a clean structured response from the debate model, so here is the reliable version from the retrieved evidence.`,
      `Your claim, "${shapeText(claim, 220)}", still needs to survive the ${arena.title} test: ${arena.job.toLowerCase()}`,
      `${shapeText(sourceLine, 700)} ${citations}`.trim(),
      `The question is whether your claim explains the tradeoffs, counterexamples, and implementation limits in the sources, not just the most favorable version of the argument.`,
    ].join("\n\n"),
    stance: "Evidence-first skepticism",
  };
}

function fallbackSnippet(answer: string) {
  return shapeText(answer, 220);
}

function debateDepth(arenaId: string): Depth {
  void arenaId;
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
  return `${clean}...`;
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
