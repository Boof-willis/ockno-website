import RotatingWord from "../RotatingWord";
import { Reveal, RevealCard } from "../motion/Reveal";
import { HeroScapeBack, HeroScapeFront } from "./HeroScape";
import Eyebrow from "../Eyebrow";

const APP_URL = "https://app.ockno.com";

const ROTATING = [
  "runs your ads.",
  "builds your funnels.",
  "knows your business.",
  "never sleeps.",
  "gets smarter every week.",
  "never asks for a raise.",
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
      className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden"
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
          <h1 className="text-[clamp(1.4rem,7.2vw,5rem)] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.06]">
            The AI employee that<br />
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
            <a
              href={APP_URL}
              className="btn-lift btn-pill btn-pill-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            >
              Get early access
            </a>
            <a
              href="#build"
              className="btn-lift btn-pill btn-pill-ghost focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See how it works
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No retainers · Cancel anytime
          </p>

          {/* Proof strip — the one hard number, above the fold. The named
              vertical makes the single stat credible. Expanded on in #proof. */}
          <div className="mt-7 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">CPA $860 → $150</span>{" "}
            in a real moving-company campaign
          </div>
        </Reveal>

        {/* Dashboard mock. Parallax lives on the wrapper and the entrance on the
            card, so the two transforms never fight. */}
        <div
          className="relative max-w-5xl mx-auto group mt-20"
          data-parallax="0.06"
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

      {/* Fade the whole scape to true black at the bottom so the hero dissolves
          into the black section below with no seam. Above everything (z-30). */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[52vh] z-30 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #000 94%)" }}
      />
    </section>
  );
}
