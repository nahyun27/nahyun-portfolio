"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const SECTION_COLORS: Record<string, string> = {
  hero: "#FF6B6B",
  about: "#00C9A7",
  research: "#5C5FFF",
  projects: "#FFD60A",
  creative: "#FF3CAC",
  awards: "#FFB400",
  footer: "#FF6B6B",
};

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springX = useSpring(cursorX, { damping: 20, stiffness: 300, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 20, stiffness: 300, mass: 0.5 });

  const hovering = useRef(false);
  const section = useSectionStore((s) => s.activeSection);
  const color = SECTION_COLORS[section] ?? "#FF6B6B";

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-hover]")
      ) {
        hovering.current = true;
      }
    };
    const out = () => { hovering.current = false; };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 mix-blend-multiply"
        style={{
          x: springX,
          y: springY,
          width: 36,
          height: 36,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: color,
          transition: "border-color 0.4s ease",
        }}
        animate={{ scale: hovering.current ? 1.8 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width: 6,
          height: 6,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: color,
          transition: "background-color 0.4s ease",
        }}
      />
    </>
  );
}
