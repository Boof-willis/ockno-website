import Icon from "../ui/Icon";

/* The platform — one asymmetric bento instead of four stacked sections.
   Merges the old Platform flow, HowItWorks learning loop, Capabilities grid,
   and Integrations strip. Every tile is phrased as an outcome; the learning
   loop gets the biggest tile because it's the differentiator. */

const LOOP_STEPS = [
  {
    n: "01",
    title: "New lead",
    body: "Start with upper-funnel leads to give the algorithm enough data volume.",
    primary: false,
  },
  {
    n: "02",
    title: "Qualified lead",
    body: "Shift the ads to chase the leads that actually book a call or ask for a quote.",
    primary: false,
  },
  {
    n: "03",
    title: "Converted lead",
    body: "Now it bids on the deals that actually closed — chasing real revenue, not clicks.",
    primary: true,
  },
];

const TOOLKIT = [
  "Pipelines & CRM",
  "Automations",
  "Funnels & forms",
  "Documents & e-sign",
  "Calendars & booking",
  "Email & SMS inbox",
  "Media library",
  "Custom domains",
];

const INTEGRATIONS = [
  { icon: "solar:plain-linear", label: "Google Ads" },
  { icon: "solar:plain-linear", label: "Meta" },
  { icon: "solar:bolt-circle-linear", label: "GoHighLevel" },
  { icon: "solar:link-circle-linear", label: "HubSpot" },
  { icon: "solar:cloud-linear", label: "Salesforce" },
  { icon: "solar:card-linear", label: "Stripe" },
  { icon: "solar:phone-calling-linear", label: "CallRail" },
  { icon: "solar:calendar-mark-linear", label: "Google Calendar" },
  { icon: "solar:calendar-date-linear", label: "Calendly" },
  { icon: "solar:server-path-linear", label: "Webhooks / Zapier" },
];

/* Mini chart bars — same silhouette as the hero mock, echoed at tile scale. */
const BARS_MUTED = [30, 45, 40, 60, 55];
const BARS_PRIMARY = [75, 85, 80];

export default function Platform() {
  return (
    <section id="platform" className="py-28 md:py-36 bg-page border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Asymmetric header: headline left, supporting copy right. */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-20 items-end mb-14 md:mb-16">
          <div data-reveal>
            <div className="eyebrow mb-5">Everything, handled</div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-foreground">
              Everything a great agency does — running 24/7.
            </h2>
          </div>
          <p data-reveal={120} className="text-muted-foreground text-lg lg:pb-1">
            Your team handles every step from ad click to closed deal, then
            loops the revenue back to Google and Meta so your ads keep getting
            sharper — all without a single status call.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* The learning loop — the differentiator gets the big tile. */}
          <div
            data-reveal
            data-reveal-from="scale"
            className="lg:col-span-7 card-elevated card-lift p-8 md:p-10 flex flex-col"
          >
            <div className="icon-tile w-11 h-11 mb-6">
              <Icon icon="solar:refresh-circle-linear" width={22} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">
              Your ads learn what a real customer looks like.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[58ch]">
              Most campaigns chase leads, not sales. As real sales come in,
              Ockno feeds them back — moving each campaign from chasing clicks,
              to qualified leads, to closed revenue. Most agencies never get
              this far.
            </p>

            <div className="divide-y divide-border border-t border-border mt-auto">
              {LOOP_STEPS.map((s) => (
                <div key={s.n} className="flex items-baseline gap-5 py-4">
                  <span
                    className={
                      s.primary
                        ? "font-mono text-xs text-primary shrink-0"
                        : "font-mono text-xs text-muted-foreground shrink-0"
                    }
                  >
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-medium text-foreground">
                        {s.title}
                      </h4>
                      {s.primary && (
                        <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                          The goal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 border-t border-border pt-5 text-xs text-muted-foreground">
              <Icon icon="solar:upload-linear" width={16} className="text-primary shrink-0" />
              <span>
                Your real sales are sent back to{" "}
                <span className="text-foreground font-medium">Google Ads</span> and{" "}
                <span className="text-foreground font-medium">Meta</span> — so both
                learn which ads bring paying customers, not just cheap clicks.
              </span>
            </div>
          </div>

          {/* Ads — the hero mock's chart, echoed at tile scale. */}
          <div
            data-reveal={140}
            data-reveal-from="scale"
            className="lg:col-span-5 card-elevated card-lift p-8 md:p-10 flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="icon-tile w-11 h-11">
                <Icon icon="solar:volume-loud-linear" width={22} />
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-md bg-nested border border-border text-[11px] text-muted-foreground">
                  Google Ads
                </span>
                <span className="px-2.5 py-1 rounded-md bg-nested border border-border text-[11px] text-muted-foreground">
                  Meta
                </span>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">
              Campaigns created, managed, and sharpened in-app.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Budgets, creatives, and bids handled by your media-buyer agent —
              with dashboards that reconcile spend, revenue, and ROAS across
              every campaign automatically.
            </p>

            <div className="relative h-36 border-l border-b border-border flex items-end gap-1.5 px-2 mt-auto overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="w-full h-px border-t border-border" />
                <div className="w-full h-px border-t border-border" />
                <div className="w-full h-px border-t border-border" />
              </div>
              {BARS_MUTED.map((h, i) => (
                <div key={`m${i}`} className="w-[10%] h-full flex items-end mx-auto">
                  <div className="w-full rounded-t-sm bg-nested" style={{ height: `${h}%` }} />
                </div>
              ))}
              {BARS_PRIMARY.map((h, i) => (
                <div key={`p${i}`} className="w-[10%] h-full flex items-end mx-auto">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-primary-muted to-primary"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider pt-3">
              <span>Spend ↔ revenue ↔ ROAS</span>
              <span className="text-success">Reconciled</span>
            </div>
          </div>

          {/* The full toolkit — compact checklist, no sub-cards. */}
          <div
            data-reveal={200}
            data-reveal-from="scale"
            className="lg:col-span-5 card-elevated card-lift p-8 md:p-10"
          >
            <div className="icon-tile w-11 h-11 mb-6">
              <Icon icon="solar:widget-4-linear" width={22} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">
              All your tools in one place. Zero to wire up.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-7">
              The all-in-one platforms hand you the tools and leave the work to
              you. Ockno has the same tools — and the AI actually runs them.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {TOOLKIT.map((t) => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon
                    icon="solar:check-circle-linear"
                    width={16}
                    className="text-primary shrink-0"
                  />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Works with your stack. */}
          <div
            data-reveal={260}
            data-reveal-from="scale"
            className="lg:col-span-7 card-elevated card-lift p-8 md:p-10 flex flex-col"
          >
            <div className="icon-tile w-11 h-11 mb-6">
              <Icon icon="solar:plug-circle-linear" width={22} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">
              Works with your stack.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-7">
              Plugs into your ad platforms, CRM, and payments — every lead
              tracked back to the exact ad and click that produced it. No rebuild
              required.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-auto">
              {INTEGRATIONS.map((chip) => (
                <div
                  key={chip.label}
                  className="px-3.5 py-1.5 rounded-full bg-nested border border-border text-[13px] text-foreground flex items-center gap-2 hover:border-primary/30 transition-colors"
                >
                  <Icon icon={chip.icon} width={15} className="text-primary" />
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
