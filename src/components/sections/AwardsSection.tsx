"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AWARDS = [
  {
    icon: "🏆",
    title: "아이디어톤 우수상",
    year: "2021",
    desc: "TennisTown — Tennis court host-guest matching platform",
  },
  {
    icon: "🥇",
    title: "메이커톤 대상",
    year: "2020",
    desc: "SW Startup competition — Grand Prize",
  },
  {
    icon: "📄",
    title: "Patent × 2",
    year: "2024",
    desc: "DPIA + Harmonic-based Audio Misclassification Attack",
  },
  {
    icon: "©️",
    title: "Software Copyright",
    year: "2024",
    desc: "DPIA System — Registration No. C-2024-052543",
  },
  {
    icon: "📊",
    title: "TOPCIT 468점",
    year: "2023",
    desc: "Top-tier software competency assessment",
  },
  {
    icon: "🌐",
    title: "TEPS 329점",
    year: "2022",
    desc: "English Proficiency Test for Practical Skills",
  },
];

export default function AwardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="awards"
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
          05 — Recognition
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
          Awards &amp;<br />Credentials.
        </motion.h2>

        {/* List */}
        <div>
          {AWARDS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.5, ease: "easeOut" }}
              className="group flex items-center gap-5 py-5 px-4 relative transition-all duration-200 rounded-xl"
              style={{ borderTop: "1px solid rgba(10,10,10,0.12)" }}
              data-cursor-hover
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderLeft = "3px solid #00C9A7";
                el.style.backgroundColor = "rgba(0,201,167,0.04)";
                el.style.paddingLeft = "20px";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderLeft = "none";
                el.style.backgroundColor = "transparent";
                el.style.paddingLeft = "16px";
              }}
            >
              {/* Icon */}
              <span className="text-2xl shrink-0 w-9 text-center">{a.icon}</span>

              {/* Title + desc */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif", color: "#0A0A0A" }}>
                  {a.title}
                </p>
                <p className="text-sm" style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
                  {a.desc}
                </p>
              </div>

              {/* Year badge */}
              <span
                className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{ borderColor: "#00C9A7", color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
                {a.year}
              </span>
            </motion.div>
          ))}

          {/* Final rule */}
          <div style={{ borderTop: "1px solid rgba(10,10,10,0.12)" }} />
        </div>
      </div>
    </section>
  );
}
