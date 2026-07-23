"use client";

import { useEffect } from "react";

/**
 * Site-wide motion engine. One client component, mounted once.
 *
 * Drives three declarative attributes (all transform/opacity-only — no filters,
 * no layout thrash — per this codebase's iOS-flicker history):
 *
 *  - [data-reveal]       one-shot scroll reveal. Value = transition delay in ms.
 *                        Optional [data-reveal-from="left"|"right"|"scale"].
 *  - [data-countup]      number counts from 0 to the given value when it enters
 *                        the viewport. Server-rendered text is the no-JS/reduced-
 *                        motion fallback. Optional [data-duration].
 *  - [data-parallax]     gentle scroll parallax (factor, e.g. "0.06"). Desktop
 *                        only. Uses the element's layout position (not its
 *                        transformed rect) so there's no feedback loop.
 *  - [data-parallax-scroll]
 *                        absolute scroll parallax: translateY = scrollY * factor,
 *                        unclamped. For stacked depth layers that must hold an
 *                        exact ratio to each other — [data-parallax] is
 *                        element-relative and clamped, so layers drift out of
 *                        register. Desktop only.
 *  - [data-focus-group]  container whose [data-focus-item] children dim to 0.25,
 *                        except the one nearest the focus line, which lights to
 *                        1. Reads one idea at a time as you scroll.
 *
 * prefers-reduced-motion: everything reveals immediately, numbers stay static,
 * no scroll listeners are attached.
 */
export default function MotionInit() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const countEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-countup]"),
    );
    const parallaxEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    const parallaxScrollEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax-scroll]"),
    );
    const focusGroups = Array.from(
      document.querySelectorAll<HTMLElement>("[data-focus-group]"),
    );

    if (reduced) {
      revealEls.forEach((el) => el.classList.add("is-inview"));
      return;
    }

    // --- Scroll reveals (one-shot) -------------------------------------------
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.reveal || "0", 10) || 0;
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.classList.add("is-inview");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    revealEls.forEach((el) => io.observe(el));

    // --- Count-ups (one-shot) -------------------------------------------------
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const cio = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          cio.unobserve(el);
          const target = parseFloat(el.dataset.countup || "0");
          const duration = parseInt(el.dataset.duration || "1300", 10);
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            el.textContent = Math.round(easeOut(p) * target).toLocaleString(
              "en-US",
            );
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    countEls.forEach((el) => cio.observe(el));

    // --- Focus highlight ------------------------------------------------------
    // Whichever item's centre sits closest to the focus line reads as "in focus"
    // and lights to full; the rest hold at 0.25. Runs on mobile too — it's an
    // opacity change, not a transform, so it doesn't touch the iOS scroll path.
    let removeFocus: (() => void) | undefined;
    if (focusGroups.length) {
      const groups = focusGroups.map((g) => ({
        items: Array.from(g.querySelectorAll<HTMLElement>("[data-focus-item]")),
      }));
      let ticking = false;
      const update = () => {
        // Slightly above centre: the eye sits high, and it lets the last item
        // reach focus before the section scrolls away.
        const line = window.innerHeight * 0.42;
        for (const { items } of groups) {
          let best: HTMLElement | null = null;
          let bestDist = Infinity;
          for (const el of items) {
            const r = el.getBoundingClientRect();
            const dist = Math.abs(r.top + r.height / 2 - line);
            if (dist < bestDist) {
              bestDist = dist;
              best = el;
            }
          }
          for (const el of items) el.classList.toggle("is-focus", el === best);
        }
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
      removeFocus = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    // --- Absolute scroll parallax (desktop only) ------------------------------
    // translateY = scrollY * factor. Layers hold an exact ratio to each other at
    // every scroll position, which is what reads as depth; a factor of 0 pins a
    // layer to the page and stands in for "infinitely far away".
    //
    // Where CSS scroll-driven animations exist, the compositor owns this instead
    // (see html.st-anim [data-parallax-scroll] in globals.css) — smoother, and
    // off the main thread. We only run the JS path as a fallback, and never both
    // at once or they'd both write `transform`.
    //
    // Safari is deliberately excluded: it reports support for
    // `animation-timeline: scroll()` (Safari 26+) but defers painting the
    // scroll-animated layers until the first scroll — so the whole scape "pops
    // in" only once you scroll, and a layer can stay blank. We gate the CSS
    // behind the `st-anim` class and add it only for engines that paint it
    // correctly; Safari falls through to the JS path, which paints on load.
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: scroll()");
    const isSafari =
      typeof navigator !== "undefined" &&
      /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(
        navigator.userAgent,
      );
    const useScrollAnim = supportsScrollTimeline && !isSafari;
    if (useScrollAnim) document.documentElement.classList.add("st-anim");
    let removeScrollParallax: (() => void) | undefined;
    if (!isMobile && !useScrollAnim && parallaxScrollEls.length) {
      // 2D translateY on purpose, and factor-0 layers are never written at all.
      // translate3d force-promotes each layer to its own compositing layer, and
      // Safari (the only engine on this path) can leave a freshly-promoted
      // layer unpainted until the first scroll recomposites — the scape "pops
      // in" — and can mis-sort promoted siblings so a nearer layer hides.
      // 2D transforms keep normal paint flow and stacking.
      const layers = parallaxScrollEls
        .map((el) => ({
          el,
          factor: parseFloat(el.dataset.parallaxScroll || "0"),
        }))
        .filter((l) => l.factor !== 0);
      let ticking = false;
      const update = () => {
        const s = window.scrollY;
        for (const l of layers) {
          l.el.style.transform = `translateY(${(s * l.factor).toFixed(1)}px)`;
        }
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      update();
      removeScrollParallax = () =>
        window.removeEventListener("scroll", onScroll);
    }

    // --- Ridge dim (Safari fallback) ------------------------------------------
    // Chromium dims [data-dim] ridges via the scroll-timeline in globals.css.
    // Safari falls through here: brightness ramps 1 → 0.62 over the first ~88vh
    // of scroll, matching the CSS keyframe, so the nearer terrain darkens as the
    // sky falls to night.
    let removeDim: (() => void) | undefined;
    const dimEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-dim]"),
    );
    if (!isMobile && !useScrollAnim && dimEls.length) {
      let ticking = false;
      const update = () => {
        const p = Math.min(1, window.scrollY / (window.innerHeight * 0.88));
        const b = (1 - p * 0.38).toFixed(3);
        for (const el of dimEls) el.style.filter = `brightness(${b})`;
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
      removeDim = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        for (const el of dimEls) el.style.filter = "";
      };
    }

    // --- Parallax (desktop only) ----------------------------------------------
    // Gentle element-relative drift: translateY tracks how far the element's
    // centre sits from the viewport centre, scaled by factor and clamped to ±44.
    //
    // Where scroll-driven animations exist we hand this to the compositor as a
    // root ScrollTimeline animation — off the main thread, so no scroll-frame
    // lag. (ViewTimeline would be the natural fit but its scrollport is the
    // nearest scroll-container ancestor, and the hero's overflow-hidden section
    // pins it, so it never sees page scroll. A root ScrollTimeline sidesteps
    // that.) The element's viewport transit maps to a scroll window
    // [enter, exit]; four keyframes hold at -R before enter, ramp linearly to
    // +R across the window, and hold after exit — reproducing the JS clamp.
    //   enter = elementTopDoc - viewportH   (element bottom hits viewport bottom)
    //   exit  = elementTopDoc + elementH    (element bottom hits viewport top)
    //   R     = min(44, factor·(viewportH + elementH)/2)
    const ST = (window as unknown as { ScrollTimeline?: unknown }).ScrollTimeline;
    const supportsCompositorParallax =
      useScrollAnim && typeof ST === "function";
    let removeParallax: (() => void) | undefined;
    if (!isMobile && parallaxEls.length && supportsCompositorParallax) {
      const de = document.documentElement;
      let anims: Animation[] = [];
      const build = () => {
        for (const a of anims) a.cancel();
        const scrollMax = de.scrollHeight - de.clientHeight;
        const vh = window.innerHeight;
        anims = parallaxEls.map((el) => {
          const factor = parseFloat(el.dataset.parallax || "0");
          const topDoc = el.getBoundingClientRect().top + window.scrollY;
          const h = el.offsetHeight;
          const enter = Math.max(0, topDoc - vh);
          const exit = Math.min(scrollMax, topDoc + h);
          const R = Math.min(44, (factor * (vh + h)) / 2);
          el.style.willChange = "transform";
          // Guard a zero/degenerate scroll range so offsets stay valid.
          const s = scrollMax > 0 ? scrollMax : 1;
          const down = `translate3d(0, ${R.toFixed(1)}px, 0)`;
          const up = `translate3d(0, ${(-R).toFixed(1)}px, 0)`;
          return el.animate(
            [
              { transform: up, offset: 0 },
              { transform: up, offset: Math.min(1, enter / s) },
              { transform: down, offset: Math.min(1, exit / s) },
              { transform: down, offset: 1 },
            ],
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              timeline: new (ST as any)({ source: de }),
              fill: "both",
              easing: "linear",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
          );
        });
      };
      build();
      // Page height / viewport can change; recompute the windows on resize.
      window.addEventListener("resize", build);
      removeParallax = () => {
        window.removeEventListener("resize", build);
        for (const a of anims) a.cancel();
        parallaxEls.forEach((el) => (el.style.willChange = ""));
      };
    } else if (!isMobile && parallaxEls.length) {
      // Fallback: main-thread scroll listener. Cache each element's
      // document-space midpoint from layout (untransformed).
      const bases = parallaxEls.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          factor: parseFloat(el.dataset.parallax || "0"),
          docMid: r.top + window.scrollY + r.height / 2,
        };
      });
      let ticking = false;
      const update = () => {
        const viewMid = window.scrollY + window.innerHeight / 2;
        for (const b of bases) {
          const y = Math.max(-44, Math.min(44, (viewMid - b.docMid) * b.factor));
          // 2D on purpose — see the scroll-parallax fallback above: 3D would
          // promote the card to a compositing layer Safari may not paint on load.
          b.el.style.transform = `translateY(${y.toFixed(1)}px)`;
        }
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
      removeParallax = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    return () => {
      io.disconnect();
      cio.disconnect();
      removeParallax?.();
      removeScrollParallax?.();
      removeDim?.();
      removeFocus?.();
    };
  }, []);

  return null;
}
