import type { CSSProperties } from "react";

/** One star: position as % of the field, size in px, resting opacity, and its
 *  twinkle's duration/delay in seconds. Authored (not random) so the server and
 *  client render byte-identical markup. */
export type Star = { x: number; y: number; s: number; o: number; du: number; de: number };

/**
 * An absolutely-filling field of the site's `.star` twinkle (globals.css), for
 * the night-sky moments outside the hero and dawn scapes, which carry their
 * own. `mask` fades the field in or out so it never ends in a hard line.
 */
export default function Stars({
  stars,
  mask,
  className = "",
}: {
  stars: Star[];
  mask?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {stars.map((st, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: st.s,
              height: st.s,
              "--base": st.o,
              animationDuration: `${st.du}s`,
              animationDelay: `${st.de}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
