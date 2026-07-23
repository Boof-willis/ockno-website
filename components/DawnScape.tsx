"use client";

import { CSSProperties, useEffect, useRef } from "react";

/**
 * Closing "dawn" backdrop — the deliberate inverse of the hero's dusk, spanning
 * the whole closing zone (FAQ + CTA + footer). The hero opens on a warm horizon
 * and dissolves UP into black night; here the page ends by rising back OUT of the
 * dark: night sky behind the FAQ, the sun cresting the ridgeline over the CTA,
 * and the footer as the lit foreground.
 *
 * The rise is scroll-driven here (not the ±44px [data-parallax] clamp, which is
 * far too subtle across a scene this tall): a single rAF-throttled scroll handler
 * maps the zone's progress through the viewport to an upward translate on the sun
 * (it climbs as you scroll toward the footer) plus a gentle counter-drift on the
 * ridges for depth. Transform/opacity only, static under reduced motion — the
 * same iOS-safe contract as the rest of the codebase. Reuses the hero ridge art
 * (/scape/v2/*) and the `.star` twinkle; the sky is a gradient.
 */

/* The sky gradient (night overhead → warm twilight → a bright sunrise band at
   the ridgeline → darkening into the ground) lives in globals.css as .dawn-sky,
   where a max-width:768px query pushes its bright band down to follow the
   lowered mobile sun. Stops are keyed to the full FAQ+CTA+footer height. */

/* Deterministic star field over the night band (top ~44% — behind the FAQ), so
   SSR and client render byte-identical. A dense, bright field so the FAQ clearly
   reads as sitting under a starlit night sky. */
const STARS: Array<{ x: number; y: number; s: number; o: number; du: number; de: number }> = [
  { x: 4, y: 6, s: 2, o: 0.8, du: 3.6, de: 0.2 },
  { x: 9, y: 18, s: 1.5, o: 0.6, du: 4.2, de: 1.2 },
  { x: 14, y: 9, s: 2.5, o: 0.9, du: 3.9, de: 0.6 },
  { x: 18, y: 27, s: 1.5, o: 0.55, du: 4.6, de: 1.8 },
  { x: 23, y: 13, s: 2, o: 0.75, du: 3.2, de: 0.9 },
  { x: 28, y: 33, s: 1.5, o: 0.5, du: 4.4, de: 0.4 },
  { x: 32, y: 5, s: 3, o: 0.95, du: 3.7, de: 1.5 },
  { x: 37, y: 22, s: 1.5, o: 0.6, du: 4.8, de: 0.8 },
  { x: 42, y: 11, s: 2, o: 0.72, du: 3.9, de: 2.0 },
  { x: 46, y: 30, s: 1.5, o: 0.5, du: 4.1, de: 0.3 },
  { x: 50, y: 16, s: 2.5, o: 0.85, du: 3.5, de: 1.3 },
  { x: 54, y: 7, s: 2, o: 0.7, du: 3.8, de: 1.0 },
  { x: 58, y: 25, s: 1.5, o: 0.55, du: 4.3, de: 1.9 },
  { x: 62, y: 12, s: 2, o: 0.75, du: 3.4, de: 0.5 },
  { x: 66, y: 34, s: 1.5, o: 0.48, du: 4.7, de: 1.6 },
  { x: 70, y: 5, s: 3, o: 0.95, du: 3.6, de: 0.7 },
  { x: 74, y: 20, s: 1.5, o: 0.6, du: 4.5, de: 1.4 },
  { x: 78, y: 10, s: 2, o: 0.75, du: 3.9, de: 0.2 },
  { x: 82, y: 29, s: 1.5, o: 0.5, du: 4.2, de: 1.1 },
  { x: 86, y: 15, s: 2.5, o: 0.85, du: 3.3, de: 0.6 },
  { x: 89, y: 6, s: 2, o: 0.72, du: 3.8, de: 1.7 },
  { x: 92, y: 24, s: 1.5, o: 0.55, du: 4.6, de: 0.4 },
  { x: 96, y: 12, s: 2.5, o: 0.88, du: 3.5, de: 1.3 },
  { x: 98, y: 33, s: 1.5, o: 0.48, du: 4.4, de: 0.9 },
  { x: 11, y: 38, s: 1.5, o: 0.42, du: 4.0, de: 0.5 },
  { x: 25, y: 40, s: 1.5, o: 0.4, du: 4.3, de: 1.5 },
  { x: 44, y: 39, s: 1.5, o: 0.42, du: 3.7, de: 0.8 },
  { x: 63, y: 41, s: 1.5, o: 0.4, du: 4.5, de: 1.2 },
  { x: 80, y: 38, s: 1.5, o: 0.42, du: 3.9, de: 0.3 },
  { x: 94, y: 42, s: 1.5, o: 0.38, du: 4.2, de: 1.8 },
];

/* Later in the array = nearer = darker silhouette and higher z. `drift` is the
   px of scroll-driven parallax: POSITIVE lags (distant range sinks slower than
   the page), NEGATIVE leads (near foreground climbs faster). The spread between
   them is what reads as depth — large on purpose so the scroll feels parallaxy.

   `pivot` is the progress value at which a layer's drift resolves to 0 (its
   art sits exactly where `raise` puts it). 0.5 centres the motion, which is
   right for the ranges behind. The NEAR ridge is different: it's the ground
   plane that has to meet the bottom of the page, and it's read at p=1 (the
   zone's bottom aligns with the viewport bottom only when you're scrolled to
   the very end). A 0.5 pivot left it hanging half its drift — 55px — above the
   footer's bottom edge in that settled state, so it anchors at 1 instead. */
const RIDGES: {
  key: string;
  src: string;
  raise: string;
  brightness: number;
  drift: number;
  /** Progress at which this layer's drift resolves to 0. Defaults to 0.5. */
  pivot?: number;
}[] = [
  { key: "far", src: "/scape/v2/far.webp", raise: "11vh", brightness: 0.95, drift: 150 },
  { key: "mid", src: "/scape/v2/mid.webp", raise: "3vh", brightness: 0.68, drift: 55 },
  { key: "near", src: "/scape/v2/near.webp", raise: "-3vh", brightness: 0.4, drift: -110, pivot: 1 },
];

export default function DawnScape() {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);
  const ridgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Perf dial for phones: every write below repaints an unpromoted layer on
    // the main thread (no will-change here — see the render comments). The sun
    // is a ~1000px gradient circle, by far the biggest repaint surface for the
    // subtlest payoff, and the mid ridge is the least visible of the three —
    // both hold still on small screens. The far/near ridge counter-drift (the
    // actual depth read) is kept everywhere.
    const smallView = window.matchMedia("(max-width: 768px)").matches;
    const update = () => {
      const zone = zoneRef.current;
      if (!zone) return;
      const rect = zone.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Off-screen: no writes. Without this the clamped p keeps re-writing the
      // same styles for every scroll frame on the rest of the page.
      if (rect.bottom < 0 || rect.top > vh) return;
      // 0 as the zone's top reaches the viewport bottom, 1 once it has scrolled a
      // full zone-height past — i.e. as the footer comes into view.
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height || 1)));

      if (sunRef.current && !smallView) {
        // Starts low on the horizon and only begins to rise — a gentle climb, not
        // a full ascent. Visible scroll range (p≈0.5→1) lifts it ~60px.
        const rise = (0.5 - p) * 120;
        sunRef.current.style.transform = `translate(-50%, calc(-50% + ${rise.toFixed(1)}px))`;
        sunRef.current.style.opacity = (0.8 + p * 0.2).toFixed(3);
      }
      for (let i = 0; i < RIDGES.length; i++) {
        const el = ridgeRefs.current[i];
        if (!el || (smallView && i === 1)) continue; // mid ridge: static on phones
        const pivot = RIDGES[i].pivot ?? 0.5;
        el.style.transform = `translateY(${((p - pivot) * RIDGES[i].drift).toFixed(1)}px)`;
      }
    };

    // Continuous rAF loop rather than a scroll listener: iOS delivers scroll
    // events a frame behind the rendered position during momentum scrolling,
    // and this scene's large drifts make that lag visible. Reading scrollY
    // every frame and bailing when unchanged keeps the idle cost to a single
    // comparison. (Same contract as MotionInit's WebKit fallbacks.)
    let last = -1;
    let rafId = 0;
    const loop = () => {
      const s = window.scrollY;
      if (s !== last) {
        last = s;
        update();
      }
      rafId = requestAnimationFrame(loop);
    };
    const onResize = () => {
      last = -1; // viewport height feeds the progress math — recompute
    };
    window.addEventListener("resize", onResize);
    update();
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={zoneRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
    >
      {/* Sky — gradient lives in globals.css (.dawn-sky) so its sunrise band can
          be re-keyed on mobile to follow the lowered sun. */}
      <div className="dawn-sky absolute inset-0" />

      {/* Seam: a short blend from the card-dark section above into the black night
          sky, so the FAQ flows in with no line — and the rest of the FAQ stays
          solid black under the stars. */}
      <div
        className="absolute inset-x-0 top-0 h-[10vh]"
        style={{ background: "linear-gradient(to bottom, hsl(var(--background-card)), transparent)" }}
      />

      {/* Stars, masked to the night band so they vanish before the sunrise. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 44%, transparent 52%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 44%, transparent 52%)",
        }}
      >
        {STARS.map((st, i) => (
          <span
            key={i}
            className="star"
            style={
              {
                left: `${st.x}%`,
                top: `${st.y}%`,
                width: st.s,
                height: st.s,
                "--base": st.o,
                animationDuration: `${st.du}s`,
                animationDelay: `${st.de}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* The sun — a warm glow that climbs the sky as you scroll to the footer.
          JS owns its transform (centering + rise); the SSR/reduced-motion default
          is simply centered at its resting height. No will-change — it forces a
          compositing layer WebKit can leave unpainted until the first scroll
          (same trap HeroScape documents), which is exactly the iOS "footer scape
          doesn't show up" failure. */}
      <div
        ref={sunRef}
        // Three tiers, because the disc is min(128vw, 1040px): the narrower the
        // screen, the more of it that 1040px glow covers, so at the desktop
        // height it reads as midday haze over the CTA rather than a sunrise.
        // Phones 88%, tablets 84%, desktop 74% — each dropping the centre far
        // enough below the ridgeline that only the top of the glow crests it.
        // Breakpoints mirror the .dawn-sky ramps in globals.css, which move the
        // sky's bright band down in step (otherwise the sky stays lit where
        // there's no longer a sun).
        className="absolute left-1/2 top-[88%] md:top-[84%] lg:top-[74%] rounded-full"
        style={{
          transform: "translate(-50%, -50%)",
          width: "min(128vw, 1040px)",
          height: "min(128vw, 1040px)",
          background:
            "radial-gradient(circle, rgba(255,250,232,1) 0%, rgba(255,214,142,0.78) 11%, rgba(255,168,82,0.42) 24%, rgba(255,120,54,0.16) 40%, transparent 56%)",
        }}
      />

      {/* Ridges — bottom-anchored silhouettes, near-black in front, lighter in the
          distance. JS gives each a gentle counter-drift for depth as the sun rises. */}
      {RIDGES.map((r, i) => (
        <div
          key={r.key}
          ref={(el) => {
            ridgeRefs.current[i] = el;
          }}
          // No will-change here either — see the sun's comment above.
          className="ridge-layer absolute left-0 w-full"
          style={{ "--raise": r.raise, zIndex: i + 1 } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.src}
            alt=""
            width={2560}
            height={1429}
            draggable={false}
            className="relative left-1/2 -translate-x-1/2 w-full min-w-[1400px] max-w-none h-auto select-none"
            style={{ filter: `brightness(${r.brightness}) saturate(1.35)` }}
          />
        </div>
      ))}

      {/* Overall dim — knocks the whole scene back a touch. Sits above the ridges
          (z-5) so it dims them too; tune this single alpha to taste. */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(4,2,0,0.16)", zIndex: 5 }}
      />
    </div>
  );
}
