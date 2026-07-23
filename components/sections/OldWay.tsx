"use client";

import { useEffect, useRef } from "react";

/* "The old way" — one centered block of copy that lights up word by word as you
   scroll through it. The section is tall; a sticky inner pins the text in the
   centre of the frame, and scroll progress across the pinned range drives each
   word from dim to full white — the illumination itself is the scroll cue.

   rAF-throttled, opacity-only (iOS-safe). Under reduced motion the whole block
   just sits lit. Words start dim via `html.js .oldway-word` so there's no flash
   before JS, and stay fully legible with no JS at all. */

const TEXT =
  "Hand it to an agency, and you pay a fat retainer every month — whether the phone rings or not. You get junk leads and vague reports. The risk stays yours. Or do it yourself, and drown in software — a dozen tools, a dozen integrations, weeks of setup before you land a single customer. You don't need another agency. You don't need another tool. You need the work done.";

const WORDS = TEXT.split(" ");

export default function OldWay() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wordRefs.current.forEach((w) => w && (w.style.opacity = "1"));
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return; // off-screen — skip writes
      // Progress across the pinned range: 0 as the section top hits the viewport
      // top (text centred), 1 as its bottom reaches the viewport bottom.
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      // +3 so the last words finish lighting a touch before the block scrolls on.
      const lit = p * (WORDS.length + 3);
      for (let i = 0; i < wordRefs.current.length; i++) {
        const w = wordRefs.current[i];
        if (!w) continue;
        const wp = Math.min(1, Math.max(0, lit - i));
        w.style.opacity = (0.18 + 0.82 * wp).toFixed(3);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="old-way"
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: "165vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="max-w-[920px] mx-auto text-center">
          <div className="eyebrow justify-center mb-8">The old way</div>
          <p className="text-2xl md:text-4xl font-semibold tracking-tight leading-[1.4] text-foreground">
            {WORDS.map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="oldway-word"
              >
                {word}
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
