import type { Metadata } from "next";
import { DemoGallery } from "@/components/demos/demo-gallery";

export const metadata: Metadata = {
  title: "CrimsonSeek demos | simulated dashboard gallery",
  description:
    "Preview simulated CrimsonSeek dashboards with mocked Linkup-style answers, citations, public read, themes, and source context.",
};

export default function DemosPage() {
  return <DemoGallery />;
}
