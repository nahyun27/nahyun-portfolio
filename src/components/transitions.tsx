"use client";

import { useEffect, useMemo } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Icon } from "@/components/ProjectIcon";
import { rng } from "@/lib/ftl/sim";
import type { TransitionKind } from "@/data/projects";

/**
 * How each project fills the screen. Every kind ends fully covered by the project's background, then
 * the shapes fade and the scene content takes over. `COVER_AT` is when that coverage is complete.
 */
export const COVER_AT: Record<TransitionKind, number> = {
  liquid: 1.2,
  tennis: 1.15,
  paper: 1.05,
  grid: 1.1,
  stack: 1.2,
  scan: 0.95,
  wave: 1.0,
  bars: 1.15,
  pills: 1.15,
  photos: 1.15,
  stamp: 0.9,
  eclipse: 1.05,
  darkness: 1.1,
};

interface Props {
  kind: TransitionKind;
  /** the colour the shapes fill with, and the screen ends up as */
  bg: string;
  /** colour of the persistent layer underneath once covered, follows the current project */
  solidBg?: string;
  accent: string;
  accent2: string;
  x: number;
  y: number;
  W: number;
  H: number;
  R: number;
  /** reduced motion: skip the choreography */
  fast?: boolean;
}

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const fill = "absolute inset-0";

// ------------------------------------------------------------------ liquid (metaball tide)
const OFFSETS: [number, number][] = [[0, 0], [-70, 30], [60, -40], [-40, -70], [80, 50], [-90, -20], [30, 80], [-20, 60], [50, -90]];

function Liquid({ bg, x, y, R }: Props) {
  return (
    <motion.svg className={`${fill} w-full h-full`} style={{ filter: "url(#flood-goo)", overflow: "visible" }} aria-hidden>
      {OFFSETS.map(([dx, dy], i) => (
        <motion.circle
          key={i}
          cx={x + dx}
          cy={y + dy}
          fill={bg}
          initial={{ r: 0 }}
          animate={{ r: R, transition: { duration: 0.95, delay: i * 0.0285, ease: [0.55, 0.05, 0.25, 1] } }}
          exit={{ r: 0, transition: { duration: 0.65, delay: (OFFSETS.length - i) * 0.02, ease: [0.5, 0, 0.75, 0] } }}
        />
      ))}
    </motion.svg>
  );
}

// ------------------------------------------------------------------ tennis ball flies in
function Tennis({ x, y, W, H }: Props) {
  const size = 120;
  const p0 = { x: -size, y: H * 0.94 };
  const p1 = { x: W * 0.3, y: H * 0.84 }; // first bounce on the ground
  const pk = { x: (p1.x + x) / 2, y: Math.min(y, H * 0.55) - 140 }; // apex of the second arc
  return (
    <motion.div
      className="absolute"
      style={{ left: 0, top: 0, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={{ x: p0.x, y: p0.y, scale: 0.4, rotate: 0 }}
      animate={{
        x: [p0.x, p1.x, pk.x, x, x],
        y: [p0.y, p1.y, pk.y, y, y],
        scale: [0.4, 0.55, 0.78, 1, 34],
        rotate: [0, 300, 520, 700, 900],
        transition: { duration: 1.1, times: [0, 0.3, 0.56, 0.78, 1], ease: ["easeIn", "easeOut", "easeIn", "easeIn"] },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 34% 28%, #F7FFA6, #D7F23B 50%, #9DB816 100%)",
          boxShadow: "inset -10px -12px 22px rgba(0,0,0,0.28), 0 18px 30px -12px rgba(0,0,0,0.45)",
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden>
          <path d="M17 12 C 44 34, 44 66, 17 88" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.92" />
          <path d="M83 12 C 56 34, 56 66, 83 88" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.92" />
        </svg>
      </div>
    </motion.div>
  );
}

// ------------------------------------------------------------------ pages turning
function Paper({ bg }: Props) {
  const sheet = (color: string, delay: number, key: string) => (
    <motion.div
      key={key}
      className={fill}
      style={{ transformOrigin: "left center", backfaceVisibility: "hidden", background: color }}
      initial={{ rotateY: -165 }}
      animate={{ rotateY: 0, transition: { duration: 0.8, delay, ease: [0.55, 0.05, 0.25, 1] } }}
    >
      {/* faint ruled lines and a fold shadow that fades as the page lands */}
      <div className={fill} style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.028) 0 1px, transparent 1px 34px)" }} />
      <motion.div
        className={fill}
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.42), rgba(0,0,0,0.06) 35%, transparent 60%)" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transition: { duration: 0.85, delay, ease: "easeOut" } }}
      />
    </motion.div>
  );
  return (
    <div className={fill} style={{ perspective: 2400, overflow: "hidden" }}>
      {sheet("#E4DBC4", 0, "back")}
      {sheet(bg, 0.26, "front")}
    </div>
  );
}

// ------------------------------------------------------------------ grid families
function Cells({ bg, accent, accent2, cols, rows, order, pop }: Props & { cols: number; rows: number; order: (i: number, r: () => number) => number; pop: "scale" | "rise" }) {
  const cells = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: cols * rows }, (_, i) => ({ i, delay: order(i, r), hot: (i * 7 + Math.floor(i / cols)) % 5 < 2 }));
  }, [cols, rows, order]);
  return (
    <div className={fill} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {cells.map((c) => {
        const flash = pop === "rise" ? accent : c.hot ? accent : accent2;
        return (
          <motion.div
            key={c.i}
            style={{ transformOrigin: pop === "rise" ? "bottom" : "center" }}
            initial={pop === "rise" ? { y: 70, opacity: 0, scaleY: 0.5, backgroundColor: flash } : { scale: 0, backgroundColor: flash }}
            animate={
              pop === "rise"
                ? { y: 0, opacity: 1, scaleY: 1.06, scaleX: 1.04, backgroundColor: [flash, bg], transition: { duration: 0.36, delay: c.delay, ease: "easeOut" } }
                : { scale: 1.08, backgroundColor: [flash, bg], transition: { duration: 0.4, delay: c.delay, ease: "easeOut" } }
            }
          />
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------ terminal scanline
function Scan({ bg, accent }: Props) {
  const t = { duration: 0.85, ease: [0.3, 0.1, 0.2, 1] as [number, number, number, number] };
  return (
    <>
      <motion.div className={fill} style={{ background: bg }} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)", transition: t }}>
        <div className={fill} style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)" }} />
      </motion.div>
      <motion.div
        className="absolute left-0 right-0"
        style={{ height: 3, background: accent, boxShadow: `0 0 22px ${accent}, 0 0 70px ${rgba(accent, 0.7)}` }}
        initial={{ top: "0%", opacity: 1 }}
        animate={{ top: "100%", opacity: [1, 1, 0.9, 0], transition: { ...t, times: [0, 0.6, 0.9, 1] } }}
      />
    </>
  );
}

// ------------------------------------------------------------------ equalizer bars
function Bars({ bg, accent, from }: Props & { from: "center" | "bottom" }) {
  const n = 36;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const delay = from === "center" ? Math.abs(i - n / 2 + 0.5) * 0.028 : i * 0.018;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${(i * 100) / n}%`, width: `${100 / n + 0.45}%`, top: 0, bottom: 0, transformOrigin: from === "center" ? "center" : "bottom" }}
            initial={{ scaleY: 0, backgroundColor: accent }}
            animate={{ scaleY: 1.02, backgroundColor: [accent, bg], transition: { duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] } }}
          />
        );
      })}
    </>
  );
}

// ------------------------------------------------------------------ pills and photo frames swell to cover
function Flyers({ accent, accent2, W, H, shape }: Props & { shape: "pill" | "photo" }) {
  const items = useMemo(() => {
    const r = rng(shape === "pill" ? 11 : 23);
    const cols = 4;
    const rows = 4;
    return Array.from({ length: cols * rows }, (_, i) => ({
      x: ((i % cols) + 0.5 + (r() - 0.5) * 0.7) * (W / cols),
      y: (Math.floor(i / cols) + 0.5 + (r() - 0.5) * 0.7) * (H / rows),
      rot: (r() - 0.5) * 120,
      delay: r() * 0.45,
      c: i % 3,
    }));
  }, [W, H, shape]);
  const colours = [accent, accent2, "#FFFFFF"];
  return (
    <>
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: it.x, top: it.y, width: 160, height: shape === "pill" ? 62 : 190, marginLeft: -80, marginTop: shape === "pill" ? -31 : -95 }}
          initial={{ scale: 0, rotate: it.rot - 40 }}
          animate={{ scale: [0, 1.25, shape === "pill" ? 9 : 8], rotate: it.rot, transition: { duration: 0.7, delay: it.delay, times: [0, 0.3, 1], ease: "easeIn" } }}
        >
          {shape === "pill" ? (
            <div style={{ width: "100%", height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${colours[it.c]} 50%, ${colours[(it.c + 1) % 3]} 50%)`, boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.12), inset 0 4px 6px rgba(255,255,255,0.5)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#fff", padding: "10px 10px 34px", boxShadow: "0 14px 26px -10px rgba(0,0,0,0.5)" }}>
              <div style={{ width: "100%", height: "100%", background: `linear-gradient(140deg, ${colours[it.c]}, ${accent2})` }} />
            </div>
          )}
        </motion.div>
      ))}
    </>
  );
}

// ------------------------------------------------------------------ gavel seal stamps down, then the ripple takes the screen
function Stamp({ bg, accent, x, y, R }: Props) {
  const seal = 200;
  return (
    <>
      <motion.div
        className={fill}
        style={{ background: bg }}
        initial={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
        animate={{ clipPath: `circle(${R}px at ${x}px ${y}px)`, transition: { delay: 0.28, duration: 0.6, ease: [0.6, 0.05, 0.3, 1] } }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ left: x - seal / 2, top: y - seal / 2, width: seal, height: seal, border: `4px solid ${accent}` }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 12, opacity: [0, 0.9, 0], transition: { delay: 0.24, duration: 0.65, ease: "easeOut" } }}
      />
      <motion.div
        className="absolute grid place-items-center rounded-full"
        style={{ left: x - seal / 2, top: y - seal / 2, width: seal, height: seal, border: `8px solid ${accent}`, background: rgba(bg, 0.96), color: accent, boxShadow: `0 20px 50px -10px rgba(0,0,0,0.6), inset 0 0 0 6px ${rgba(accent, 0.25)}` }}
        initial={{ scale: 3.2, opacity: 0, rotate: -28 }}
        animate={{ scale: [3.2, 1, 1], opacity: [0, 1, 1], rotate: [-28, -10, -10], transition: { duration: 0.42, times: [0, 0.6, 1], ease: "easeIn" } }}
      >
        <Icon name="scale" size={96} strokeWidth={1.3} />
      </motion.div>
    </>
  );
}

// ------------------------------------------------------------------ moon slides across a sun, then the shadow swallows the screen
function Eclipse({ bg, accent, x, y, R }: Props) {
  const d = 170;
  const grow = (2 * R) / d;
  return (
    <>
      <motion.div
        className="absolute rounded-full"
        style={{ left: x - d / 2, top: y - d / 2, width: d, height: d, background: `radial-gradient(circle at 40% 35%, #fff, ${accent} 60%)`, boxShadow: `0 0 80px ${rgba(accent, 0.8)}` }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 1], transition: { duration: 0.5, times: [0, 0.5, 1], ease: "easeOut" } }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ left: x - d / 2, top: y - d / 2, width: d, height: d, background: bg }}
        initial={{ x: -260, scale: 1 }}
        animate={{ x: [-260, -44, -44], scale: [1, 1, grow], transition: { duration: 1.0, delay: 0.12, times: [0, 0.42, 1], ease: ["easeOut", "easeIn"] } }}
      />
    </>
  );
}

// ------------------------------------------------------------------ flashlight failing, then dark
function Darkness({ bg, x, y, R }: Props) {
  const r = useMotionValue(R);
  const bg0 = rgba(bg, 0);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${bg0} ${r}px, ${bg} calc(${r}px + 70px))`;
  useEffect(() => {
    const c = animate(r, [R, R * 0.55, R * 0.62, R * 0.25, R * 0.3, 0], { duration: 1.1, times: [0, 0.3, 0.42, 0.7, 0.8, 1], ease: "easeInOut" });
    return () => c.stop();
  }, [r, R]);
  return <motion.div className={fill} style={{ background }} />;
}

// ------------------------------------------------------------------ entry point
const seq = (i: number) => i * 0.006;
const stackOrder = (i: number, r: () => number) => (5 - Math.floor(i / 12)) * 0.11 + r() * 0.28;

export function Transition(props: Props) {
  const { kind, bg, solidBg, fast } = props;
  const cover = COVER_AT[kind];
  const solid = solidBg ?? bg;

  if (fast) {
    return <motion.div className={fill} style={{ background: solid }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.01 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} />;
  }

  const shapes = (() => {
    switch (kind) {
      case "liquid": return <Liquid {...props} />;
      case "tennis": return <Tennis {...props} />;
      case "paper": return <Paper {...props} />;
      case "grid": return <Cells {...props} cols={14} rows={8} order={seq} pop="scale" />;
      case "stack": return <Cells {...props} cols={12} rows={6} order={stackOrder} pop="rise" />;
      case "scan": return <Scan {...props} />;
      case "wave": return <Bars {...props} from="center" />;
      case "bars": return <Bars {...props} from="bottom" />;
      case "pills": return <Flyers {...props} shape="pill" />;
      case "photos": return <Flyers {...props} shape="photo" />;
      case "stamp": return <Stamp {...props} />;
      case "eclipse": return <Eclipse {...props} />;
      case "darkness": return <Darkness {...props} />;
    }
  })();

  if (kind === "liquid") return shapes;

  return (
    <>
      {/* persistent base once the shapes have covered the screen */}
      <motion.div className={fill} style={{ background: solid }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: cover, duration: 0.18 } }} exit={{ opacity: 0, transition: { duration: 0.35 } }} />
      <motion.div className={fill} initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { delay: cover + 0.04, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.05 } }}>
        {shapes}
      </motion.div>
    </>
  );
}
