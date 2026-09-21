"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Gentle Parallax offsets based on scroll
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg)", transform: "translateZ(0)", willChange: "transform" }}>

      {/* Primary Mint Orb - Top Right */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%]"
        style={{ opacity: "var(--orb-a-o)", width: "60vw", height: "60vw", maxWidth: "800px", maxHeight: "800px", y: y1, background: "radial-gradient(circle, var(--orb-a) 0%, transparent 68%)", transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* Deep Indigo/Purple Orb - Middle Left */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.25, 0.85, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[-20%]"
        style={{ opacity: "var(--orb-b-o)", width: "70vw", height: "70vw", maxWidth: "900px", maxHeight: "900px", y: y2, background: "radial-gradient(circle, var(--orb-b) 0%, transparent 70%)", transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* Secondary Mint Orb - Bottom Center */}
      <motion.div
        animate={{
          x: [0, 70, -70, 0],
          scale: [1, 1.4, 0.9, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[10%]"
        style={{ opacity: "var(--orb-c-o)", width: "80vw", height: "50vw", maxWidth: "1200px", maxHeight: "800px", y: y3, background: "radial-gradient(circle, var(--orb-c) 0%, transparent 60%)", transform: "translateZ(0)", willChange: "transform" }}
      />
      {/* Accent orb, only visible in the light theme */}
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -20, 0], scale: [1, 1.2, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] left-[-10%]"
        style={{ opacity: "var(--orb-d-o)", width: "45vw", height: "45vw", maxWidth: "640px", maxHeight: "640px", background: "radial-gradient(circle, var(--orb-d) 0%, transparent 70%)", transform: "translateZ(0)", willChange: "transform" }}
      />
    </div>
  );
}
