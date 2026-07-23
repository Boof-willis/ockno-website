import type { ReactNode, CSSProperties } from "react";

/**
 * Laptop shell built from CSS 3D transforms — no model file, no WebGL.
 *
 * The screen is a real DOM slot, which is the whole point: children render as
 * live HTML, so text stays crisp, links work, and swapping the content is a
 * prop change. A GLTF/WebGL device would make the screen a texture — the mock
 * inside would need rasterising to a canvas, text would soften, and content
 * swaps would mean texture uploads. It also keeps three.js (~600KB) out of the
 * bundle and stays off the iOS scroll path that 682c75a/d0910d1 fought.
 *
 * Geometry is authored here rather than sourced, so it's a generic laptop: no
 * third-party model licence, and no Apple trade dress.
 *
 * Knobs, all CSS custom properties so they can be driven by scroll later:
 *   --lid    lid angle. 90 = fully open (screen faces viewer), 0 = shut.
 *   --view   how far above the device the camera sits.
 *   --depth  perspective strength; lower = wider lens, more dramatic.
 */

export default function Device({
  children,
  lid = 90,
  view = 10,
  // Long lens. The deck extends toward the camera, so a short perspective makes
  // its near edge flare wider than the lid — which instantly reads as wrong,
  // since a real laptop's base and lid are the same width.
  depth = 5200,
  className = "",
  style,
}: {
  children?: ReactNode;
  /** Lid angle in degrees: 90 open, 0 shut. */
  lid?: number;
  /** Camera elevation in degrees. */
  view?: number;
  /** Perspective distance in px. */
  depth?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`device ${className}`}
      style={
        {
          "--lid": `${lid}deg`,
          "--view": `${view}deg`,
          "--depth": `${depth}px`,
          ...style,
        } as CSSProperties
      }
    >
      <div className="device-body">
        {/* Lid — hinges from its bottom edge. */}
        <div className="device-lid">
          <div className="device-bezel">
            <div className="device-screen">{children}</div>
            <div className="device-glare" aria-hidden />
          </div>
        </div>

        {/* Base — lies away from the viewer, hinged at its top edge. */}
        <div className="device-base" aria-hidden>
          <div className="device-deck" />
          <div className="device-notch" />
        </div>
      </div>

      {/* Contact shadow. Separate from the 3D tree so it isn't transformed. */}
      <div className="device-shadow" aria-hidden />
    </div>
  );
}
