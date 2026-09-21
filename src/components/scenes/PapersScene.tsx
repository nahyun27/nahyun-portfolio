"use client";

import { useEffect, useRef, useState } from "react";
import { rng } from "@/lib/ftl/sim";
import type { SceneTheme } from "@/data/projects";

const N = 16;
const BAD = 5; // the paper that carries a hidden instruction
const H = 360;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  risk: number;
  seen: boolean;
}

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** deterministic fake embeddings so the layout is stable between visits */
function build() {
  const r = rng(2024);
  const vec = Array.from({ length: N }, () => Array.from({ length: 6 }, () => r() * 2 - 1));
  const cos = (a: number[], b: number[]) => {
    let d = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return d / Math.sqrt(na * nb);
  };
  const sim = (i: number, j: number) => (cos(vec[i], vec[j]) + 1) / 2;
  const edges = new Map<string, { a: number; b: number; s: number }>();
  for (let i = 0; i < N; i++) {
    const near = Array.from({ length: N }, (_, j) => j).filter((j) => j !== i).sort((p, q) => sim(i, q) - sim(i, p)).slice(0, 2);
    for (const j of near) edges.set(`${Math.min(i, j)}-${Math.max(i, j)}`, { a: Math.min(i, j), b: Math.max(i, j), s: sim(i, j) });
  }
  return { edges: [...edges.values()], sim };
}

export default function PapersScene({ theme }: { theme: SceneTheme }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graph = useRef(build());
  const nodes = useRef<Node[] | null>(null);
  const probe = useRef<{ x: number; y: number } | null>(null);
  const scan = useRef({ active: false, x: 0, done: false, quarantine: 0 });
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    let raf = 0;
    let last = performance.now();
    let hover = -1;

    const loop = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.7);
      last = now;
      const w = box.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.height = `${H}px`;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (!nodes.current) {
        const r = rng(9);
        nodes.current = Array.from({ length: N }, () => ({ x: w * (0.2 + r() * 0.6), y: H * (0.2 + r() * 0.6), vx: 0, vy: 0, risk: 0.02 + r() * 0.08, seen: false }));
        nodes.current[BAD].risk = 0.94;
      }
      const ns = nodes.current;
      const { edges, sim } = graph.current;
      const sc = scan.current;

      // physics
      const rest = Math.min(w, H) * 0.3;
      for (let i = 0; i < N; i++) {
        const a = ns[i];
        for (let j = i + 1; j < N; j++) {
          const b = ns[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1; }
          const d = Math.sqrt(d2);
          const f = Math.min(6, 2400 / d2);
          a.vx += (dx / d) * f * dt; a.vy += (dy / d) * f * dt;
          b.vx -= (dx / d) * f * dt; b.vy -= (dy / d) * f * dt;
        }
        a.vx += (w / 2 - a.x) * 0.0016 * dt;
        a.vy += (H / 2 - a.y) * 0.0016 * dt;
        const p = probe.current;
        if (p) {
          const dx = a.x - p.x, dy = a.y - p.y, d = Math.hypot(dx, dy);
          if (d < 150 && d > 0.1) { const f = (1 - d / 150) * 5.5; a.vx += (dx / d) * f * dt; a.vy += (dy / d) * f * dt; }
        }
      }
      for (const e of edges) {
        const a = ns[e.a], b = ns[e.b];
        if (sc.done && (e.a === BAD || e.b === BAD)) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
        const f = (d - rest * (1.25 - e.s)) * 0.012 * dt;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      }
      for (const n of ns) {
        n.vx *= 0.86; n.vy *= 0.86;
        n.x = Math.max(18, Math.min(w - 18, n.x + n.vx * dt));
        n.y = Math.max(18, Math.min(H - 18, n.y + n.vy * dt));
      }

      // scan sweep
      if (sc.active) {
        sc.x += (w / 95) * dt;
        for (const n of ns) if (n.x < sc.x) n.seen = true;
        if (sc.x > w + 30) {
          sc.active = false;
          sc.done = true;
          setPhase("done");
        }
      }
      if (sc.done && sc.quarantine < 1) sc.quarantine = Math.min(1, sc.quarantine + 0.03 * dt);

      // draw
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, H);

      hover = -1;
      if (probe.current) {
        let best = 22;
        ns.forEach((n, i) => {
          const d = Math.hypot(n.x - probe.current!.x, n.y - probe.current!.y);
          if (d < best) { best = d; hover = i; }
        });
      }

      for (const e of edges) {
        const quarantined = sc.done && (e.a === BAD || e.b === BAD);
        const focus = hover >= 0 && (e.a === hover || e.b === hover);
        const alpha = (quarantined ? 0.05 * (1 - sc.quarantine) + 0.03 : 0.12 + e.s * 0.32) * (focus ? 2 : 1);
        ctx.strokeStyle = rgba(theme.fg, Math.min(0.85, alpha));
        ctx.lineWidth = focus ? 1.8 : 1;
        ctx.beginPath();
        ctx.moveTo(ns[e.a].x, ns[e.a].y);
        ctx.lineTo(ns[e.b].x, ns[e.b].y);
        ctx.stroke();
      }

      ns.forEach((n, i) => {
        const bad = i === BAD;
        const q = bad && sc.done ? sc.quarantine : 0;
        const r = 10 - q * 3.5 + (hover === i ? 2 : 0);
        // droplet body
        ctx.fillStyle = bad && n.seen ? theme.accent : theme.accent2;
        ctx.globalAlpha = q > 0 ? 1 - q * 0.6 : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(n.x - r * 0.3, n.y - r * 0.34, r * 0.26, 0, Math.PI * 2);
        ctx.fill();
        // unscanned suspect pulses faintly so curious people find it
        if (bad && !sc.done) {
          const pulse = (Math.sin(now / 420) + 1) / 2;
          ctx.strokeStyle = rgba(theme.accent, 0.15 + pulse * 0.25);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 5 + pulse * 5, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (q > 0) {
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = rgba(theme.accent, 0.9);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle = rgba(theme.fg, 0.6);
        ctx.font = "600 10px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(String(i + 1).padStart(2, "0"), n.x, n.y + r + 13);
        // risk chip once the scan line has passed
        if (n.seen) {
          const high = n.risk > 0.5;
          ctx.font = "700 10px 'Inter', sans-serif";
          ctx.fillStyle = high ? theme.accent : rgba(theme.fg, 0.55);
          ctx.fillText(high ? `risk ${n.risk.toFixed(2)}` : n.risk.toFixed(2), n.x, n.y - r - 8);
        }
      });

      if (sc.active) {
        const g = ctx.createLinearGradient(sc.x - 60, 0, sc.x, 0);
        g.addColorStop(0, rgba(theme.accent2, 0));
        g.addColorStop(1, rgba(theme.accent2, 0.35));
        ctx.fillStyle = g;
        ctx.fillRect(sc.x - 60, 0, 60, H);
        ctx.fillStyle = rgba(theme.accent2, 0.9);
        ctx.fillRect(sc.x - 1, 0, 2, H);
      }

      if (hover >= 0) {
        const n = ns[hover];
        let bestJ = -1, bestS = -1;
        for (let j = 0; j < N; j++) if (j !== hover && sim(hover, j) > bestS) { bestS = sim(hover, j); bestJ = j; }
        const text = `Paper ${String(hover + 1).padStart(2, "0")}  nearest ${String(bestJ + 1).padStart(2, "0")}  sim ${bestS.toFixed(2)}`;
        ctx.font = "600 11px 'Inter', sans-serif";
        const tw = ctx.measureText(text).width + 16;
        const tx = Math.min(w - tw - 4, Math.max(4, n.x - tw / 2));
        const ty = n.y > 60 ? n.y - 44 : n.y + 26;
        ctx.fillStyle = rgba(theme.fg, 0.92);
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, 22, 11);
        ctx.fill();
        ctx.fillStyle = theme.bg;
        ctx.textAlign = "left";
        ctx.fillText(text, tx + 8, ty + 15);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      probe.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (probe.current = null);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", move);
    canvas.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [theme]);

  const startScan = () => {
    if (phase === "scanning") return;
    const sc = scan.current;
    nodes.current?.forEach((n) => (n.seen = false));
    Object.assign(sc, { active: true, x: 0, done: false, quarantine: 0 });
    setPhase("scanning");
  };
  const reset = () => {
    const sc = scan.current;
    Object.assign(sc, { active: false, x: 0, done: false, quarantine: 0 });
    nodes.current?.forEach((n) => (n.seen = false));
    setPhase("idle");
  };

  const btn = (primary: boolean): React.CSSProperties => ({
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    padding: "8px 16px",
    borderRadius: 999,
    color: primary ? "#fff" : theme.fg,
    background: primary ? theme.accent : rgba(theme.fg, 0.07),
    border: `1px solid ${rgba(theme.fg, 0.14)}`,
    opacity: primary && phase === "scanning" ? 0.6 : 1,
    cursor: "none",
  });

  return (
    <div ref={boxRef} style={{ color: theme.fg }}>
      <div style={{ borderRadius: 22, background: rgba(theme.fg, 0.04), border: `1px solid ${rgba(theme.fg, 0.1)}`, overflow: "hidden", position: "relative" }}>
        <canvas ref={canvasRef} style={{ width: "100%", display: "block", touchAction: "none" }} />
        <div style={{ position: "absolute", left: 16, top: 14, fontSize: 12, opacity: 0.55 }}>Move your cursor through the papers. They drift by similarity.</div>
      </div>
      <div className="flex flex-wrap items-center" style={{ marginTop: 16, gap: 8 }}>
        <button style={btn(true)} data-cursor-hover onClick={startScan} disabled={phase === "scanning"}>
          {phase === "scanning" ? "Scanning..." : "Scan for prompt injection"}
        </button>
        <button style={btn(false)} data-cursor-hover onClick={reset}>
          Reset
        </button>
      </div>
      <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.65, maxWidth: 620, minHeight: 64, color: rgba(theme.fg, phase === "done" ? 0.9 : 0.6) }}>
        {phase === "done"
          ? "One chunk in Paper 06 tried to give the model an instruction, and its embedding sits very close to known attack phrasing (0.94). It is quarantined and the paper is cut out of the answer context."
          : "Every paper is chunked and embedded. The scan compares each chunk to known injection phrasing by meaning, so it works in Korean and English and does not depend on exact keywords."}
      </p>
    </div>
  );
}
