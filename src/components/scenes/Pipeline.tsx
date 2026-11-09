"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { SceneTheme } from "@/data/projects";

export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function onColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum > 0.6 ? "#0B0D10" : "#FFFFFF";
}

export interface PipelineStep {
  label: string;
  /** one or two sentences shown while the step is lit */
  detail: string;
  /** what is in hand after this step, e.g. a file or a status */
  artifact?: string;
  /** who or what does the step, shown as a small tag */
  actor?: string;
}

export interface PipelineAlt {
  /** index of the step where the other outcome branches off */
  at: number;
  /** label for the switch, e.g. "Fail the quality gate" */
  toggle: string;
  label: string;
  detail: string;
  artifact?: string;
}

/**
 * A process drawn as a rail of steps that light up in order, with the current step's detail and
 * artifact beside it. Click a step to stop on it. An optional alternate outcome lets a switch
 * divert the run at one step (a failed gate, a refund, a low-confidence match).
 */
export default function Pipeline({ theme, steps, alt, title, interval = 1900 }: { theme: SceneTheme; steps: PipelineStep[]; alt?: PipelineAlt; title?: string; interval?: number }) {
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [diverted, setDiverted] = useState(false);
  const t = theme;

  // the run ends at the branch step when the alternate outcome is switched on
  const last = alt && diverted ? alt.at : steps.length - 1;
  const failed = !!alt && diverted && at === alt.at;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setAt((a) => (a >= last ? 0 : a + 1)), at >= last ? interval * 1.8 : interval);
    return () => window.clearTimeout(id);
  }, [playing, at, last, interval]);

  const current = failed ? { label: alt!.label, detail: alt!.detail, artifact: alt!.artifact, actor: undefined } : steps[at];

  const chip: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 34,
    padding: "0 14px",
    borderRadius: 999,
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 700,
    color: t.fg,
    background: rgba(t.fg, 0.08),
    border: `1px solid ${rgba(t.fg, 0.16)}`,
    cursor: "none",
  };

  return (
    <div style={{ color: t.fg }}>
      <div className="flex flex-wrap items-center justify-between" style={{ gap: 10, marginBottom: 16 }}>
        {title && <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: rgba(t.fg, 0.6) }}>{title}</p>}
        <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
          {alt && (
            <button
              type="button"
              data-cursor-hover
              aria-pressed={diverted}
              onClick={() => {
                setDiverted((d) => !d);
                setAt(0);
                setPlaying(true);
              }}
              style={{ ...chip, background: diverted ? rgba("#FF5A5A", 0.18) : chip.background, borderColor: diverted ? rgba("#FF5A5A", 0.5) : rgba(t.fg, 0.16) }}
            >
              <span style={{ width: 26, height: 14, borderRadius: 999, background: diverted ? "#FF5A5A" : rgba(t.fg, 0.2), position: "relative", transition: "background .3s" }}>
                <span style={{ position: "absolute", top: 2, left: diverted ? 14 : 2, width: 10, height: 10, borderRadius: 999, background: "#fff", transition: "left .3s" }} />
              </span>
              {alt.toggle}
            </button>
          )}
          <button type="button" data-cursor-hover onClick={() => setPlaying((p) => !p)} style={chip} aria-label={playing ? "Pause" : "Play"}>
            {playing ? "❚❚ Pause" : "▶ Play"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" style={{ gap: 18 }}>
        {/* the rail */}
        <ol className="relative flex flex-col" style={{ gap: 6 }}>
          {steps.map((s, i) => {
            const done = i < at;
            const active = i === at;
            const dead = !!alt && diverted && i > alt.at;
            const bad = failed && i === alt!.at;
            return (
              <li key={s.label} className="relative">
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    style={{ position: "absolute", left: 15, top: 38, bottom: -12, width: 2, background: done && !dead ? t.accent : rgba(t.fg, 0.14), transition: "background .4s" }}
                  />
                )}
                <button
                  type="button"
                  data-cursor-hover
                  onClick={() => {
                    setAt(Math.min(i, last));
                    setPlaying(false);
                  }}
                  className="relative flex items-center w-full text-left"
                  style={{ gap: 14, padding: "6px 10px 6px 0", borderRadius: 12, cursor: "none", opacity: dead ? 0.3 : 1, transition: "opacity .3s" }}
                >
                  <span
                    className="grid place-items-center shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      zIndex: 1,
                      fontSize: 12,
                      fontWeight: 800,
                      color: bad ? "#fff" : active || done ? onColor(t.accent) : t.fg,
                      background: bad ? "#FF5A5A" : active || done ? t.accent : t.bg,
                      border: `2px solid ${bad ? "#FF5A5A" : active || done ? t.accent : rgba(t.fg, 0.25)}`,
                      boxShadow: active ? `0 0 0 6px ${rgba(bad ? "#FF5A5A" : t.accent, 0.2)}` : "none",
                      transition: "all .35s",
                    }}
                  >
                    {bad ? "✕" : done ? "✓" : i + 1}
                  </span>
                  <span className="flex flex-col" style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: active ? 800 : 600, color: active ? t.fg : rgba(t.fg, 0.75) }}>{s.label}</span>
                    {s.actor && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: rgba(t.fg, 0.45) }}>{s.actor}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* what is happening right now */}
        <div className="flex flex-col" style={{ gap: 12 }}>
                      <div
              key={`${at}-${failed}`}
              className="pipeline-card"
              style={{ padding: "18px 20px", borderRadius: 18, background: rgba(t.fg, 0.06), border: `1px solid ${failed ? rgba("#FF5A5A", 0.5) : rgba(t.fg, 0.14)}` }}
            >
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: failed ? "#FF8A8A" : t.accent }}>
                {failed ? "Stopped" : `Step ${at + 1} of ${steps.length}`}
              </p>
              <p style={{ marginTop: 6, fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>{current.label}</p>
              <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.65, color: rgba(t.fg, 0.75) }}>{current.detail}</p>
              {current.artifact && (
                <p
                  style={{
                    marginTop: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: failed ? "#FFB0B0" : t.fg,
                    background: rgba(failed ? "#FF5A5A" : t.accent, 0.14),
                    border: `1px solid ${rgba(failed ? "#FF5A5A" : t.accent, 0.35)}`,
                  }}
                >
                  {current.artifact}
                </p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
