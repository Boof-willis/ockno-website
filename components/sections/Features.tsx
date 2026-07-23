"use client";

/* Core features — a tabbed product showcase. A framed Ockno app mock sits on a
   soft ambient backdrop; the tab bar (and the arrows) switch which surface it
   shows. Social proof is carried in the header stat and the "Results" tab.

   Tabs are useState-driven (clicks, not scroll) so they work regardless of the
   scroll engine. Own mocks + own gradient backdrop — no external assets. */

import { useState } from "react";
import Icon from "../ui/Icon";

type TabKey = "ads" | "pipeline" | "followup" | "results";

const TABS: {
  key: TabKey;
  label: string;
  icon: string;
  title: string;
  caption: string;
  /* When set, the tab shows a real product screenshot full-bleed in the app
     window (the screenshot carries its own app chrome). */
  image?: string;
}[] = [
  {
    key: "ads",
    label: "Ads",
    icon: "solar:megaphone-linear",
    title: "Ad campaigns",
    image: "/images/ads-manager.png",
    caption:
      "Launch and manage Google & Meta campaigns from one place — budgets, creatives, and bids handled for you.",
  },
  {
    key: "pipeline",
    label: "Pipelines",
    icon: "solar:diagram-up-linear",
    title: "Pipeline",
    image: "/images/pipelines.png",
    caption:
      "A drag-and-drop CRM that mirrors how you close — every lead tracked from the first click to a paid invoice.",
  },
  {
    key: "followup",
    label: "Follow-up",
    icon: "solar:workflow-linear",
    title: "Automations",
    image: "/images/automations.png",
    caption:
      "Email & SMS sequences that fire on real outcomes, not form fills — so no lead ever goes cold.",
  },
  {
    key: "results",
    label: "Results",
    icon: "solar:chart-2-linear",
    title: "Results",
    image: "/images/insights.png",
    caption:
      "Real revenue reported back to the ad platforms — so every week the ads find more buyers, not clicks.",
  },
];

/* Every tab is backed by a real product screenshot (full-bleed, carries its own
   app chrome), so there are no hand-built fallback views. VIEWS stays as the
   escape hatch if a future tab ships without a screenshot. */
const VIEWS: Partial<Record<TabKey, () => React.JSX.Element>> = {};

/* ---- The framed app mock ------------------------------------------------ */

function AppFrame({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  const tab = TABS[active];
  const View = VIEWS[tab.key];
  return (
    <div className="relative rounded-[26px] overflow-hidden border border-border p-4 sm:p-8 lg:p-12">
      {/* Ambient backdrop (own gradient mesh, not a photo) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, hsl(var(--primary) / 0.14), transparent 55%), radial-gradient(90% 80% at 85% 110%, hsl(24 55% 42% / 0.16), transparent 60%), hsl(var(--background-page))",
        }}
      />
      <div
        className="absolute inset-0 grid-bg opacity-[0.08] pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%, black, transparent 80%)",
        }}
      />

      {/* App window */}
      {tab.image ? (
        /* Real product screenshot — carries its own app chrome, so it fills
           the whole window full-bleed. */
        <div className="relative rounded-2xl border border-border shadow-elevated overflow-hidden bg-card">
          {/* Explicit intrinsic dimensions (all product shots are 1920×1080) —
              WebKit otherwise lays the img out at height 0 until a scroll. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tab.image}
            alt={`Ockno — ${tab.title}`}
            width={1920}
            height={1080}
            className="w-full h-auto block"
          />
        </div>
      ) : (
        <div className="relative rounded-2xl border border-border bg-card shadow-elevated overflow-hidden flex min-h-[420px]">
          {/* Sidebar (desktop) */}
          <div className="hidden md:flex w-52 shrink-0 border-r border-border bg-nested/40 flex-col">
            <div className="h-14 flex items-center px-4 border-b border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ockno-logo.svg" alt="Ockno" className="h-5 w-auto" />
            </div>
            <div className="flex-1 p-3 space-y-1">
              {TABS.map((t, i) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onSelect(i)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                    i === active
                      ? "bg-card border border-border text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon
                    icon={t.icon}
                    width={17}
                    className={i === active ? "text-primary" : ""}
                  />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-border flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-gradient-to-b from-primary/25 to-primary/[0.06] border border-primary/30 flex items-center justify-center text-[11px] font-semibold text-primary">
                A
              </span>
              <div className="leading-tight">
                <div className="text-[12px] text-foreground">Anderson Moving</div>
                <div className="text-[10px] text-muted-foreground">Owner</div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon icon={tab.icon} width={17} className="text-primary md:hidden" />
                {tab.title}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon icon="solar:magnifer-linear" width={17} />
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-h-0">{View ? <View /> : null}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Section ------------------------------------------------------------ */

export default function Features() {
  const [active, setActive] = useState(0);
  const move = (dir: number) =>
    setActive((a) => (a + dir + TABS.length) % TABS.length);

  return (
    <section id="features" className="py-24 md:py-32 bg-page border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-16 items-end mb-10 md:mb-12">
          <div data-reveal>
            <div className="eyebrow mb-5">Core features</div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-foreground">
              One platform that runs your whole funnel.
            </h2>
          </div>
          <div data-reveal={120} className="lg:pb-2">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              From ad click to closed deal — Ockno builds it, launches it, and
              reports the revenue back so the ads keep getting sharper.
            </p>
            <p className="text-sm text-muted-foreground/80">
              <span className="text-foreground font-medium">CPA $860 → $150</span>{" "}
              in a real moving-company campaign.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div
          data-reveal
          className="flex items-center gap-1.5 sm:gap-2 mb-5 overflow-x-auto rounded-full border border-border bg-nested/50 p-1.5"
        >
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                i === active
                  ? "bg-card border border-border text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Framed showcase */}
        <div data-reveal={120} data-reveal-from="scale">
          <AppFrame active={active} onSelect={setActive} />
        </div>

        {/* Footer: prev / caption / next */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous feature"
            onClick={() => move(-1)}
            className="w-12 h-12 shrink-0 rounded-full border border-white/10 bg-white/10 hover:bg-white/25 flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
          </button>
          <p className="flex-1 text-center text-sm text-muted-foreground text-balance">
            {TABS[active].caption}
          </p>
          <button
            type="button"
            aria-label="Next feature"
            onClick={() => move(1)}
            className="w-12 h-12 shrink-0 rounded-full border border-white/10 bg-white/10 hover:bg-white/25 flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon icon="solar:arrow-right-linear" width={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
