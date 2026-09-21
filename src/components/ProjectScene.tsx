"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ProjectIcon";
import { LINK_ICONS, ARROW_ICON } from "@/components/LinkIcons";
import LiquidStage from "@/components/scenes/LiquidStage";
import SsdScene from "@/components/scenes/SsdScene";
import PapersScene from "@/components/scenes/PapersScene";
import NshTerminal from "@/components/scenes/NshTerminal";
import type { Project, ProjectMedia, SceneTheme } from "@/data/projects";

export interface SceneOrigin {
  x: number;
  y: number;
  R: number;
}

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** readable text colour on top of a fill */
function on(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum > 0.6 ? "#0B0D10" : "#FFFFFF";
}

const OFFSETS: [number, number][] = [[0, 0], [-70, 30], [60, -40], [-40, -70], [80, 50], [-90, -20], [30, 80], [-20, 60], [50, -90]];

/** Liquid fill: circles swell from the click point and a gooey filter fuses them into one lumpy tide. */
function Flood({ color, x, y, R, duration = 0.95, fast }: { color: string; x: number; y: number; R: number; duration?: number; fast?: boolean }) {
  const d = fast ? 0.01 : duration;
  return (
    <motion.svg className="absolute inset-0 w-full h-full" style={{ filter: "url(#flood-goo)", overflow: "visible" }} aria-hidden>
      {OFFSETS.map(([dx, dy], i) => (
        <motion.circle
          key={i}
          cx={x + dx}
          cy={y + dy}
          fill={color}
          initial={{ r: 0 }}
          animate={{ r: R, transition: { duration: d, delay: fast ? 0 : i * (duration * 0.03), ease: [0.55, 0.05, 0.25, 1] } }}
          exit={{ r: 0, transition: { duration: fast ? 0.01 : 0.65, delay: fast ? 0 : (OFFSETS.length - i) * 0.02, ease: [0.5, 0, 0.75, 0] } }}
        />
      ))}
    </motion.svg>
  );
}

function StageTabs({ tabs, theme }: { tabs: { label: string; node: React.ReactNode }[]; theme: SceneTheme }) {
  const [i, setI] = useState(0);
  return (
    <div>
      {tabs.length > 1 && (
        <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 18 }}>
          {tabs.map((t, k) => (
            <button
              key={t.label}
              onClick={() => setI(k)}
              data-cursor-hover
              aria-pressed={i === k}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "7px 15px",
                borderRadius: 999,
                color: i === k ? on(theme.accent) : theme.fg,
                background: i === k ? theme.accent : rgba(theme.fg, 0.07),
                border: `1px solid ${rgba(theme.fg, 0.14)}`,
                cursor: "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      {tabs[i].node}
    </div>
  );
}

function SceneMedia({ media, theme }: { media: ProjectMedia[]; theme: SceneTheme }) {
  const [i, setI] = useState(0);
  const item = media[i];
  if (!item) return null;
  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "62%",
          borderRadius: 24,
          overflow: "hidden",
          background: item.bg ?? rgba(theme.fg, 0.06),
          border: `1px solid ${rgba(theme.fg, 0.14)}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={item.src}
          alt={item.label}
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: item.fit ?? "cover", objectPosition: item.position ?? "center" }}
        />
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap" style={{ gap: 8, marginTop: 14 }}>
          {media.map((m, k) => (
            <button
              key={m.src}
              onClick={() => setI(k)}
              data-cursor-hover
              aria-pressed={i === k}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 999,
                color: theme.fg,
                background: i === k ? rgba(theme.fg, 0.16) : "transparent",
                border: `1px solid ${rgba(theme.fg, 0.2)}`,
                cursor: "none",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
      {item.caption && <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: rgba(theme.fg, 0.65) }}>{item.caption}</p>}
    </div>
  );
}

const SHELL_CHIPS = [
  "ps -A | grep -i system | awk '{print $1,$4}'",
  "cat nsh.c | head -6 | tail -5 | head -1",
  'sort < nsh.c | grep "int " | awk \'{print $1,$2}\' > delme3',
  "cat delme3",
  "date; pwd; ls",
  "sleep 5 &",
  "history",
  "!!",
  "help",
];

function Stage({ p }: { p: Project }) {
  const t = p.theme;
  const media = p.media ?? [];
  const screens = media.length ? { label: p.stage === "ssd" ? "Measured on FEMU" : p.stage === "shell" ? "Screenshot" : "Screens", node: <SceneMedia media={media} theme={t} /> } : null;
  if (p.stage === "ssd") return <StageTabs theme={t} tabs={[{ label: "Live model", node: <SsdScene theme={t} /> }, ...(screens ? [screens] : [])]} />;
  if (p.stage === "papers") return <StageTabs theme={t} tabs={[{ label: "Live graph", node: <PapersScene theme={t} /> }, ...(screens ? [{ ...screens, label: "Real demos" }] : [])]} />;
  if (p.stage === "shell")
    return (
      <StageTabs
        theme={t}
        tabs={[
          { label: "Try it", node: <NshTerminal chips={SHELL_CHIPS} autoDemo={SHELL_CHIPS[0]} height={400} palette={{ bg: rgba("#000000", 0.55) }} /> },
          ...(screens ? [screens] : []),
        ]}
      />
    );
  const liquid = <LiquidStage theme={t} icon={p.icon} label={p.title} />;
  return screens ? <StageTabs theme={t} tabs={[{ label: "Scene", node: liquid }, screens]} /> : liquid;
}

interface Props {
  projects: Project[];
  startIndex: number;
  origin: SceneOrigin;
  onClose: () => void;
}

export default function ProjectScene({ projects, startIndex, origin, onClose }: Props) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(startIndex);
  const [wave, setWave] = useState<{ key: number; color: string; x: number; y: number } | null>(null);
  const waving = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const p = projects[idx];
  const t = p.theme;

  // lock page scroll, move focus into the scene and give it back afterwards
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  const go = useCallback(
    (delta: number, x?: number, y?: number) => {
      if (waving.current) return;
      const next = (idx + delta + projects.length) % projects.length;
      const cx = x ?? window.innerWidth / 2;
      const cy = y ?? window.innerHeight / 2;
      if (reduce) {
        setIdx(next);
        return;
      }
      waving.current = true;
      setWave({ key: Date.now(), color: projects[next].theme.bg, x: cx, y: cy });
      window.setTimeout(() => setIdx(next), 880);
      window.setTimeout(() => {
        setWave(null);
        waving.current = false;
      }, 960);
    },
    [idx, projects, reduce]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "Escape") onClose();
      else if (!typing && e.key === "ArrowRight") go(1);
      else if (!typing && e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const center = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const ctrl: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 999,
    color: t.fg,
    background: rgba(t.fg, 0.1),
    border: `1px solid ${rgba(t.fg, 0.16)}`,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    cursor: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 700,
  };

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      className="fixed inset-0 z-[300]"
      style={{ overflowY: "auto", overflowX: "hidden", color: t.fg }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <filter id="flood-goo" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
      </svg>

      {/* base tide, fixed behind everything so the scene can scroll over it */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Flood color={t.bg} x={origin.x} y={origin.y} R={origin.R} fast={!!reduce} />
      </div>

      <motion.div
        className="relative"
        style={{ zIndex: 10, minHeight: "100%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.7, duration: 0.45 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        {/* top bar */}
        <div className="sticky top-0 flex items-center justify-between" style={{ zIndex: 30, padding: "18px clamp(20px, 5vw, 72px)", gap: 12 }}>
          <button ref={closeRef} onClick={onClose} data-cursor-hover style={{ ...ctrl, padding: "0 20px", gap: 10 }} aria-label="Back to work">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Work
          </button>
          <div className="flex items-center" style={{ gap: 10 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, opacity: 0.7, fontVariantNumeric: "tabular-nums", marginRight: 6 }}>
              {p.id} / {String(projects.length).padStart(2, "0")}
            </span>
            <button onClick={(e) => { const c = center(e); go(-1, c.x, c.y); }} data-cursor-hover style={{ ...ctrl, width: 44 }} aria-label="Previous project">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={(e) => { const c = center(e); go(1, c.x, c.y); }} data-cursor-hover style={{ ...ctrl, width: 44 }} aria-label="Next project">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          style={{ gap: "clamp(28px, 4vw, 64px)", padding: "12px clamp(20px, 5vw, 72px) 72px", maxWidth: 1500, margin: "0 auto" }}
        >
          {/* text */}
          <div className="flex flex-col" style={{ gap: 24, minWidth: 0 }}>
            <div className="flex items-center" style={{ gap: 14 }}>
              <span
                className="blob-morph grid place-items-center shrink-0"
                style={{
                  width: 60,
                  height: 60,
                  color: on(t.accent),
                  background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,0.6), transparent 45%), linear-gradient(140deg, ${t.accent}, ${t.accent2})`,
                  boxShadow: `0 14px 30px -12px ${rgba(t.accent, 0.7)}, inset 0 -6px 12px -6px rgba(0,0,0,0.2)`,
                  animation: "blob-morph 8s ease-in-out infinite",
                }}
              >
                <Icon name={p.icon} size={26} strokeWidth={1.9} />
              </span>
              {p.badge && (
                <span
                  className="inline-flex items-center"
                  style={{ gap: 8, padding: "6px 14px", borderRadius: 999, background: rgba(t.fg, 0.1), border: `1px solid ${rgba(t.fg, 0.16)}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}
                >
                  <span className="animate-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: t.accent }} />
                  {p.badge}
                </span>
              )}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 5vw, 4.6rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                overflowWrap: "anywhere",
              }}
            >
              {p.title}
            </h3>

            <p style={{ fontSize: 17, lineHeight: 1.7, color: rgba(t.fg, 0.78), maxWidth: 560 }}>{p.summary}</p>

            <div className="flex flex-wrap" style={{ gap: 10 }}>
              {p.links.map((l, k) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="inline-flex items-center transition-transform duration-300 hover:-translate-y-0.5"
                  style={{
                    gap: 9,
                    height: 46,
                    padding: "0 22px",
                    borderRadius: 999,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "none",
                    color: k === 0 ? on(t.accent) : t.fg,
                    background: k === 0 ? t.accent : "transparent",
                    border: `1px solid ${k === 0 ? t.accent : rgba(t.fg, 0.35)}`,
                    boxShadow: k === 0 ? `0 12px 28px -12px ${rgba(t.accent, 0.8)}` : "none",
                  }}
                >
                  {LINK_ICONS[l.kind]}
                  {l.label}
                  {ARROW_ICON}
                </a>
              ))}
            </div>

            {p.metrics && (
              <div className="flex flex-wrap" style={{ gap: 12 }}>
                {p.metrics.map((m) => (
                  <div key={m.label} style={{ padding: "14px 20px", borderRadius: 22, background: rgba(t.fg, 0.07), border: `1px solid ${rgba(t.fg, 0.12)}` }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, lineHeight: 1, letterSpacing: "-0.03em" }}>{m.value}</div>
                    <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: rgba(t.fg, 0.6) }}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            <ul className="flex flex-col" style={{ gap: 12, borderTop: `1px solid ${rgba(t.fg, 0.14)}`, paddingTop: 22 }}>
              {p.highlights.map((h) => (
                <li key={h} className="flex" style={{ gap: 12, fontSize: 15, lineHeight: 1.65, color: rgba(t.fg, 0.82) }}>
                  <span className="shrink-0" style={{ width: 8, height: 8, marginTop: 9, borderRadius: "50%", background: t.accent, boxShadow: `inset -1px -1px 2px rgba(0,0,0,0.2)` }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap" style={{ gap: 8, borderTop: `1px solid ${rgba(t.fg, 0.14)}`, paddingTop: 18 }}>
              {p.tags.map((tag) => (
                <span key={tag} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: rgba(t.fg, 0.08), border: `1px solid ${rgba(t.fg, 0.14)}` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* stage */}
          <div className="lg:sticky lg:self-start" style={{ top: 88, minWidth: 0 }}>
            <Stage key={p.id} p={p} />
          </div>
        </motion.div>
      </motion.div>

      {/* tide for switching projects, sweeps over the content and is gone once the new scene is under it */}
      {wave && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          <Flood key={wave.key} color={wave.color} x={wave.x} y={wave.y} R={origin.R} duration={0.7} />
        </div>
      )}
    </motion.div>,
    document.body
  );
}

