"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const PAPERS = [
  {
    id: "01",
    title: "AdvChameleon",
    subtitle: "Universal Adversarial Audio Attacks",
    venue: "In submission — USENIX Security 2026",
    tags: ["Audio AI", "Adversarial ML", "Universal Attack"],
    color: "#5C5FFF",
  },
  {
    id: "02",
    title: "DPIA",
    subtitle: "Dynamic Perturbation Intensity Attack",
    venue: "Patent + Copyright registered 2024",
    tags: ["Patent", "Audio Attack", "Deep Learning"],
    color: "#8B5CF6",
  },
  {
    id: "03",
    title: "ASR Survey",
    subtitle: "Audio Adversarial Attacks Survey",
    venue: "KIPS ASK 2023",
    tags: ["Survey", "ASR", "Security"],
    color: "#6366F1",
  },
  {
    id: "04",
    title: "Firmware Security",
    subtitle: "Firmware Signing & Encryption System",
    venue: "KIPS ASK 2022",
    tags: ["Firmware", "Cryptography", "IoT Security"],
    color: "#4338CA",
  },
];

const ACCENT = "#5C5FFF";

export default function ResearchSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("research"); },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <section
      id="research"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#F5F5FF" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT, fontFamily: "'Inter', sans-serif" }}
        >
          02 — Research
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="font-syne font-black text-5xl md:text-7xl leading-none mb-16"
          style={{ color: "#0D0D0D" }}
        >
          Publications<br />
          <span style={{ color: ACCENT }}>&amp; Patents.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PAPERS.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.12,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="rounded-3xl p-8 border relative overflow-hidden group cursor-default"
              style={{
                backgroundColor: "#fff",
                borderColor: "#E0E0FF",
              }}
              data-hover
            >
              {/* Corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: paper.color }}
              />

              <div
                className="text-xs font-bold tracking-widest mb-4 opacity-40"
                style={{ fontFamily: "'Inter', sans-serif", color: paper.color }}
              >
                {paper.id}
              </div>

              <h3
                className="font-syne font-black text-2xl md:text-3xl mb-2"
                style={{ color: "#0D0D0D" }}
              >
                {paper.title}
              </h3>

              <p
                className="text-base mb-4"
                style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}
              >
                {paper.subtitle}
              </p>

              <p
                className="text-sm mb-6 font-medium"
                style={{ color: paper.color, fontFamily: "'Inter', sans-serif" }}
              >
                {paper.venue}
              </p>

              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: paper.color + "15",
                      color: paper.color,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
