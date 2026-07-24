import EarlyAccessButton from "../EarlyAccessButton";

/* Final CTA — bookends the hero: where the hero dissolves UP into night, the
   close rises out of the dark into a sunrise. The dusk/dawn scape lives in
   DawnScape; the copy sits over its night band, above the horizon. */
export default function Cta() {
  return (
    <section id="cta" className="relative z-10 pt-28 md:pt-36 pb-[34vh] md:pb-[40vh]">
      {/* Readability vignette — kept very light for now (vibrancy over contrast,
          per the current pass). Feathered radial, transparent at the section top
          so it never adds a line/seam. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(135% 42% at 50% 32%, rgba(6,4,7,0.28) 0%, rgba(6,4,7,0.1) 46%, transparent 72%)",
        }}
      />

      <div
        className="max-w-[1440px] mx-auto px-6 relative z-10 text-center"
        style={{ textShadow: "0 1px 22px rgba(0,0,0,0.55)" }}
      >
        <div className="eyebrow justify-center mb-6" data-reveal>
          Get started
        </div>
        <h2
          data-reveal={60}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-balance text-foreground mb-6"
        >
          Stop buying clicks. <br className="hidden sm:block" />
          Start buying customers.
        </h2>

        <p data-reveal={120} className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Ockno builds and runs your whole marketing stack, then tracks every
          lead from the ad click to the closed sale, so your campaigns finally
          optimize for revenue.
        </p>

        <div data-reveal={220} className="flex justify-center mb-6 mt-10">
          <EarlyAccessButton className="btn-lift btn-pill btn-pill-primary w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page">
            Get early access
          </EarlyAccessButton>
        </div>
      </div>
    </section>
  );
}
