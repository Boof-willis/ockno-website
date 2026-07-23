import Icon from "../ui/Icon";

const APP_URL = "https://app.ockno.com";

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
    <section id="compare" className="py-28 md:py-36 bg-card border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* The receipt — agency vs Ockno, line by line. */}
        <div className="max-w-2xl mb-12" data-reveal>
          <div className="eyebrow mb-5">The honest comparison</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-5">
            Your agency vs. Ockno.
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything the best agencies do for their clients — and what the
            average one only promises — without the retainer, the wait, or the
            contract.
          </p>
        </div>

        <div
          data-reveal={120}
          data-reveal-from="scale"
          className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr_1.1fr] gap-px rounded-card overflow-hidden border border-border bg-border"
        >
          <div className="hidden md:block bg-page" />
          <div className="bg-nested px-6 py-4 text-center">
            <span className="text-sm font-semibold text-muted-foreground">
              Your agency
            </span>
          </div>
          <div className="bg-primary/10 px-6 py-4 text-center border-b-2 border-primary md:border-b-0">
            <span className="text-sm font-semibold text-primary inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ockno-logo.svg" alt="" className="h-4 w-auto" />
              Ockno
            </span>
          </div>

          {ROWS.map((row) => (
            <div key={row.label} className="contents">
              <div className="bg-page px-6 py-4 flex items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </span>
              </div>
              <div className="bg-nested px-6 py-4 flex items-start gap-2.5">
                <Icon
                  icon="solar:close-circle-linear"
                  width={18}
                  className="text-muted-foreground/70 shrink-0 mt-0.5"
                />
                <span className="text-sm text-muted-foreground">{row.agency}</span>
              </div>
              <div className="bg-primary/[0.06] px-6 py-4 flex items-start gap-2.5">
                <Icon
                  icon="solar:check-circle-bold"
                  width={18}
                  className="text-primary shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground">{row.ockno}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Agency figures reflect typical retainer-based pricing. Your results
          depend on your market, offer, and volume.
        </p>

        <div data-reveal className="text-center mt-10">
          <a
            href={APP_URL}
            className="btn-lift btn-pill btn-pill-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            Get early access
          </a>
        </div>
      </div>
    </section>
  );
}
