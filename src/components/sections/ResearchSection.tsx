"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";

const PAPERS = [
  {
    id: "01",
    title: "AdvChameleon",
    subtitle: "Universal adversarial audio attacks that transfer across models and speech recognition systems.",
    venue: "In submission — USENIX Security 2026",
    tags: ["Audio AI", "Adversarial ML", "Universal"],
  },
  {
    id: "02",
    title: "DPIA",
    subtitle: "Dynamic Perturbation Intensity Attack — a frequency-domain adversarial audio attack.",
    venue: "Patent + Copyright © 2024",
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
    subtitle: "Firmware signing and encryption system for secure embedded device authentication.",
    venue: "KIPS ASK 2022",
    tags: ["Firmware", "Cryptography", "IoT"],
  },
];

export default function ResearchSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="research"
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
          02 — Research
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
          Publications<br />&amp; Patents.
        </motion.h2>

        <HorizontalSlider cards={PAPERS} />
      </div>
    </section>
  );
}
