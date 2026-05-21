"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEPTH_OPTIONS, DEPTH_ORDER, type Depth } from "@/lib/linkup";

interface Props {
  value: Depth;
  onChange: (next: Depth) => void;
}

/**
 * Effort selector: three standalone pills, no segmented track.
 *
 * Active pill: solid crimson fill with white text and a soft glow.
 * Inactive pills: transparent, muted ink text; soft warm hover.
 *
 * The active state moves with a tight ease-out curve so switching between
 * Fast/Standard/Deep feels deliberate without calling attention to itself.
 */
export function DepthSelector({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Search effort"
      className="inline-flex items-center gap-0.5 rounded-full p-1"
      style={{
        background: "rgba(21, 18, 14, 0.055)",
        boxShadow: "inset 0 0 0 1px rgba(21, 18, 14, 0.04)",
      }}
    >
      {DEPTH_ORDER.map((depth) => {
        const meta = DEPTH_OPTIONS[depth];
        const active = value === depth;
        return (
          <motion.button
            key={depth}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(depth)}
            title={`${meta.tagline}: ${meta.description}`}
            initial={false}
            animate={{
              backgroundColor: active
                ? "rgba(217, 79, 48, 1)"
                : "rgba(217, 79, 48, 0)",
              color: active ? "rgb(255, 255, 255)" : "rgb(111, 106, 98)",
              boxShadow: active
                ? "0 1px 2px rgba(150, 47, 24, 0.18), 0 8px 18px -12px rgba(217, 79, 48, 0.65)"
                : "0 0 0 0 rgba(150, 47, 24, 0), 0 0 0 0 rgba(217, 79, 48, 0), inset 0 0 0 rgba(255, 255, 255, 0)",
            }}
            whileTap={{ scale: 0.94 }}
            transition={{
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              "relative rounded-full px-3 py-1 text-[12.5px] font-semibold tracking-tight outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent-400/50",
              !active && "hover:text-ink",
            )}
          >
            {meta.label}
          </motion.button>
        );
      })}
    </div>
  );
}
