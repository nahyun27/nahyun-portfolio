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
      style={{ minHeight: "100vh", backgroundColor: "#0C0C0F", transform: "translateZ(0)", willChange: "transform" }}>

      {/* Primary Mint Orb - Top Right */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] opacity-[0.12]"
        style={{ width: "60vw", height: "60vw", maxWidth: "800px", maxHeight: "800px", y: y1, background: "radial-gradient(circle, #00C9A7 0%, transparent 70%)", filter: "blur(90px)", transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* Deep Indigo/Purple Orb - Middle Left */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.25, 0.85, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[-20%] opacity-[0.06]"
        style={{ width: "70vw", height: "70vw", maxWidth: "900px", maxHeight: "900px", y: y2, background: "radial-gradient(circle, #7000FF 0%, transparent 70%)", filter: "blur(100px)", transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* Secondary Mint Orb - Bottom Center */}
      <motion.div
        animate={{
          x: [0, 70, -70, 0],
          scale: [1, 1.4, 0.9, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[10%] opacity-[0.10]"
        style={{ width: "80vw", height: "50vw", maxWidth: "1200px", maxHeight: "800px", y: y3, background: "radial-gradient(circle, #00C9A7 0%, transparent 60%)", filter: "blur(120px)", transform: "translateZ(0)", willChange: "transform" }}
      />
    </div>
  );
}
