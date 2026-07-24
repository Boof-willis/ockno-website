"use client";

/* How it works — three zig-zag feature cards. Each card pairs a text column with
   an inset "visual panel"; the panel alternates sides down the page (right →
   left → right). No browser chrome — the visuals float on an ambient panel.

   Two scroll-linked touches, both iOS-safe (this codebase dropped
   backdrop-filter and raw scroll-transforms after a flicker history): the Brain
   frame sequence is scrubbed from card 1's scroll progress, and the connect
   ring rotates via --ring-rot on <html>. rAF-throttled, transform/opacity only,
   and both idle under reduced motion. The "glass" panels are faked with
   translucent fills + inner borders — no real blur. */

import { useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";
import OrbitingConnect from "../ui/orbiting-connect";

const STEPS = [
  {
    n: "01",
    eyebrow: "Onboarding",
    title: "Train Ockno on your business",
    body: "Answer a few questions or point it at your website. Ockno learns your offer, pricing, ideal customer, and voice — and remembers all of it.",
    tag: "Your Brain, trained on day one.",
    visual: "train" as const,
  },
  {
    n: "02",
    eyebrow: "Connections",
    title: "Connect your ad platforms",
    body: "Link Google and Meta in a couple of clicks. No pixels to wrestle, no integration spaghetti, no rebuild of what you already run.",
    tag: "Your whole stack, wired in minutes.",
    visual: "connect" as const,
  },
  {
    n: "03",
    eyebrow: "The payoff",
    title: "Watch Ockno improve your marketing",
    body: "It builds your funnels and follow-up, launches the ads, and feeds your real sales back — so every week it finds more buyers, not just clicks.",
    tag: "Cheaper customers, every single week.",
    visual: "watch" as const,
  },
];

const BUILDS = [
  { icon: "solar:clipboard-list-linear", label: "Forms" },
  { icon: "solar:global-linear", label: "Landing pages" },
  { icon: "solar:diagram-up-linear", label: "Pipelines" },
  { icon: "solar:calendar-linear", label: "Calendars" },
  { icon: "solar:palette-linear", label: "Brand & style guide" },
  { icon: "solar:bolt-linear", label: "Skills" },
  { icon: "solar:volume-loud-linear", label: "Ad campaigns" },
  { icon: "solar:magic-stick-3-linear", label: "Ad creatives" },
  { icon: "solar:routing-2-linear", label: "Automations" },
  { icon: "solar:chat-square-linear", label: "Email & SMS follow-up" },
  { icon: "solar:document-text-linear", label: "Documents" },
  { icon: "solar:file-check-linear", label: "Estimates & contracts" },
];

/* Brain frame sequence (single spark → full neural brain), scrubbed by scroll. */
const FRAME_COUNT = 56;
const FRAMES = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/train-seq/frame-${String(i + 1).padStart(3, "0")}.jpg`,
);

/* Ambient backdrop shared by the connect + watch panels: a warm top glow over a
   faint, masked grid. */
function PanelBg() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(110% 80% at 50% 0%, hsl(var(--primary) / 0.12), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 grid-bg opacity-[0.12] pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black, transparent 78%)",
        }}
      />
    </>
  );
}

/* Panel 1 — the Brain forming, full-bleed, scrubbed by scroll. */
function VisualTrain({ frame }: { frame: number }) {
  return (
    <div
      data-visual="train"
      className="relative w-full h-full h-full min-h-[300px] lg:min-h-0 rounded-2xl overflow-hidden bg-black flex items-center justify-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FRAMES[frame]}
        alt="Ockno building its knowledge of your business"
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ boxShadow: "inset 0 0 90px 24px rgba(0,0,0,0.55)" }}
      />
      <div className="absolute left-5 bottom-5 flex items-center gap-2 rounded-full border border-foreground/10 bg-card/70 px-3 py-1.5 text-[11px] font-mono text-foreground/85">
        <Icon icon="solar:brain-linear" className="text-primary" />
        Building your Brain…
      </div>
    </div>
  );
}

/* Panel 2 — the platforms Ockno wires into, orbiting the Ockno hub on two
   counter-rotating rings (components/ui/orbiting-connect). */
function VisualConnect() {
  return (
    <div className="relative w-full h-full h-full min-h-[300px] lg:min-h-0 rounded-2xl overflow-hidden bg-nested flex items-center justify-center">
      <PanelBg />

      <OrbitingConnect />

      {/* Floating status chip */}
      <div className="absolute left-5 bottom-5 flex items-center gap-2 rounded-full border border-foreground/10 bg-card/70 px-3 py-1.5 text-[11px] font-mono text-foreground/85">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        6 sources connected
      </div>
    </div>
  );
}

/* Panel 3 — the payoff, as a floating glass card: cost per customer falling. */
function VisualWatch() {
  return (
    <div
      data-visual="watch"
      className="relative w-full h-full h-full min-h-[300px] lg:min-h-0 rounded-2xl overflow-hidden bg-nested flex items-center justify-center p-6 sm:p-10"
    >
      <PanelBg />

      <div className="relative w-full max-w-[380px] rounded-2xl border border-foreground/10 bg-card/70 shadow-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Icon icon="solar:chart-2-linear" className="text-primary" />
            Cost per customer
          </div>
          <span className="text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded inline-flex items-center gap-1">
            <Icon icon="solar:arrow-down-linear" width={11} />
            83%
          </span>
        </div>

        <div className="relative h-32">
          <svg viewBox="0 0 300 140" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cpaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.24" />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill, revealed alongside the line by the same clip. */}
            <path
              data-cpa-fill
              d="M6,24 C70,34 90,74 150,80 C220,88 250,112 294,120 L294,140 L6,140 Z"
              fill="url(#cpaFill)"
            />
            {/* The falling cost line — drawn left→right (downward) on scroll.
                pathLength=1 normalizes the whole curved path to length 1 so the
                dash animation (offset 1→0) draws it fully. NOTE: no
                non-scaling-stroke here — it measures the dash in screen px while
                preserveAspectRatio="none" stretches the path, which makes the
                drawn line stop short of the end. */}
            <path
              data-cpa-line
              d="M6,24 C70,34 90,74 150,80 C220,88 250,112 294,120"
              pathLength={1}
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          {/* Dots pinned to the line's actual endpoints — the path runs (6,24) →
              (294,120) in a 300×140 stretched viewBox, i.e. 2%/17.1% → 98%/85.7%. */}
          <span
            className="absolute w-2 h-2 rounded-full bg-foreground/60 border border-card -translate-x-1/2 -translate-y-1/2"
            style={{ left: "2%", top: "17.1%" }}
          />
          <span
            data-cpa-dot
            className="absolute w-2.5 h-2.5 rounded-full bg-success border border-card -translate-x-1/2 -translate-y-1/2"
            style={{ left: "98%", top: "85.7%" }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono mt-3">
          <span className="text-muted-foreground">$860</span>
          <span className="hidden sm:inline text-muted-foreground/80">
            real sales → Google &amp; Meta
          </span>
          <span className="text-success">$150</span>
        </div>
      </div>
    </div>
  );
}

/* Where the stacked cards pin (clears the fixed nav). */
const PIN = 100;

export default function Build() {
  const [frame, setFrame] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Preload the Brain frames so scrubbing never hits the network.
  useEffect(() => {
    FRAMES.forEach((src) => {
      const im = new window.Image();
      im.src = src;
    });
  }, []);

  // Scroll-linked visuals: Brain frame (from card 1's transit) + ring rotation.
  // rAF-throttled, transform/opacity only; idle under reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(FRAME_COUNT - 1);
      return;
    }
    let ticking = false;
    let lastFrame = -1;
    // Card 3's falling-cost line, drawn on scroll (cached on first tick).
    let cpaLine: SVGPathElement | null = null;
    let cpaFill: SVGPathElement | null = null;
    let cpaDot: HTMLElement | null = null;
    // The visual panels themselves — the scrub driver on stacked layouts.
    let trainVisual: HTMLElement | null = null;
    let watchVisual: HTMLElement | null = null;
    // The section rect gates the whole pass: this handler is wired to window
    // scroll, so without it every card/visual rect below gets measured on every
    // frame of the ENTIRE page. (The old `--ring-rot` root write that lived
    // here is gone — nothing consumed it anymore, and a per-frame custom
    // property on <html> invalidates style page-wide.)
    const section = document.getElementById("build");
    const update = () => {
      ticking = false;
      const vhGate = window.innerHeight;
      if (section) {
        const sr = section.getBoundingClientRect();
        // 20% margin so states settle just off-screen rather than mid-glance.
        if (sr.bottom < -vhGate * 0.2 || sr.top > vhGate * 1.2) return;
      }
      // Below lg the cards stack text-above-visual into a tall column, so a
      // card's top rect is a bad proxy for whether its VISUAL is on screen —
      // the two scrubs below switch to the visual's own rect there.
      const desktop = window.matchMedia("(min-width: 1024px)").matches;

      // Card 3 — the "cost per customer" line draws left→right (downward) as the
      // card rises to its pin. dashoffset length→0 reveals the falling line; the
      // area fill and end-dot come in with it.
      const c3 = cardRefs.current[2];
      if (c3) {
        if (!cpaLine) {
          cpaLine = c3.querySelector<SVGPathElement>("[data-cpa-line]");
          cpaFill = c3.querySelector<SVGPathElement>("[data-cpa-fill]");
          cpaDot = c3.querySelector<HTMLElement>("[data-cpa-dot]");
          // pathLength=1 → dash math is normalized to the whole path.
          if (cpaLine) cpaLine.style.strokeDasharray = "1";
        }
        if (cpaLine) {
          const vh = window.innerHeight;
          // Desktop: the 480px sticky card rises as one unit, so its own rect
          // is the right driver — the line completes just before the card pins.
          // Stacked (mobile): the graph sits at the BOTTOM of a tall card and
          // only enters the frame long after the card top does, which left the
          // line ~fully drawn before it was ever visible. Drive off the
          // visual's own rect instead: it starts as the panel crosses the
          // viewport bottom and completes with the graph mid-frame.
          const drv = desktop
            ? c3.getBoundingClientRect()
            : (
                watchVisual ??
                (watchVisual =
                  c3.querySelector<HTMLElement>('[data-visual="watch"]')) ??
                c3
              ).getBoundingClientRect();
          const prog = Math.min(
            1,
            Math.max(0, (vh * 0.95 - drv.top) / (vh * (desktop ? 0.8 : 0.55))),
          );
          cpaLine.style.strokeDashoffset = `${(1 - prog).toFixed(4)}`;
          if (cpaFill) cpaFill.style.opacity = `${Math.max(0, (prog - 0.15) / 0.85).toFixed(3)}`;
          if (cpaDot) cpaDot.style.opacity = prog > 0.94 ? "1" : "0";
        }
      }

      // Brain frame: builds as card 1 rises to its pin, then plays its last few
      // frames a short way into the card's fade — so the animation *finishes*
      // just after the fade begins rather than freezing incomplete before it.
      const el = cardRefs.current[0];
      if (el) {
        const vh = window.innerHeight;
        const LAST = FRAME_COUNT - 1;
        let idx: number;
        if (desktop) {
          const r = el.getBoundingClientRect();
          const TAIL = 4; // last frames reserved to complete during the fade
          // 0 as the card sits low → 1 exactly as it reaches the pin.
          const rise = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.8 - PIN)));
          // How far card 2 has risen over card 1 (its fade progress).
          let cover = 0;
          const next = cardRefs.current[1];
          const h = r.height;
          if (next && h) {
            cover = Math.min(
              1,
              Math.max(0, (PIN + h - next.getBoundingClientRect().top) / h),
            );
          }
          // Build to (LAST - TAIL) on the rise; the last TAIL frames fill in
          // over the first quarter of the fade, so it lands full a few frames in.
          idx = Math.round(
            Math.min(LAST, rise * (LAST - TAIL) + Math.min(1, cover / 0.25) * TAIL),
          );
        } else {
          // Stacked (mobile): same trap as the CPA line — the Brain panel sits
          // at the bottom of a tall card, so card-top math finishes the build
          // before the panel is on screen. Scrub off the visual's own rect:
          // first frame once its top clears ~88% of the viewport, final frame
          // when it reaches ~18% — a 0.7vh runway, so the build unfolds slowly
          // across the middle of the screen instead of racing to done.
          const vr = (
            trainVisual ??
            (trainVisual =
              el.querySelector<HTMLElement>('[data-visual="train"]')) ??
            el
          ).getBoundingClientRect();
          const prog = Math.min(1, Math.max(0, (vh * 0.88 - vr.top) / (vh * 0.7)));
          idx = Math.round(prog * LAST);
        }
        if (idx !== lastFrame) {
          lastFrame = idx;
          setFrame(idx);
        }
      }

      // Sticky-stack recede (desktop only): as the next card rises to cover this
      // one, this card scales down and dims behind it. Inline styles are cleared
      // when uncovered so the entrance reveal still governs.
      const cards = cardRefs.current;
      for (let i = 0; i < cards.length; i++) {
        const outer = cards[i];
        const inner = outer?.firstElementChild as HTMLElement | null;
        if (!inner) continue;
        const next = cards[i + 1];
        if (!desktop || !next) {
          inner.style.transform = "";
          inner.style.opacity = "";
          continue;
        }
        const h = outer!.getBoundingClientRect().height;
        const nextTop = next.getBoundingClientRect().top;
        const cover = Math.min(1, Math.max(0, (PIN + h - nextTop) / h));
        // As the next card rises to replace this one, this card shrinks and
        // fades — fully gone (opacity 0) a touch before the next card lands at
        // its sticky position, so the previous card is never visible under it.
        if (cover > 0.001) {
          inner.style.transform = `scale(${(1 - cover * 0.1).toFixed(3)})`;
          inner.style.opacity = Math.max(0, 1 - cover * 1.18).toFixed(3);
        } else {
          inner.style.transform = "";
          inner.style.opacity = "";
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Re-run on resize so the desktop-only recede transforms are recomputed (and
    // cleared below the lg breakpoint) instead of leaving stale inline styles.
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="build" className="py-28 md:py-36 bg-page border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-16" data-reveal>
          <div className="eyebrow mb-5">How it works</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-5">
            Three steps to a marketing team that runs itself.
          </h2>
          <p className="text-muted-foreground text-lg">
            No setup marathon, no integration spaghetti. Train it, connect it,
            and let it run.
          </p>
        </div>

        {/* Zig-zag cards, stacked: each pins at PIN and the next slides over it. */}
        <div className="space-y-6 lg:space-y-0">
          {STEPS.map((s, i) => {
            const imageRight = i % 2 === 0;
            return (
              <div
                key={s.n}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="lg:sticky lg:pb-12"
                style={{ top: `${PIN}px` }}
              >
                <div
                  data-reveal
                  data-reveal-from="scale"
                  className="stack-card overflow-hidden lg:h-[480px]"
                >
                <div className="grid lg:grid-cols-2 items-stretch h-full">
                  {/* Text */}
                  <div
                    className={
                      "p-8 sm:p-11 lg:p-12 flex flex-col justify-center order-1 " +
                      (imageRight ? "lg:order-1" : "lg:order-2")
                    }
                  >
                    <div className="eyebrow mb-6">{s.eyebrow}</div>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance text-foreground mb-5">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-[46ch]">
                      {s.body}
                    </p>
                    <div className="mt-8 flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon
                        icon="solar:check-circle-linear"
                        width={18}
                        className="text-primary shrink-0"
                      />
                      <span>{s.tag}</span>
                    </div>
                  </div>

                  {/* Visual */}
                  <div
                    className={
                      "p-3 lg:p-4 order-2 " +
                      (imageRight ? "lg:order-2" : "lg:order-1")
                    }
                  >
                    {s.visual === "train" && <VisualTrain frame={frame} />}
                    {s.visual === "connect" && <VisualConnect />}
                    {s.visual === "watch" && <VisualWatch />}
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What it builds, once it's running. */}
        <div className="mt-16 lg:mt-20" data-reveal>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
            What it builds for you
          </p>
          <div
            className="relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="flex w-max gap-3 animate-marquee">
              {[...BUILDS, ...BUILDS].map((b, i) => (
                <div
                  key={`${b.label}-${i}`}
                  className="flex items-center gap-3 rounded-full border border-border bg-nested px-5 py-2.5 whitespace-nowrap"
                >
                  <Icon icon={b.icon} width={18} className="text-primary shrink-0" />
                  <span className="text-sm text-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
