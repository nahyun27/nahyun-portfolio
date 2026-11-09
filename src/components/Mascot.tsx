"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import CharacterSvg from "@/components/mascot/CharacterSvg";

/**
 * The site mascot: a bob-haired SVG character rigged with plain CSS/JS, not a static image.
 * Eyes track the cursor, it blinks on an interval, smiles on hover, winks and talks on click, and
 * breathes gently while idle. There's no drawn or emoji arm on the character itself - instead the
 * button carries `data-cursor-emoji="👋"`, which CustomCursor reads to turn the cursor itself
 * into a waving hand while it's over the avatar (see CustomCursor.tsx).
 *
 * When the About section's seat (an element with `data-mascot-dock`) comes into view, the avatar
 * springs over and sits in it like a profile photo, then flies back to its corner once you leave.
 */

const GREETINGS = ["Hi, I'm Nahyun 👋", "Thanks for stopping by!", "Feel free to look around ✨"];
const DIZZY_TEXT = "whoa, dizzy~ 🌀";

// how far the pupils and the head are allowed to drift toward the cursor
const EYE_RANGE = 3.2;
const HEAD_TILT_RANGE = 3;
// hair swings a little further than the head tilts - was 9deg, which visibly outran the face
// (which only ever rotates by HEAD_TILT_RANGE), reading as the hair sliding loose rather than
// swaying. Bangs and back hair share this one value so they stay nested at the same angle.
const HAIR_SWAY_RANGE = 3.2;

// 4 clicks inside 1.4s counts as "rapid" and triggers the dizzy reaction instead of a wink
const RAPID_CLICK_COUNT = 4;
const RAPID_CLICK_WINDOW = 1400;

const IDLE_BOB = { y: [0, -6, 0], rotate: 0, transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const } };
const DIZZY_WOBBLE = { rotate: [0, -16, 14, -12, 10, -5, 0], y: [0, -3, 2, -2, 0], transition: { duration: 0.85, ease: "easeInOut" as const } };

type MouthState = "neutral" | "smile" | "open";
type EyeState = "open" | "smile" | "dizzy";

export default function Mascot() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState(GREETINGS[0]);
  const [dizzyActive, setDizzyActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const talkTimer = useRef<number | undefined>(undefined);
  const winkTimer = useRef<number | undefined>(undefined);
  const dizzyTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);
  const clickTimes = useRef<number[]>([]);
  const greetingIndex = useRef(0);

  // docking into the About seat: an offset + scale from the avatar's home corner
  const [docked, setDocked] = useState(false);
  const homeRef = useRef<HTMLSpanElement>(null);
  const dockX = useMotionValue(0);
  const dockY = useMotionValue(0);
  const dockScale = useMotionValue(1);

  // an expression (mouth shape or eye shape) holds for at least this long before the next
  // requested change is allowed to land - hovering in and out, or anything else that fires in a
  // burst, used to flicker between shapes several times a second instead of reading as one change
  const EXPRESSION_HOLD = 1000;
  const lastMouthAt = useRef(0);
  const mouthQueue = useRef<number | undefined>(undefined);
  const lastEyesAt = useRef(0);
  const eyesQueue = useRef<number | undefined>(undefined);

  const applyMouth = (state: MouthState) => {
    const root = rootRef.current;
    if (!root) return;
    const set = (id: string, visible: boolean) => {
      const el = root.querySelector<SVGElement>(`#${id}`);
      if (el) el.style.opacity = visible ? "1" : "0";
    };
    set("mouthNeutral", state === "neutral");
    set("mouthSmile", state === "smile");
    set("mouthOpen", state === "open");
    lastMouthAt.current = Date.now();
  };

  const setMouth = (state: MouthState) => {
    const elapsed = Date.now() - lastMouthAt.current;
    window.clearTimeout(mouthQueue.current);
    if (elapsed >= EXPRESSION_HOLD) applyMouth(state);
    else mouthQueue.current = window.setTimeout(() => applyMouth(state), EXPRESSION_HOLD - elapsed);
  };

  // squints into happy closed eyes for a smile, spins into X's when dizzy, open round eyes
  // otherwise (including while talking - squinting AND talking at once reads oddly, so "open"
  // covers both neutral and talk)
  const applyEyes = (state: EyeState) => {
    const root = rootRef.current;
    if (!root) return;
    const set = (id: string, visible: boolean) => {
      const el = root.querySelector<SVGElement>(`#${id}`);
      if (el) el.style.opacity = visible ? "1" : "0";
    };
    set("eyeNormalL", state === "open");
    set("eyeNormalR", state === "open");
    set("eyeSmileL", state === "smile");
    set("eyeSmileR", state === "smile");
    set("eyeDizzyL", state === "dizzy");
    set("eyeDizzyR", state === "dizzy");
    lastEyesAt.current = Date.now();
  };

  const setEyes = (state: EyeState) => {
    const elapsed = Date.now() - lastEyesAt.current;
    window.clearTimeout(eyesQueue.current);
    if (elapsed >= EXPRESSION_HOLD) applyEyes(state);
    else eyesQueue.current = window.setTimeout(() => applyEyes(state), EXPRESSION_HOLD - elapsed);
  };

  const talk = (ms = 900) => {
    if (reduce) return;
    window.clearTimeout(talkTimer.current);
    setMouth("open");
    setEyes("open");
    // settle back into a smile if the cursor is still there, not a blank stare
    talkTimer.current = window.setTimeout(() => {
      setMouth(hovering.current ? "smile" : "neutral");
      setEyes(hovering.current ? "smile" : "open");
    }, ms);
  };

  // a quick one-eyed wink on click. The right eye is forced open for the duration, even if it
  // was mid-smile - a smile arc and the wink's closed arc sitting side by side look too similar
  // and read as a glitch (one eye "stuck", not a wink) rather than a deliberate one-eyed close.
  // An open eye next to the shut one is what actually reads as a wink.
  const wink = () => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;
    const set = (id: string, visible: boolean) => {
      const el = root.querySelector<SVGElement>(`#${id}`);
      if (el) el.style.opacity = visible ? "1" : "0";
    };
    window.clearTimeout(winkTimer.current);
    set("eyeNormalL", false);
    set("eyeSmileL", false);
    set("eyeWinkL", true);
    set("eyeSmileR", false);
    set("eyeNormalR", true);
    winkTimer.current = window.setTimeout(() => {
      set("eyeWinkL", false);
      set("eyeSmileL", hovering.current);
      set("eyeNormalL", !hovering.current);
      set("eyeSmileR", hovering.current);
      set("eyeNormalR", !hovering.current);
    }, 260);
  };

  const showBubble = (text: string, ms = 3600) => {
    window.clearTimeout(closeTimer.current);
    setBubbleText(text);
    setBubbleOpen(true);
    closeTimer.current = window.setTimeout(() => setBubbleOpen(false), ms);
  };

  // 4+ clicks inside RAPID_CLICK_WINDOW instead reads as "stop poking me" - X eyes, a wobble, a
  // dedicated line in the speech bubble - rather than another wink
  const dizzy = () => {
    if (reduce) return;
    window.clearTimeout(winkTimer.current);
    setDizzyActive(true);
    setMouth("open");
    setEyes("dizzy");
    showBubble(DIZZY_TEXT, 1400);
    window.clearTimeout(dizzyTimer.current);
    dizzyTimer.current = window.setTimeout(() => {
      setDizzyActive(false);
      setMouth(hovering.current ? "smile" : "neutral");
      setEyes(hovering.current ? "smile" : "open");
    }, 850);
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
      talk(1400);
      showBubble(GREETINGS[0]);
    }, 1500);

    const scheduleIdle = () => {
      idleTimer.current = window.setTimeout(() => {
        talk(1200);
        greetingIndex.current = (greetingIndex.current + 1) % GREETINGS.length;
        showBubble(GREETINGS[greetingIndex.current], 3200);
        scheduleIdle();
      }, 9000 + Math.random() * 6000);
    };
    scheduleIdle();

    return () => {
      window.clearTimeout(hello);
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(talkTimer.current);
      window.clearTimeout(winkTimer.current);
      window.clearTimeout(dizzyTimer.current);
      window.clearTimeout(mouthQueue.current);
      window.clearTimeout(eyesQueue.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // pop into the seat while it is in view, back home once it is mostly gone (the gap between the two
  // thresholds keeps it from flickering at the edge). It shrinks away where it is and springs up in
  // the new spot instead of flying across the page, so a fast scroll never leaves it chasing the
  // seat. While seated it is pinned to the seat on every scroll frame.
  useEffect(() => {
    const seat = document.querySelector<HTMLElement>("[data-mascot-dock]");
    const home = homeRef.current;
    if (!seat || !home) return;

    let isDocked = false;
    // false while it is shrinking away; the position jumps once it is invisible
    let placed = true;
    // true while it is growing back in, so scroll updates leave the scale alone
    let growing = false;
    let flight = 0;
    let raf = 0;
    let running: { stop: () => void }[] = [];

    const target = () => {
      if (!isDocked) return { x: 0, y: 0, scale: 1 };
      const s = seat.getBoundingClientRect();
      const h = home.getBoundingClientRect();
      return {
        x: s.left + s.width / 2 - (h.left + h.width / 2),
        y: s.top + s.height / 2 - (h.top + h.height / 2),
        scale: s.width / h.width,
      };
    };

    const pop = async () => {
      running.forEach((a) => a.stop());
      const id = ++flight;
      if (reduce) {
        const t = target();
        dockX.set(t.x);
        dockY.set(t.y);
        dockScale.set(t.scale);
        placed = true;
        return;
      }
      placed = false;
      growing = false;
      const out = animate(dockScale, 0, { duration: 0.14, ease: "easeIn" });
      running = [out];
      await out;
      // a newer dock or undock started meanwhile: let that one finish the job
      if (id !== flight) return;
      const t = target();
      dockX.set(t.x);
      dockY.set(t.y);
      placed = true;
      growing = true;
      const grow = animate(dockScale, t.scale, { type: "spring", stiffness: 520, damping: 16 });
      running = [grow];
      await grow;
      if (id === flight) growing = false;
    };

    const follow = () => {
      raf = 0;
      if (!isDocked || !placed) return;
      const t = target();
      dockX.set(t.x);
      dockY.set(t.y);
      if (!growing) dockScale.set(t.scale);
    };
    const onScroll = () => {
      if (isDocked && !raf) raf = window.requestAnimationFrame(follow);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const r = entry.intersectionRatio;
        if (!isDocked && r >= 0.95) isDocked = true;
        else if (isDocked && r < 0.5) isDocked = false;
        else return;
        setDocked(isDocked);
        pop();
      },
      // the top margin keeps the seat from counting as visible while it is under the nav pill
      { threshold: [0, 0.5, 0.95], rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(seat);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(raf);
      running.forEach((a) => a.stop());
    };
  }, [reduce, dockX, dockY, dockScale]);

  // a little hello once it lands in the seat
  useEffect(() => {
    if (!docked) return;
    const id = window.setTimeout(() => {
      wink();
      talk(900);
    }, 450);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docked]);

  const greet = () => {
    talk(1100);
    greetingIndex.current = (greetingIndex.current + 1) % GREETINGS.length;
    showBubble(GREETINGS[greetingIndex.current]);
  };

  return (
    // fixed, not absolute, and mounted globally (see layout.tsx) - it follows you down the page
    // instead of only living in the hero, more like a little guide than a hero decoration.
    // z-150 sits above ordinary section content (z-10) but below the nav (z-200) and the custom
    // cursor (z-9999)
    <div
      className="fixed z-[150]"
      style={{ right: "clamp(16px, 4vw, 56px)", bottom: "clamp(20px, 5vh, 60px)" }}
    >
      {/* row, not a column: the bubble sits beside the avatar instead of above it, so the group
          stays short enough to fit under the HUD on common laptop heights (~720px) */}
      <div className="relative flex items-center" style={{ gap: 10 }}>
        <AnimatePresence>
          {/* no bubble while seated in About: it would sit on top of the text */}
          {bubbleOpen && !dragging && !docked && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 6, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="glass-chip"
              style={{
                padding: "9px 16px",
                borderRadius: "16px 8px 8px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                whiteSpace: "nowrap",
                boxShadow: "0 12px 28px -10px rgba(var(--shadow-rgb),calc(0.4 * var(--shadow-k)))",
              }}
            >
              {bubbleText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* untransformed stand-in for the avatar's home spot, measured to work out the dock offset */}
        <span
          ref={homeRef}
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: "clamp(72px, 8vw, 112px)", height: "clamp(72px, 8vw, 112px)" }}
        />

        <motion.div className="relative" style={{ x: dockX, y: dockY, scale: dockScale }}>
        <motion.button
          type="button"
          onClick={() => {
            const now = Date.now();
            clickTimes.current = [...clickTimes.current.filter((t) => now - t < RAPID_CLICK_WINDOW), now];
            if (clickTimes.current.length >= RAPID_CLICK_COUNT) {
              clickTimes.current = [];
              dizzy();
              return;
            }
            wink();
            greet();
          }}
          onMouseEnter={() => {
            hovering.current = true;
            setMouth("smile");
            setEyes("smile");
            greet();
          }}
          onMouseLeave={() => {
            hovering.current = false;
            setMouth("neutral");
            setEyes("open");
          }}
          // a fist while it's being dragged around, a wave otherwise - CustomCursor re-reads
          // this live off the element itself, no fresh hover needed for the swap mid-drag
          data-cursor-emoji={dragging ? "🤛" : "👋"}
          aria-label="Say hi back - drag to move it, click to wave"
          className="relative"
          style={{ cursor: "none" }}
          drag
          dragSnapToOrigin
          dragElastic={0.15}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 420, bounceDamping: 16 }}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          whileDrag={{ scale: 1.08 }}
          animate={reduce || dragging ? undefined : dizzyActive ? DIZZY_WOBBLE : IDLE_BOB}
          whileTap={{ scale: 0.94 }}
        >
          <span
            ref={rootRef}
            className="mascot-frame block overflow-hidden rounded-full"
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
        </motion.button>
        {/* night only: the little one stands on a plinth like the rest of the collection */}
        <span aria-hidden className="mascot-plinth night-only" />
        </motion.div>
      </div>
    </div>
  );
}
