"use client";

import { cn } from "@/lib/utils";
import { type CSSProperties, type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  intensity?: "flat" | "subtle" | "regular" | "elevated";
  style?: CSSProperties;
  radius?: number;
}

const intensityMap = {
  flat: "border border-divider/70 bg-white/55",
  subtle: "border border-divider/70 bg-white/68 shadow-[0_1px_2px_rgba(21,18,14,0.04)]",
  regular:
    "border border-divider/70 bg-white/82 shadow-[0_1px_2px_rgba(21,18,14,0.04),0_12px_32px_-24px_rgba(21,18,14,0.35)]",
  elevated:
    "border border-divider/70 bg-white/92 shadow-[0_1px_2px_rgba(21,18,14,0.05),0_18px_44px_-26px_rgba(21,18,14,0.42)]",
};

export function GlassCard({
  children,
  className,
  padding = "p-6",
  intensity = "regular",
  style,
  radius,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        intensityMap[intensity],
        padding,
        className
      )}
      style={{ borderRadius: radius ?? 18, ...style }}
    >
      {children}
    </div>
  );
}
