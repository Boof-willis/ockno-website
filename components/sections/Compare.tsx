import { Fragment } from "react";
import Icon from "../ui/Icon";
import { signupUrl } from "@/lib/links";
import MidnightScape from "../MidnightScape";

const ROWS = [
  {
    label: "Monthly cost",
    agency: "$3,000–$8,000 retainer, plus a cut of your ad spend",
    ockno: "A fraction of the price — and no retainer",
  },
  {
    label: "Hours",
    agency: "9-to-5, and slow to reply",
    ockno: "24/7 — a team that never clocks out",
  },
  {
    label: "Who does your work",
    agency: "One junior account manager juggling 20 other clients",
    ockno: "A dedicated AI team focused on your business alone",
  },
  {
    label: "What you actually get",
    agency: "Pretty reports and a pile of “leads”",
    ockno: "Real customers, and ads that get sharper every week",
  },
  {
    label: "Speed to change",
    agency: "Days or weeks, over email",
    ockno: "Instant — approve it and it’s live",
  },
  {
    label: "Getting started",
    agency: "Onboarding calls, delays, and setup fees",
    ockno: "Onboard in minutes; the AI builds it for you",
  },
  {
    label: "Lock-in",
    agency: "Long contracts you can’t escape",
    ockno: "No contract — cancel anytime",
  },
];

export default function Compare() {
  return (
    <section id="compare" className="midnight-section relative bg-black pb-20 md:pb-28">
      {/* Opening shot: the valley at midnight, dissolving into black. The
          content below is offset by the band's own height so the heading sits
          in its lower fade (--midnight-h, globals.css). */}
      <MidnightScape />

      <div className="midnight-offset relative max-w-[1440px] mx-auto px-6">
        {/* The receipt — agency vs Ockno, line by line. Centred, unlike the
            left-set headers around it: this is the page's centrepiece, the
            footnote and CTA below are already centred, and it breaks up a run
            of five identically-composed section openings. */}
        <div className="max-w-2xl mx-auto text-center mb-12" data-reveal>
          <div className="eyebrow justify-center mb-5">The honest comparison</div>
          <h2 className="text-xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-5">
            Your agency vs. Ockno.
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything the best agencies do for their clients — and what the
            average one only promises — without the retainer, the wait, or the
            contract.
          </p>
        </div>

        {/* A real comparison table, built as a CSS grid (not a <table>). From
            md up it's three columns: row label, agency, Ockno. Below md three
            readable columns don't fit, so each row's label becomes a
            full-width strip above the two answers, which stay side by side.
            Nothing scrolls sideways at any width — the old horizontal-scroll
            version left the Ockno column off-screen on phones, so a visitor saw
            the agency's side of the argument and never ours.

            Fills step up left to right — labels on page, agency on card, Ockno
            on nested with its header one step brighter again — so the eye
            lands on the Ockno column by brightness. The one touch of hue is a
            sunrise-orange rule along the top of the Ockno header, the same
            accent as the CTAs, so the winning column is marked. Opaque tokens
            rather than tints, so the table reads the same on any section fill. */}
        <div
          data-reveal={120}
          data-reveal-from="scale"
          className="grid grid-cols-2 md:grid-cols-[28%_1fr_1fr] rounded-card border border-border overflow-hidden"
        >
          {/* Header row */}
          <div className="hidden md:block bg-page border-r border-b border-border" />
          <div className="bg-card border-r border-b border-border px-3.5 py-3 md:px-5 md:py-4 text-center">
            <span className="text-xs md:text-sm font-semibold text-muted-foreground">
              Your agency
            </span>
          </div>
          <div className="bg-accent shadow-[inset_0_2px_0_0_hsl(var(--primary)/0.75)] border-b border-border px-3.5 py-3 md:px-5 md:py-4 flex items-center justify-center">
            {/* Wordmark — the logo already reads "Ockno", so no text label. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ockno-logo.svg" alt="Ockno" className="h-4 md:h-[18px] w-auto" />
          </div>

          {/* Body rows */}
          {ROWS.map((row, i) => {
            const last = i === ROWS.length - 1;
            return (
              <Fragment key={row.label}>
                {/* The label strip on phones has no rule under it — the fill
                    change is enough to group it with the answers below. */}
                <div
                  className={`col-span-2 md:col-span-1 bg-page md:border-r border-border px-3.5 pt-4 pb-2.5 md:px-5 md:py-4 flex items-center${last ? "" : " md:border-b"}`}
                >
                  <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </span>
                </div>
                <div
                  className={`bg-card border-r border-border px-3.5 py-3.5 md:px-5 md:py-4 flex items-start gap-2 md:gap-2.5${last ? "" : " border-b"}`}
                >
                  <Icon
                    icon="solar:close-circle-linear"
                    width={16}
                    className="text-muted-foreground/70 shrink-0 mt-0.5"
                  />
                  <span className="text-[13px] md:text-sm text-muted-foreground">{row.agency}</span>
                </div>
                <div
                  className={`bg-nested border-border px-3.5 py-3.5 md:px-5 md:py-4 flex items-start gap-2 md:gap-2.5${last ? "" : " border-b"}`}
                >
                  <Icon
                    icon="solar:check-circle-bold"
                    width={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <span className="text-[13px] md:text-sm text-foreground">{row.ockno}</span>
                </div>
              </Fragment>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Agency figures reflect typical retainer-based pricing. Your results
          depend on your market, offer, and volume.
        </p>

        <div data-reveal className="text-center mt-10">
          <a href={signupUrl()} className="btn-lift btn-pill btn-pill-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page">
            Start free
          </a>
        </div>
      </div>
    </section>
  );
}
