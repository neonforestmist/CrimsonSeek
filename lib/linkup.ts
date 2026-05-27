import { z } from "zod";

export type Depth = "fast" | "standard" | "deep";

export interface DepthOption {
  depth: Depth;
  maxResults: number;
  label: string;
  tagline: string;
  description: string;
}

export const DEPTH_OPTIONS: Record<Depth, DepthOption> = {
  fast: {
    depth: "fast",
    maxResults: 5,
    label: "Fast",
    tagline: "Sub-second answer",
    description: "A handful of high-quality sources, returned almost instantly.",
  },
  standard: {
    depth: "standard",
    maxResults: 12,
    label: "Standard",
    tagline: "Balanced",
    description: "Broader coverage across the web with strong citations.",
  },
  deep: {
    depth: "deep",
    maxResults: 25,
    label: "Deep",
    tagline: "Multi-step research",
    description: "Agentic search across many sources for maximum depth.",
  },
};

export const DEPTH_ORDER: Depth[] = ["fast", "standard", "deep"];

const LINKUP_URL = "https://api.linkup.so/v1/search";

const SEARCH_QUALITY_GUIDANCE =
  "Prioritize useful, source-rich information from reputable reviews, primary sources, forums, technical analysis, reporting, and firsthand discussion. Prefer recent evidence for current products, policies, model comparisons, market claims, and public debates. Return source snippets that contain extractable source material: concrete facts, quote fragments, measurements, policy language, benchmark details, or firsthand evidence that can be cited inline. Avoid snippets that are mostly ellipses, broken fragments, or generic page metadata. Avoid SEO listicles, affiliate pages, shopping spam, thin summaries, duplicate rewrite pages, ranking pages, and generic keyword-first pages unless they contain original reporting, measurements, or clear firsthand evidence.";

export interface LinkupSearchInput {
  q: string;
  depth: Depth;
  outputType: "sourcedAnswer" | "searchResults" | "structured";
  fromDate?: string;
  toDate?: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeImages?: boolean;
  maxResults?: number;
  structuredOutputSchema?: string;
  includeInlineCitations?: boolean;
  includeSources?: boolean;
}

export const SourceSchema = z.object({
  name: z.string(),
  url: z.string(),
  snippet: z.string().optional().nullable(),
  favicon: z.string().nullable().optional(),
});
export type LinkupSource = z.infer<typeof SourceSchema>;

export const SourcedAnswerSchema = z.object({
  answer: z.string(),
  sources: z.array(SourceSchema),
});
export type SourcedAnswer = z.infer<typeof SourcedAnswerSchema>;

export const LinkupImageResultSchema = z.object({
  type: z.literal("image"),
  name: z.string(),
  url: z.string(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  caption: z.string().optional(),
  palette: z.array(z.string()).optional(),
});
export type LinkupImageResult = z.infer<typeof LinkupImageResultSchema>;

const SearchResultSchema = z.object({
  type: z.string().optional(),
  name: z.string(),
  url: z.string(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  sourceName: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
});

const SearchResultsSchema = z.object({
  results: z.array(SearchResultSchema),
});

export const SentimentBreakdownSchema = z.object({
  overall_tone: z.enum(["very_positive", "positive", "mixed", "negative", "very_negative"]),
  positive_pct: z.number().min(0).max(100),
  neutral_pct: z.number().min(0).max(100),
  negative_pct: z.number().min(0).max(100),
  hype_score: z.number().min(0).max(100).describe("How much hype/buzz the topic has right now"),
  controversy_score: z.number().min(0).max(100).describe("How polarizing the topic is"),
  themes: z
    .array(
      z.object({
        title: z.string().describe("Short 2-5 word theme label"),
        sentiment: z.enum(["positive", "neutral", "negative"]),
        summary: z.string().describe("1-2 sentence summary of what people are saying"),
        share_of_voice: z.number().min(0).max(100).describe("Rough % of conversation this theme represents"),
      })
    )
    .min(3)
    .max(8),
  notable_quotes: z
    .array(
      z.object({
        quote: z.string(),
        sentiment: z.enum(["positive", "neutral", "negative"]),
        source: z.string().describe("Publication or community name"),
      })
    )
    .max(6),
  one_line_verdict: z.string().describe("Single sentence summary of the internet's vibe"),
});
export type SentimentBreakdown = z.infer<typeof SentimentBreakdownSchema>;

const SENTIMENT_JSON_SCHEMA = {
  type: "object",
  required: [
    "overall_tone",
    "positive_pct",
    "neutral_pct",
    "negative_pct",
    "hype_score",
    "controversy_score",
    "themes",
    "notable_quotes",
    "one_line_verdict",
  ],
  properties: {
    overall_tone: {
      type: "string",
      enum: ["very_positive", "positive", "mixed", "negative", "very_negative"],
    },
    positive_pct: { type: "number", minimum: 0, maximum: 100 },
    neutral_pct: { type: "number", minimum: 0, maximum: 100 },
    negative_pct: { type: "number", minimum: 0, maximum: 100 },
    hype_score: { type: "number", minimum: 0, maximum: 100 },
    controversy_score: { type: "number", minimum: 0, maximum: 100 },
    themes: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        required: ["title", "sentiment", "summary", "share_of_voice"],
        properties: {
          title: { type: "string" },
          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
          summary: { type: "string" },
          share_of_voice: { type: "number", minimum: 0, maximum: 100 },
        },
      },
    },
    notable_quotes: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        required: ["quote", "sentiment", "source"],
        properties: {
          quote: { type: "string" },
          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
          source: { type: "string" },
        },
      },
    },
    one_line_verdict: { type: "string" },
  },
} as const;

async function callLinkup<T>(input: LinkupSearchInput): Promise<T> {
  const apiKey = process.env.LINKUP_API_KEY;
  if (!apiKey) {
    throw new Error("LINKUP_API_KEY is not set. Add it to .env or .env.local");
  }

  const res = await fetch(LINKUP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Linkup ${res.status}: ${text.slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

export interface SearchParams {
  query: string;
  depth: Depth;
  maxResults: number;
  fromDate?: string;
  toDate?: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  priorityDomains?: string[];
}

function domainFilters(p: SearchParams) {
  if (p.includeDomains?.length) {
    return { includeDomains: p.includeDomains };
  }
  if (p.excludeDomains?.length) {
    return { excludeDomains: p.excludeDomains };
  }
  return {};
}

function withSearchGuidance(query: string, p: SearchParams) {
  const guidance = [SEARCH_QUALITY_GUIDANCE];
  if (p.fromDate || p.toDate) {
    guidance.push(
      `Recency preference: prioritize sources published or materially updated from ${p.fromDate ?? "recent years"} through ${p.toDate ?? "today"}. If an older source is still necessary, it should be primary, canonical, or explicitly historical context.`
    );
  }
  if (p.priorityDomains?.length) {
    const domains = p.priorityDomains.join(", ");
    guidance.push(`Prioritize sources from these domains when they are relevant: ${domains}.`);
  }
  return `${query}\n\n<guidance>${guidance.join(" ")}</guidance>`;
}

export async function fetchSourcedAnswer(p: SearchParams): Promise<SourcedAnswer> {
  const raw = await callLinkup<unknown>({
    q: withSearchGuidance(p.query, p),
    depth: p.depth,
    outputType: "sourcedAnswer",
    maxResults: p.maxResults,
    fromDate: p.fromDate,
    toDate: p.toDate,
    ...domainFilters(p),
    includeInlineCitations: false,
    includeSources: true,
  });
  return SourcedAnswerSchema.parse(raw);
}

export async function fetchSentiment(p: SearchParams): Promise<SentimentBreakdown> {
  const prompt = `Analyze what the internet really thinks about: "${p.query}". Survey reviews, news, social discussion, forums, analyst commentary, and firsthand reactions. Return a structured breakdown of the public read: overall tone, percentage splits, top themes with share-of-voice, notable quotes, energy, and controversy. Focus on useful evidence and actual reactions. Exclude SEO listicles, affiliate pages, duplicate summaries, shopping spam, and keyword-first pages unless they contain original reporting or clear firsthand evidence.`;

  const raw = await callLinkup<unknown>({
    q: withSearchGuidance(prompt, p),
    depth: p.depth,
    outputType: "structured",
    maxResults: p.maxResults,
    fromDate: p.fromDate,
    toDate: p.toDate,
    ...domainFilters(p),
    structuredOutputSchema: JSON.stringify(SENTIMENT_JSON_SCHEMA),
  });
  return SentimentBreakdownSchema.parse(normalizeSentimentPayload(raw));
}

function normalizeSentimentPayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const payload = raw as Record<string, unknown>;
  return {
    ...payload,
    themes: Array.isArray(payload.themes)
      ? payload.themes.map((theme) => normalizeReactionObject(theme))
      : payload.themes,
    notable_quotes: Array.isArray(payload.notable_quotes)
      ? payload.notable_quotes.map((quote) => normalizeReactionObject(quote))
      : payload.notable_quotes,
  };
}

function normalizeReactionObject(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  return {
    ...record,
    sentiment: normalizeReactionValue(record.sentiment),
  };
}

function normalizeReactionValue(value: unknown) {
  const normalized = String(value ?? "").toLowerCase().trim();
  if (
    normalized === "mixed" ||
    normalized === "balanced" ||
    normalized === "context" ||
    normalized === "contextual" ||
    normalized === "unclear"
  ) {
    return "neutral";
  }
  if (normalized === "supportive" || normalized === "favorable") return "positive";
  if (normalized === "critical" || normalized === "unfavorable") return "negative";
  return value;
}

export async function fetchImageResults(p: SearchParams): Promise<LinkupImageResult[]> {
  const attempts = [
    {
      q: withSearchGuidance(p.query, p),
      fromDate: p.fromDate,
      toDate: p.toDate,
    },
    {
      q: withSearchGuidance(
        `${p.query} photos images screenshots charts visual evidence`,
        p
      ),
      fromDate: p.fromDate,
      toDate: p.toDate,
    },
    {
      q: `${p.query} photos images screenshots charts visual evidence`,
    },
  ];

  for (const attempt of attempts) {
    const raw = await callLinkup<unknown>({
      q: attempt.q,
      depth: p.depth,
      outputType: "searchResults",
      maxResults: Math.min(p.maxResults, 12),
      fromDate: attempt.fromDate,
      toDate: attempt.toDate,
      ...domainFilters(p),
      includeImages: true,
    });

    const parsed = SearchResultsSchema.parse(raw);
    const images = parsed.results
      .filter(
        (result) =>
          result.type === "image" || Boolean(result.imageUrl ?? result.thumbnailUrl)
      )
      .slice(0, 6)
      .map((result) => ({
        type: "image" as const,
        name: result.name,
        url: result.imageUrl ?? result.thumbnailUrl ?? result.url,
        sourceName: result.sourceName ?? result.name,
        sourceUrl: result.sourceUrl ?? result.url,
        caption: result.content ?? undefined,
      }));

    if (images.length) return images;
  }

  return [];
}

export interface FullSearchResult {
  query: string;
  depth: Depth;
  fromDate?: string;
  toDate?: string;
  answer: SourcedAnswer;
  sentiment: SentimentBreakdown | null;
  sentimentError?: string;
  images?: LinkupImageResult[];
  imagesError?: string;
}

export async function runFullSearch(p: SearchParams): Promise<FullSearchResult> {
  const [answer, sentimentResult, imageResult] = await Promise.allSettled([
    fetchSourcedAnswer(p),
    fetchSentiment(p),
    fetchImageResults(p),
  ]);

  if (answer.status === "rejected") {
    throw answer.reason instanceof Error ? answer.reason : new Error(String(answer.reason));
  }

  return {
    query: p.query,
    depth: p.depth,
    fromDate: p.fromDate,
    toDate: p.toDate,
    answer: answer.value,
    sentiment: sentimentResult.status === "fulfilled" ? sentimentResult.value : null,
    sentimentError:
      sentimentResult.status === "rejected"
        ? sentimentResult.reason instanceof Error
          ? sentimentResult.reason.message
          : String(sentimentResult.reason)
        : undefined,
    images: imageResult.status === "fulfilled" ? imageResult.value : [],
    imagesError:
      imageResult.status === "rejected"
        ? imageResult.reason instanceof Error
          ? imageResult.reason.message
          : String(imageResult.reason)
        : undefined,
  };
}
