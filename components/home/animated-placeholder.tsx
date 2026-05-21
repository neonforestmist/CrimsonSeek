"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PHRASES = [
  "Ask anything…",
  "What is everyone saying about…",
  "How do people feel about…",
  "What’s the consensus on…",
];

interface Props {
  /** Hide and freeze the cycling placeholder - pass true when the
      input has a value or is focused, so it behaves like a real
      placeholder rather than a competing animation. */
  hidden: boolean;
}

export function AnimatedPlaceholder({ hidden }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (hidden) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 3600);
    return () => clearInterval(id);
  }, [hidden]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[17px] text-ink-faint"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!hidden && (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {PHRASES[index]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
