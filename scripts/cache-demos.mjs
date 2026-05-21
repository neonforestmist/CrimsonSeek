import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LINKUP_URL = "https://api.linkup.so/v1/search";
const SEARCH_QUALITY_GUIDANCE =
  "Prioritize useful, source-rich information from reputable reviews, primary sources, forums, technical analysis, reporting, and firsthand discussion. Avoid SEO listicles, affiliate pages, shopping spam, thin summaries, duplicate rewrite pages, ranking pages, and generic keyword-first pages unless they contain original reporting, measurements, or clear firsthand evidence.";

const DEMO_RANGE = {
  fromDate: "2026-01-01",
  toDate: "2026-05-20",
  rangeLabel: "Jan 1 to May 20, 2026",
};

const SCENARIOS = [
  {
    slug: "iphone-17-pro",
    query: "iPhone 17 Pro reviews and reception",
    depth: "standard",
    maxResults: 12,
    ...DEMO_RANGE,
  },
  {
    slug: "gpt-5-launch",
    query: "GPT-5 launch reception, reviews, and reactions",
    depth: "deep",
    maxResults: 25,
    ...DEMO_RANGE,
  },
  {
    slug: "vision-pro-year-in",
    query: "Apple Vision Pro one year later, public reaction and adoption",
    depth: "deep",
    maxResults: 25,
    ...DEMO_RANGE,
  },
  {
    slug: "cybertruck-reactions",
    query: "Tesla Cybertruck owner reactions after delivery",
    depth: "standard",
    maxResults: 12,
    ...DEMO_RANGE,
  },
  {
    slug: "rust-vs-zig",
    query: "Rust vs Zig adoption and developer reactions in 2026",
    depth: "deep",
    maxResults: 25,
    ...DEMO_RANGE,
  },
];

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
};

await loadEnv(".env.local");
await loadEnv(".env");

const apiKey = process.env.LINKUP_API_KEY?.trim();
if (!apiKey) {
  throw new Error("LINKUP_API_KEY is not set in .env or .env.local");
}

const results = {};

for (const scenario of SCENARIOS) {
  console.log(`Generating ${scenario.slug}...`);
  results[scenario.slug] = await runFullSearch(scenario);
  const sourceCount = results[scenario.slug].answer.sources.length;
  const imageCount = results[scenario.slug].images?.length ?? 0;
  const hasPublicRead = Boolean(results[scenario.slug].sentiment);
  console.log(
    `  ok: ${sourceCount} sources, ${imageCount} images, public read ${hasPublicRead ? "yes" : "no"}`
  );
}

const cache = {
  generatedAt: new Date().toISOString(),
  rangeLabel: DEMO_RANGE.rangeLabel,
  results,
};

const outputPath = join(ROOT, "lib", "demo-cache.json");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);

async function runFullSearch(scenario) {
  const [answer, sentimentResult, imageResult] = await Promise.allSettled([
    fetchSourcedAnswer(scenario),
    fetchPublicRead(scenario),
    fetchImages(scenario),
  ]);

  if (answer.status === "rejected") {
    throw answer.reason;
  }

  return {
    query: scenario.query,
    depth: scenario.depth,
    fromDate: scenario.fromDate,
    toDate: scenario.toDate,
    answer: answer.value,
    sentiment: sentimentResult.status === "fulfilled" ? sentimentResult.value : null,
    sentimentError:
      sentimentResult.status === "rejected"
        ? formatError(sentimentResult.reason)
        : undefined,
    images: imageResult.status === "fulfilled" ? imageResult.value : [],
    imagesError:
      imageResult.status === "rejected" ? formatError(imageResult.reason) : undefined,
  };
}

async function fetchSourcedAnswer(scenario) {
  return callLinkup({
    q: withSearchGuidance(scenario.query),
    depth: scenario.depth,
    outputType: "sourcedAnswer",
    maxResults: scenario.maxResults,
    fromDate: scenario.fromDate,
    toDate: scenario.toDate,
    includeInlineCitations: true,
  });
}

async function fetchPublicRead(scenario) {
  const prompt = `Analyze what the internet really thinks about: "${scenario.query}". Survey reviews, news, social discussion, forums, analyst commentary, and firsthand reactions. Return a structured breakdown of the public read: overall tone, percentage splits, top themes with share-of-voice, notable quotes, energy, and controversy. Focus on useful evidence and actual reactions. Exclude SEO listicles, affiliate pages, duplicate summaries, shopping spam, and keyword-first pages unless they contain original reporting or clear firsthand evidence.`;

  const result = await callLinkup({
    q: withSearchGuidance(prompt),
    depth: scenario.depth,
    outputType: "structured",
    maxResults: scenario.maxResults,
    fromDate: scenario.fromDate,
    toDate: scenario.toDate,
    structuredOutputSchema: JSON.stringify(SENTIMENT_JSON_SCHEMA),
  });
  return normalizePublicRead(result);
}

async function fetchImages(scenario) {
  const attempts = [
    {
      q: withSearchGuidance(scenario.query),
      fromDate: scenario.fromDate,
      toDate: scenario.toDate,
    },
    {
      q: withSearchGuidance(
        `${scenario.query} photos images screenshots charts visual evidence`
      ),
      fromDate: scenario.fromDate,
      toDate: scenario.toDate,
    },
    {
      q: withSearchGuidance(
        `${scenario.query} photos images screenshots charts visual evidence`
      ),
    },
    {
      q: `${scenario.query} photos images screenshots charts visual evidence`,
    },
  ];

  for (const attempt of attempts) {
    const response = await callLinkup({
      q: attempt.q,
      depth: scenario.depth,
      outputType: "searchResults",
      maxResults: Math.min(scenario.maxResults, 12),
      fromDate: attempt.fromDate,
      toDate: attempt.toDate,
      includeImages: true,
    });

    const images = mapImageResults(response.results ?? []);
    if (images.length) return images;
  }

  return [];
}

function mapImageResults(results) {
  return results
    .filter((result) => result.type === "image" || result.imageUrl || result.thumbnailUrl)
    .slice(0, 6)
    .map((result) => ({
      type: "image",
      name: result.name,
      url: result.imageUrl ?? result.thumbnailUrl ?? result.url,
      sourceName: result.sourceName ?? result.name,
      sourceUrl: result.sourceUrl ?? result.url,
      caption: result.content ?? undefined,
    }));
}

function withSearchGuidance(query) {
  return `${query}\n\n<guidance>${SEARCH_QUALITY_GUIDANCE}</guidance>`;
}

function normalizePublicRead(raw) {
  if (!raw || typeof raw !== "object") return raw;
  return {
    ...raw,
    themes: Array.isArray(raw.themes)
      ? raw.themes.map((theme) => normalizeReactionObject(theme))
      : raw.themes,
    notable_quotes: Array.isArray(raw.notable_quotes)
      ? raw.notable_quotes.map((quote) => normalizeReactionObject(quote))
      : raw.notable_quotes,
  };
}

function normalizeReactionObject(value) {
  if (!value || typeof value !== "object") return value;
  return {
    ...value,
    sentiment: normalizeReactionValue(value.sentiment),
  };
}

function normalizeReactionValue(value) {
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

async function callLinkup(input) {
  const response = await fetch(LINKUP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Linkup ${response.status}: ${text.slice(0, 500)}`);
  }

  return response.json();
}

async function loadEnv(file) {
  let content = "";
  try {
    content = await readFile(join(ROOT, file), "utf8");
  } catch {
    return;
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^["']|["']$/g, "").trim();
    if (value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
