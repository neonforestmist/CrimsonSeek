import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import type {
  Depth,
  FullSearchResult,
  LinkupImageResult,
  LinkupSource,
  SentimentBreakdown,
} from "@/lib/linkup";
import { hostnameOf } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const execFileAsync = promisify(execFile);

type ReportPdfVariant = "full" | "appendix" | "citations";

interface ReportPdfInput {
  result: FullSearchResult;
  query: string;
  depth: Depth;
  rangeLabel: string;
  variant: ReportPdfVariant;
}

interface PdfImageAsset {
  image: LinkupImageResult;
  fileName?: string;
}

const DEPTH_LABEL: Record<Depth, string> = {
  fast: "Fast scan",
  standard: "Standard report",
  deep: "Deep report",
};

const PDF_TITLE: Record<ReportPdfVariant, string> = {
  full: "Full report",
  appendix: "Evidence appendix",
  citations: "Citation packet",
};

const TONE_LABEL: Record<NonNullable<FullSearchResult["sentiment"]>["overall_tone"], string> = {
  very_positive: "Strong support",
  positive: "Supportive",
  mixed: "Mixed",
  negative: "Critical",
  very_negative: "Strong pushback",
};

const REACTION_LABEL = {
  positive: "supportive",
  neutral: "neutral",
  negative: "critical",
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ReportPdfInput | null;

  if (!body?.result || !body.query || !body.variant) {
    return new NextResponse("Invalid PDF payload", { status: 400 });
  }

  const workdir = await mkdtemp(join(tmpdir(), "crimson-report-"));
  const inputPath = join(workdir, "report.typ");
  const outputPath = join(workdir, "report.pdf");

  try {
    const imageAssets = await preparePdfImages(body.result.images ?? [], workdir);
    await writeFile(inputPath, buildTypstDocument(body, imageAssets), "utf8");
    await execFileAsync(join(process.cwd(), "node_modules/.bin/typst"), [
      "compile",
      "--root",
      workdir,
      inputPath,
      outputPath,
    ]);
    const pdf = await readFile(outputPath);
    const fileName = `${slugify(body.query)}-${body.variant}.pdf`;

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF generation failed";
    return new NextResponse(message, { status: 500 });
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

async function preparePdfImages(
  images: LinkupImageResult[],
  workdir: string
): Promise<PdfImageAsset[]> {
  const limitedImages = images.slice(0, 6);
  return Promise.all(
    limitedImages.map(async (image, index) => {
      try {
        const response = await fetch(image.url, {
          headers: {
            Accept: "image/png,image/jpeg,image/gif,image/svg+xml,image/webp,*/*",
          },
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) return { image };

        const contentType = response.headers
          .get("content-type")
          ?.split(";")[0]
          .trim()
          .toLowerCase();
        const extension = imageExtension(contentType, image.url);
        if (!extension) return { image };

        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.length || bytes.byteLength > 8_000_000) return { image };

        const fileName = `image-${index}.${extension}`;
        await writeFile(join(workdir, fileName), bytes);
        return { image, fileName };
      } catch {
        return { image };
      }
    })
  );
}

function imageExtension(contentType: string | undefined, url: string) {
  if (contentType === "image/jpeg" || contentType === "image/jpg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/svg+xml") return "svg";

  const path = url.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "jpg";
  if (path.endsWith(".png")) return "png";
  if (path.endsWith(".gif")) return "gif";
  if (path.endsWith(".svg")) return "svg";
  return undefined;
}

function buildTypstDocument(input: ReportPdfInput, imageAssets: PdfImageAsset[]) {
  const { result, query, depth, rangeLabel, variant } = input;
  const sentiment = result.sentiment;
  const themes = sentiment?.themes ?? [];
  const sources = result.answer.sources;

  const sections = [
    cover({ query, depth, rangeLabel, variant, result }),
    variant === "full" ? executiveSummary(result.answer.answer) : "",
    variant === "full" && sentiment ? sentimentSnapshot(sentiment) : "",
    variant === "full" ? crimsonSearchPreview(query, sources) : "",
    variant !== "citations" ? imageEvidence(imageAssets) : "",
    variant !== "citations" ? themeMatrix(themes) : "",
    variant === "full" && sentiment ? notableQuotes(sentiment.notable_quotes) : "",
    sourcesSection(sources),
  ].filter(Boolean);

  return `${preamble()}\n${sections.join("\n\n")}`;
}

function preamble() {
  return `
#let crimson = rgb("#d94f30")
#let crimson-dark = rgb("#962f18")
#let ink = rgb("#15120e")
#let muted = rgb("#6f6a62")
#let faint = rgb("#a39d92")
#let divider = rgb("#ddd5c4")
#let canvas = rgb("#f5eee2")
#let wash = rgb("#fff8f5")
#let good = rgb("#188038")
#let warn = rgb("#f9ab00")
#let bad = rgb("#d93025")

#set page(paper: "us-letter", margin: (x: 0.64in, y: 0.62in), fill: white)
#set text(font: "Helvetica", size: 10pt, fill: ink)
#set par(justify: false, leading: 0.62em)
#show heading: it => {
  v(14pt)
  text(size: 17pt, weight: "bold", fill: ink, it.body)
  v(5pt)
  line(length: 100%, stroke: 0.7pt + divider)
  v(9pt)
}
#let small-label(body) = text(size: 7.5pt, weight: "bold", fill: muted, upper(body))
#let muted-text(body) = text(size: 9pt, fill: muted, body)
#let pill(body) = box(fill: wash, stroke: divider, inset: (x: 7pt, y: 4pt), radius: 4pt)[#text(size: 8.2pt, fill: muted, body)]
#let metric(label, value, detail, color) = block(width: 100%, fill: white, stroke: divider, inset: 10pt, radius: 5pt)[
  #small-label(label)
  #v(4pt)
  #text(size: 24pt, weight: "bold", fill: ink, value)
  #h(3pt)#text(size: 12pt, fill: color)[•]
  #v(4pt)
  #muted-text(detail)
]
#let result-item(site, title, snippet) = block(width: 100%, inset: (y: 5pt))[
  #text(size: 7.8pt, fill: muted, site)
  #linebreak()
  #text(size: 11pt, weight: "bold", fill: crimson-dark, title)
  #linebreak()
  #text(size: 9pt, fill: ink, snippet)
]
#let theme-row(title, sentiment, summary, share, color) = block(width: 100%, stroke: divider, inset: 9pt, radius: 4pt)[
  #grid(columns: (1.2fr, 4fr, 0.55fr), gutter: 12pt,
    [#text(weight: "bold", title)#linebreak()#text(size: 8pt, fill: color, sentiment)],
    [#text(size: 9pt, fill: muted, summary)],
    [#align(right)[#text(weight: "bold", fill: color, share)]],
  )
]
`;
}

function cover({
  query,
  depth,
  rangeLabel,
  variant,
  result,
}: {
  query: string;
  depth: Depth;
  rangeLabel: string;
  variant: ReportPdfVariant;
  result: FullSearchResult;
}) {
  const sentiment = result.sentiment;
  const images = result.images ?? [];
  const sources = result.answer.sources;
  return `
#block(width: 100%, fill: canvas, inset: 18pt, radius: 8pt)[
  #text(size: 9pt, weight: "bold", fill: crimson)[CRIMSONSEEK]
  #v(12pt)
  #text(size: 34pt, weight: "bold", fill: ink, ${typ(PDF_TITLE[variant])})
  #v(5pt)
  #text(size: 16pt, weight: "bold", fill: muted, ${typ(query)})
  #v(12pt)
  #pill(${typ(rangeLabel)}) #h(5pt) #pill(${typ(DEPTH_LABEL[depth])})
]

#v(12pt)
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 8pt,
  metric("Sources", ${typ(String(sources.length))}, "curated citations", crimson),
  metric("Images", ${typ(String(images.length))}, "visual evidence", good),
  metric("Energy", ${typ(sentiment ? String(Math.round(sentiment.hype_score)) : "n/a")}, "conversation energy", warn),
  metric("Friction", ${typ(sentiment ? String(Math.round(sentiment.controversy_score)) : "n/a")}, "pushback level", bad),
)
`;
}

function executiveSummary(answer: string) {
  return `
= Executive summary
#text(size: 10.3pt, ${typ(answer)})
`;
}

function sentimentSnapshot(sentiment: SentimentBreakdown) {
  return `
= Public read snapshot
#block(width: 100%, fill: wash, stroke: divider, inset: 12pt, radius: 6pt)[
  #grid(columns: (1.2fr, 0.8fr), gutter: 12pt,
    [
      #small-label("Overall read")
      #linebreak()
      #text(size: 22pt, weight: "bold", fill: ink, ${typ(TONE_LABEL[sentiment.overall_tone])})
      #v(5pt)
      #text(size: 9.2pt, fill: muted, ${typ(sentiment.one_line_verdict)})
    ],
    [
      #align(right)[
        #text(size: 26pt, weight: "bold", fill: good, ${typ(`${Math.round(sentiment.positive_pct)}%`)})
        #linebreak()
        #muted-text("supportive")
      ]
    ],
  )
]
#v(8pt)
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  metric("Supportive", ${typ(`${Math.round(sentiment.positive_pct)}%`)}, "approval and praise", good),
  metric("Neutral", ${typ(`${Math.round(sentiment.neutral_pct)}%`)}, "mixed or unresolved", muted),
  metric("Critical", ${typ(`${Math.round(sentiment.negative_pct)}%`)}, "friction and pushback", bad),
)
`;
}

function crimsonSearchPreview(query: string, sources: LinkupSource[]) {
  const relevantSources = sources.filter((source) => isRelevantSource(source, query));
  const usefulSources = relevantSources.filter(isUsefulSource);
  const usefulFallback = sources.filter(isUsefulSource);
  const sourcePool = usefulSources.length
    ? usefulSources
    : relevantSources.length
      ? relevantSources
      : usefulFallback.length
        ? usefulFallback
        : sources;
  const rows = sourcePool
    .slice(0, 5)
    .map((source) => ({
      site: hostnameOf(source.url),
      title: source.name,
      snippet: source.snippet ?? source.url,
    }));

  return `
= Crimson Search preview
#block(width: 100%, stroke: divider, inset: 10pt, radius: 999pt)[
  #text(fill: crimson, "⌕") #h(5pt) #text(size: 9.2pt, fill: ink, ${typ(query)})
]
#v(6pt)
${rows.map((row) => `#result-item(${typ(row.site)}, ${typ(row.title)}, ${typ(row.snippet)})`).join("\n")}
`;
}

function isRelevantSource(source: LinkupSource, query: string) {
  const text = `${source.name} ${source.snippet ?? ""} ${source.url}`.toLowerCase();
  const title = source.name.toLowerCase();
  const q = query.toLowerCase();

  if (q.includes("iphone 17 pro")) {
    const proMatch = /\biphone\s+17[\s-]+pro\b|\b17[\s-]+pro\b|\bpro[\s-]+max\b/.test(
      text
    );
    const adjacentModelTitle =
      /\b17e\b|\biphone\s+air\b/.test(title) &&
      !/\b17[\s-]+pro\b|\bpro[\s-]+max\b/.test(title);
    return proMatch && !adjacentModelTitle;
  }
  if (q.includes("vision pro")) {
    return text.includes("vision") && text.includes("pro");
  }
  if (q.includes("gpt-5")) {
    return text.includes("gpt-5") || text.includes("gpt 5");
  }
  if (q.includes("cybertruck")) {
    return text.includes("cybertruck");
  }
  if (q.includes("rust") && q.includes("zig")) {
    return text.includes("rust") || text.includes("zig");
  }

  return true;
}

function isUsefulSource(source: LinkupSource) {
  const text = `${source.name} ${source.snippet ?? ""}`.toLowerCase();
  const host = hostnameOf(source.url).toLowerCase();
  const lowValueDomain = /(coupon|deals|shopping|affiliate|pinterest|facebook)\./.test(
    host
  );
  const seoPatterns = [
    /\b\d+\s+(ways|tips|tricks|hacks|secrets|things|reasons|ideas|facts|best)\b/,
    /\b(top|best)\s+\d+\b/,
    /\bthe best\b.{0,48}\b(to buy|for|of|in)\b/,
    /\bbest\s+\w+s?\s+\b(to buy|for|of|in)\b/,
    /\beverything you need to know\b/,
    /\bultimate guide\b/,
    /\bbuying guide\b/,
    /\bcomplete guide\b/,
    /\bwhat you need to know\b/,
    /\bshould you buy\b/,
    /\bbest deals\b/,
    /\bhot selling\b/,
    /\bon sale\b/,
    /\baffiliate\b/,
    /\bcoupon\b/,
    /\bshopping\b/,
    /\bsponsored\b/,
  ];
  return !lowValueDomain && !seoPatterns.some((pattern) => pattern.test(text));
}

function imageEvidence(assets: PdfImageAsset[]) {
  if (!assets.length) {
    return `
= Image evidence
#muted-text("No image evidence was returned for this report.")
`;
  }

  const cards = assets
    .map(
      ({ image, fileName }) => `[
  ${
    fileName
      ? `#block(width: 100%, height: 96pt, clip: true, radius: 4pt, stroke: divider)[
    #image(${typ(fileName)}, width: 100%, height: 96pt, fit: "cover")
  ]`
      : `#block(width: 100%, fill: wash, stroke: divider, inset: 9pt, radius: 4pt)[
    #text(size: 8.4pt, fill: muted, "Image preview unavailable")
  ]`
  }
  #v(4pt)
  #text(weight: "bold", size: 9.4pt, ${typ(image.name)})
  #linebreak()
  #text(size: 8.4pt, fill: muted, ${typ(image.caption ?? image.sourceName ?? hostnameOf(image.url))})
]`
    )
    .join(",\n");

  return `
= Image evidence
#grid(columns: (1fr, 1fr), gutter: 12pt, ${cards})
`;
}

function themeMatrix(themes: SentimentBreakdown["themes"]) {
  if (!themes.length) return "";
  return `
= Conversation themes
${themes
  .map(
    (theme) =>
      `#theme-row(${typ(theme.title)}, ${typ(REACTION_LABEL[theme.sentiment])}, ${typ(theme.summary)}, ${typ(
        `${Math.round(theme.share_of_voice)}%`
      )}, ${themeColor(theme.sentiment)})`
  )
  .join("\n#v(5pt)\n")}
`;
}

function notableQuotes(quotes: SentimentBreakdown["notable_quotes"]) {
  if (!quotes.length) return "";
  return `
= Notable quotes
${quotes
  .slice(0, 6)
  .map(
    (quote) => `#block(width: 100%, fill: wash, stroke: divider, inset: 10pt, radius: 5pt)[
  #text(size: 10pt, ${typ(`"${quote.quote}"`)})
  #linebreak()
  #text(size: 8pt, weight: "bold", fill: muted, ${typ(quote.source)})
]`
  )
  .join("\n#v(6pt)\n")}
`;
}

function sourcesSection(sources: LinkupSource[]) {
  if (!sources.length) {
    return `
= Sources
#muted-text("No citations were returned for this report.")
`;
  }

  return `
= Sources
${sources
  .map(
    (source, index) => `#block(width: 100%, inset: (y: 5pt))[
  #text(weight: "bold", size: 9.5pt, ${typ(`${index + 1}. ${source.name}`)})
  #h(1fr)
  #text(size: 8pt, fill: muted, ${typ(hostnameOf(source.url))})
  #linebreak()
  #text(size: 8.7pt, fill: muted, ${typ(source.snippet ?? source.url)})
]`
  )
  .join("\n#line(length: 100%, stroke: 0.5pt + divider)\n")}
`;
}

function typ(value: unknown) {
  return JSON.stringify(sanitizeText(value));
}

function sanitizeText(value: unknown) {
  return String(value ?? "")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function themeColor(sentiment: "positive" | "neutral" | "negative") {
  if (sentiment === "positive") return "good";
  if (sentiment === "negative") return "bad";
  return "muted";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
