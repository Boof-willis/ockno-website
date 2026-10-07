import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import { signupUrl } from "@/lib/links";
import MaxTierCard from "@/components/pricing/MaxTierCard";
import { credits, dollars, fetchCatalog, plansForTier, rate, type Catalog, type CatalogFee, type CatalogPlan } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing | Ockno",
  description:
    "Every Ockno plan includes every feature. Plans differ only in how many AI credits they include. Phone numbers, texting and calls are billed at the carriers' rates.",
  alternates: { canonical: "/pricing" },
};

/* Pass-through rates, grouped the way someone thinks about them. Labels come from the catalog;
   the groups and their order are this page's. A rate the catalog adds later still shows, under
   "Other". */
const FEE_GROUPS: { title: string; keys: string[] }[] = [
  { title: "Phone numbers", keys: ["number_month", "tollfree_number_month"] },
  { title: "Texting", keys: ["sms_segment", "sms_inbound_segment", "mms", "mms_inbound"] },
  { title: "Calls", keys: ["voice_minute", "tracked_call_minute"] },
  { title: "Email and domains", keys: ["email_send", "custom_domain_month"] },
  { title: "Texting registration (carrier fees)", keys: ["a2p_brand", "a2p_campaign", "a2p_campaign_month"] },
];

const UNIT: Record<string, string> = {
  mo: "a month",
  segment: "per segment",
  message: "per message",
  email: "per email",
  minute: "per minute",
  "one-time": "one time",
};

/* Plainer names than the catalog's for a few rows; the catalog label is used for everything else. */
const FEE_LABEL: Record<string, string> = {
  a2p_brand: "Business registration",
  a2p_campaign: "Campaign review",
  a2p_campaign_month: "Campaign upkeep",
  voice_minute: "Calls in the app",
  tracked_call_minute: "Tracked calls",
  email_send: "Email sent",
};

function feeUnit(f: CatalogFee) {
  return UNIT[f.unit] ?? `per ${f.unit}`;
}

function groupFees(fees: CatalogFee[]) {
  const used = new Set<string>();
  const groups = FEE_GROUPS.map((g) => {
    const rows = g.keys.map((k) => fees.find((f) => f.key === k)).filter(Boolean) as CatalogFee[];
    rows.forEach((r) => used.add(r.key));
    return { title: g.title, rows };
  }).filter((g) => g.rows.length > 0);
  const other = fees.filter((f) => !used.has(f.key));
  if (other.length) groups.push({ title: "Other", rows: other });
  return groups;
}

function faqs(c: Catalog) {
  const trial = c.plans.find((p) => p.tier === "trial");
  return [
    {
      q: "What is an AI credit?",
      a: "Credits are how Ockno measures AI work. Every message to your AI team, every image and every second of video spends some. Heavier models and longer tasks spend more. Your plan includes a set number each month.",
    },
    {
      q: "What happens when I run out of credits?",
      a: "AI pauses until your next billing date. Everything else keeps running: your numbers, texts, pages and automations. Moving up a plan adds credits straight away. There are no top-ups or overage charges, so a month never costs more than you expect.",
    },
    {
      q: "Do unused credits roll over?",
      a: "No. Credits reset at the start of each billing cycle.",
    },
    {
      q: "Do I need a card to try it?",
      a: `No. The free trial runs for ${c.trial_days} days with ${credits(trial?.included_credits)} credits and needs no card. Phone numbers and texting start when you choose a plan.`,
    },
    {
      q: "How are phone numbers and texts billed?",
      a: "At the rates on this page, on the same card as your plan. Each number is billed monthly until you release it. Texts, calls and emails are added up over the month and billed with your plan.",
    },
    {
      q: "Can I change plans?",
      a: "Anytime. Moving up applies right away and charges the difference for the rest of the month. Moving down keeps your current credits until your plan renews.",
    },
    {
      q: "What if a payment fails?",
      a: "Nothing switches off right away. We retry your card automatically and let you know, so you have time to update it.",
    },
  ];
}

function TierCard({ plan, cta, highlight = false }: { plan: CatalogPlan; cta: React.ReactNode; highlight?: boolean }) {
  const isTrial = plan.tier === "trial";
  return (
    <div className={`card-elevated relative flex flex-col p-7 md:p-8 ${highlight ? "ring-1 ring-primary/30" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{plan.label}</h3>
        {plan.savings_pct_vs_base ? (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            Save {plan.savings_pct_vs_base}% per credit
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground min-h-[2.5rem]">{plan.tagline}</p>
      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          {isTrial ? "$0" : dollars(plan.monthly_price_usd)}
        </span>
        <span className="text-sm text-muted-foreground">{isTrial ? "to start" : "a month"}</span>
      </div>
      <p className="mt-1 text-sm text-foreground tabular-nums">
        {credits(plan.included_credits)} AI credits {isTrial ? "to explore" : "a month"}
      </p>
      <div className="mt-auto pt-8">{cta}</div>
    </div>
  );
}

export default async function PricingPage() {
  const catalog = await fetchCatalog();
  const trial = plansForTier(catalog, "trial")[0];
  const base = plansForTier(catalog, "base")[0];
  const pro = plansForTier(catalog, "pro")[0];
  const max = plansForTier(catalog, "max");
  const custom = plansForTier(catalog, "custom")[0];
  const included = Array.from(new Set(catalog.plans.find((p) => p.tier === "base")?.features ?? []));
  const groups = groupFees(catalog.fees);
  const qa = faqs(catalog);
  const defaultModel = catalog.ai_models.find((m) => m.is_default);
  const otherModels = catalog.ai_models
    .filter((m) => !m.is_default)
    .sort((a, b) => a.cost_multiplier - b.cost_multiplier);
  const images = catalog.generation.filter((g) => g.kind === "image");
  const videos = catalog.generation.filter((g) => g.kind === "video");
  const range = (rows: { credits_per_unit: number }[]) => {
    const v = rows.map((r) => r.credits_per_unit).sort((a, b) => a - b);
    return v.length === 0 ? null : v[0] === v[v.length - 1] ? credits(v[0]) : `${credits(v[0])} to ${credits(v[v.length - 1])}`;
  };
  const maxTop = max[max.length - 1];

  /* Each plan card signs up with that plan picked, by its catalog key. */
  const planCta = (plan: CatalogPlan, label: string, variant: "primary" | "ghost") => (
    <a
      href={signupUrl(plan.key)}
      className={`btn-lift btn-pill btn-pill-${variant} w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      {label}
    </a>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <>
      <Nav />
      <main className="relative z-10 bg-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        {/* Hero */}
        <section className="pt-36 md:pt-44 pb-14">
          <div className="max-w-[1440px] mx-auto px-6 text-center">
            <div className="eyebrow justify-center mb-6">Pricing</div>
            <h1 className="text-[clamp(32px,6vw,60px)] font-semibold tracking-tight text-balance text-foreground">
              Every feature on every plan.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto text-balance">
              Plans differ only in how many AI credits they include. The bigger the plan, the less each credit costs.
            </p>
            <div className="mt-9 flex justify-center">
              <a href={signupUrl()} className="btn-lift btn-pill btn-pill-primary w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Start free
              </a>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section aria-label="Plans" className="pb-10">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {trial && <TierCard plan={trial} cta={planCta(trial, "Start free trial", "ghost")} />}
              {base && <TierCard plan={base} cta={planCta(base, `Choose ${base.label}`, "ghost")} />}
              {pro && <TierCard plan={pro} cta={planCta(pro, `Choose ${pro.label}`, "primary")} />}
              {max.length > 0 && <MaxTierCard steps={max} tagline={max[0].tagline} />}
            </div>
            {custom && maxTop && (
              <div className="card-elevated mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 p-7 md:p-8">
                <div>
                  <p className="font-medium text-foreground">{custom.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {`Need more than ${credits(maxTop.included_credits)} credits a month? We'll put a plan together for you.`}
                  </p>
                </div>
                <a
                  href={`mailto:hello@ockno.com?subject=${encodeURIComponent(`${custom.label} plan`)}`}
                  className="btn-lift btn-pill btn-pill-ghost btn-pill-sm shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Talk to us
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Included */}
        <section className="py-20 md:py-24 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24">
            <div>
              <div className="eyebrow mb-5">Included</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
                Nothing is held back for a bigger plan.
              </h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 self-center">
              {[
                "Your AI marketing team",
                "Ads on Meta and Google",
                "Pages, forms and sites",
                "CRM, pipelines and automations",
                ...included,
                "As many workspaces as you need",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-foreground">
                  <Icon icon="solar:check-circle-linear" width={18} className="text-primary shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Credits */}
        <section className="py-20 md:py-24 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24">
            <div>
              <div className="eyebrow mb-5">AI credits</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
                What a credit buys.
              </h2>
              <p className="mt-5 text-muted-foreground">
                Credits reset every billing cycle. When they run out, AI pauses until the cycle renews or
                you move up a plan. There are no overage charges.
              </p>
            </div>
            <div className="card-elevated divide-y divide-border self-start">
              {defaultModel && (
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <span className="text-foreground">Messages to your AI team</span>
                  <span className="text-muted-foreground text-sm text-right">{defaultModel.label} by default</span>
                </div>
              )}
              {otherModels.map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-4 px-6 py-4">
                  <span className="text-foreground">{m.label}</span>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {m.cost_multiplier}&times; the credits of {defaultModel?.label ?? "the default"}
                  </span>
                </div>
              ))}
              {range(images) && (
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <span className="text-foreground">Ad image</span>
                  <span className="text-muted-foreground text-sm tabular-nums">{range(images)} credits each</span>
                </div>
              )}
              {range(videos) && (
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <span className="text-foreground">Ad video</span>
                  <span className="text-muted-foreground text-sm tabular-nums">{range(videos)} credits a second</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pass-through rates */}
        <section className="py-20 md:py-24 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24">
            <div>
              <div className="eyebrow mb-5">Pay as you go</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
                Numbers, texts and calls.
              </h2>
              <p className="mt-5 text-muted-foreground">
                These are set by the phone carriers and billed to the same card as your plan. You only pay
                for what you use.
              </p>
            </div>
            <div className="space-y-8">
              {groups.map((g) => (
                <div key={g.title}>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">{g.title}</h3>
                  <div className="card-elevated divide-y divide-border">
                    {g.rows.map((f) => (
                      <div key={f.key} className="flex items-center justify-between gap-4 px-6 py-3.5">
                        <span className="text-foreground">{FEE_LABEL[f.key] ?? f.label}</span>
                        <span className="text-sm tabular-nums text-foreground whitespace-nowrap">
                          {rate(f.price)} <span className="text-muted-foreground">{feeUnit(f)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                A text longer than 160 characters is sent as more than one segment. Prices in US dollars.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-24 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-28">
              <div className="eyebrow mb-5">FAQ</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
                Questions about billing.
              </h2>
            </div>
            <div className="divide-y divide-border border-t border-border">
              {qa.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
                    <span className="text-foreground font-medium text-[15px]">{item.q}</span>
                    <Icon
                      icon="solar:add-circle-linear"
                      width={20}
                      className="text-muted-foreground shrink-0 transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-6 text-muted-foreground text-sm leading-relaxed max-w-[62ch]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="py-24 md:py-28 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
              Start with the free trial.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              {catalog.trial_days} days and {credits(trial?.included_credits)} AI credits. No card needed.
            </p>
            <div className="mt-9 flex justify-center">
              <a href={signupUrl()} className="btn-lift btn-pill btn-pill-primary w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Start free
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
