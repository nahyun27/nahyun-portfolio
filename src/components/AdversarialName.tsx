"use client";

import { useEffect, useRef, useState } from "react";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 2.2 -0.6'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * A scripted illustration of an adversarial example (picture barely changes, prediction flips).
 * Nothing here is a real model: the grain is decoration and the percentages are a formula of hover
 * time. The HUD says so on screen. Wraps the h1 without touching its layout.
 */
export default function AdversarialName({ children }: { children: React.ReactNode }) {
  const [eps, setEps] = useState(0);
  const hovering = useRef(false);
  const value = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const target = hovering.current ? 1 : 0;
      const rate = hovering.current ? 0.55 : 1.6; // creeps up slowly, recovers fast
      value.current += Math.sign(target - value.current) * Math.min(Math.abs(target - value.current), rate * dt);
      setEps(reduced ? target : Math.round(value.current * 100) / 100);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const flip = smooth(0.35, 0.78, eps);
  const pName = 99.2 * (1 - flip) + 0.4;
  const pFooled = Math.max(0.3, 99.5 - pName);
  const fooled = flip > 0.5;
  const rows = fooled
    ? [
        { label: "gibbon", p: pFooled, hot: true },
        { label: "nahyun kim", p: pName, hot: false },
      ]
    : [
        { label: "nahyun kim", p: pName, hot: false },
        { label: "gibbon", p: pFooled, hot: true },
      ];

  return (
    <div className="relative">
      {/* only the name is hoverable and only the name gets the grain */}
      <div
        className="relative inline-block"
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
      >
      {children}

      {/* the perturbation: it never changes the layout, it only grains the picture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: NOISE,
          backgroundSize: "220px 220px",
          mixBlendMode: "overlay",
          opacity: eps * 0.85,
          transform: `translate(${(eps * 13) % 7}px, ${(eps * 9) % 5}px)`,
        }}
      />

      </div>

      {/* readout sits in the free space below the name, never under the grain */}
      <div
        className="glass-chip hidden xl:block"
        style={{
          position: "absolute",
          right: 0,
          top: "calc(100% + 30px)",
          width: 250,
          borderRadius: 18,
          padding: "12px 14px",
          zIndex: 5,
          isolation: "isolate",
          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
          fontSize: 11.5,
          lineHeight: 1.5,
          color: "var(--text)",
          pointerEvents: "none",
        }}
      >
        <div style={{ color: "var(--t4)" }}>simulated classifier</div>
        <div style={{ margin: "8px 0 10px", display: "grid", gap: 6 }}>
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between" style={{ color: r.hot && fooled ? "var(--mint)" : "var(--text)" }}>
                <span>{r.label}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.p.toFixed(1)}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 999, background: "var(--w60)", overflow: "hidden", marginTop: 3 }}>
                <div
                  style={{
                    width: `${r.p}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: r.hot ? "var(--fill-brand)" : "var(--t4)",
                    transition: "width 0.12s linear",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between" style={{ color: "var(--t3)", fontVariantNumeric: "tabular-nums" }}>
          <span>{"ε"} = {(eps * 0.03).toFixed(3)}</span>
          <span>{eps === 0 ? "hover the name" : fooled ? "flipped" : "pushing..."}</span>
        </div>
        {fooled && (
          <div style={{ marginTop: 6, color: "var(--mint)" }}>You still read Nahyun Kim. A fooled model would not.</div>
        )}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--w60)", color: "var(--t5)", fontSize: 10.5 }}>
          Illustration only. No model runs here, the noise is decoration and the numbers follow a script.
        </div>
      </div>
    </div>
  );
}
