"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";
import AnimatedHeading from "@/components/AnimatedHeading";

const PAPERS = [
  {
    id: "01",
    title: "AdvChameleon",
    subtitle: "Universal adversarial audio attacks that transfer across models & speech recognition systems.",
    venue: "Patent, In submission",
    tags: ["Audio AI", "Adversarial ML", "Universal"],
  },
  {
    id: "02",
    title: "Anonimous Attack",
    // subtitle: "Dynamic Perturbation Intensity Attack — a frequency-domain adversarial audio attack.",
    subtitle: "A novel adversarial attack proposing a method to adjust perturbation intensity by exploiting temporal characteristics.",
    venue: "Patent, In Review",
    tags: ["Patent", "Audio Attack", "Deep Learning"],
  },
  {
    id: "03",
    title: "ASR Survey",
    subtitle: "Comprehensive survey of adversarial attacks on automatic speech recognition systems.",
    venue: "KIPS ASK 2023",
    tags: ["Survey", "ASR", "Security"],
  },
  {
    id: "04",
    title: "Firmware Security",
    subtitle: "Firmware signing & encryption system for secure embedded device authentication.",
    venue: "KIPS ASK 2022",
    tags: ["Firmware", "Cryptography", "IoT"],
  },
];

export default function ResearchSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <section id="research" ref={ref} className="min-h-screen flex items-center py-24 md:py-32 relative z-10"
      style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          02 — Research
        </motion.p>
        <AnimatedHeading
          text="Publications|& Patents."
          className="mb-14"
          style={{ fontSize: "clamp(2rem, 8vw, 4rem)" }}
          delay={0.1}
        />
        <HorizontalSlider cards={PAPERS} />
      </div>
    </section>
  );
}
