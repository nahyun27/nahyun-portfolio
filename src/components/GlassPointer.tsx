"use client";

import { useEffect } from "react";

const GLASS = ".glass, .glass-chip";
// a small card can lean further than a wide one before it looks wrong
const maxTilt = (width: number) => Math.min(7, Math.max(2.5, 1800 / width));

/**
 * One document-level pointer listener for every glass surface. It writes the pointer position
 * into --gx/--gy on the hovered pane (and the panes around it) so the specular highlight and the
 * ring glow in globals.css can follow it, and leans `.tilt` cards toward the pointer.
 * CSS variables only, batched to one write per frame: no React state, no re-renders.
 */
export default function GlassPointer() {
  useEffect(() => {
    // touch screens have no hover, the static glass is enough there
    if (!window.matchMedia("(hover: hover)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.classList.remove("is-tilting");
      el.style.removeProperty("--ta");
    };

    const frame = () => {
      raf = 0;
      const e = last;
      const target = e?.target;
      if (!e || !(target instanceof Element)) return;

      let pane = target.closest<HTMLElement>(GLASS);
      while (pane) {
        const r = pane.getBoundingClientRect();
        pane.style.setProperty("--gx", `${e.clientX - r.left}px`);
        pane.style.setProperty("--gy", `${e.clientY - r.top}px`);
        pane = pane.parentElement?.closest<HTMLElement>(GLASS) ?? null;
      }

      if (reduceMotion) return;
      const card = target.closest<HTMLElement>(".tilt");
      if (card !== tilted) {
        release(tilted);
        tilted = card;
      }
      if (!card) return;
      const r = card.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      // rotate around the axis perpendicular to the pointer offset, so the near edge dips toward it
      card.classList.add("is-tilting");
      card.style.setProperty("--tax", String(-ny));
      card.style.setProperty("--tay", String(nx));
      card.style.setProperty("--ta", `${Math.min(1, Math.hypot(nx, ny)) * maxTilt(r.width)}deg`);
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = window.requestAnimationFrame(frame);
    };
    const onLeave = () => {
      release(tilted);
      tilted = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.cancelAnimationFrame(raf);
      release(tilted);
    };
  }, []);

  return null;
}
