"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

const STATS = [
  { num: 2, label: "Patents", suffix: "" },
  { num: 3, label: "Papers", suffix: "" },
  { num: 5, label: "Years", suffix: "+" },
  { num: 10, label: "Projects", suffix: "+" },
];

const SKILLS = [
  "Python", "PyTorch", "TensorFlow", "scikit-learn",
  "React", "Next.js", "TypeScript", "Three.js",
  "React Native", "wav2vec2", "YOLOv5/v8", "ROS2", "C/C++", "Docker",
];

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    let frame = 0;
    const total = 72;
    const id = setInterval(() => {
      frame++;
      setVal(Math.round((frame / total) * target));
      if (frame >= total) { setVal(target); clearInterval(id); }
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [active, target]);
  return <>{val}{suffix}</>;
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const f = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.6, ease: "easeOut" as const },
  });

  return (
    <section id="about" ref={ref} className="min-h-screen flex items-center py-28"
      style={{ backgroundColor: "#0C0C0F" }}>
      <div className="section-inner w-full">

        <motion.p {...f(0)} className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          01 — About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <AnimatedHeading
              text="Hello,|I'm Nahyun."
              highlightWords={["I'm", "Nahyun."]}
              className="mb-8"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.2rem)" }}
              delay={0.07}
            />

            <motion.p {...f(0.14)}
              className="text-base md:text-lg leading-relaxed mb-5"
              style={{ color: "#777", fontFamily: "'Inter', sans-serif", maxWidth: 460 }}>
              Senior at Hanyang University (ERICA), studying CS and researching at{" "}
              <a href="https://ace.hanyang.ac.kr" target="_blank" rel="noopener noreferrer"
                data-cursor-hover className="font-medium transition-colors"
                style={{ color: "#00C9A7", textDecoration: "underline", textUnderlineOffset: 4 }}>
                ACE Lab
              </a>
              . I specialize in <strong style={{ color: "#F0EDE6" }}>AI security</strong> and{" "}
              <strong style={{ color: "#F0EDE6" }}>adversarial ML</strong>{" "}
              — attacking and defending audio AI.
            </motion.p>

            <motion.p {...f(0.19)}
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ color: "#777", fontFamily: "'Inter', sans-serif", maxWidth: 460 }}>
              On the side, I build immersive web experiences and mobile apps.
            </motion.p>

            <motion.div {...f(0.25)} className="flex flex-wrap gap-3">
              {[
                { label: "GitHub ↗", href: "https://github.com/nahyun27" },
                { label: "Email ↗", href: "mailto:ksknh7@hanyang.ac.kr" },
                { label: "Lab ↗", href: "https://ace.hanyang.ac.kr" },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  data-cursor-hover
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#888",
                    fontFamily: "'Inter', sans-serif",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "#00C9A7";
                    el.style.color = "#00C9A7";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "#888";
                  }}>
                  {l.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <div>
            <motion.div {...f(0.1)}
              className="grid grid-cols-2 mb-10"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                overflow: "hidden",
                backgroundColor: "#141417",
              }}>
              {STATS.map((s, i) => (
                <div key={s.label} className="p-7 flex flex-col gap-1" style={{
                  borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  <p className="font-black leading-none"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
                      color: "#F0EDE6",
                    }}>
                    <Counter target={s.num} suffix={s.suffix} active={inView} />
                  </p>
                  <p className="text-xs" style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div {...f(0.19)} className="mb-10">
              <p className="text-xs tracking-[0.22em] uppercase mb-4"
                style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}>
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((sk, i) => (
                  <motion.span key={sk}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.28 + i * 0.025 }}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#666",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                    {sk}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div {...f(0.24)}>
              <p className="text-xs tracking-[0.22em] uppercase mb-4"
                style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}>
                Certifications
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { title: "TOPCIT 468점", desc: "Top-tier software competency assessment (2023)" },
                  { title: "TEPS 329점", desc: "English Proficiency Test for Practical Skills (2022)" }
                ].map((cert, i) => (
                  <motion.div key={cert.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="flex justify-between items-center px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}>
                    <span className="font-semibold text-sm" style={{ color: "#F0EDE6", fontFamily: "'Inter', sans-serif" }}>{cert.title}</span>
                    <span className="text-xs text-right" style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>{cert.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
