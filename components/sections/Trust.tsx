import Icon from "../ui/Icon";
import Stars, { type Star } from "../ui/stars";

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
    image: "/images/spencer.webp",
    statIcon: "solar:chart-2-linear",
    highlight: "$1M+ ad spend managed",
    body: "Ran a performance marketing agency for years. Built the first closed-loop system by hand — the one that became Ockno.",
  },
  {
    initials: "J",
    name: "Joel",
    role: "Engineering",
    image: "/images/joel.webp",
    statIcon: "solar:code-linear",
    highlight: "Trading bots → production SaaS",
    body: "Has built everything from trading bots to manufacturing SaaS. Turned the prototype into real software you can trust with your budget.",
  },
];

/* The FAQ's night sky starts here: stars through the lower part of the section,
   faded in from nothing (see the mask) so they reach the FAQ's own starfield at
   full strength and there's no line where the sky begins. */
const STARS: Star[] = [
  { x: 57, y: 70.4, s: 1.2, o: 0.6, du: 4.3, de: 0.7 },
  { x: 58.2, y: 30, s: 2.1, o: 0.68, du: 5, de: 1.7 },
  { x: 4.8, y: 21.4, s: 1.7, o: 0.69, du: 3.8, de: 1 },
  { x: 89.4, y: 78.9, s: 1.6, o: 0.69, du: 3.8, de: 2 },
  { x: 44.5, y: 19.9, s: 1.2, o: 0.46, du: 3.2, de: 0.4 },
  { x: 80.3, y: 66.3, s: 1.5, o: 0.5, du: 3.3, de: 0.1 },
  { x: 47.4, y: 49.5, s: 1.4, o: 0.7, du: 3.3, de: 1.5 },
  { x: 34.9, y: 44.5, s: 2.6, o: 0.67, du: 4.2, de: 1 },
  { x: 0.1, y: 23.5, s: 2, o: 0.9, du: 4.4, de: 1.7 },
  { x: 87.9, y: 49.9, s: 2.2, o: 0.65, du: 4.8, de: 1.2 },
  { x: 16.9, y: 21.6, s: 1.7, o: 0.68, du: 4.6, de: 0.1 },
  { x: 69.8, y: 70, s: 1.5, o: 0.8, du: 3.9, de: 1 },
  { x: 40.6, y: 49.8, s: 2.4, o: 0.66, du: 3.4, de: 2.4 },
  { x: 63.7, y: 87.4, s: 2.3, o: 0.87, du: 3.8, de: 0.7 },
  { x: 64.2, y: 63.2, s: 2.2, o: 0.71, du: 4.5, de: 1.1 },
  { x: 82.2, y: 56.2, s: 2.5, o: 0.65, du: 3.5, de: 0.3 },
  { x: 18, y: 79.6, s: 1.8, o: 0.93, du: 4.4, de: 1.8 },
  { x: 75.1, y: 82.1, s: 2.1, o: 0.71, du: 4, de: 2.3 },
  { x: 50.3, y: 95, s: 1.6, o: 0.51, du: 3.6, de: 0.9 },
  { x: 66, y: 73.3, s: 2.2, o: 0.94, du: 4.3, de: 1.6 },
  { x: 89.5, y: 62.4, s: 1.3, o: 0.67, du: 4.8, de: 0.3 },
  { x: 13.1, y: 53.9, s: 1.3, o: 0.57, du: 4.4, de: 0.2 },
  { x: 92.7, y: 31.4, s: 1.6, o: 0.52, du: 3.2, de: 1.1 },
  { x: 43.2, y: 87.7, s: 1.8, o: 0.89, du: 3.7, de: 0.4 },
  { x: 53, y: 31.1, s: 1.3, o: 0.92, du: 4.6, de: 0 },
  { x: 2.9, y: 88, s: 2.2, o: 0.53, du: 3.4, de: 1.3 },
  { x: 30.6, y: 45.3, s: 1.8, o: 0.57, du: 3.9, de: 0.6 },
  { x: 99.3, y: 48.2, s: 2.2, o: 0.63, du: 4.8, de: 1.5 },
  { x: 27.4, y: 92.6, s: 1.5, o: 0.74, du: 4.1, de: 1.9 },
  { x: 8.7, y: 70.2, s: 1.9, o: 0.62, du: 3.6, de: 0.8 },
];

export default function Trust() {
  return (
    <section id="team" className="ambient ambient-left section-to-night py-24 md:py-28">
      {/* z-[-1], same layer as the ambient light but later, so the stars sit
          over its glow and under everything else in the section. */}
      <Stars
        stars={STARS}
        mask="linear-gradient(to bottom, transparent 22%, black 88%)"
        className="z-[-1]"
      />
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
                  loading="lazy"
                  decoding="async"
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
