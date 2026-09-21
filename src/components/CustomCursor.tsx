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

  // Detect touch device safely inside a state/effect
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a,button,[data-cursor-hover]")) {
        if (ringRef.current) {
          ringRef.current.style.width = "48px";
          ringRef.current.style.height = "48px";
          ringRef.current.style.borderColor = "var(--mint)";
          ringRef.current.style.background = "rgba(var(--mint-rgb),0.06)";
        }
      }
    };
    const onOut = () => {
      if (ringRef.current) {
        ringRef.current.style.width = "28px";
        ringRef.current.style.height = "28px";
        ringRef.current.style.borderColor = "color-mix(in srgb, var(--text) 50%, transparent)";
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
          borderColor: "color-mix(in srgb, var(--text) 50%, transparent)",
          transition: "width 0.18s ease, height 0.18s ease, border-color 0.18s ease, background 0.18s ease",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width: 4,
          height: 4,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "var(--mint)",
        }}
      />
    </>
  );
}
