"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const AWARDS = [
  {
    icon: "🏆",
    year: "2021",
    title: "아이디어톤 우수상",
    desc: "TennisTown — Tennis court host-guest matching platform (Goote)",
    type: "award",
  },
  {
    icon: "🥇",
    year: "2020",
    title: "메이커톤 대상",
    desc: "SW Startup competition — Grand Prize winner",
    type: "award",
  },
  {
    icon: "📄",
    year: "2024",
    title: "Patent × 2",
    desc: "DPIA (Dynamic Perturbation Intensity Attack) + Harmonic-based Audio Misclassification",
    type: "patent",
  },
  {
    icon: "©️",
    year: "2024",
    title: "Software Copyright",
    desc: "DPIA System — Registration No. C-2024-052543",
    type: "copyright",
  },
  {
    icon: "📊",
    year: "2023",
    title: "TOPCIT 468점",
    desc: "Top-tier software competency assessment score",
    type: "cert",
  },
  {
    icon: "🌐",
    year: "2022",
    title: "TEPS 329점",
    desc: "English Proficiency Test for Practical Skills",
    type: "cert",
  },
];

const TYPE_COLORS: Record<string, string> = {
  award: "#FFB400",
  patent: "#FF9A3C",
  copyright: "#FFD60A",
  cert: "#FFC044",
};

const ACCENT = "#FFB400";

export default function AwardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("awards"); },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <section
      id="awards"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT, fontFamily: "'Inter', sans-serif" }}
        >
          05 — Recognition
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="font-syne font-black text-5xl md:text-7xl leading-none mb-16"
          style={{ color: "#0D0D0D" }}
        >
          Awards &amp;<br />
          <span style={{ color: ACCENT }}>Credentials.</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
            className="absolute left-6 top-0 bottom-0 w-[2px]"
            style={{ backgroundColor: ACCENT + "40" }}
          />

          <div className="space-y-6 pl-16">
            {AWARDS.map((award, i) => {
              const color = TYPE_COLORS[award.type] ?? ACCENT;
              return (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="relative flex items-start gap-5 rounded-2xl p-6 border group cursor-default"
                  style={{ backgroundColor: "#fff", borderColor: "#FFE9A0" }}
                  data-hover
                >
                  {/* Dot */}
                  <div
                    className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />

                  <div className="text-3xl shrink-0">{award.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className="font-syne font-bold text-lg"
                        style={{ color: "#0D0D0D" }}
                      >
                        {award.title}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: color + "25",
                          color: color,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {award.year}
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}
                    >
                      {award.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
