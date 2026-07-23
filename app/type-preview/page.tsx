import type { Metadata } from "next";
import { hankenGrotesk } from "../fonts";

export const metadata: Metadata = {
  title: "Ockno Operator — Type Comparison",
  robots: {
    index: false,
    follow: false,
  },
};

const samples = [
  { weight: 500, label: "Medium 500" },
  { weight: 600, label: "Semibold 600" },
  { weight: 700, label: "Bold 700" },
];

function TypefacePanel({
  eyebrow,
  name,
  family,
}: {
  eyebrow: string;
  name: string;
  family: string;
}) {
  return (
    <section className="border-t border-[#d9d2c8] pt-5 md:pt-7">
      <div className="mb-12 flex items-baseline justify-between gap-4">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8177]">
          {eyebrow}
        </p>
        <p className="font-body text-sm text-[#8a8177]">{name}</p>
      </div>

      <div style={{ fontFamily: family }}>
        <h2
          className="max-w-[14ch] text-[clamp(3.25rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
          style={{ fontFamily: family }}
        >
          The AI employee that builds for you.
        </h2>

        <p className="mt-16 text-[clamp(3.5rem,7vw,7.5rem)] font-medium leading-none tracking-[-0.045em]">
          Ockno
        </p>

        <div className="mt-14 space-y-2 text-[clamp(1.5rem,3vw,2.75rem)] leading-tight tracking-[0.04em]">
          <p>ABCDEFGHIJKLM</p>
          <p>abcdefghijklm</p>
          <p>0123456789</p>
        </div>

        <div className="mt-14 grid gap-7 border-t border-[#d9d2c8] pt-7">
          {samples.map((sample) => (
            <div key={sample.weight} className="grid grid-cols-[7rem_1fr] items-baseline gap-4">
              <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#8a8177]">
                {sample.label}
              </p>
              <p
                className="text-[clamp(1.5rem,3vw,2.5rem)] leading-none tracking-[-0.025em]"
                style={{ fontWeight: sample.weight }}
              >
                Runs your ads.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TypePreviewPage() {
  return (
    <main
      className={`${hankenGrotesk.variable} min-h-[100dvh] bg-[#faf7f2] px-6 py-10 text-[#211e1b] md:px-10 md:py-14 lg:px-16`}
    >
      <header className="mb-20 grid gap-6 border-b border-[#d9d2c8] pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Ockno type study 01
          </p>
          <h1 className="mt-3 font-body text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            Display type comparison
          </h1>
        </div>
        <p className="max-w-md font-body text-sm leading-relaxed text-[#6f675f] md:text-right">
          Identical size, weight, spacing, and copy. Only the typeface changes.
        </p>
      </header>

      <div className="grid gap-24 md:grid-cols-2 md:gap-10 lg:gap-12">
        <TypefacePanel
          eyebrow="Current"
          name="Hanken Grotesk"
          family="var(--font-hanken), system-ui, sans-serif"
        />
        <TypefacePanel
          eyebrow="Candidate"
          name="Ockno Operator"
          family="var(--font-sans), 'Arial Narrow', sans-serif"
        />
      </div>
    </main>
  );
}
