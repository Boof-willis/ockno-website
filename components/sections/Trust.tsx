import Icon from "../ui/Icon";

/* The trust moment: who built this. "Who it's for" was cut — the fit is already
   settled in the hero ("Built for local business owners running their own ads")
   and this section's own headline, so repeating it here was dead weight. What's
   left is credibility: two operators, up close. The agency-as-customer segment
   (the one non-redundant bit of the old list) survives as the footer strip. */

const FOUNDERS = [
  {
    initials: "S",
    name: "Spencer",
    role: "Performance marketing",
    image: "/images/spencer.png",
    statIcon: "solar:chart-2-linear",
    highlight: "$1M+ ad spend managed",
    body: "Ran a performance marketing agency for years. Built the first closed-loop system by hand — the one that became Ockno.",
  },
  {
    initials: "J",
    name: "Joel",
    role: "Engineering",
    image: "/images/joel.png",
    statIcon: "solar:code-linear",
    highlight: "Trading bots → production SaaS",
    body: "Has built everything from trading bots to manufacturing SaaS. Turned the prototype into real software you can trust with your budget.",
  },
];

export default function Trust() {
  return (
    <section id="team" className="py-28 md:py-32 bg-card border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="max-w-2xl mb-12 md:mb-14" data-reveal>
          <div className="eyebrow mb-5">Built by operators</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-5">
            For owners who run their own growth — built by operators.
          </h2>
          <p className="text-muted-foreground text-lg">
            Ockno onboards, builds, and runs your marketing end to end — so you
            keep it in-house instead of handing it off. It isn&apos;t a slick
            demo: we spent two years proving it inside real client campaigns.
          </p>
        </div>

        {/* The two operators, up close. */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {FOUNDERS.map((f, i) => (
            <div
              key={f.name}
              data-reveal={i * 120}
              className="card-elevated card-lift flex flex-col sm:flex-row gap-6 p-6 sm:p-8"
            >
              {f.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={f.image}
                  alt={f.name}
                  width={176}
                  height={176}
                  className="w-full sm:w-44 aspect-square rounded-2xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-full sm:w-44 aspect-square rounded-2xl bg-gradient-to-b from-primary/20 to-primary/[0.05] border border-primary/30 flex items-center justify-center text-primary font-semibold text-4xl shrink-0">
                  {f.initials}
                </div>
              )}
              <div className="min-w-0 flex flex-col">
                <div className="text-foreground font-semibold text-xl leading-tight">
                  {f.name}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1.5">
                  {f.role}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3.5 flex-1">
                  {f.body}
                </p>
                <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-xs">
                  <Icon icon={f.statIcon} width={15} className="text-primary shrink-0" />
                  <span className="text-foreground font-medium">{f.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer strip: the agency-as-customer segment + the live-accounts proof. */}
        <div
          data-reveal={260}
          className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border border-border bg-nested/40 p-5 sm:px-6"
        >
          <div className="flex items-start gap-3">
            <Icon
              icon="solar:users-group-two-rounded-linear"
              width={20}
              className="text-primary shrink-0 mt-0.5"
            />
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Running an agency?</span>{" "}
              Ockno runs every client from one place — onboard a new one in
              minutes.
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground shrink-0 sm:ml-auto sm:border-l sm:border-border sm:pl-6">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shrink-0" />
            Live in multiple real client accounts today.
          </div>
        </div>
      </div>
    </section>
  );
}
