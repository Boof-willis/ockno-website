import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/HeroBackdrop";
import DawnScape from "@/components/DawnScape";
import MotionInit from "@/components/motion/MotionInit";
import Hero from "@/components/sections/Hero";
import OldWay from "@/components/sections/OldWay";
import Features from "@/components/sections/Features";
import Compare from "@/components/sections/Compare";
import Build from "@/components/sections/Build";
import Platform from "@/components/sections/Platform";
import Trust from "@/components/sections/Trust";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";

/* Eight sections, one funnel: hero → problem → product → how it works (and the
   payoff number) → versus an agency → platform depth → trust → objections →
   close. Ordered by what a prospect asks next: what is it, will it be work for
   me, why is it better than what I pay for now, what else is in it, who built
   it. The nav and footer links follow the same order. */
export default function Home() {
  return (
    <>
      {/* Static, GPU-free hero backdrop */}
      <HeroBackdrop />

      <Nav />

      <main className="relative z-10">
        <MotionInit />
        <Hero />
        <OldWay />
        <Features />
        <Build />
        <Compare />
        <Platform />
        <Trust />

        {/* Closing dawn — FAQ, CTA, and footer share one sunrise backdrop, the
            deliberate inverse of the hero's dusk. Night through the FAQ, dawn
            breaking over the CTA, footer as the lit foreground. Each child sits
            relative/z-10 over the z-0 scape. */}
        <div className="relative isolate">
          <DawnScape />
          <Faq />
          <Cta />
          <Footer />
        </div>
      </main>
    </>
  );
}
