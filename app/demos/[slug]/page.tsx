import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoDashboard } from "@/components/demos/demo-dashboard";
import { DEMO_SCENARIOS } from "@/lib/demo-results";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DEMO_SCENARIOS.map((scenario) => ({ slug: scenario.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = DEMO_SCENARIOS.find((item) => item.slug === slug);

  if (!scenario) {
    return {
      title: "CrimsonSeek demo",
    };
  }

  return {
    title: `${scenario.title} | CrimsonSeek demo`,
    description: scenario.summary,
  };
}

export default async function DemoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = DEMO_SCENARIOS.find((item) => item.slug === slug);

  if (!scenario) notFound();

  return <DemoDashboard scenario={scenario} />;
}
