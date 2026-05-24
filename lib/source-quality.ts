import type { LinkupSource } from "@/lib/linkup";
import { hostnameOf } from "@/lib/utils";

export type SourceQualityTier = "strong" | "context" | "caution" | "unknown";

export interface SourceQuality {
  tier: SourceQualityTier;
  label: string;
  role: string;
  reason: string;
}

const PRIMARY_HOST_PATTERNS = [
  /\.gov$/,
  /\.edu$/,
  /(^|\.)apple\.com$/,
  /(^|\.)anthropic\.com$/,
  /(^|\.)android\.com$/,
  /(^|\.)microsoft\.com$/,
  /(^|\.)openai\.com$/,
  /(^|\.)samsung\.com$/,
  /(^|\.)github\.com$/,
  /(^|\.)arxiv\.org$/,
  /(^|\.)nih\.gov$/,
  /(^|\.)ncbi\.nlm\.nih\.gov$/,
  /(^|\.)sec\.gov$/,
];

const RESEARCH_HOST_PATTERNS = [
  /(^|\.)apa\.org$/,
  /(^|\.)artificialanalysis\.ai$/,
  /(^|\.)aider\.chat$/,
  /(^|\.)bain\.com$/,
  /(^|\.)bcg\.com$/,
  /(^|\.)deloitte\.com$/,
  /(^|\.)gartner\.com$/,
  /(^|\.)hbr\.org$/,
  /(^|\.)ibm\.com$/,
  /(^|\.)ilo\.org$/,
  /(^|\.)jamanetwork\.com$/,
  /(^|\.)lmarena\.ai$/,
  /(^|\.)mckinsey\.com$/,
  /(^|\.)nber\.org$/,
  /(^|\.)oecd\.org$/,
  /(^|\.)pewresearch\.org$/,
  /(^|\.)unesco\.org$/,
  /(^|\.)weforum\.org$/,
];

const EDITORIAL_HOST_PATTERNS = [
  /(^|\.)reuters\.com$/,
  /(^|\.)apnews\.com$/,
  /(^|\.)androidauthority\.com$/,
  /(^|\.)theverge\.com$/,
  /(^|\.)wired\.com$/,
  /(^|\.)engadget\.com$/,
  /(^|\.)cnet\.com$/,
  /(^|\.)educationweek\.org$/,
  /(^|\.)ifixit\.com$/,
  /(^|\.)businessinsider\.com$/,
  /(^|\.)macrumors\.com$/,
  /(^|\.)pcmag\.com$/,
  /(^|\.)techcrunch\.com$/,
  /(^|\.)ars-technica\.com$/,
  /(^|\.)tomshardware\.com$/,
  /(^|\.)windowscentral\.com$/,
];

const COMMUNITY_HOST_PATTERNS = [
  /(^|\.)reddit\.com$/,
  /(^|\.)news\.ycombinator\.com$/,
  /(^|\.)hackernews\.com$/,
  /(^|\.)stackoverflow\.com$/,
  /(^|\.)forum\./,
  /(^|\.)forums\./,
  /(^|\.)discourse\./,
];

const LOW_CONFIDENCE_HOST_PATTERNS = [
  /(^|\.)medium\.com$/,
  /(^|\.)substack\.com$/,
  /(^|\.)quora\.com$/,
  /(^|\.)linkedin\.com$/,
  /(^|\.)pinterest\.com$/,
  /(^|\.)facebook\.com$/,
];

const SEO_PATTERNS = [
  /\b\d+\s+(ways|tips|tricks|hacks|secrets|things|reasons|ideas|facts|best)\b/,
  /\b(top|best)\s+\d+\b/,
  /\bbest\s+\w+s?\s+\b(to buy|for|of|in)\b/,
  /\beverything you need to know\b/,
  /\bultimate guide\b/,
  /\bbuying guide\b/,
  /\bcomplete guide\b/,
  /\bwhat you need to know\b/,
  /\bshould you buy\b/,
  /\bbest deals\b/,
  /\baffiliate\b/,
  /\bcoupon\b/,
  /\bshopping\b/,
  /\bsponsored\b/,
];

export function assessSourceQuality(source: LinkupSource): SourceQuality {
  const host = hostnameOf(source.url).toLowerCase();
  const text = `${source.name} ${source.snippet ?? ""}`.toLowerCase();

  if (isSeoRisk(host, text)) {
    return {
      tier: "caution",
      label: "Caution",
      role: "Possible SEO or low-value page",
      reason:
        "Useful only if it contains original testing, measurements, or firsthand evidence.",
    };
  }

  if (LOW_CONFIDENCE_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return {
      tier: "caution",
      label: "Caution",
      role: "Personal or low-confidence source",
      reason:
        "Useful as a public reaction, but weaker than primary records, benchmarks, reputable reporting, or firsthand community evidence.",
    };
  }

  if (PRIMARY_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return {
      tier: "strong",
      label: "Strong",
      role: "Primary or official source",
      reason: "Best for factual claims, release details, technical notes, or original records.",
    };
  }

  if (RESEARCH_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return {
      tier: "strong",
      label: "Strong",
      role: "Research or institutional source",
      reason: "Useful for survey data, benchmarks, policy analysis, or original research.",
    };
  }

  if (EDITORIAL_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return {
      tier: "strong",
      label: "Strong",
      role: "Editorial source",
      reason: "Useful for reported context, reviews, hands-on testing, and cited analysis.",
    };
  }

  if (COMMUNITY_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return {
      tier: "context",
      label: "Context",
      role: "Community or firsthand discussion",
      reason: "Useful for public reaction, complaints, praise, and recurring lived experience.",
    };
  }

  if (/\b(review|hands-on|tested|benchmark|analysis|interview|survey)\b/.test(text)) {
    return {
      tier: "context",
      label: "Context",
      role: "Evidence-bearing source",
      reason: "Looks useful because it contains review, testing, analysis, or direct reaction cues.",
    };
  }

  return {
    tier: "unknown",
    label: "Unknown",
    role: "Unclassified source",
    reason: "Kept in the report, but not treated as a high-confidence citation by default.",
  };
}

export function summarizeSourceQuality(sources: LinkupSource[]) {
  const assessed = sources.map((source) => ({
    source,
    quality: assessSourceQuality(source),
  }));

  return {
    assessed,
    strong: assessed.filter((item) => item.quality.tier === "strong").length,
    context: assessed.filter((item) => item.quality.tier === "context").length,
    caution: assessed.filter((item) => item.quality.tier === "caution").length,
    unknown: assessed.filter((item) => item.quality.tier === "unknown").length,
  };
}

function isSeoRisk(host: string, text: string) {
  if (/(coupon|deals|shopping|affiliate|pinterest|facebook)\./.test(host)) {
    return true;
  }
  return SEO_PATTERNS.some((pattern) => pattern.test(text));
}
