interface GeminiTextInput {
  system: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  json?: boolean;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export class GeminiJsonParseError extends Error {
  constructor(message = "Gemini returned malformed JSON") {
    super(message);
    this.name = "GeminiJsonParseError";
  }
}

export async function generateGeminiText({
  system,
  prompt,
  temperature = 0.7,
  maxOutputTokens = 1400,
  json = false,
}: GeminiTextInput) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env or .env.local");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens,
        ...(json ? { responseMimeType: "application/json" } : {}),
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Gemini request failed with status ${res.status}: ${sanitizeProviderError(text)}`
    );
  }

  const data = (await res.json()) as GeminiResponse;
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

export function parseJsonObject<T>(text: string): T {
  const candidates = jsonCandidates(text);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as T;
      }
    } catch {
      // Try the next extraction strategy before giving up.
    }
  }

  throw new GeminiJsonParseError();
}

function jsonCandidates(text: string) {
  const trimmed = text.trim();
  const candidates = new Set<string>();

  if (trimmed) candidates.add(trimmed);

  for (const match of trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const fenced = match[1]?.trim();
    if (fenced) candidates.add(fenced);
  }

  const extracted = extractFirstJsonObject(trimmed);
  if (extracted) candidates.add(extracted);

  return [...candidates];
}

function extractFirstJsonObject(text: string) {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      return text.slice(start, index + 1).trim();
    }
  }

  return null;
}

function sanitizeProviderError(text: string) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "The provider returned an empty error body.";

  return trimmed
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[redacted]")
    .replace(/key=([^&\s"]+)/gi, "key=[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .slice(0, 400);
}
