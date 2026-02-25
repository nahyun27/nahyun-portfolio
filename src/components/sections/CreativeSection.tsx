"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";
import AnimatedHeading from "@/components/AnimatedHeading";

const CREATIVE_DATA = [
  { id: "01", emoji: "🎮", title: "Midnight Protocol", subtitle: "Turn-based hacking RPG developed in Unity. Showcased at BIC Festival.", tags: ["Unity", "C#", "Game Dev"] },
  { id: "02", emoji: "⚡", title: "Neon Drifter", subtitle: "Fast-paced synthwave aesthetics racing game with custom shaders.", tags: ["Three.js", "WebGL", "GLSL"] },
  { id: "03", emoji: "🎨", title: "Creative Coding", subtitle: "Collection of generative art and interactive web experiments.", tags: ["p5.js", "Canvas API", "Math"] },
];

export default function CreativeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="creative" ref={ref} className="min-h-screen flex items-center py-28"
      style={{ backgroundColor: "#0C0C0F" }}>
      <div className="section-inner w-full">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          04 — Creative
        </motion.p>
        <AnimatedHeading
          text="Web &|Games."
          highlightWords={["Games."]}
          className="mb-14"
          style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}
          delay={0.1}
        />
        <HorizontalSlider cards={CREATIVE_DATA} />
      </div>
    </section>
  );
}
