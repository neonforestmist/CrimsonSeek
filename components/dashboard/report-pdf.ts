import type { Depth, FullSearchResult } from "@/lib/linkup";

export type ReportPdfVariant = "full" | "appendix" | "citations";

interface ReportPdfInput {
  result: FullSearchResult;
  query: string;
  depth: Depth;
  rangeLabel: string;
  variant: ReportPdfVariant;
}

export async function downloadCuratedReportPdf(input: ReportPdfInput) {
  const response = await fetch("/api/report-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "PDF generation failed");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const fileName =
    disposition?.match(/filename="([^"]+)"/)?.[1] ??
    `${slugify(input.query)}-${input.variant}.pdf`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
