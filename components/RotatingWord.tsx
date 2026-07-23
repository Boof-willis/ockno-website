"use client";

import { useEffect, useState } from "react";

/**
 * Rotating headline text, word-by-word. All phrases are stacked in the same
 * grid cell (so the width is stable and equal to the widest phrase) and clipped
 * to the line. The swap is sequenced: the outgoing phrase rolls fully up and out
 * before the incoming phrase rolls up into place, so two phrases are never on
 * screen at once. A small per-word stagger gives the cascade. Holds still under
 * prefers-reduced-motion.
 */
export default function RotatingWord({
  words,
  className = "",
  interval = 2600,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [{ active, prev }, setState] = useState({ active: 0, prev: -1 });

  useEffect(() => {
    if (words.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setState((s) => ({ active: (s.active + 1) % words.length, prev: s.active }));
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const stateFor = (i: number) =>
    i === active ? "in" : i === prev ? "out" : "below";

  // Incoming phrase waits for the outgoing one to leave, then rolls in.
  const IN_DELAY = 360; // ms — handoff gap
  const STAGGER = 90; // ms between words (per-word cascade in)

  return (
    <span className="rot-words" aria-label={words[active]}>
      {words.map((phrase, i) => {
        const parts = phrase.trim().split(/\s+/);
        const state = stateFor(i);
        return (
          <span key={i} className="rot-phrase" data-state={state} aria-hidden>
            {parts.map((w, wi) => {
              // Staggered on the way in; the whole phrase leaves in unison.
              const delay = state === "in" ? IN_DELAY + wi * STAGGER : 0;
              // Non-breaking space so the gap between inline-block words isn't
              // trimmed at the box edge.
              return (
                <span
                  key={wi}
                  className={`rot-word ${className}`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {w}
                  {wi < parts.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
