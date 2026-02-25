"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const CREATIVE_ITEMS = [
  {
    title: "Stack Tower 3D",
    desc: "Addictive precision stacking game built in the browser. Satisfying physics and leaderboard.",
    tech: ["Three.js", "React Three Fiber"],
    emoji: "🗼",
    size: "large",
    color: "#FF3CAC",
  },
  {
    title: "Floating Memories",
    desc: "3D photo galaxy — your photos drift through a star field.",
    tech: ["Three.js", "WebGL"],
    emoji: "🌌",
    size: "small",
    color: "#C71585",
  },
  {
    title: "This Portfolio",
    desc: "You're looking at it! Built with Next.js 14, Framer Motion, and a lot of love.",
    tech: ["Next.js 14", "Framer Motion", "Tailwind"],
    emoji: "✨",
    size: "small",
    color: "#FF69B4",
  },
];

const ACCENT = "#FF3CAC";

export default function CreativeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("creative"); },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <section
      id="creative"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#FFF0F8" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT, fontFamily: "'Inter', sans-serif" }}
        >
          04 — Creative Lab
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="font-syne font-black text-5xl md:text-7xl leading-none mb-16"
          style={{ color: "#0D0D0D" }}
        >
          Web &amp;<br />
          <span style={{ color: ACCENT }}>Games.</span>
        </motion.h2>

        {/* Asymmetric bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
          {CREATIVE_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.13, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className={`rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group ${item.size === "large" ? "md:col-span-2" : "md:col-span-1"
                }`}
              style={{ backgroundColor: "#fff", border: `1.5px solid ${item.color}30` }}
              data-hover
            >
              {/* BG gradient on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"
                style={{ background: `radial-gradient(circle at 70% 30%, ${item.color}, transparent 70%)` }}
              />

              <div>
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3
                  className="font-syne font-black text-2xl md:text-3xl mb-2"
                  style={{ color: "#0D0D0D" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {item.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: item.color + "20",
                      color: item.color,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <motion.div
                className="absolute top-6 right-6 text-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: item.color }}
              >
                ↗
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
