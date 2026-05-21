"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

/**
 * Shared scroll-reveal primitive - Stripe/Linear style. The "rise + fade"
 * transition (cubic-bezier(0.16, 1, 0.3, 1)) is the Apple "ease-out
 * expo" curve that makes content feel pulled into view rather than
 * pushed.
 *
 * `viewport.once` keeps the page light: an element animates the first
 * time it enters and never again, even if the user scrolls back.
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance from the viewport edge before the element triggers. */
  margin?: string;
}

export function Reveal({
  children,
  className,
  delay = 0,
  margin = "-80px",
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={variants}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
