import Stars, { type Star } from "./ui/stars";

/**
 * Midnight — the valley from the hero and the closing dawn, seen in the dead of
 * night, as the opening shot of the comparison section.
 *
 * The pattern is Sintra's (sintra.ai): a full-bleed image band at the top of a
 * section that rises out of the black page and dissolves back into it, with the
 * section's own heading set in the lower fade. Here it's the middle beat of the
 * page's one night — dusk in the hero, midnight here, dawn at the close — so the
 * art is the moonlit take on the same hills (public/scape/night/*.webp, encoded
 * from the unused v1 renders) under a cool haze instead of a warm sky.
 *
 * Static: no parallax or scroll work, just gradients, two images and the .star
 * twinkle. Its height comes from --midnight-h on the section (globals.css), which
 * the section's content also reads to land the heading in the fade.
 */

/* Upper half of the band only; the mask below thins them out before the hills. */
const STARS: Star[] = [
  { x: 0.9, y: 8, s: 1.8, o: 0.9, du: 4.4, de: 1.2 },
  { x: 89, y: 40.2, s: 1.6, o: 0.93, du: 3.2, de: 2.2 },
  { x: 55.5, y: 10.1, s: 2.7, o: 0.58, du: 3.7, de: 1.2 },
  { x: 90.7, y: 37.4, s: 1.9, o: 0.71, du: 4.4, de: 0.7 },
  { x: 32.2, y: 13.3, s: 1.9, o: 0.59, du: 4.7, de: 1 },
  { x: 8.4, y: 36.4, s: 1.9, o: 0.63, du: 4.8, de: 0.1 },
  { x: 80, y: 18.8, s: 1.4, o: 0.93, du: 4.1, de: 1.8 },
  { x: 9.4, y: 47.8, s: 2.1, o: 0.54, du: 4.4, de: 2 },
  { x: 26.9, y: 34.2, s: 2.1, o: 0.51, du: 4.7, de: 1.9 },
  { x: 83.2, y: 26.5, s: 1.9, o: 0.9, du: 3.7, de: 2.1 },
  { x: 62.1, y: 47.3, s: 1.7, o: 0.59, du: 4.8, de: 0.6 },
  { x: 95, y: 28.6, s: 1.3, o: 0.59, du: 4.1, de: 0.9 },
  { x: 67.7, y: 21.8, s: 1.3, o: 0.51, du: 3.9, de: 0.2 },
  { x: 21.4, y: 44.2, s: 1.5, o: 0.52, du: 5, de: 0.3 },
  { x: 45.5, y: 16.6, s: 1.3, o: 0.54, du: 4.4, de: 0.3 },
  { x: 75.5, y: 36, s: 2, o: 0.72, du: 3.3, de: 1.1 },
  { x: 49.8, y: 41.9, s: 2.3, o: 0.63, du: 4.5, de: 1.2 },
  { x: 16.9, y: 24.4, s: 1.5, o: 0.78, du: 3.8, de: 2.1 },
  { x: 36.2, y: 44.1, s: 1.7, o: 0.93, du: 4.4, de: 2.2 },
  { x: 50.1, y: 30.6, s: 2, o: 0.57, du: 3.8, de: 0.5 },
  { x: 66.7, y: 34.8, s: 2.5, o: 0.86, du: 4, de: 1 },
  { x: 58.6, y: 44, s: 1.8, o: 0.49, du: 3.4, de: 2 },
  { x: 72.6, y: 8, s: 1.2, o: 0.62, du: 3.4, de: 0.2 },
];

export default function MidnightScape() {
  return (
    <div
      aria-hidden
      className="midnight absolute inset-x-0 top-0 overflow-hidden pointer-events-none"
    >
      <div className="midnight-sky absolute inset-0" />
      <Stars
        stars={STARS}
        mask="linear-gradient(to bottom, black 0%, black 34%, transparent 56%)"
      />

      {/* Bottom-anchored and pinned to a min width so phones get a crop of the
          hills rather than a squashed panorama (.midnight-layer frames it).
          Explicit intrinsic sizes for the same WebKit zero-height trap
          HeroScape notes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/scape/night/hills.webp"
        alt=""
        width={2048}
        height={705}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="midnight-layer absolute bottom-[5%] w-full min-w-[1100px] max-w-none h-auto select-none"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/scape/night/trees.webp"
        alt=""
        width={2048}
        height={406}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="midnight-layer absolute bottom-0 w-full min-w-[1100px] max-w-none h-auto select-none"
      />

      {/* Rises out of the black above, dissolves into the black below. */}
      <div className="midnight-fade absolute inset-0" />
    </div>
  );
}
