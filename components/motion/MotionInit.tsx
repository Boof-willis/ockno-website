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
 *  - [data-parallax]     gentle scroll parallax (factor, e.g. "0.06"). Uses the
 *                        element's layout position (not its transformed rect)
 *                        so there's no feedback loop.
 *  - [data-parallax-scroll]
 *                        absolute scroll parallax: translateY = scrollY * factor,
 *                        unclamped. For stacked depth layers that must hold an
 *                        exact ratio to each other — [data-parallax] is
 *                        element-relative and clamped, so layers drift out of
 *                        register.
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
    // Cost dial, NOT an off-switch: phones still run every effect (that parity
    // was hard-won — see the iOS notes below), but the WebKit JS fallbacks are
    // main-thread repaints, so on small screens we trim per-frame work: static
    // ridge dim, frozen mid ridge (data-parallax-scroll-mobile), frozen dawn
    // sun. Never used to skip an effect wholesale.
    const smallView = window.matchMedia("(max-width: 768px)").matches;

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

    // --- Absolute scroll parallax ---------------------------------------------
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
    // Every iOS browser is WebKit under its own branding (CriOS, FxiOS,
    // EdgiOS…), so the Safari paint-deferral bug applies to all of them.
    // iPadOS masquerades as macOS but reports multitouch.
    const isIOS =
      typeof navigator !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const useScrollAnim = supportsScrollTimeline && !isSafari && !isIOS;
    if (useScrollAnim) document.documentElement.classList.add("st-anim");
    let removeScrollParallax: (() => void) | undefined;
    if (!useScrollAnim && parallaxScrollEls.length) {
      // 2D translateY on purpose, and factor-0 layers are never written at all.
      // translate3d force-promotes each layer to its own compositing layer, and
      // WebKit (the only engine on this path) can leave a freshly-promoted
      // layer unpainted until the first scroll recomposites — the scape "pops
      // in" — and can mis-sort promoted siblings so a nearer layer hides.
      // 2D transforms keep normal paint flow and stacking.
      //
      // Driven by a continuous rAF loop rather than a scroll listener: during
      // iOS momentum scrolling, scroll events arrive a frame behind the
      // rendered position, which reads as jitter on layers that must hold an
      // exact ratio to the page. The loop reads scrollY every frame and only
      // writes when it changed, so the idle cost is one comparison per frame.
      // data-parallax-scroll-mobile overrides the factor on small screens —
      // a 0 drops that layer's per-frame repaint entirely (each unpromoted
      // transform write repaints the layer's visible area on this path).
      const layers = parallaxScrollEls
        .map((el) => {
          const mob = el.dataset.parallaxScrollMobile;
          return {
            el,
            factor: parseFloat(
              (smallView && mob != null ? mob : el.dataset.parallaxScroll) ||
                "0",
            ),
            // Scroll offset past which this layer's section is fully above the
            // viewport — beyond it we stop writing (the layer is clipped away,
            // but the writes would still invalidate style/compositing every
            // frame for the rest of the page).
            max: Infinity,
            lastS: -1,
          };
        })
        .filter((l) => l.factor !== 0);
      const measure = () => {
        for (const l of layers) {
          const sec = l.el.closest("section");
          l.max = sec
            ? sec.getBoundingClientRect().bottom + window.scrollY
            : Infinity;
          l.lastS = -1;
        }
      };
      measure();
      let rafId = 0;
      const loop = () => {
        const s = window.scrollY;
        for (const l of layers) {
          const sEff = Math.min(s, l.max);
          if (sEff !== l.lastS) {
            l.lastS = sEff;
            l.el.style.transform = `translateY(${(sEff * l.factor).toFixed(1)}px)`;
          }
        }
        rafId = requestAnimationFrame(loop);
      };
      loop();
      window.addEventListener("resize", measure);
      removeScrollParallax = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", measure);
      };
    }

    // --- Ridge dim (WebKit fallback) ------------------------------------------
    // Chromium dims [data-dim] ridges via the scroll-timeline in globals.css.
    // Safari/iOS fall through here: brightness ramps 1 → 0.62 over the first
    // ~88vh of scroll, matching the CSS keyframe, so the nearer terrain darkens
    // as the sky falls to night. Same continuous-loop contract as the scroll
    // parallax above.
    let removeDim: (() => void) | undefined;
    const dimEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-dim]"),
    );
    if (!useScrollAnim && dimEls.length && smallView) {
      // Small screens: a scroll-driven `filter` re-rasterizes both big ridge
      // images every frame on the main thread — the single most expensive
      // per-frame write in the hero. Land on a fixed mid-ramp brightness once
      // instead; the bottom fade-to-black already sells the darkening there.
      for (const el of dimEls) el.style.filter = "brightness(0.75)";
      removeDim = () => {
        for (const el of dimEls) el.style.filter = "";
      };
    } else if (!useScrollAnim && dimEls.length) {
      let last = -1;
      let rafId = 0;
      const loop = () => {
        const s = window.scrollY;
        if (s !== last) {
          last = s;
          const p = Math.min(1, s / (window.innerHeight * 0.88));
          const b = (1 - p * 0.38).toFixed(3);
          for (const el of dimEls) el.style.filter = `brightness(${b})`;
        }
        rafId = requestAnimationFrame(loop);
      };
      // Viewport height feeds the ramp — force a recompute on resize.
      const onResize = () => {
        last = -1;
      };
      window.addEventListener("resize", onResize);
      loop();
      removeDim = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        for (const el of dimEls) el.style.filter = "";
      };
    }

    // --- Parallax -------------------------------------------------------------
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
    if (parallaxEls.length && supportsCompositorParallax) {
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
    } else if (parallaxEls.length) {
      // Fallback: main-thread rAF loop (same contract as the scroll-parallax
      // fallback above — scroll events lag iOS momentum scrolling). Cache each
      // element's document-space midpoint from layout (untransformed).
      const bases = parallaxEls.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          factor: parseFloat(el.dataset.parallax || "0"),
          docMid: r.top + window.scrollY + r.height / 2,
        };
      });
      let last = -1;
      let rafId = 0;
      const loop = () => {
        const s = window.scrollY;
        if (s !== last) {
          last = s;
          const viewMid = s + window.innerHeight / 2;
          for (const b of bases) {
            const y = Math.max(-44, Math.min(44, (viewMid - b.docMid) * b.factor));
            // 2D on purpose — see the scroll-parallax fallback above: 3D would
            // promote the card to a compositing layer WebKit may not paint on load.
            b.el.style.transform = `translateY(${y.toFixed(1)}px)`;
          }
        }
        rafId = requestAnimationFrame(loop);
      };
      const onResize = () => {
        last = -1;
      };
      window.addEventListener("resize", onResize);
      loop();
      removeParallax = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
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
