import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { Depth } from "@/lib/linkup";

const ALLOWED_DEPTH: Depth[] = ["fast", "standard", "deep"];

interface PageProps {
  searchParams: Promise<{
    q?: string;
    depth?: string;
    from?: string;
    to?: string;
    rangeLabel?: string;
    includeDomains?: string;
    excludeDomains?: string;
    priorityDomains?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.q?.trim();
  if (!query) redirect("/");

  const depth: Depth = ALLOWED_DEPTH.includes(sp.depth as Depth)
    ? (sp.depth as Depth)
    : "standard";
  const includeDomains = parseDomains(sp.includeDomains);
  const excludeDomains = includeDomains.length ? [] : parseDomains(sp.excludeDomains);
  const priorityDomains = parseDomains(sp.priorityDomains);

  return (
    <DashboardView
      query={query}
      depth={depth}
      fromDate={sp.from}
      toDate={sp.to}
      rangeLabel={sp.rangeLabel ?? "Anytime"}
      includeDomains={includeDomains}
      excludeDomains={excludeDomains}
      priorityDomains={priorityDomains}
    />
  );
}

function parseDomains(value?: string) {
  if (!value) return [];
  const seen = new Set<string>();
  return value
    .split(",")
    .map((domain) => domain.trim())
    .map((domain) =>
      domain
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
