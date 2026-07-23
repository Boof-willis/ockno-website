"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide momentum scrolling.
 *
 * Lenis drives the *native* scroll position (it doesn't transform the page like
 * older smooth-scroll libraries), so window.scrollY stays truthful and the
 * scroll-driven parallax, the fixed star field, and the Safari JS parallax all
 * keep working — they just now follow an eased scroll instead of the raw one.
 *
 * Disabled under prefers-reduced-motion: the page falls back to native scroll.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1, // smoothing intensity; lower = floatier, higher = snappier
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Smooth-scroll same-page anchor links (nav). The built-in `anchors` option
    // jumps instantly; an explicit scrollTo with a duration animates it to match
    // the wheel feel. No offset needed — lenis.scrollTo honours each section's
    // CSS scroll-margin-top (88px), which already clears the fixed nav.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const a = (e.target as HTMLElement).closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
