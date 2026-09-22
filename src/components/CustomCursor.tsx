"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 180, damping: 16, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 16, mass: 0.6 });

  // the ring behaves like a drop of water: it stretches along the way it is moving and squashes across it
  const vx = useVelocity(ringX);
  const vy = useVelocity(ringY);
  const speed = useTransform([vx, vy], ([x, y]: number[]) => Math.hypot(x, y));
  const angle = useTransform([vx, vy], ([x, y]: number[]) => (Math.atan2(y, x) * 180) / Math.PI);
  const stretch = useTransform(speed, [0, 1800], [1, 1.55]);
  const squash = useTransform(speed, [0, 1800], [1, 0.72]);

  const ringRef = useRef<HTMLDivElement>(null);

  // when set, the cursor becomes this emoji instead of the usual ring/dot - see [data-cursor-emoji]
  const [cursorEmoji, setCursorEmoji] = useState<string | null>(null);
  // the element currently under the cursor that opted in, so its emoji can be re-read live (an
  // element can change its own data-cursor-emoji value - e.g. a wave while idle vs. a fist while
  // being dragged - without the cursor needing a fresh mouseover to notice)
  const emojiElRef = useRef<HTMLElement | null>(null);

  // Detect touch device safely inside a state/effect
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // intentional: starts false so SSR and the first client render match, then flips once we can
    // actually check - a lazy initial state would read `window` during the server render too
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      // catch up to the hovered element's current emoji, in case it changed its own attribute
      // since the last mouseover (no new mouseover fires just from that)
      if (emojiElRef.current) {
        const live = emojiElRef.current.dataset.cursorEmoji ?? null;
        setCursorEmoji((prev) => (prev === live ? prev : live));
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // an element opts into "cursor becomes this emoji" via data-cursor-emoji="<emoji>" - takes
      // over from the usual ring/dot entirely rather than combining with it (see the render below)
      const emojiEl = t.closest<HTMLElement>("[data-cursor-emoji]");
      emojiElRef.current = emojiEl;
      if (emojiEl) {
        setCursorEmoji(emojiEl.dataset.cursorEmoji ?? null);
        return;
      }
      setCursorEmoji(null);
      if (t.closest("a,button,[data-cursor-hover]")) {
        if (ringRef.current) {
          ringRef.current.style.width = "48px";
          ringRef.current.style.height = "48px";
          ringRef.current.style.borderColor = "var(--cursor-dot, var(--mint))";
          ringRef.current.style.background = "color-mix(in srgb, var(--cursor-dot, var(--mint)) 14%, transparent)";
        }
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor-emoji]")) {
        setCursorEmoji(null);
        emojiElRef.current = null;
      }
      if (ringRef.current) {
        ringRef.current.style.width = "28px";
        ringRef.current.style.height = "28px";
        ringRef.current.style.borderColor = "color-mix(in srgb, var(--cursor-ring, var(--text)) 60%, transparent)";
        ringRef.current.style.background = "transparent";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [isTouchDevice, mouseX, mouseY, dotX, dotY]);

  // Don't render cursor elements on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          width: 28,
          height: 28,
          translateX: "-50%",
          translateY: "-50%",
          rotate: angle,
          scaleX: stretch,
          scaleY: squash,
          opacity: cursorEmoji ? 0 : 1,
          borderColor: "color-mix(in srgb, var(--cursor-ring, var(--text)) 60%, transparent)",
          // the halo is the local background colour, so the ring stays readable over similar shapes
          boxShadow: "0 0 0 1px var(--cursor-halo, transparent)",
          transition: "width 0.18s ease, height 0.18s ease, border-color 0.3s ease, background 0.18s ease, box-shadow 0.3s ease, opacity 0.15s ease",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width: 5,
          height: 5,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "var(--cursor-dot, var(--mint))",
          opacity: cursorEmoji ? 0 : 1,
          boxShadow: "0 0 0 1.5px var(--cursor-halo, transparent)",
          transition: "background-color 0.3s ease, box-shadow 0.3s ease, opacity 0.15s ease",
        }}
      />
      {/* the emoji itself, snapped to the raw (unsprung) cursor position like the dot - a cute
          little swap-out for the ring/dot rather than something layered on top of them */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          fontSize: 26,
          filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.3))",
        }}
        animate={{ opacity: cursorEmoji ? 1 : 0, scale: cursorEmoji ? 1 : 0.4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {cursorEmoji}
      </motion.div>
    </>
  );
}
