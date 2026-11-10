"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * The Brain, in 3D — a procedural brain (two hemispheres with the folds of the
 * cortex, the cerebellum and the stem) made of glowing nodes and the
 * connections between them, drawn live on a canvas.
 *
 * Replaces the 56-frame JPEG sequence (public/train-seq): sharp at any pixel
 * density, alive between scrolls — it turns slowly, and signals travel its
 * pathways — and a fraction of the bytes.
 *
 * `progress` (0–1) drives the build, the same story the frames told: a single
 * spark at 0, nodes bursting out of it to their places as it rises,
 * connections forming behind them, the whole brain lit by 1. It's a ref so the
 * scroll handler can write it every frame without a React render.
 *
 * Canvas 2D on purpose, not WebGL: this codebase pulled WebGL after iOS
 * momentum-scroll flicker (682c75a), and a thousand additive sprites and a few
 * thousand lines are well within 2D's budget. It only animates while on
 * screen, caps the pixel ratio, and under reduced motion draws one still,
 * finished frame.
 */

type Props = {
  /** Build progress: 0 is a single spark, 1 the whole brain. */
  progress: MutableRefObject<number>;
  className?: string;
};

type Tract = { a: number; b: number; cx: number; cy: number; cz: number };

type Brain = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  /** Radius factor per node. */
  size: Float32Array;
  /** Brightness factor per node — the folds' ridges read brighter. */
  glow: Float32Array;
  /** Build progress at which each node sets off from the spark. */
  birth: Float32Array;
  /** Neighbour links, as flat (a, b) pairs. */
  edges: Uint16Array;
  /** Long curved pathways through the interior, which the signals travel. */
  tracts: Tract[];
};

/* Where the build starts, and the point the brain turns around. */
const SPARK = { x: 0, y: 0.02, z: 0.08 };

/* Share of each node's journey from the spark (in progress units). */
const FLIGHT = 0.16;

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* The cortex's folds: a cheap, smooth pseudo-noise in about [-1, 1]. */
const folds = (x: number, y: number, z: number) =>
  Math.sin(x * 7.3 + Math.sin(y * 4.1) * 1.6) *
  Math.sin(y * 6.1 + Math.sin(z * 4.7) * 1.4) *
  Math.sin(z * 6.9 + Math.sin(x * 5.3) * 1.5);

/**
 * A unit direction → a point on the cerebrum's surface. An ellipsoid (x is
 * left–right, y up, z front–back), shaped toward a brain: fuller frontal lobe,
 * narrower occipital, a flat underside that droops into the temporal lobes,
 * the longitudinal fissure between the hemispheres and the lateral fissure
 * above each temporal lobe, then the folds as a small radial displacement.
 */
function cerebrum(dx: number, dy: number, dz: number): [number, number, number] {
  let x = dx * 0.84;
  let y = dy * 0.74;
  const z = dz * 1.02;
  const front = Math.max(0, dz);
  const back = Math.max(0, -dz);
  y *= 1 + 0.07 * front - 0.06 * back;
  x *= 1 - 0.1 * back;
  if (y < 0) {
    const temporal =
      Math.exp(-(((dz - 0.12) / 0.42) ** 2)) * smooth(0.3, 0.85, Math.abs(dx));
    y *= 0.56 + 0.46 * temporal;
  }
  const fissure = Math.exp(-((dx / 0.1) ** 2)) * Math.max(0, dy);
  const lateral =
    Math.exp(-(((dy + 0.08 + 0.3 * dz) / 0.08) ** 2)) *
    smooth(0.45, 0.8, Math.abs(dx)) *
    smooth(-0.35, 0.25, dz);
  const k = (1 - 0.13 * fissure - 0.08 * lateral) * (1 + 0.04 * folds(x, y, z));
  return [x * k, y * k, z * k];
}

/** Whether a point sits inside the cerebrum's rough volume (for culling). */
const insideCerebrum = (x: number, y: number, z: number) =>
  (x / 0.84) ** 2 + (y / (y < 0 ? 0.46 : 0.76)) ** 2 + (z / 1.02) ** 2 < 0.94;

function buildBrain(count: number): Brain {
  const rand = mulberry32(0x0c4e0);
  const X: number[] = [];
  const Y: number[] = [];
  const Z: number[] = [];
  const S: number[] = [];
  const G: number[] = [];

  const push = (x: number, y: number, z: number, size: number, glow: number) => {
    X.push(x);
    Y.push(y);
    Z.push(z);
    S.push(size);
    G.push(glow);
  };

  // Cortex: a Fibonacci lattice gives an even, organic spread over the surface.
  const nCortex = Math.round(count * 0.8);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < nCortex; i++) {
    const v = 1 - (2 * (i + 0.5)) / nCortex;
    const r = Math.sqrt(1 - v * v);
    const a = i * golden + (rand() - 0.5) * 0.35;
    const dy = v + (rand() - 0.5) * 0.02;
    const [x, y, z] = cerebrum(Math.cos(a) * r, dy, Math.sin(a) * r);
    const ridge = folds(x, y, z);
    push(x, y, z, 0.75 + rand() * 0.55 + Math.max(0, ridge) * 0.35, 0.55 + 0.45 * smooth(-0.3, 0.6, ridge));
  }

  // Cerebellum: tucked under the back of the brain, striped by its folia.
  const nCerebellum = Math.round(count * 0.1);
  for (let placed = 0, i = 0; placed < nCerebellum && i < nCerebellum * 4; i++) {
    const v = 1 - 2 * rand();
    const r = Math.sqrt(1 - v * v);
    const a = rand() * Math.PI * 2;
    const x = Math.cos(a) * r * 0.52;
    const y = -0.5 + v * 0.25;
    const z = -0.6 + Math.sin(a) * r * 0.32;
    if (insideCerebrum(x, y, z)) continue;
    placed++;
    push(x, y, z, 0.6 + rand() * 0.4, 0.5 + 0.35 * (0.5 + 0.5 * Math.sin(y * 70)));
  }

  // Stem: a short tapering column under the middle.
  const nStem = Math.round(count * 0.04);
  for (let i = 0; i < nStem; i++) {
    const t = rand();
    const a = rand() * Math.PI * 2;
    const rad = 0.13 - 0.04 * t;
    push(Math.cos(a) * rad, -0.36 - 0.62 * t, -0.24 - 0.14 * t + Math.sin(a) * rad, 0.6 + rand() * 0.35, 0.55);
  }

  // A sparse core, so the volume has depth between the surfaces.
  const nCore = count - X.length;
  for (let i = 0; i < nCore; i++) {
    const v = 1 - 2 * rand();
    const r = Math.sqrt(1 - v * v);
    const a = rand() * Math.PI * 2;
    const [x, y, z] = cerebrum(Math.cos(a) * r, v, Math.sin(a) * r);
    const depth = 0.25 + 0.5 * rand();
    push(x * depth, y * depth, z * depth, 0.5 + rand() * 0.3, 0.35);
  }

  const n = X.length;
  const x = Float32Array.from(X);
  const y = Float32Array.from(Y);
  const z = Float32Array.from(Z);

  // Birth order: outward from the spark, loosened with a little jitter, so
  // the build reads as a burst that settles into the shape.
  let maxD = 0;
  const dist = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    dist[i] = Math.hypot(x[i] - SPARK.x, y[i] - SPARK.y, z[i] - SPARK.z);
    if (dist[i] > maxD) maxD = dist[i];
  }
  const birth = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    birth[i] = clamp01(0.03 + 0.72 * (dist[i] / maxD) ** 1.15 + (rand() - 0.5) * 0.12) * (1 - FLIGHT);
  }

  // Links: each node to its three nearest neighbours within reach. O(n²) once,
  // at mount — a few milliseconds for a thousand nodes.
  const K = 3;
  const REACH = 0.21 * 0.21;
  const seen = new Set<number>();
  const pairs: number[] = [];
  const best = new Float32Array(K);
  const bestJ = new Int32Array(K);
  for (let i = 0; i < n; i++) {
    best.fill(Infinity);
    bestJ.fill(-1);
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const d = (x[i] - x[j]) ** 2 + (y[i] - y[j]) ** 2 + (z[i] - z[j]) ** 2;
      if (d > REACH || d >= best[K - 1]) continue;
      let k = K - 1;
      while (k > 0 && best[k - 1] > d) {
        best[k] = best[k - 1];
        bestJ[k] = bestJ[k - 1];
        k--;
      }
      best[k] = d;
      bestJ[k] = j;
    }
    for (let k = 0; k < K; k++) {
      const j = bestJ[k];
      if (j < 0) continue;
      const key = i < j ? i * 65536 + j : j * 65536 + i;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push(i, j);
    }
  }

  // Pathways: long links between cortex nodes, bowed in through the interior.
  const tracts: Tract[] = [];
  for (let tries = 0; tracts.length < 42 && tries < 4000; tries++) {
    const a = Math.floor(rand() * nCortex);
    const b = Math.floor(rand() * nCortex);
    const d = Math.hypot(x[a] - x[b], y[a] - y[b], z[a] - z[b]);
    if (d < 0.55 || d > 1.35) continue;
    const pull = 0.3 + rand() * 0.25;
    tracts.push({
      a,
      b,
      cx: ((x[a] + x[b]) / 2) * pull,
      cy: ((y[a] + y[b]) / 2) * pull,
      cz: ((z[a] + z[b]) / 2) * pull,
    });
  }

  return {
    n,
    x,
    y,
    z,
    size: Float32Array.from(S),
    glow: Float32Array.from(G),
    birth,
    edges: Uint16Array.from(pairs),
    tracts,
  };
}

/** A soft, warm point of light — drawn once, stamped per node. */
function makeSprite(core: string, mid: string, px: number) {
  const c = document.createElement("canvas");
  c.width = c.height = px;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
  grad.addColorStop(0, core);
  grad.addColorStop(0.12, core);
  grad.addColorStop(0.22, mid);
  grad.addColorStop(0.45, "rgba(255, 120, 40, 0.18)");
  grad.addColorStop(1, "rgba(255, 100, 30, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, px, px);
  return c;
}

type Pulse = { tract: number; t0: number; dur: number; reverse: boolean };

export default function Brain3D({ progress, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const brain = buildBrain(small ? 720 : 1100);
    const { n, x, y, z, size, glow, birth, edges, tracts } = brain;

    const nodeSprite = makeSprite("rgba(255, 238, 205, 1)", "rgba(255, 176, 92, 0.85)", 64);
    const pulseSprite = makeSprite("rgba(255, 252, 238, 1)", "rgba(255, 214, 150, 0.9)", 64);

    // Per-frame projections, reused: screen x/y, depth, perspective scale,
    // and how far each node is through its flight (0 unborn, 1 in place).
    const PX = new Float32Array(n);
    const PY = new Float32Array(n);
    const PZ = new Float32Array(n);
    const PS = new Float32Array(n);
    const PA = new Float32Array(n);
    // Scratch for one pathway's sample points.
    const SEG = 10;
    const TX = new Float32Array(SEG + 1);
    const TY = new Float32Array(SEG + 1);
    const TZ = new Float32Array(SEG + 1);

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.75 : 2);
      W = Math.max(1, Math.round(canvas.clientWidth * dpr));
      H = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;
    };

    // Pointer tilt (fine pointers only): the brain leans a little toward it.
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      ptr.tx = 0;
      ptr.ty = 0;
    };

    const pulses: Pulse[] = [];
    let lastT = 0;
    let spin = 0;

    const draw = (t: number) => {
      const p = reduced ? 1 : clamp01(progress.current);
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      if (!reduced) spin += dt * 0.16;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      const yaw = 1.05 + spin + ptr.x * 0.3;
      const pitch = -0.22 + ptr.y * 0.18;
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const s = Math.min(W / 2.5, H / 2.15);
      const ox = W / 2;
      const oy = H / 2;
      const D = 3.4; // camera distance, in model units

      // Model point → screen, into the given slot of the given arrays. Yaw
      // about the vertical axis, then pitch, then perspective; +0.14 lifts the
      // model so the stem's overhang doesn't push the cortex off-centre.
      const project = (
        px: number,
        py: number,
        pz: number,
        i: number,
        outX: Float32Array,
        outY: Float32Array,
        outZ: Float32Array,
      ) => {
        const x1 = px * cyw + pz * syw;
        const z1 = -px * syw + pz * cyw;
        const y2 = py * cp - z1 * sp;
        const z2 = py * sp + z1 * cp;
        const k = D / (D - z2);
        outX[i] = ox + x1 * s * k;
        outY[i] = oy - (y2 + 0.14) * s * k;
        outZ[i] = z2;
        return k;
      };

      // Nodes: fly out from the spark, ease into place.
      for (let i = 0; i < n; i++) {
        const a = clamp01((p - birth[i]) / FLIGHT);
        const e = 1 - (1 - a) ** 3;
        PA[i] = a;
        PS[i] = project(
          SPARK.x + (x[i] - SPARK.x) * e,
          SPARK.y + (y[i] - SPARK.y) * e,
          SPARK.z + (z[i] - SPARK.z) * e,
          i,
          PX,
          PY,
          PZ,
        );
      }
      const depthA = (zz: number) => 0.16 + 0.84 * clamp01((zz + 1.15) / 2.3) ** 1.3;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      // The spark: bright while the build is young, a faint core once it's done.
      project(SPARK.x, SPARK.y, SPARK.z, 0, TX, TY, TZ);
      const sx = TX[0];
      const sy = TY[0];
      const sparkR = s * (0.22 - 0.12 * p) * (1 + 0.06 * Math.sin(t / 380));
      ctx.globalAlpha = 1 - 0.78 * p;
      ctx.drawImage(pulseSprite, sx - sparkR, sy - sparkR, sparkR * 2, sparkR * 2);

      // Burst lines: every node still in flight trails a line back to the spark.
      if (p < 1) {
        ctx.lineWidth = 0.9 * dpr;
        ctx.strokeStyle = "rgb(255, 160, 80)";
        for (let i = 0; i < n; i++) {
          const a = PA[i];
          if (a <= 0 || a >= 1) continue;
          ctx.globalAlpha = (1 - a) * 0.45 * depthA(PZ[i]);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(PX[i], PY[i]);
          ctx.stroke();
        }
      }

      // Links, batched into depth bands so far ones fall back.
      ctx.lineWidth = 0.8 * dpr;
      ctx.strokeStyle = "rgb(255, 150, 70)";
      const BANDS = 5;
      for (let band = 0; band < BANDS; band++) {
        ctx.beginPath();
        let any = false;
        for (let k = 0; k < edges.length; k += 2) {
          const a = edges[k];
          const b = edges[k + 1];
          if (PA[a] < 1 || PA[b] < 1) continue;
          const zz = (PZ[a] + PZ[b]) / 2;
          const bnd = Math.min(BANDS - 1, Math.max(0, Math.floor(((zz + 1.15) / 2.3) * BANDS)));
          if (bnd !== band) continue;
          ctx.moveTo(PX[a], PY[a]);
          ctx.lineTo(PX[b], PY[b]);
          any = true;
        }
        if (!any) continue;
        ctx.globalAlpha = 0.05 + 0.2 * (band / (BANDS - 1)) ** 1.4;
        ctx.stroke();
      }
      // Links whose ends are still arriving fade in on their own.
      for (let k = 0; k < edges.length; k += 2) {
        const a = edges[k];
        const b = edges[k + 1];
        const m = Math.min(PA[a], PA[b]);
        if (m <= 0.4 || m >= 1) continue;
        ctx.globalAlpha = ((m - 0.4) / 0.6) ** 2 * 0.2 * depthA((PZ[a] + PZ[b]) / 2);
        ctx.beginPath();
        ctx.moveTo(PX[a], PY[a]);
        ctx.lineTo(PX[b], PY[b]);
        ctx.stroke();
      }

      // Pathways: bowed curves through the interior, lit once the brain forms.
      const tractA = smooth(0.62, 0.95, p);
      const tractPoint = (tr: Tract, u: number, j: number) => {
        const v = 1 - u;
        project(
          v * v * x[tr.a] + 2 * v * u * tr.cx + u * u * x[tr.b],
          v * v * y[tr.a] + 2 * v * u * tr.cy + u * u * y[tr.b],
          v * v * z[tr.a] + 2 * v * u * tr.cz + u * u * z[tr.b],
          j,
          TX,
          TY,
          TZ,
        );
      };
      if (tractA > 0) {
        ctx.lineWidth = 1.25 * dpr;
        ctx.strokeStyle = "rgb(255, 178, 100)";
        for (const tr of tracts) {
          for (let j = 0; j <= SEG; j++) tractPoint(tr, j / SEG, j);
          ctx.globalAlpha = tractA * 0.36 * depthA(TZ[SEG >> 1]);
          ctx.beginPath();
          ctx.moveTo(TX[0], TY[0]);
          for (let j = 1; j <= SEG; j++) ctx.lineTo(TX[j], TY[j]);
          ctx.stroke();
        }
      }

      // Nodes.
      const base = s * 0.052;
      for (let i = 0; i < n; i++) {
        const a = PA[i];
        if (a <= 0) continue;
        const alpha = Math.min(1, a * 3) * depthA(PZ[i]) * glow[i];
        if (alpha < 0.02) continue;
        const r = base * size[i] * PS[i];
        ctx.globalAlpha = alpha;
        ctx.drawImage(nodeSprite, PX[i] - r, PY[i] - r, r * 2, r * 2);
      }

      // Signals: sparks running the pathways — the brain, learning.
      if (!reduced && tractA > 0.5 && tracts.length) {
        const rate = 9 * tractA; // per second
        if (Math.random() < rate * dt) {
          pulses.push({
            tract: Math.floor(Math.random() * tracts.length),
            t0: t,
            dur: 900 + Math.random() * 900,
            reverse: Math.random() < 0.5,
          });
        }
        const pr = base * 2.2;
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pu = pulses[k];
          const u = (t - pu.t0) / pu.dur;
          if (u >= 1) {
            pulses.splice(k, 1);
            continue;
          }
          tractPoint(tracts[pu.tract], pu.reverse ? 1 - u : u, 0);
          ctx.globalAlpha = Math.sin(u * Math.PI) * tractA * depthA(TZ[0]);
          ctx.drawImage(pulseSprite, TX[0] - pr, TY[0] - pr, pr * 2, pr * 2);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // Animate only while on screen; a hidden tab or an off-screen card costs
    // nothing. Reduced motion draws one finished frame, and again on resize.
    let raf = 0;
    let visible = false;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduced || !visible || document.hidden) return;
      lastT = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    if (fine && !reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [progress]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
