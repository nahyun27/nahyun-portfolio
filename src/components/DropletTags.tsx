"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The hero tag list ("#ProblemSolver" etc), but as loose droplets instead of a static row:
 * they drift lazily inside their box, and clicking one pops it - it vanishes, then reappears
 * at a fresh random spot a moment later. Reuses the site's existing `.blob-morph` (border-radius
 * wobble) and the same glass-chip colours the static tags used, just rigged to move and pop.
 */

const TAGS = ["#ProblemSolver", "#ProblemDefiner", "#EarlyAdopter", "#ENTJ"];

type Droplet = { id: number; text: string; left: number; top: number; scale: number };

let uid = 0;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

// pick a spot away from the droplets already out there, so a respawn doesn't just land back
// on top of a neighbour - try a handful of candidates and keep the one with the most room
function spawnPos(avoid: { left: number; top: number }[]) {
  let best = { left: rand(8, 80), top: rand(10, 68) };
  let bestDist = -1;
  for (let i = 0; i < 10; i++) {
    const candidate = { left: rand(8, 80), top: rand(10, 68) };
    const dist = avoid.length
      ? Math.min(...avoid.map((p) => Math.hypot(p.left - candidate.left, (p.top - candidate.top) * 1.6)))
      : 999;
    if (dist > bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

export default function DropletTags() {
  const [drops, setDrops] = useState<Droplet[]>(() => {
    const placed: { left: number; top: number }[] = [];
    return TAGS.map((text) => {
      const pos = spawnPos(placed);
      placed.push(pos);
      return { id: uid++, text, ...pos, scale: rand(0.94, 1.08) };
    });
  });

  const pop = (id: number, text: string) => {
    setDrops((ds) => ds.filter((d) => d.id !== id));
    window.setTimeout(() => {
      setDrops((ds) => {
        const pos = spawnPos(ds.map((d) => ({ left: d.left, top: d.top })));
        return [...ds, { id: uid++, text, ...pos, scale: rand(0.94, 1.08) }];
      });
    }, 550 + Math.random() * 750);
  };

  return (
    <div className="relative w-full" style={{ height: "clamp(104px, 12vw, 140px)", maxWidth: 480, marginTop: 22 }}>
      <AnimatePresence>
        {drops.map((d) => (
          // `translate` is the standalone CSS property (not `transform`), so it centers the
          // pill on its (left, top) point without fighting framer-motion, which only ever
          // writes to `transform` - that's where the opacity/scale/x/y animation below lives.
          <motion.button
            key={d.id}
            type="button"
            onClick={() => pop(d.id, d.text)}
            data-cursor-hover
            aria-label={`${d.text}, click to pop`}
            className="blob-morph absolute hv-mint text-xs font-bold tracking-[0.04em]"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              translate: "-50% -50%",
              border: "1px solid var(--w80)",
              color: "var(--t3)",
              fontFamily: "'Inter', sans-serif",
              backgroundColor: "var(--w20)",
              padding: "7px 15px",
              cursor: "none",
              animation: `blob-morph ${7 + rand(0, 4)}s ease-in-out infinite`,
              animationDelay: `${-rand(0, 6)}s`,
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: 1,
              scale: d.scale,
              y: [0, -7, 1, -4, 0],
              x: [0, 4, -3, 2, 0],
            }}
            exit={{ opacity: 0, scale: 1.7, transition: { duration: 0.32, ease: "easeOut" } }}
            transition={{
              default: { type: "spring", stiffness: 300, damping: 20 },
              y: { duration: rand(4.5, 6.5), repeat: Infinity, ease: "easeInOut", delay: rand(0, 2) },
              x: { duration: rand(5, 7), repeat: Infinity, ease: "easeInOut", delay: rand(0, 2) },
            }}
          >
            {d.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
