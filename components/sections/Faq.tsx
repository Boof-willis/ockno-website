import Icon from "../ui/Icon";
import EarlyAccessButton from "../EarlyAccessButton";

const FAQS = [
  {
    q: "Is this really cheaper than an agency?",
    a: "Yes — a fraction of a typical retainer, and no cut of your ad spend. You get a whole AI team for far less than one junior account manager would cost you.",
  },
  {
    q: "What if I already have an agency?",
    a: "Most people come to Ockno to replace theirs. You can switch over whenever you're ready — there's no long contract holding you here, and the AI rebuilds your funnels and follow-up for you.",
  },
  {
    q: "Do I need to be technical or “good at marketing”?",
    a: "No. Your AI team builds and runs it for you — ads, funnels, follow-up, the works. You just approve the big moves, like signing off on a bid.",
  },
  {
    q: "How is this different from GoHighLevel or HubSpot?",
    a: "Those give you the tools — then leave you to configure everything, wire up integrations, and learn the software. Ockno has the same tools in one place, but the AI builds it all for you from day one. All the power, none of the PhD.",
  },
  {
    q: "How long does setup take?",
    a: "Minutes to onboard, not weeks. You answer a few questions (or point Ockno at your website) and the Brain builds your funnels, pipelines, calendars, ads, and contracts for you to review — no integration spaghetti.",
  },
  {
    q: "Can agencies use it to run their clients?",
    a: "Absolutely. Run all your clients from one place, and onboard each new one in minutes instead of weeks. It replaces the stack of tools most agencies stitch together today.",
  },
  {
    q: "How is this different from a freelancer or a DIY tool?",
    a: "A freelancer is one person with limited hours. A DIY tool is something you have to operate yourself. Ockno is a full team that does the work for you, around the clock.",
  },
  {
    q: "Which ad platforms does it run?",
    a: "Google Ads and Meta. Meta is live today and Google is expanding, and it reports real conversions back to both so your ads keep improving.",
  },
  {
    q: "How fast will I see results?",
    a: "Setup is quick, but it takes a few weeks of real jobs for the system to learn what a good customer looks like for you. Anyone promising instant, guaranteed numbers isn't being honest — results depend on your market, offer, and volume.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/* Objection handling as a single-column accordion (native <details> — no
   client JS) beside a sticky header. One question open at a time is the
   reader's choice; the divide-y list keeps the section quiet either way. */
export default function Faq() {
  return (
    <section id="faq" className="relative z-10 py-28 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-[1fr_1.5fr] gap-14 lg:gap-24 items-start">
        <div className="lg:sticky lg:top-28" data-reveal>
          <div className="eyebrow mb-5">FAQ</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-5">
            Questions, answered straight.
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            No sales-page spin — including the honest answer on how fast
            you&apos;ll see results.
          </p>
          <EarlyAccessButton className="btn-lift btn-pill btn-pill-ghost focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Get early access
            <Icon icon="solar:arrow-right-linear" width={16} />
          </EarlyAccessButton>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {FAQS.map((item, i) => (
            <details key={item.q} data-reveal={Math.min(i * 50, 300)} className="group">
              <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-primary/70 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground font-medium text-[15px]">
                    {item.q}
                  </span>
                </span>
                <Icon
                  icon="solar:add-circle-linear"
                  width={20}
                  className="text-muted-foreground shrink-0 transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p className="pb-6 pl-9 text-muted-foreground text-sm leading-relaxed max-w-[62ch]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
