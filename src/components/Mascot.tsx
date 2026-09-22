"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import CharacterSvg from "@/components/mascot/CharacterSvg";

/**
 * The site mascot: a bob-haired SVG character rigged with plain CSS/JS, not a static image.
 * Eyes track the cursor, it blinks on an interval, smiles on hover, waves and talks on click, and
 * breathes gently while idle. Everything except the arm lives in one CharacterSvg; the arm is a
 * separate unclipped layer on top so the waving hand can swing past the circular frame.
 */

const WAVE_KEYFRAMES = { rotate: [0, -18, 10, -16, 6, 0], transition: { duration: 1.1, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" as const } };

const GREETINGS = ["Hi, I'm Nahyun 👋", "Thanks for stopping by!", "Feel free to look around ✨"];

// how far the pupils and the head are allowed to drift toward the cursor
const EYE_RANGE = 3.2;
const HEAD_TILT_RANGE = 3;
// hair swings a little further than the head tilts - was 9deg, which visibly outran the face
// (which only ever rotates by HEAD_TILT_RANGE), reading as the hair sliding loose rather than
// swaying. Bangs and back hair share this one value so they stay nested at the same angle.
const HAIR_SWAY_RANGE = 3.2;

type MouthState = "neutral" | "smile" | "open";

export default function Mascot() {
  const reduce = useReducedMotion();
  const arm = useAnimationControls();
  const rootRef = useRef<HTMLDivElement>(null);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const idleTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const talkTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);

  const setMouth = (state: MouthState) => {
    const root = rootRef.current;
    if (!root) return;
    const set = (id: string, visible: boolean) => {
      const el = root.querySelector<SVGElement>(`#${id}`);
      if (el) el.style.opacity = visible ? "1" : "0";
    };
    set("mouthNeutral", state === "neutral");
    set("mouthSmile", state === "smile");
    set("mouthOpen", state === "open");
  };

  const wave = () => {
    if (reduce) return;
    arm.start(WAVE_KEYFRAMES);
  };

  const talk = (ms = 900) => {
    if (reduce) return;
    window.clearTimeout(talkTimer.current);
    setMouth("open");
    // settle back into a smile if the cursor is still there, not a blank stare
    talkTimer.current = window.setTimeout(() => setMouth(hovering.current ? "smile" : "neutral"), ms);
  };

  const showBubble = (ms = 3600) => {
    window.clearTimeout(closeTimer.current);
    setBubbleOpen(true);
    closeTimer.current = window.setTimeout(() => setBubbleOpen(false), ms);
  };

  // eyes track the pointer, with a small tilt of the whole head following along
  useEffect(() => {
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 420));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 420));
      el.style.setProperty("--eye-x", `${dx * EYE_RANGE}px`);
      el.style.setProperty("--eye-y", `${dy * EYE_RANGE}px`);
      el.style.setProperty("--head-tilt", `${dx * HEAD_TILT_RANGE}deg`);
      // the transition on the hair groups (not this property write) is what gives the swishy lag
      el.style.setProperty("--hair-sway", `${dx * HAIR_SWAY_RANGE}deg`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  // blink on an interval: squash each eye socket, matching the classic scaleY trick
  useEffect(() => {
    if (reduce) return;
    const blink = () => {
      const eyes = rootRef.current?.querySelectorAll<SVGGElement>(".eye");
      eyes?.forEach((eye) => (eye.style.transform = "scaleY(0.1)"));
      window.setTimeout(() => {
        eyes?.forEach((eye) => (eye.style.transform = "scaleY(1)"));
      }, 120);
    };
    const id = window.setInterval(blink, 3400 + Math.random() * 1400);
    return () => window.clearInterval(id);
  }, [reduce]);

  // greet once shortly after the hero settles, then check back in every so often.
  // Skipped entirely under reduced motion: only a click should trigger anything then.
  useEffect(() => {
    if (reduce) return;
    const hello = window.setTimeout(() => {
      wave();
      talk(1400);
      showBubble();
    }, 1500);

    const scheduleIdle = () => {
      idleTimer.current = window.setTimeout(() => {
        wave();
        talk(1200);
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
      window.clearTimeout(talkTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const greet = () => {
    wave();
    talk(1100);
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
          onMouseEnter={() => {
            hovering.current = true;
            setMouth("smile");
            greet();
          }}
          onMouseLeave={() => {
            hovering.current = false;
            setMouth("neutral");
          }}
          data-cursor-hover
          aria-label="Say hi back"
          className="relative"
          style={{ cursor: "none" }}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.94 }}
        >
          <span
            ref={rootRef}
            className="block overflow-hidden rounded-full"
            style={{
              width: "clamp(72px, 8vw, 112px)",
              height: "clamp(72px, 8vw, 112px)",
              border: "2px solid var(--w120)",
              boxShadow: "0 16px 36px -14px rgba(var(--shadow-rgb),calc(0.55 * var(--shadow-k))), 0 0 0 4px var(--bg)",
              background: "linear-gradient(180deg, var(--surface-2), var(--surface))",
              ["--eye-x" as string]: "0px",
              ["--eye-y" as string]: "0px",
              ["--head-tilt" as string]: "0deg",
            }}
          >
            {/* head: tilts toward the cursor, scaled/nudged so the bust fills the circular frame */}
            <div
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: "translateY(6%) scale(1.18) rotate(var(--head-tilt))" }}
            >
              <CharacterSvg />
            </div>
          </span>

          {/* just a waving hand, no arm/sleeve — a drawn limb never quite looked attached to the
              body no matter where the shoulder joint was placed, so it's a floating hand instead
              (same idea as a 👋 emoji next to the avatar). Sits outside the clipped circle so it
              can swing past the frame; the outer <svg>'s transform matches the head div's. */}
          <motion.svg
            viewBox="0 0 240 260"
            className="absolute inset-0 pointer-events-none"
            style={{
              width: "clamp(72px, 8vw, 112px)",
              height: "clamp(72px, 8vw, 112px)",
              overflow: "visible",
              transform: "translateY(6%) scale(1.18)",
            }}
            aria-hidden
          >
            <motion.g animate={arm} style={{ transformOrigin: "206px 158px" }}>
              <ellipse cx="206" cy="158" rx="12.5" ry="13.5" fill="#FCDFC4" />
              {/* knuckle creases, just enough for it to read as a hand and not a blob */}
              <path
                d="M198 151 C200.5 148.5 204.5 147.5 207.5 149.5 M199 158 C202 155.8 206.5 154.8 209.5 157 M200 165 C203 163.3 206.8 163.3 209 165.3"
                stroke="#EAB98F"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                opacity="0.65"
              />
            </motion.g>
          </motion.svg>
        </motion.button>
      </div>
    </div>
  );
}
