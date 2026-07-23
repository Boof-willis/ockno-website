/**
 * Layered depth backdrop: a dusk gradient with three ridge layers parallaxing at
 * different rates. Ridge art (owned) lives under /public/scape/v2/*.webp.
 *
 * translateY = scrollY * factor, POSITIVE, applied by MotionInit via
 * [data-parallax-scroll]. Because it's positive it partially cancels the page's
 * upward scroll: on screen a layer rises by scrollY * (1 - factor). So a HIGHER
 * factor moves SLOWER and reads as FARTHER:
 *
 *   far  → 0.31  rises at 69% of page speed — most distant
 *   mid  → 0.17  rises at 83%
 *   near → 0     rises at page speed — glued to the page, nearest
 *
 * Factor 0 is the foreground, not the background.
 *
 * The scape is split into two halves because the hero content sits between them:
 *
 *   HeroScapeBack   z-0   gradient + far + mid
 *   hero content    z-10  copy, CTAs, dashboard mock
 *   HeroScapeFront  z-20  near ridge — occludes the mock as it scrolls past
 *
 * They can't be one component: `z-10` on the content wrapper opens a stacking
 * context, so a child of a `z-0` sibling can never paint above the mock no
 * matter how high its z-index climbs. The near ridge has to be a sibling that
 * comes after.
 *
 * All layers are bottom-anchored and sized by natural aspect: the distant range
 * is tallest (it rises highest in frame), the near ridge is a thin band.
 *
 * The parallax wrapper owns translateY; the <img> owns its own centering
 * transform. Keep them on separate elements or the two will overwrite each other.
 */

import type { CSSProperties } from "react";

type Layer = {
  key: string;
  src: string;
  factor: number;
  /** Lift the layer's resting (scroll-0) position off the bottom edge, so its
   *  ridge clears the layers in front. Any CSS length; defaults to 0. */
  raise?: string;
  /** Dim this layer as the page scrolls (via filter: brightness). The closer
   *  terrain loses light as the sky falls to night. */
  dim?: boolean;
};

type Star = {
  top: number;
  left: number;
  size: number;
  base: number;
  delay: number;
  dur: number;
};

/**
 * Star field, generated once at module load from a seeded PRNG so the server and
 * client render byte-identical markup (Math.random() would drift and trip
 * hydration). Stars are distributed across the BLACK region of the tall sky
 * layer (its top ~half); `top` is a percentage of that 300vh layer, so most
 * stars sit above the viewport at rest and descend into view as the black grows.
 */
const STARS: Star[] = (() => {
  let s = 0x9e3779b9;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 120 }, () => ({
    top: 2 + rand() * 47, // % of the 300vh sky layer — the black region
    left: rand() * 100,
    size: 1 + rand() * 1.6, // px
    base: 0.55 + rand() * 0.45, // resting opacity — crystal clear over black
    delay: rand() * 5, // s — desync the twinkle
    dur: 2.6 + rand() * 3, // s
  }));
})();

/** How fast the sky descends. >1 means it drifts DOWN relative to the viewport as
 *  the page scrolls, so the orange band recedes and black grows from the top. */
const SKY_FACTOR = 1.5;

/* Black overhead → orange low. Read over the 300vh layer; at rest the viewport is
   the middle third (33–67%), which lands the black/orange split near its centre —
   ~50% black on top, ~50% orange below. Above 50% stays black so the descent
   fills black; below 67% stays bright orange (off-screen at rest). */
const SKY_GRADIENT =
  "linear-gradient(to bottom, rgb(6,5,5) 0%, rgb(8,6,5) 46%, rgb(35,20,12) 50%, rgb(122,69,39) 56%, rgb(221,134,64) 61%, rgb(255,178,94) 66.5%, rgb(255,184,106) 100%)";

/* Stars read only over black: clear through the black region, gone by the orange
   band. Static within the layer, so it descends with everything else. */
const STAR_MASK =
  "linear-gradient(to bottom, black 0%, black 47%, transparent 53%)";

/**
 * Twinkling stars, sitting inside the tall sky layer (so they descend with it as
 * the black grows). Absolutely filling the 300vh layer; the mask keeps them over
 * black and fades them out toward the orange band.
 */
function StarField() {
  return (
    <div
      aria-hidden
      className="starfield absolute inset-0 pointer-events-none"
      style={{
        maskImage: STAR_MASK,
        WebkitMaskImage: STAR_MASK,
      }}
    >
      {STARS.map((st, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              top: `${st.top}%`,
              left: `${st.left}%`,
              width: `${st.size}px`,
              height: `${st.size}px`,
              "--base": st.base,
              animationDelay: `${st.delay}s`,
              animationDuration: `${st.dur}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Shooting stars, authored (not random) so SSR/client match. Positions live in
 * the same coordinate space as the twinkle field — `top` is a % of the 300vh
 * sky layer, kept inside the visible black band (~33–42%) so they streak in view
 * at rest. `--ang` = atan2(sy, sx) so the tail trails the head's travel. The
 * staggered dur/delay pairs land a streak roughly every 5–10s without ever
 * marching in lockstep.
 */
const SHOOTING = [
  // Right-side starts streak left; left-side starts streak right. Either way
  // the head travels INTO the sky, never straight off the nearest edge.
  { top: 34, left: 66, len: 130, ang: -20, sx: -300, sy: 109, dur: 26, delay: 1, rev: true },
  { top: 39, left: 12, len: 95, ang: 24, sx: 250, sy: 111, dur: 29, delay: 7, rev: false },
  { top: 31, left: 78, len: 150, ang: -18, sx: -340, sy: 110, dur: 33, delay: 14, rev: true },
  { top: 37, left: 34, len: 105, ang: 22, sx: 270, sy: 109, dur: 37, delay: 21, rev: false },
];

function ShootingStars() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ maskImage: STAR_MASK, WebkitMaskImage: STAR_MASK }}
    >
      {SHOOTING.map((s, i) => (
        <span
          key={i}
          className={`shooting-star${s.rev ? " rev" : ""}`}
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              "--len": `${s.len}px`,
              "--ang": `${s.ang}deg`,
              "--sx": `${s.sx}px`,
              "--sy": `${s.sy}px`,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const BACK: Layer[] = [
  { key: "far", src: "/scape/v2/far.webp", factor: 0.5, raise: "16vh" },
  { key: "mid", src: "/scape/v2/mid.webp", factor: 0.187, dim: true },
];

const FRONT: Layer[] = [
  { key: "near", src: "/scape/v2/near.webp", factor: 0, dim: true },
];

function Ridges({ layers }: { layers: Layer[] }) {
  return (
    <>
      {layers.map(({ key, src, factor, raise, dim }, i) => (
        <div
          key={key}
          data-parallax-scroll={factor}
          className="ridge-layer absolute left-0 w-full"
          // Explicit z per layer (later in the array = nearer = higher) so the
          // stacking order can't be reordered by the compositor.
          //
          // No will-change here on purpose. It forces each layer onto its own
          // compositing layer, and Safari then (a) can paint a back layer over a
          // nearer one and (b) defers painting the layer at all until the first
          // scroll — so the whole scape "pops in" only once you scroll. The
          // scroll-driven animation still composites the transform on its own,
          // so smoothness doesn't depend on will-change.
          //
          // `bottom` comes from --raise (see .ridge-layer in globals.css), which
          // is scaled down on mobile so the layers sit closer together.
          style={
            {
              "--pfactor": factor,
              "--raise": raise ?? "0px",
              zIndex: i + 1,
            } as CSSProperties
          }
        >
          <img
            src={src}
            alt=""
            aria-hidden
            draggable={false}
            data-dim={dim ? "" : undefined}
            // Explicit intrinsic dimensions (all v2 layers are 2560×1429).
            // Safari lays the img out before the file is decoded; without these
            // attributes `h-auto` resolves to 0 at first layout, the whole
            // scape sits 0px tall below the fold, and it only appears when a
            // scroll forces relayout. The attributes give layout the aspect
            // ratio up front, independent of decode timing.
            width={2560}
            height={1429}
            className="relative left-1/2 -translate-x-1/2 w-full min-w-[1400px] max-w-none h-auto select-none"
          />
        </div>
      ))}
    </>
  );
}

/** Sky + stars + the two distant ranges. Renders behind the hero content. */
export function HeroScapeBack() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden z-0">
      {/* Sky + stars as one tall layer (300vh, extending far above and below the
          viewport; the overflow-hidden parent clips it). It carries
          data-parallax-scroll with a factor > 1, so as the page scrolls it drifts
          DOWN relative to the viewport: the orange band slides off the bottom and
          the black grows from the top — "losing elevation". The stars ride along,
          so more come into view as the black region expands. Same parallax engine
          as the ridges (CSS scroll-timeline on Chromium, JS on Safari). */}
      <div
        data-parallax-scroll={SKY_FACTOR}
        className="absolute left-0 right-0"
        style={
          {
            "--pfactor": SKY_FACTOR,
            top: "-100vh",
            height: "300vh",
          } as CSSProperties
        }
      >
        <div className="absolute inset-0" style={{ background: SKY_GRADIENT }} />
        <StarField />
        <ShootingStars />
      </div>
      <Ridges layers={BACK} />
    </div>
  );
}

/**
 * The near ridge. Renders after the hero content so it occludes the dashboard
 * mock. pointer-events-none — it overlaps the mock and the CTAs sit near it, so
 * it must never eat a click.
 */
export function HeroScapeFront() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden z-20 pointer-events-none"
    >
      <Ridges layers={FRONT} />
    </div>
  );
}
