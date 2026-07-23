import RotatingWord from "../RotatingWord";
import { Reveal, RevealCard } from "../motion/Reveal";
import { HeroScapeBack, HeroScapeFront } from "./HeroScape";
import Eyebrow from "../Eyebrow";
import EarlyAccessButton from "../EarlyAccessButton";

const ROTATING = [
  "learns your business.",
  "builds your funnels.",
  "creates your ads.",
  "launches your campaigns.",
  "optimizes for revenue.",
  "follows up with your leads.",
  "manages your bookings.",
  "handles your reporting.",
];

/* Eyebrow marquee. Every line is a claim already made elsewhere on this site —
   the metadata positioning, the CTA subtext, and the early-access status. It
   points at #compare because that's where a sceptic's actual objection ("how is
   this different from an agency?") gets answered. Nothing here is aspirational;
   if a line stops being true, remove it. */
const EYEBROW_LINES = [
  "Not a tool you operate — a hire that delivers",
  "No retainers. Cancel anytime.",
  "Now in early access",
];

/* Entrance timeline (seconds). Copy leads, the product screenshot follows —
   the cascade sells it as a live product rather than a flat marketing render. */
const T = {
  badge: 0,
  headline: 0.1,
  subhead: 0.2,
  cta: 0.3,
  card: 0.4,
};

export default function Hero() {
  return (
    <section
      className="relative pt-[98px] pb-[198px] md:pt-[146px] md:pb-[230px] overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <HeroScapeBack />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center">
        <Reveal delay={T.badge} className="mb-7">
          <Eyebrow
            items={EYEBROW_LINES}
            href="#compare"
            label="See how Ockno compares to an agency"
          />
        </Reveal>

        <Reveal delay={T.headline}>
          <h1 className="text-[clamp(21px,6.4vw,55px)] md:text-[55px] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.06]">
            The marketing operator that<br />
            <RotatingWord
              words={ROTATING}
              className="bg-gradient-to-r from-primary-hover to-primary bg-clip-text text-transparent"
            />
          </h1>
        </Reveal>

        <Reveal delay={T.subhead}>
          <p className="text-base md:text-lg text-balance max-w-[520px] mx-auto mb-3.5 text-muted-foreground">
            It learns your business and runs your marketing for you — so you
            don&apos;t have to.
          </p>
          {/* Audience signal — answers "is this for me?" above the fold, so a
              local business owner self-identifies immediately. Agencies are a
              welcome secondary segment, handled lower down in #team, not here. */}
          <p className="text-sm max-w-[520px] mx-auto mb-8 text-muted-foreground/70">
            Built for local business owners running their own ads.
          </p>
        </Reveal>

        <Reveal delay={T.cta} className="flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <EarlyAccessButton className="btn-lift btn-pill btn-pill-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page">
              Get early access
            </EarlyAccessButton>
            <a
              href="#build"
              className="btn-lift btn-pill btn-pill-ghost focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See how it works
            </a>
          </div>

          {/* Proof strip — the one hard number, above the fold. The named
              vertical makes the single stat credible. Expanded on in #proof. */}
          <div className="mt-7 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">CPA $860 → $150</span>{" "}
            in a real moving-company campaign
          </div>
        </Reveal>

        {/* Dashboard mock. As the page scrolls, the wrapper sinks: a POSITIVE
            data-parallax-scroll factor translates it downward, so it rises slower
            than the page. The near ridge (HeroScapeFront, z-20) is glued to the
            page (factor 0) and paints in front, so its tree line climbs up over
            the lagging mock — the image descends into the trees. Parallax lives
            on the wrapper and the entrance on the card, so the two transforms
            never fight. */}
        <div
          className="relative max-w-5xl mx-auto group mt-10"
          data-parallax-scroll="0.22"
          style={{ ["--pfactor" as string]: 0.22 }}
        >
          <RevealCard delay={T.card}>
            {/* Real product — the Brain: Ockno learning a business from every
                chat. The screenshot carries its own app chrome, so it stands on
                its own, masked to a rounded frame — no fake browser bar. */}
            {/* Explicit intrinsic dimensions (all product shots are 1920×1080).
                Without them WebKit lays the img out at height 0 before decode
                and never relayouts until a scroll — same trap as the scape. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brain.png"
              alt="Ockno — the Brain, learning a business from every chat"
              width={1920}
              height={1080}
              className="w-full h-auto block rounded-xl overflow-hidden border border-border shadow-2xl bg-page"
            />
          </RevealCard>
        </div>
      </div>

      {/* Sibling of the content wrapper, not a child: it has to paint above the
          z-10 content to occlude the mock. */}
      <HeroScapeFront />

      {/* Fade the scape to true black at the bottom so the hero dissolves into
          the black section below with no seam. Sits at z-[5] — BEHIND the z-10
          content — so it darkens the sky and the back ranges but never touches
          the product screenshot or copy, which stay full-brightness as they
          scroll. The near ridge (trees) carries its own bottom fade in
          HeroScapeFront so it blacks out too without dimming the screenshot. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[52vh] z-[5] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #000 94%)" }}
      />
    </section>
  );
}
