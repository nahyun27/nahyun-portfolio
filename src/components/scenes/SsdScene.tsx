"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BLOCKS, HOT_SET, PPB, FtlSim, makeWorkload } from "@/lib/ftl/sim";
import type { SceneTheme } from "@/data/projects";

const COLS = 8;
const PER_TILE = 4; // pages per tile row and column (16 pages)
const GAP = 6;

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function draw(canvas: HTMLCanvasElement, sim: FtlSim, w: number, theme: SceneTheme) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const tile = (w - GAP * (COLS - 1)) / COLS;
  const rows = Math.ceil(BLOCKS / COLS);
  const h = rows * tile + (rows - 1) * GAP;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = `${h}px`;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const cell = tile / PER_TILE;
  const r = cell * 0.36;

  for (let b = 0; b < BLOCKS; b++) {
    const tx = (b % COLS) * (tile + GAP);
    const ty = Math.floor(b / COLS) * (tile + GAP);
    ctx.fillStyle = rgba(theme.fg, 0.05);
    ctx.beginPath();
    ctx.roundRect(tx, ty, tile, tile, 9);
    ctx.fill();

    if (sim.flash[b] > 0) {
      ctx.fillStyle = rgba("#FFFFFF", (sim.flash[b] / 24) * 0.55);
      ctx.beginPath();
      ctx.roundRect(tx, ty, tile, tile, 9);
      ctx.fill();
      sim.flash[b]--;
    }

    for (let i = 0; i < PPB; i++) {
      const ppn = b * PPB + i;
      const cx = tx + cell * ((i % PER_TILE) + 0.5);
      const cy = ty + cell * (Math.floor(i / PER_TILE) + 0.5);
      const st = sim.state[ppn];
      if (st === 0) {
        ctx.fillStyle = rgba(theme.fg, 0.16);
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
        ctx.fill();
      } else if (st === 1) {
        const truthHot = sim.lpnOf[ppn] < HOT_SET;
        ctx.fillStyle = truthHot ? theme.accent : theme.accent2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.arc(cx - r * 0.32, cy - r * 0.34, r * 0.24, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = rgba(theme.fg, 0.3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (sim.blockState[b] === 1) {
      ctx.strokeStyle = rgba(theme.fg, 0.55);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tx + 0.5, ty + 0.5, tile - 1, tile - 1, 9);
      ctx.stroke();
    }
  }
}

function makeSims() {
  return { a: new FtlSim("baseline"), b: new FtlSim("hotcold"), wa: makeWorkload(11), wb: makeWorkload(11) };
}

interface Stats {
  waf: number;
  copies: number;
  erases: number;
}

function Panel({
  title,
  sub,
  canvasRef,
  stats,
  theme,
  maxWaf,
}: {
  title: string;
  sub: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  stats: Stats;
  theme: SceneTheme;
  maxWaf: number;
}) {
  const level = Math.min(1, (stats.waf - 1) / (maxWaf - 1));
  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-end justify-between" style={{ marginBottom: 10, gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>{title}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{sub}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
            {stats.waf.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: "0.1em", textTransform: "uppercase" }}>WAF</div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />
      {/* liquid gauge: the fuller the tank, the more the drive writes on its own */}
      <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: rgba(theme.fg, 0.1), overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(4, level * 100)}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${theme.accent2}, ${theme.accent})`,
            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
      <div className="flex" style={{ marginTop: 8, gap: 16, fontSize: 12, opacity: 0.65, fontVariantNumeric: "tabular-nums" }}>
        <span>GC copies {stats.copies.toLocaleString()}</span>
        <span>erases {stats.erases.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function SsdScene({ theme }: { theme: SceneTheme }) {
  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const sims = useRef<{ a: FtlSim; b: FtlSim; wa: ReturnType<typeof makeWorkload>; wb: ReturnType<typeof makeWorkload> } | null>(null);
  const burst = useRef(0);
  const running = useRef(true);
  const speed = useRef(1);
  const [uiRunning, setUiRunning] = useState(true);
  const [uiSpeed, setUiSpeed] = useState(1);
  const [statsA, setStatsA] = useState<Stats>({ waf: 1, copies: 0, erases: 0 });
  const [statsB, setStatsB] = useState<Stats>({ waf: 1, copies: 0, erases: 0 });

  const reset = useCallback(() => {
    sims.current = makeSims();
    burst.current = 0;
    setStatsA({ waf: 1, copies: 0, erases: 0 });
    setStatsB({ waf: 1, copies: 0, erases: 0 });
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let lastStats = 0;
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!sims.current) sims.current = makeSims();
      const s = sims.current;
      const box = boxRef.current;
      if (s && box) {
        if (running.current) {
          acc += (dt * 110 * speed.current) / 1000;
          while (acc >= 1) {
            acc -= 1;
            const isBurst = burst.current > 0;
            s.a.write(s.wa(isBurst));
            s.b.write(s.wb(isBurst));
          }
          if (burst.current > 0) burst.current -= dt / 16;
        }
        const w = (box.clientWidth - 24) / (window.innerWidth >= 1024 ? 2 : 1);
        if (canvasA.current) draw(canvasA.current, s.a, Math.max(120, w), theme);
        if (canvasB.current) draw(canvasB.current, s.b, Math.max(120, w), theme);
        if (now - lastStats > 250) {
          lastStats = now;
          setStatsA({ waf: s.a.waf, copies: s.a.gcCopies, erases: s.a.erases });
          setStatsB({ waf: s.b.waf, copies: s.b.gcCopies, erases: s.b.erases });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [theme]);

  const btn = (active = false): React.CSSProperties => ({
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 14px",
    borderRadius: 999,
    color: active ? theme.bg : theme.fg,
    background: active ? theme.accent : rgba(theme.fg, 0.08),
    border: `1px solid ${rgba(theme.fg, 0.14)}`,
    cursor: "none",
  });

  const maxWaf = Math.max(3, statsA.waf + 0.4);

  return (
    <div ref={boxRef} style={{ color: theme.fg }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        <Panel title="Baseline FTL" sub="one write pool, hot and cold data mixed" canvasRef={canvasA} stats={statsA} theme={theme} maxWaf={maxWaf} />
        <Panel title="Hot / Cold FTL" sub="two pools, frequency classified" canvasRef={canvasB} stats={statsB} theme={theme} maxWaf={maxWaf} />
      </div>

      <div className="flex flex-wrap items-center" style={{ marginTop: 20, gap: 8 }}>
        <button
          style={btn()}
          data-cursor-hover
          onClick={() => {
            running.current = !running.current;
            setUiRunning(running.current);
          }}
        >
          {uiRunning ? "Pause" : "Play"}
        </button>
        <button
          style={btn(uiSpeed === 4)}
          data-cursor-hover
          onClick={() => {
            speed.current = speed.current === 1 ? 4 : 1;
            setUiSpeed(speed.current);
          }}
        >
          {uiSpeed === 4 ? "4x speed" : "1x speed"}
        </button>
        <button style={btn()} data-cursor-hover onClick={() => (burst.current = 240)}>
          Hot burst
        </button>
        <button style={btn()} data-cursor-hover onClick={reset}>
          Reset
        </button>
        <div className="flex items-center" style={{ gap: 14, marginLeft: "auto", fontSize: 12, opacity: 0.75 }}>
          <span className="inline-flex items-center" style={{ gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 999, background: theme.accent, display: "inline-block" }} />
            hot data
          </span>
          <span className="inline-flex items-center" style={{ gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 999, background: theme.accent2, display: "inline-block" }} />
            cold data
          </span>
          <span className="inline-flex items-center" style={{ gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 999, border: `1px solid ${rgba(theme.fg, 0.5)}`, display: "inline-block" }} />
            invalid
          </span>
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.65, opacity: 0.65, maxWidth: 640 }}>
        Both drives receive the exact same writes: 90% of them hit 10% of the addresses. The baseline scatters hot and cold pages across
        every block, so garbage collection keeps moving cold data. Separating them leaves whole blocks of dead hot pages that erase for
        free. This is a small model of the idea, so its absolute numbers differ from the FEMU measurement (WAF 7.8 to 3.9).
      </p>
    </div>
  );
}
