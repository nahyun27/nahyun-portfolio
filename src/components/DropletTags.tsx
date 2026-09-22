"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

type AnimationControls = ReturnType<typeof useAnimationControls>;

/**
 * The old hero tag row ("#ProblemSolver" etc), now let loose as soap-bubble droplets that drift
 * around behind the hero content (absolute within the hero section, not the whole page), wander
 * on their own even with no cursor nearby, scatter when the cursor sweeps past, and give a
 * springy "boing" squash when it actually touches one. Clicking one pops it - it vanishes, then
 * reappears somewhere else a moment later.
 *
 * Position is real physics (wander drift + a repulsion force near the pointer), stepped every
 * frame and written straight to each bubble's `transform` via a ref, not React state - so 4
 * bubbles moving at 60fps never trigger a re-render. Each bubble also gets its own framer
 * AnimationControls (for the entrance/exit/boing squash, all just `scale`), handed to the physics
 * loop through the same phys map so a touch can trigger it imperatively without React state.
 * Bounds are measured off the component's own container (via a ref), not the viewport, so it
 * stays confined to the hero section it's mounted in.
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
type Phys = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // current wander heading, turns gently instead of jittering
  radius: number;
  touching: boolean;
  lastBoing: number;
  el: HTMLDivElement | null;
  controls: AnimationControls | null;
};

export default function DropletTags() {
  const [bubbles, setBubbles] = useState<BubbleData[]>(() => TAGS.map((text) => ({ id: uid++, text })));
  const phys = useRef<Map<number, Phys>>(new Map());
  const pointer = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 });
  const containerRef = useRef<HTMLDivElement>(null);

  // seeds a bubble's physics state the first time its DOM node shows up, keeps it after that
  const registerEl = (id: number, text: string) => (el: HTMLDivElement | null) => {
    const existing = phys.current.get(id);
    if (existing) {
      existing.el = el;
      return;
    }
    if (!el) return;
    const box = containerRef.current;
    const w = box?.clientWidth ?? window.innerWidth;
    const h = box?.clientHeight ?? window.innerHeight;
    phys.current.set(id, {
      x: rand(80, Math.max(160, w - 80)),
      y: rand(140, Math.max(280, h - 120)),
      vx: rand(-4, 4),
      vy: rand(-4, 4),
      angle: rand(0, Math.PI * 2),
      radius: (BUBBLE_STYLE[text]?.size ?? 90) / 2,
      touching: false,
      lastBoing: 0,
      el,
      controls: null,
    });
  };

  // hands the bubble's own animation controls to its physics entry, so the physics loop can
  // trigger the boing squash on contact without going through React state
  const registerControls = (id: number, controls: AnimationControls | null) => {
    const p = phys.current.get(id);
    if (p) p.controls = controls;
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      p.vx = p.lastX < 0 ? 0 : e.clientX - p.lastX;
      p.vy = p.lastY < 0 ? 0 : e.clientY - p.lastY;
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      const box = containerRef.current?.getBoundingClientRect();
      // pointer coords converted into the container's own local space, since that's what the
      // bubbles' physics positions are measured in
      p.x = e.clientX - (box?.left ?? 0);
      p.y = e.clientY - (box?.top ?? 0);
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
      const w = containerRef.current?.clientWidth ?? window.innerWidth;
      const h = containerRef.current?.clientHeight ?? window.innerHeight;

      phys.current.forEach((p) => {
        // wander drift: the heading turns a little each frame instead of the velocity itself
        // jittering, so it settles into smooth, gently curving paths - like actually floating in
        // still air, not a bubble vibrating in place
        p.angle += rand(-0.1, 0.1) * dt;
        p.vx += Math.cos(p.angle) * 0.05 * dt;
        p.vy += Math.sin(p.angle) * 0.05 * dt;

        // scatter away from the cursor - stronger the closer and the faster it's sweeping past,
        // which is what makes a slow hover barely nudge it but a quick swirl send it flying
        const dx = p.x - pt.x;
        const dy = p.y - pt.y;
        const dist = Math.hypot(dx, dy) || 1;
        const fieldRadius = 160;
        if (dist < fieldRadius) {
          const cursorSpeed = Math.min(Math.hypot(pt.vx, pt.vy), 45);
          const strength = (1 - dist / fieldRadius) * (1.8 + cursorSpeed * 0.4);
          p.vx += (dx / dist) * strength * dt;
          p.vy += (dy / dist) * strength * dt;
        }

        // an actual touch (cursor within the bubble itself) gets a one-off springy squash on top
        // of the scatter, not just the push - a little "boing~" instead of only sliding away.
        // Re-arms once the cursor has properly left, with a cooldown so it can't fire every frame
        const touchNow = dist < p.radius + 6;
        if (touchNow && !p.touching && now - p.lastBoing > 450) {
          p.controls?.start({
            scale: [1, 1.3, 0.85, 1.1, 0.96, 1],
            transition: { duration: 0.55, times: [0, 0.18, 0.42, 0.64, 0.84, 1], ease: "easeOut" },
          });
          p.lastBoing = now;
        }
        p.touching = dist < p.radius + 16; // a little hysteresis so it doesn't flicker at the edge

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

        // bounce off the container's edges instead of drifting past them - margins sized for
        // the biggest bubble's radius (124px circle) so it doesn't clip against the hero's
        // overflow-hidden
        const sideMargin = 68;
        if (p.x < sideMargin) {
          p.x = sideMargin;
          p.vx = Math.abs(p.vx);
          p.angle = 0;
        } else if (p.x > w - sideMargin) {
          p.x = w - sideMargin;
          p.vx = -Math.abs(p.vx);
          p.angle = Math.PI;
        }
        if (p.y < 96) {
          p.y = 96;
          p.vy = Math.abs(p.vy);
          p.angle = Math.PI / 2;
        } else if (p.y > h - 70) {
          p.y = h - 70;
          p.vy = -Math.abs(p.vy);
          p.angle = -Math.PI / 2;
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
    // absolute, not fixed: confined to the hero section it's mounted in (its nearest positioned
    // ancestor), not the whole viewport. z-5 sits above the ambient background (z-0) so the
    // bubbles are visible, but below the section's own content (z-10) so they stay behind the
    // title and everything else, not floating in front of it
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <AnimatePresence>
        {bubbles.map((b) => (
          <Bubble key={b.id} id={b.id} text={b.text} registerEl={registerEl} registerControls={registerControls} onPop={pop} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Bubble({
  id,
  text,
  registerEl,
  registerControls,
  onPop,
}: {
  id: number;
  text: string;
  registerEl: (id: number, text: string) => (el: HTMLDivElement | null) => void;
  registerControls: (id: number, controls: AnimationControls | null) => void;
  onPop: (id: number, text: string) => void;
}) {
  const controls = useAnimationControls();
  const { size, font } = BUBBLE_STYLE[text] ?? { size: 90, font: 12 };

  useEffect(() => {
    registerControls(id, controls);
    // the entrance: same spring the old declarative `animate` used, just kicked off imperatively
    // now that `controls` (not a plain object) drives this bubble's scale/opacity
    controls.start({ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    return () => registerControls(id, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    // outer div: physics owns its `transform` (translate3d), written straight to the DOM.
    // inner motion.button: framer owns ITS OWN transform (scale, for the entrance/pop/boing) -
    // two separate elements each with their own transform, so the two never fight.
    <div ref={registerEl(id, text)} className="absolute pointer-events-auto" style={{ left: 0, top: 0, translate: "-50% -50%" }}>
      <motion.button
        type="button"
        onClick={() => onPop(id, text)}
        data-cursor-hover
        aria-label={`${text}, click to pop`}
        className="glass-chip hv-mint font-semibold tracking-[0.02em] grid place-items-center text-center"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          // it's a background element, not something meant to be read - faint on purpose, the
          // hv-mint hover rule (!important) still lights it up clearly on contact
          color: "var(--t6)",
          opacity: 0.6,
          fontFamily: "'Inter', sans-serif",
          fontSize: font,
          lineHeight: 1.15,
          padding: "0 8px",
          cursor: "none",
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={controls}
        exit={{ opacity: 0, scale: 1.7, transition: { duration: 0.32, ease: "easeOut" } }}
      >
        {text}
      </motion.button>
    </div>
  );
}
