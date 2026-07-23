"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "./ui/Icon";

/**
 * Hero eyebrow — a pill containing an infinite horizontal marquee.
 *
 * Geometry from the reference template: 30px tall, pill radius, 12px/400 label,
 * a 23px circular chip flush right, and the asymmetric 4px/4px/4px/8px padding
 * that lets the chip sit flush while the label keeps its inset.
 *
 * Mechanics also from the reference: a flex row with a 36px gap, clipped by
 * overflow:hidden, drifting left forever. The reference duplicates its single
 * announcement four times and drives translateX from JS at ~25px/s.
 *
 * This uses the codebase's existing marquee pattern instead: render the item set
 * TWICE and animate translateX 0 → -50% in CSS. At exactly two copies, -50%
 * lands on the start of the second copy, so the loop is seamless with no JS in
 * the frame loop. The only thing measured in JS is the duration — the CSS can't
 * know the track's width, and a hardcoded duration would silently change speed
 * whenever the copy changes.
 *
 * Holds still under prefers-reduced-motion: the animation is dropped and the
 * first item sits in place. The link works either way.
 */

/** px/sec. Matches the reference's measured drift. */
const SPEED = 25;

export default function Eyebrow({
  items,
  href,
  label,
}: {
  items: string[];
  href: string;
  label: string;
}) {
  const trackRef = useRef<HTMLSpanElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Duration = (width of one copy) / speed, so drift stays at SPEED px/s no
  // matter how the copy changes.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const oneCopy = el.scrollWidth / 2;
      if (oneCopy > 0) setDuration(oneCopy / SPEED);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  // Fonts land after first paint and change the track width; re-measure once
  // they're ready so the speed doesn't drift.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      const el = trackRef.current;
      if (!el || cancelled) return;
      const oneCopy = el.scrollWidth / 2;
      if (oneCopy > 0) setDuration(oneCopy / SPEED);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a href={href} className="eyebrow-pill group" aria-label={label}>
      <span className="eyebrow-viewport">
        <span
          ref={trackRef}
          className="eyebrow-track"
          style={duration ? { animationDuration: `${duration}s` } : undefined}
        >
          {/* Rendered twice — the -50% keyframe depends on exactly two copies. */}
          {[...items, ...items].map((item, i) => (
            <span className="eyebrow-item" key={i} aria-hidden>
              {item}
            </span>
          ))}
        </span>
      </span>
      <span className="eyebrow-chip">
        <Icon icon="solar:arrow-right-linear" width={14} />
      </span>
    </a>
  );
}
