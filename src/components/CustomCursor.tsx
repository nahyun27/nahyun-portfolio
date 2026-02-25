"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 200, damping: 18, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 18, mass: 0.6 });

  const isHovering = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a,button,[data-cursor-hover]")) {
        isHovering.current = true;
        ringRef.current?.style.setProperty("width", "44px");
        ringRef.current?.style.setProperty("height", "44px");
        ringRef.current?.style.setProperty("border-color", "#00C9A7");
        ringRef.current?.style.setProperty("background", "rgba(0,201,167,0.08)");
      }
    };
    const onOut = () => {
      isHovering.current = false;
      ringRef.current?.style.setProperty("width", "28px");
      ringRef.current?.style.setProperty("height", "28px");
      ringRef.current?.style.setProperty("border-color", "#0A0A0A");
      ringRef.current?.style.setProperty("background", "transparent");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [mouseX, mouseY, dotX, dotY]);

  return (
    <>
      {/* Ring */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2"
        style={{
          x: ringX,
          y: ringY,
          width: 28,
          height: 28,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "#0A0A0A",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width: 5,
          height: 5,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "#0A0A0A",
        }}
      />
    </>
  );
}
