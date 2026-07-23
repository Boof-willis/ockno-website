"use client";

import { useEffect } from "react";

/**
 * TEMPORARY — Safari paint-bug diagnostics. Reports the live DOM state of the
 * scape layers (load state, geometry, computed styles, and which element is
 * topmost where each image should be) to /api/safari-probe at load, t+2s, and
 * on the first scroll. Delete together with the API route once fixed.
 */
export default function SafariProbe() {
  useEffect(() => {
    const report = (phase: string) => {
      try {
        const imgs = Array.from(document.querySelectorAll("img"))
          .filter((i) => i.src.includes("/scape/"))
          .map((img) => {
            const wrap = img.parentElement as HTMLElement;
            const r = img.getBoundingClientRect();
            const cs = getComputedStyle(wrap);
            const csi = getComputedStyle(img);
            const cx = Math.min(
              window.innerWidth - 2,
              Math.max(2, r.left + r.width / 2),
            );
            const cy = Math.min(
              window.innerHeight - 2,
              Math.max(2, r.top + r.height * 0.75),
            );
            const top = document.elementFromPoint(cx, cy);
            return {
              src: (img.currentSrc || img.src).split("/").pop(),
              complete: img.complete,
              nw: img.naturalWidth,
              nh: img.naturalHeight,
              rect: {
                t: Math.round(r.top),
                l: Math.round(r.left),
                w: Math.round(r.width),
                h: Math.round(r.height),
              },
              wrap: {
                transform: cs.transform,
                z: cs.zIndex,
                display: cs.display,
                visibility: cs.visibility,
                opacity: cs.opacity,
                bottom: cs.bottom,
                animation: cs.animationName,
              },
              img: {
                transform: csi.transform,
                visibility: csi.visibility,
                opacity: csi.opacity,
              },
              probe: {
                x: Math.round(cx),
                y: Math.round(cy),
                topmost: top
                  ? `${top.tagName}.${String(top.className).slice(0, 60)}`
                  : null,
                topmostIsThisImg: top === img,
              },
            };
          });
        // Hit-test the bottom flanks, clear of the centred dashboard card —
        // the ridge images should be the topmost elements there.
        const flanks = [
          [60, window.innerHeight - 40],
          [window.innerWidth - 60, window.innerHeight - 40],
          [60, window.innerHeight - 200],
        ].map(([x, y]) => {
          const el = document.elementFromPoint(x, y);
          return `${x},${y}: ${el ? el.tagName + "[" + ((el as HTMLImageElement).src || "").split("/").pop() + "]" : "none"}`;
        });
        fetch("/api/safari-probe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            phase,
            ua: navigator.userAgent,
            vw: window.innerWidth,
            vh: window.innerHeight,
            scrollY: window.scrollY,
            stAnim: document.documentElement.classList.contains("st-anim"),
            flanks,
            imgs,
          }),
        }).catch(() => {});
      } catch {
        /* diagnostics must never break the page */
      }
    };

    report("load");
    const t1 = window.setTimeout(() => report("t+2s"), 2000);
    // Independent decode test per layer: catches a file Safari can't decode
    // (which would also zero out naturalHeight) separately from layout issues.
    for (const name of ["far", "mid", "near"]) {
      const probe = new Image();
      probe.src = `/scape/v2/${name}.webp`;
      probe
        .decode()
        .then(() =>
          fetch("/api/safari-probe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              phase: "decode",
              file: name,
              ok: true,
              nw: probe.naturalWidth,
              nh: probe.naturalHeight,
            }),
          }),
        )
        .catch((e) =>
          fetch("/api/safari-probe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              phase: "decode",
              file: name,
              ok: false,
              err: String(e),
            }),
          }),
        );
    }
    const onFirstScroll = () => {
      report("first-scroll");
      window.removeEventListener("scroll", onFirstScroll);
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => {
      window.clearTimeout(t1);
      window.removeEventListener("scroll", onFirstScroll);
    };
  }, []);

  return null;
}
