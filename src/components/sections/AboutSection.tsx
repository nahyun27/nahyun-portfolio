"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const SKILLS = [
  "Python", "PyTorch", "TensorFlow", "scikit-learn",
  "React", "Next.js", "TypeScript", "Three.js",
  "React Native", "wav2vec2", "YOLOv5/v8", "ROS2",
  "C/C++", "Linux", "Docker", "Git",
];

const STATS = [
  { label: "Patents", value: 2, suffix: "" },
  { label: "Papers", value: 3, suffix: "" },
  { label: "Years Exp.", value: 5, suffix: "+" },
  { label: "Projects", value: 10, suffix: "+" },
];

function AnimatedCounter({
  target,
  suffix,
  active,
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1400;
    const step = Math.ceil((target / duration) * 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const ACCENT = "#00C9A7";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("about"); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#F4FEFB" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Section label */}
        <motion.p
          {...fade(0)}
          className="text-sm font-medium tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT, fontFamily: "'Inter', sans-serif" }}
        >
          01 — About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio */}
          <div>
            <motion.h2
              {...fade(0.1)}
              className="font-syne font-black text-5xl md:text-6xl leading-none mb-8"
              style={{ color: "#0D0D0D" }}
            >
              Hello,<br />
              <span style={{ color: ACCENT }}>I&apos;m Nahyun.</span>
            </motion.h2>

            <motion.p
              {...fade(0.2)}
              className="text-lg leading-relaxed mb-6"
              style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}
            >
              I&apos;m a senior at Hanyang University (ERICA) studying Computer Science,
              and a researcher at{" "}
              <a
                href="https://ace.hanyang.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4 transition-colors"
                style={{ color: ACCENT }}
                data-hover
              >
                ACE Lab
              </a>
              . My work sits at the intersection of{" "}
              <strong>AI security</strong> and{" "}
              <strong>adversarial machine learning</strong> — specifically
              attacking and defending audio-based AI systems.
            </motion.p>

            <motion.p
              {...fade(0.3)}
              className="text-lg leading-relaxed mb-10"
              style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}
            >
              Beyond research, I love bringing ideas to life through{" "}
              <strong>creative web development</strong> — from immersive 3D
              experiences to playful mobile apps.
            </motion.p>

            {/* Contact */}
            <motion.div {...fade(0.4)} className="flex flex-wrap gap-4">
              {[
                { label: "GitHub", href: "https://github.com/nahyun27" },
                { label: "Email", href: "mailto:ksknh7@hanyang.ac.kr" },
                { label: "Lab", href: "https://ace.hanyang.ac.kr" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-300 hover:text-white"
                  style={{
                    borderColor: ACCENT,
                    color: ACCENT,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ACCENT;
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = ACCENT;
                  }}
                >
                  {link.label} ↗
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Stats + Skills */}
          <div>
            {/* Stats grid */}
            <motion.div
              {...fade(0.15)}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl p-6 border"
                  style={{ borderColor: "#D4F5EC", backgroundColor: "#fff" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <p
                    className="font-syne font-black text-4xl md:text-5xl"
                    style={{ color: ACCENT }}
                  >
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      active={inView}
                    />
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Skill pills */}
            <motion.div {...fade(0.35)}>
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}
              >
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    whileHover={{ scale: 1.08 }}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "#D4F5EC",
                      color: "#007A64",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
