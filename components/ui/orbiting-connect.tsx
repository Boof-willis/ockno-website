"use client";

/* Orbiting integration ring — the platforms Ockno wires into circle the Ockno
   hub on two counter-rotating orbits. Adapted from a generic "orbiting skills"
   pattern to this site's warm, monochrome-with-amber palette and real logos.

   Motion is driven by a single rAF that writes `transform` straight to each
   node's ref — no per-frame React re-render. Transform/opacity only, paused on
   hover, and fully static under prefers-reduced-motion (same iOS-safe contract
   as the rest of the codebase; no backdrop-filter). */

import React, { memo, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Ring = "inner" | "outer";

interface OrbitItem {
  id: string;
  ring: Ring;
  phase: number; // initial angle (radians)
  size: number; // px
  label: string;
  icon?: string; // iconify name
  img?: string; // image src (for logos iconify lacks)
}

/* radius in px, speed in rad/sec (sign = direction), scroll in rad/px (scroll
   also turns the rings). The two rings turn opposite ways so the field reads as
   depth; the radii are spaced so an inner and outer node never collide even when
   radially aligned (gap ≈ 18px of clearance between the tiles). */
const RINGS: Record<Ring, { radius: number; speed: number; scroll: number }> = {
  inner: { radius: 62, speed: 0.2, scroll: 0.0026 },
  outer: { radius: 120, speed: -0.13, scroll: -0.0026 },
};

const ITEMS: OrbitItem[] = [
  { id: "google-ads", ring: "inner", phase: 0, size: 38, label: "Google Ads", icon: "logos:google-ads" },
  { id: "meta", ring: "inner", phase: (2 * Math.PI) / 3, size: 38, label: "Meta", icon: "logos:meta-icon" },
  { id: "stripe", ring: "inner", phase: (4 * Math.PI) / 3, size: 38, label: "Stripe", icon: "logos:stripe" },
  { id: "highlevel", ring: "outer", phase: Math.PI / 6, size: 42, label: "HighLevel", img: "/images/logos/highlevel.svg" },
  { id: "zapier", ring: "outer", phase: Math.PI / 6 + (2 * Math.PI) / 3, size: 42, label: "Zapier", icon: "logos:zapier-icon" },
  { id: "gcal", ring: "outer", phase: Math.PI / 6 + (4 * Math.PI) / 3, size: 42, label: "Calendar", icon: "logos:google-calendar" },
];

/* The Ockno mark (symbol only), lifted from /images/ockno-logo.svg. */
function OcknoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 104 108" className={className} fill="currentColor" aria-hidden>
      <path d="M89.48,52a37.48,37.48,0,0,1-18.8,32.51,36.61,36.61,0,0,1-6.23,2.86c-1.54.46-2.9.77-4.1,1.2a8.49,8.49,0,0,0-1.88.87,11.3,11.3,0,0,0-3.24,3.05c.05-.83.15-1.92.34-3.15.53-3.55,1.7-8.29,3.94-11.62a26.48,26.48,0,0,1,5.93-5.89l.17-.14a9.08,9.08,0,0,0,.89-.64,23.95,23.95,0,1,0-29,0,10.33,10.33,0,0,0,.88.64l.18.14a26.48,26.48,0,0,1,5.93,5.89c2.23,3.33,3.41,8.07,3.94,11.62.18,1.23.29,2.32.34,3.15a11.39,11.39,0,0,0-3.25-3.05,8.21,8.21,0,0,0-1.87-.87c-1.2-.43-2.57-.74-4.1-1.2a36.61,36.61,0,0,1-6.23-2.86A37.5,37.5,0,1,1,89.48,52Z" />
    </svg>
  );
}

/* Glowing orbit path — soft ring in the theme's tones (warm off-white inner,
   warm amber outer) instead of the source's cyan/purple. */
const OrbitPath = memo(function OrbitPath({
  radius,
  tone,
}: {
  radius: number;
  tone: "primary" | "amber";
}) {
  const c =
    tone === "amber"
      ? { border: "hsl(28 85% 58% / 0.24)", glow: "hsl(28 85% 58% / 0.10)" }
      : { border: "hsl(var(--primary) / 0.22)", glow: "hsl(var(--primary) / 0.10)" };
  return (
    <div
      aria-hidden
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 44px ${c.glow}, inset 0 0 34px ${c.glow}`,
      }}
    />
  );
});

const OrbitNode = memo(function OrbitNode({
  item,
  setRef,
}: {
  item: OrbitItem;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const [hover, setHover] = useState(false);
  const glyph = Math.round(item.size * 0.56);
  return (
    <div
      ref={setRef}
      className="absolute top-1/2 left-1/2 will-change-transform"
      style={{ width: item.size, height: item.size, zIndex: hover ? 20 : 10 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`relative w-full h-full rounded-2xl bg-card border border-border flex items-center justify-center transition-transform duration-300 ${
          hover ? "scale-125 shadow-elevated" : "shadow-card"
        }`}
      >
        {item.img ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.img}
            alt=""
            width={glyph}
            height={glyph}
            style={{ width: glyph, height: glyph }}
            className="object-contain"
          />
        ) : (
          <Icon icon={item.icon!} width={glyph} />
        )}
        {hover && (
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md border border-border bg-nested text-[10px] font-mono text-foreground whitespace-nowrap pointer-events-none">
            {item.label}
          </span>
        )}
      </div>
    </div>
  );
});

export default function OrbitingConnect() {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(false);

  useEffect(() => {
    // Each ring's angle = auto-orbit (time) + scroll-driven turn (scrollY). The
    // scroll term is what ties the motion to the page: as you scroll past the
    // section the rings wind in opposite directions, on top of the idle drift.
    const place = (t: number, scroll: number) => {
      for (let i = 0; i < ITEMS.length; i++) {
        const el = nodeRefs.current[i];
        if (!el) continue;
        const ring = RINGS[ITEMS[i].ring];
        const a = t * ring.speed + ITEMS[i].phase + scroll * ring.scroll;
        const x = Math.cos(a) * ring.radius;
        const y = Math.sin(a) * ring.radius;
        el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
      }
    };

    // Static layout under reduced motion — place once, no loop, no scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(0, 0);
      return;
    }

    let raf = 0;
    let last = performance.now();
    let t = 0;
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) t += dt;
      place(t, window.scrollY);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative w-[288px] h-[288px] max-w-full flex items-center justify-center"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <OrbitPath radius={RINGS.inner.radius} tone="primary" />
      <OrbitPath radius={RINGS.outer.radius} tone="amber" />

      {/* Center hub — Ockno, the thing everything wires into. */}
      <div className="relative z-10">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full blur-md"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)" }}
        />
        <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-elevated flex items-center justify-center">
          <OcknoMark className="w-8 h-8 text-foreground" />
        </div>
      </div>

      {ITEMS.map((item, i) => (
        <OrbitNode
          key={item.id}
          item={item}
          setRef={(el) => {
            nodeRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
