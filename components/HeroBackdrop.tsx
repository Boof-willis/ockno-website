/**
 * Static, GPU-free backdrop. Fixed behind content (z-0); the hero is
 * transparent so this shows through, while lower sections have solid
 * backgrounds that cover it. Pure CSS — no animation or canvas cost.
 */
export default function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-page"
    >
      {/* Very subtle warm wash near the top of the hero (orange kept faint) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[20%] w-[1200px] max-w-[140vw] h-[820px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.07), transparent 70%)",
        }}
      />
      {/* Faint grid, faded out toward the bottom so it never fights content */}
      <div
        className="absolute inset-0 grid-bg opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
        }}
      />
    </div>
  );
}
