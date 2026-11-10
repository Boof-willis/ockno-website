import type { CSSProperties, ReactNode } from "react";

/**
 * Load-time entrance primitives, as plain CSS animations (globals.css,
 * "Load-time entrances").
 *
 * These used framer-motion springs; the whole library shipped for this one
 * file. A 1s ease-out-expo curve is the same critically-damped feel (fast
 * start, no overshoot), runs off the main thread, and starts with the first
 * paint instead of after hydration. Transform/opacity only — no filters — per
 * this codebase's iOS-flicker history. Reduced motion is handled in the CSS.
 *
 * Delays are passed per-element so the cascade is authored in one place (Hero's
 * timeline). No client JS: Hero stays a server component all the way down.
 */

type Props = {
  children: ReactNode;
  /** seconds */
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

const cx = (a: string, b?: string) => (b ? `${a} ${b}` : a);

/** Fade up. The hero's headline/subhead/CTA pattern. */
export function Reveal({ children, delay = 0, y = 24, className, style }: Props & { y?: number }) {
  return (
    <div
      data-motion
      className={cx("enter enter-up", className)}
      style={{ ...style, animationDelay: `${delay}s`, ["--enter-y" as string]: `${y}px` }}
    >
      {children}
    </div>
  );
}

/** Opacity only, no movement. For elements inside an already-moving parent —
 *  stacking transforms on a moving card reads as jitter. */
export function Fade({ children, delay = 0, className, style }: Props) {
  return (
    <div data-motion className={cx("enter enter-fade", className)} style={{ ...style, animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/** Fade up + settle from scale. The mock card itself. */
export function RevealCard({ children, delay = 0, className, style }: Props) {
  return (
    <div data-motion className={cx("enter enter-card", className)} style={{ ...style, animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
