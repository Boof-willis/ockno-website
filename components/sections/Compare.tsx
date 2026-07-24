import Icon from "../ui/Icon";
import EarlyAccessButton from "../EarlyAccessButton";

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
          <h2 className="text-xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-5">
            Your agency vs. Ockno.
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything the best agencies do for their clients — and what the
            average one only promises — without the retainer, the wait, or the
            contract.
          </p>
        </div>

        {/* A real comparison table, built from flex rows (not a <table>) so the
            pinned first column is a plain block element — position: sticky is
            reliable there in every browser, whereas sticky <th>/<td> is buggy in
            Safari. The two comparison columns scroll horizontally on screens too
            narrow to fit all three; the row-label column stays pinned so labels
            are always readable. */}
        <div
          data-reveal={120}
          data-reveal-from="scale"
          className="rounded-card border border-border overflow-hidden"
        >
          <div className="scroll-x-thin overflow-x-auto">
            <div className="min-w-[500px] md:min-w-[600px]">
              {/* Header row */}
              <div className="flex border-b border-border">
                <div className="sticky left-0 z-20 w-[28%] shrink-0 bg-page border-r border-border px-3.5 py-2.5 md:px-5 md:py-4" />
                <div className="w-[36%] shrink-0 bg-nested border-r border-border px-3.5 py-2.5 md:px-5 md:py-4 text-center">
                  <span className="text-xs md:text-sm font-semibold text-muted-foreground">
                    Your agency
                  </span>
                </div>
                <div className="w-[36%] shrink-0 bg-primary/10 px-3.5 py-2.5 md:px-5 md:py-4 text-center">
                  <span className="inline-flex items-center justify-center">
                    {/* Wordmark — the logo already reads "Ockno", so no text label. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/ockno-logo.svg" alt="Ockno" className="h-4 md:h-[18px] w-auto" />
                  </span>
                </div>
              </div>

              {/* Body rows */}
              {ROWS.map((row, i) => {
                const b = i < ROWS.length - 1 ? "border-b border-border" : "";
                return (
                  <div key={row.label} className={`flex ${b}`}>
                    <div className="sticky left-0 z-20 w-[28%] shrink-0 bg-page border-r border-border px-3.5 py-2.5 md:px-5 md:py-4 flex items-center">
                      <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {row.label}
                      </span>
                    </div>
                    <div className="w-[36%] shrink-0 bg-nested border-r border-border px-3.5 py-2.5 md:px-5 md:py-4 flex items-start gap-2 md:gap-2.5">
                      <Icon
                        icon="solar:close-circle-linear"
                        width={16}
                        className="text-muted-foreground/70 shrink-0 mt-0.5"
                      />
                      <span className="text-xs md:text-sm text-muted-foreground">{row.agency}</span>
                    </div>
                    <div className="w-[36%] shrink-0 bg-primary/[0.06] px-3.5 py-2.5 md:px-5 md:py-4 flex items-start gap-2 md:gap-2.5">
                      <Icon
                        icon="solar:check-circle-bold"
                        width={16}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <span className="text-xs md:text-sm text-foreground">{row.ockno}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Agency figures reflect typical retainer-based pricing. Your results
          depend on your market, offer, and volume.
        </p>

        <div data-reveal className="text-center mt-10">
          <EarlyAccessButton className="btn-lift btn-pill btn-pill-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page">
            Get early access
          </EarlyAccessButton>
        </div>
      </div>
    </section>
  );
}
