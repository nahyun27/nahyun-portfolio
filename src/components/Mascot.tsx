"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";

/**
 * A small waving avatar, the first piece of what's meant to grow into a site mascot/chat character.
 * Built in plain CSS/SVG (no Live2D yet, that needs a rigged model file from outside this codebase).
 * Waves on load, waves again every so often, and reacts to hover/tap.
 */

// classic emoji hand-wave keyframes: two swings, pause, repeat
const WAVE_KEYFRAMES = { rotate: [0, 16, -10, 16, -6, 0], transition: { duration: 1.1, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" as const } };

const GREETINGS = ["Hi, I'm Nahyun 👋", "Thanks for stopping by!", "Feel free to look around ✨"];

export default function Mascot() {
  const reduce = useReducedMotion();
  const hand = useAnimationControls();
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const idleTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const wave = () => {
    if (reduce) return;
    hand.start(WAVE_KEYFRAMES);
  };

  const showBubble = (ms = 3600) => {
    window.clearTimeout(closeTimer.current);
    setBubbleOpen(true);
    closeTimer.current = window.setTimeout(() => setBubbleOpen(false), ms);
  };

  // greet once shortly after the hero settles, then check back in every so often.
  // Skipped entirely under reduced motion: only a click should trigger anything then.
  useEffect(() => {
    if (reduce) return;
    const hello = window.setTimeout(() => {
      wave();
      showBubble();
    }, 1500);

    const scheduleIdle = () => {
      idleTimer.current = window.setTimeout(() => {
        wave();
        setGreeting((g) => (g + 1) % GREETINGS.length);
        showBubble(3200);
        scheduleIdle();
      }, 9000 + Math.random() * 6000);
    };
    scheduleIdle();

    return () => {
      window.clearTimeout(hello);
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(closeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const greet = () => {
    wave();
    setGreeting((g) => (g + 1) % GREETINGS.length);
    showBubble();
  };

  return (
    // pinned low and to the side, on purpose: it needs to clear the adversarial-example readout
    // that sits under the name on wide screens, and there isn't much vertical room to spare there
    <div
      className="absolute z-20"
      style={{ right: "clamp(16px, 4vw, 56px)", bottom: "clamp(20px, 5vh, 60px)" }}
    >
      {/* row, not a column: the bubble sits beside the avatar instead of above it, so the group
          stays short enough to fit under the HUD on common laptop heights (~720px) */}
      <div className="relative flex items-center" style={{ gap: 10 }}>
        <AnimatePresence>
          {bubbleOpen && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 6, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="glass-chip"
              style={{
                padding: "9px 16px",
                borderRadius: "16px 8px 8px 16px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                whiteSpace: "nowrap",
                boxShadow: "0 12px 28px -10px rgba(var(--shadow-rgb),calc(0.4 * var(--shadow-k)))",
              }}
            >
              {GREETINGS[greeting]}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={greet}
          onMouseEnter={greet}
          data-cursor-hover
          aria-label="Say hi back"
          className="relative"
          style={{ cursor: "none" }}
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.94 }}
        >
          <span
            className="block overflow-hidden rounded-full"
            style={{
              width: "clamp(58px, 7vw, 92px)",
              height: "clamp(58px, 7vw, 92px)",
              border: "2px solid var(--w120)",
              boxShadow: "0 16px 36px -14px rgba(var(--shadow-rgb),calc(0.55 * var(--shadow-k))), 0 0 0 4px var(--bg)",
              background: "var(--surface)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mascot.png" alt="" aria-hidden className="w-full h-full object-cover" draggable={false} />
          </span>

          <motion.span
            aria-hidden
            animate={hand}
            className="absolute select-none"
            style={{
              right: "-6%",
              top: "-8%",
              fontSize: "clamp(20px, 2.6vw, 30px)",
              transformOrigin: "70% 80%",
              filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))",
            }}
          >
            👋
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
