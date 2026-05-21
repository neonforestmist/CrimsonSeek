import { NextResponse } from "next/server";
import { runFullSearch, type Depth } from "@/lib/linkup";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_DEPTH: Depth[] = ["fast", "standard", "deep"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const depth: Depth = ALLOWED_DEPTH.includes(body.depth) ? body.depth : "standard";
  const maxResults = typeof body.maxResults === "number" && body.maxResults > 0 ? Math.min(body.maxResults, 50) : 12;
  const fromDate = typeof body.fromDate === "string" && body.fromDate ? body.fromDate : undefined;
  const toDate = typeof body.toDate === "string" && body.toDate ? body.toDate : undefined;
  const includeDomains = parseDomainList(body.includeDomains);
  const excludeDomains = includeDomains.length > 0 ? [] : parseDomainList(body.excludeDomains);
  const priorityDomains = parseDomainList(body.priorityDomains);

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const result = await runFullSearch({
      query,
      depth,
      maxResults,
      fromDate,
      toDate,
      includeDomains,
      excludeDomains,
      priorityDomains,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseDomainList(value: unknown) {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) =>
      item
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .replace(/\/.*$/, "")
        .toLowerCase()
    )
    .filter((domain) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain))
    .filter((domain) => {
      if (seen.has(domain)) return false;
      seen.add(domain);
      return true;
    })
    .slice(0, 100);
}
