"use client";

import { useRef } from "react";
import { Icon, type IconName } from "@/components/ProjectIcon";
import type { SceneTheme } from "@/data/projects";

// x, y in percent, size in px, depth for cursor parallax, tint picks accent or accent2, float timing
const DROPS = [
  { x: 12, y: 16, s: 96, d: 26, t: 0, dur: 7, delay: 0 },
  { x: 74, y: 10, s: 64, d: 40, t: 1, dur: 6, delay: 1.2 },
  { x: 84, y: 58, s: 128, d: 18, t: 0, dur: 9, delay: 0.6 },
  { x: 8, y: 66, s: 72, d: 34, t: 1, dur: 6.5, delay: 2 },
  { x: 46, y: 84, s: 48, d: 46, t: 0, dur: 5.5, delay: 0.3 },
  { x: 62, y: 30, s: 36, d: 52, t: 1, dur: 5, delay: 1.7 },
  { x: 28, y: 44, s: 30, d: 56, t: 0, dur: 6, delay: 2.4 },
];

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Water themed stage: drifting droplets that lean toward the cursor around one big glass blob. */
export default function LiquidStage({ theme, icon, label }: { theme: SceneTheme; icon: IconName; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  const body = (c: string) =>
    `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.8) 0 7%, transparent 8%), radial-gradient(circle at 50% 50%, ${rgba(c, 0.9)}, ${rgba(c, 0.45)})`;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        maxHeight: "68vh",
        width: "100%",
        borderRadius: 36,
        overflow: "hidden",
        background: `radial-gradient(120% 100% at 30% 0%, ${rgba(theme.fg, 0.1)}, transparent 60%), ${rgba(theme.fg, 0.04)}`,
        border: `1px solid ${rgba(theme.fg, 0.12)}`,
        ["--mx" as string]: 0,
        ["--my" as string]: 0,
      }}
    >
      {DROPS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            transform: `translate3d(calc(var(--mx) * ${d.d}px), calc(var(--my) * ${d.d}px), 0)`,
            transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className="drop-float"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: body(d.t ? theme.accent2 : theme.accent),
              boxShadow: "inset -8px -10px 22px rgba(0,0,0,0.16), inset 8px 10px 18px rgba(255,255,255,0.22)",
              animation: `drop-float ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          transform: "translate3d(calc(var(--mx) * 10px), calc(var(--my) * 10px), 0)",
          transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          className="blob-morph"
          style={{
            width: "46%",
            aspectRatio: "1 / 1",
            display: "grid",
            placeItems: "center",
            color: theme.fg,
            background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,0.55), transparent 42%), linear-gradient(140deg, ${rgba(theme.accent, 0.55)}, ${rgba(theme.accent2, 0.4)})`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: `1px solid ${rgba("#FFFFFF", 0.35)}`,
            boxShadow: `inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -18px 30px -12px ${rgba(theme.accent, 0.5)}, 0 30px 60px -30px ${rgba("#000000", 0.5)}`,
            animation: "blob-morph 9s ease-in-out infinite",
          }}
        >
          <Icon name={icon} size={72} strokeWidth={1.4} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 22, bottom: 18, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: rgba(theme.fg, 0.55), fontFamily: "'Inter', sans-serif" }}>
        {label}
      </div>
    </div>
  );
}
