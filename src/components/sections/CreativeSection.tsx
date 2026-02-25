"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";

const CREATIVE = [
  {
    id: "01",
    emoji: "🗼",
    title: "Stack Tower 3D",
    subtitle: "Addictive precision stacking game built entirely in the browser with 3D rendering.",
    tags: ["Three.js", "React Three Fiber"],
  },
  {
    id: "02",
    emoji: "🌌",
    title: "Floating Memories",
    subtitle: "3D photo galaxy — your images drift through a procedurally generated star field.",
    tags: ["Three.js", "WebGL", "GLSL"],
  },
  {
    id: "03",
    emoji: "✨",
    title: "This Portfolio",
    subtitle: "You're looking at it! Built with Next.js 14 App Router, Framer Motion, and Tailwind.",
    tags: ["Next.js 14", "Framer Motion", "Tailwind"],
  },
];

export default function CreativeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="creative"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase font-semibold mb-10"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          04 — Creative Lab
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.65, ease: "easeOut" }}
          className="font-black leading-tight mb-14"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.4rem,5vw,4rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
          }}>
          Web &amp;<br />Games.
        </motion.h2>

        <HorizontalSlider cards={CREATIVE} />
      </div>
    </section>
  );
}
