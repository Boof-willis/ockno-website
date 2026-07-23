"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Load-time entrance primitives.
 *
 * Both use a critically-damped spring (bounce: 0) rather than a tween: it
 * decelerates without overshoot, which is what keeps a 1s move from reading
 * as sluggish. Transform/opacity only — no filters — per this codebase's
 * iOS-flicker history.
 *
 * Delays are passed per-element rather than via staggerChildren so that Hero
 * stays a server component and only the animated leaves ship JS.
 */

const SPRING = { type: "spring" as const, duration: 1, bounce: 0 };

/** Initial opacity is 0.001, not 0: keeps the layer composited so the first
 *  frame doesn't cost a paint. */
const HIDDEN = 0.001;

type Props = {
  children: ReactNode;
  /** seconds */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** Fade up. The hero's headline/subhead/CTA pattern. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  style,
}: Props & { y?: number }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      data-motion
      className={className}
      style={style}
      initial={{ opacity: HIDDEN, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Opacity only, no movement. For elements inside an already-moving parent —
 *  stacking transforms on a moving card reads as jitter. */
export function Fade({ children, delay = 0, className, style }: Props) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      data-motion
      className={className}
      style={style}
      initial={{ opacity: HIDDEN }}
      animate={{ opacity: 1 }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Fade up + settle from scale. The mock card itself. */
export function RevealCard({
  children,
  delay = 0,
  className,
  style,
}: Props) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      data-motion
      className={className}
      style={style}
      initial={{ opacity: HIDDEN, y: 44, scale: 0.965 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, duration: 1.2, delay }}
    >
      {children}
    </motion.div>
  );
}
