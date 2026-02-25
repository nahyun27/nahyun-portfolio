"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { num: 2, label: "Patents", suffix: "" },
  { num: 3, label: "Papers", suffix: "" },
  { num: 5, label: "Years Exp.", suffix: "+" },
  { num: 10, label: "Projects", suffix: "+" },
];

const SKILLS = [
  "Python", "PyTorch", "TensorFlow", "scikit-learn",
  "React", "Next.js", "TypeScript", "Three.js",
  "React Native", "wav2vec2", "YOLOv5/v8", "ROS2",
  "C/C++", "Docker", "Git",
];

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    const dur = 1200;
    const fps = 60;
    const total = dur / (1000 / fps);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setVal(Math.round((frame / total) * target));
      if (frame >= total) { setVal(target); clearInterval(id); }
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [active, target]);

  return <>{val}{suffix}</>;
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.65, ease: "easeOut" as const },
  });

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">

        {/* Label */}
        <motion.p {...fade(0)} className="text-xs tracking-[0.3em] uppercase font-semibold mb-10"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          01 — About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <motion.h2 {...fade(0.08)}
              className="font-black leading-tight mb-8"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.5rem,5vw,4rem)",
                color: "#0A0A0A",
                letterSpacing: "-0.02em"
              }}>
              Hello,<br />
              <span style={{ color: "#00C9A7" }}>I&apos;m Nahyun.</span>
            </motion.h2>

            <motion.p {...fade(0.16)}
              className="text-base md:text-lg leading-relaxed mb-5"
              style={{ color: "#444", fontFamily: "'Inter', sans-serif", maxWidth: 480 }}>
              Senior at Hanyang University (ERICA) studying Computer Science, and a researcher at{" "}
              <a href="https://ace.hanyang.ac.kr" target="_blank" rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4"
                style={{ color: "#00C9A7" }} data-cursor-hover>
                ACE Lab
              </a>
              . I work at the intersection of <strong>AI security</strong> and{" "}
              <strong>adversarial machine learning</strong> — attacking and defending audio AI systems.
            </motion.p>

            <motion.p {...fade(0.22)}
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ color: "#444", fontFamily: "'Inter', sans-serif", maxWidth: 480 }}>
              Beyond research, I love building immersive web experiences and mobile apps that feel alive.
            </motion.p>

            {/* Links */}
            <motion.div {...fade(0.28)} className="flex flex-wrap gap-3">
              {[
                { label: "GitHub ↗", href: "https://github.com/nahyun27" },
                { label: "Email ↗", href: "mailto:ksknh7@hanyang.ac.kr" },
                { label: "Lab ↗", href: "https://ace.hanyang.ac.kr" },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  data-cursor-hover
                  className="px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200 hover:bg-[#0A0A0A] hover:text-[#F5F0E8]"
                  style={{
                    borderColor: "#0A0A0A", color: "#0A0A0A",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  {l.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <div>
            {/* Stats 2×2 */}
            <motion.div {...fade(0.12)} className="grid grid-cols-2 gap-px mb-10"
              style={{ border: "2px solid #0A0A0A", borderRadius: 16, overflow: "hidden" }}>
              {STATS.map((s, i) => (
                <div key={s.label}
                  className="p-6 flex flex-col gap-1"
                  style={{
                    backgroundColor: "#fff",
                    borderRight: i % 2 === 0 ? "1px solid #0A0A0A" : "none",
                    borderBottom: i < 2 ? "1px solid #0A0A0A" : "none",
                  }}>
                  <p className="font-black leading-none"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem,4vw,3.5rem)", color: "#0A0A0A" }}>
                    <Counter target={s.num} suffix={s.suffix} active={inView} />
                  </p>
                  <p className="text-sm" style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Skills */}
            <motion.div {...fade(0.2)}>
              <p className="text-xs tracking-[0.2em] uppercase mb-3"
                style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}>
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((sk, i) => (
                  <motion.span key={sk}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className="px-3 py-1 rounded-full border text-sm font-medium"
                    style={{
                      borderColor: "#0A0A0A", color: "#0A0A0A",
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: "transparent",
                    }}>
                    {sk}
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
