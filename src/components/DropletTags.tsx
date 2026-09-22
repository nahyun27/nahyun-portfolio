"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The old hero tag row ("#ProblemSolver" etc), now let loose as soap-bubble droplets that drift
 * across the whole page (fixed, not scoped to the hero) and scatter away from the cursor when it
 * sweeps past. Clicking one pops it - it vanishes, then reappears somewhere else a moment later.
 *
 * Position is real cursor-avoidance physics (a small drift + a repulsion force near the pointer),
 * stepped every frame and written straight to each bubble's `transform` via a ref, not React
 * state - so 4 bubbles moving at 60fps never trigger a re-render. React only owns which bubbles
 * currently exist (for the pop/respawn mount+unmount and its enter/exit animation).
 */

const TAGS = ["#ProblemSolver", "#ProblemDefiner", "#EarlyAdopter", "#ENTJ"];

// true circles, so a fixed equal width/height per tag instead of a pill that grows with its
// text - longer tags get a bigger circle and a smaller font instead of a wider box
const BUBBLE_STYLE: Record<string, { size: number; font: number }> = {
  "#ProblemSolver": { size: 118, font: 12.5 },
  "#ProblemDefiner": { size: 124, font: 12 },
  "#EarlyAdopter": { size: 108, font: 12.5 },
  "#ENTJ": { size: 72, font: 13.5 },
};

let uid = 0;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

type BubbleData = { id: number; text: string };
type Phys = { x: number; y: number; vx: number; vy: number; el: HTMLDivElement | null };

export default function DropletTags() {
  const [bubbles, setBubbles] = useState<BubbleData[]>(() => TAGS.map((text) => ({ id: uid++, text })));
  const phys = useRef<Map<number, Phys>>(new Map());
  const pointer = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 });

  // seeds a bubble's physics state the first time its DOM node shows up, keeps it after that
  const registerEl = (id: number) => (el: HTMLDivElement | null) => {
    const existing = phys.current.get(id);
    if (existing) {
      existing.el = el;
      return;
    }
    if (!el) return;
    phys.current.set(id, {
      x: rand(80, window.innerWidth - 80),
      y: rand(140, window.innerHeight - 120),
      vx: rand(-6, 6),
      vy: rand(-6, 6),
      el,
    });
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      p.vx = p.lastX < 0 ? 0 : e.clientX - p.lastX;
      p.vy = p.lastY < 0 ? 0 : e.clientY - p.lastY;
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      p.x = e.clientX;
      p.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.7); // ~1 at 60fps, capped so a stutter can't fling things
      last = now;
      const pt = pointer.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      phys.current.forEach((p) => {
        // lazy drift, like it's sitting in still air
        p.vx += rand(-0.05, 0.05) * dt;
        p.vy += rand(-0.05, 0.05) * dt;

        // scatter away from the cursor - stronger the closer and the faster it's sweeping past,
        // which is what makes a slow hover barely nudge it but a quick swirl send it flying
        const dx = p.x - pt.x;
        const dy = p.y - pt.y;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = 160;
        if (dist < radius) {
          const cursorSpeed = Math.min(Math.hypot(pt.vx, pt.vy), 45);
          const strength = (1 - dist / radius) * (1.8 + cursorSpeed * 0.4);
          p.vx += (dx / dist) * strength * dt;
          p.vy += (dy / dist) * strength * dt;
        }

        p.vx *= 0.965;
        p.vy *= 0.965;
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = 16;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // bounce off the viewport edges instead of drifting off screen
        const sideMargin = 54;
        if (p.x < sideMargin) {
          p.x = sideMargin;
          p.vx = Math.abs(p.vx);
        } else if (p.x > w - sideMargin) {
          p.x = w - sideMargin;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < 88) {
          p.y = 88;
          p.vy = Math.abs(p.vy);
        } else if (p.y > h - 64) {
          p.y = h - 64;
          p.vy = -Math.abs(p.vy);
        }

        if (p.el) p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pop = (id: number, text: string) => {
    phys.current.delete(id);
    setBubbles((bs) => bs.filter((b) => b.id !== id));
    window.setTimeout(() => {
      setBubbles((bs) => [...bs, { id: uid++, text }]);
    }, 550 + Math.random() * 750);
  };

  return (
    // z-5: above the ambient background (z-0) so the bubbles are visible, but below every
    // section's content (all z-10) so they stay behind the title and everything else, not
    // floating in front of it
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <AnimatePresence>
        {bubbles.map((b) => {
          const { size, font } = BUBBLE_STYLE[b.text] ?? { size: 90, font: 12 };
          return (
            // outer div: physics owns its `transform` (translate3d), written straight to the DOM.
            // inner motion.button: framer owns ITS OWN transform (scale, for the pop) - two
            // separate elements each with their own transform, so the two never fight.
            <div key={b.id} ref={registerEl(b.id)} className="absolute pointer-events-auto" style={{ left: 0, top: 0, translate: "-50% -50%" }}>
              <motion.button
                type="button"
                onClick={() => pop(b.id, b.text)}
                data-cursor-hover
                aria-label={`${b.text}, click to pop`}
                className="glass-chip hv-mint font-bold tracking-[0.02em] grid place-items-center text-center"
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  color: "var(--t3)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: font,
                  lineHeight: 1.15,
                  padding: "0 8px",
                  cursor: "none",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.7, transition: { duration: 0.32, ease: "easeOut" } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {b.text}
              </motion.button>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
