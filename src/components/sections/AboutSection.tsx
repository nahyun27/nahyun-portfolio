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
  "C/C++", "Python", "JAVA", "Javascript", "TypeScript", "PyTorch", "TensorFlow", "scikit-learn",
  "React", "Next.js", "Three.js", "Node.js", "TailwindCSS", "React Native",
  "wav2vec2", "YOLOv5/v8", "Docker", "Figma"
];

const CERTS = [
  { title: "TOPCIT 468", year: "2023", org: "Software competency" },
  { title: "TEPS 329", year: "2024", org: "English proficiency" },
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

function StatCard({ s, i, inView }: { s: { num: number; label: string; suffix: string; }; i: number; inView: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.18 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative flex flex-col p-8 md:p-10 rounded-3xl overflow-hidden group cursor-default transition-all duration-300"
      style={{ padding: "6px 19px", backgroundColor: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, rgba(0,201,167,0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10 flex flex-col justify-center h-full">
        <p className="font-black leading-none drop-shadow-md"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", color: "#F0EDE6", letterSpacing: "-0.02em" }}>
          <Counter target={s.num} suffix={s.suffix} active={inView} />
        </p>
        <p className="text-sm uppercase tracking-[0.2em] mt-6 font-semibold transition-colors duration-300 group-hover:text-[#00C9A7]" style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}>
          {s.label}
        </p>
      </div>
      <div className="absolute top-8 right-8 w-2 h-2 rounded-full opacity-30 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"
        style={{ backgroundColor: "#00C9A7", boxShadow: "0 0 10px rgba(0,201,167,0.8)" }} />
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  const [activeFilter, setActiveFilter] = useState<"ALL" | "RESEARCH" | "DEVELOP">("ALL");
  const f = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="about" ref={ref} className="min-h-screen flex items-center py-24 md:py-32 relative z-10"
      style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">

        <motion.p {...f(0)} className="text-xs tracking-[0.4em] uppercase font-semibold mb-16"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          01 — About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 xl:gap-32 items-start">
          {/* ── Left ── */}
          <div className="flex flex-col gap-10">
            <AnimatedHeading
              text="Hello,|I'm Nahyun."
              highlightWords={["I'm", "Nahyun."]}
              style={{ fontSize: "clamp(2.2rem, 8vw, 4rem)" }}
              delay={0.07}
            />

            <motion.div {...f(0.15)} className="flex flex-col gap-5">
              <p className="text-base md:text-lg leading-[1.8]"
                style={{ color: "#666", fontFamily: "'Inter', sans-serif", maxWidth: 480 }}>
                Ph.D. Student in Computer Science, researching at Hanyang University{" "}
                <a href="https://ace.hanyang.ac.kr" target="_blank" rel="noopener noreferrer"
                  data-cursor-hover className="font-medium"
                  style={{ color: "#00C9A7", textDecoration: "underline", textUnderlineOffset: 4 }}>
                  ACE Lab
                </a>
                . I specialize in <strong style={{ color: "#F0EDE6" }}>AI security</strong> and{" "}
                <strong style={{ color: "#F0EDE6" }}>adversarial ML</strong>{" "}
                — attacking and defending AI systems.
              </p>
              <p className="text-base md:text-lg leading-[1.8]"
                style={{ color: "#666", fontFamily: "'Inter', sans-serif", maxWidth: 480 }}>
                On the side, I craft immersive web experiences and mobile apps.
              </p>
            </motion.div>

            <motion.div {...f(0.25)} className="flex flex-wrap gap-3">
              {[
                { label: "Email ↗", href: "mailto:ksknh7@hanyang.ac.kr", color: "#00C9A7" },
                { label: "GitHub ↗", href: "https://github.com/nahyun27", color: "#F0EDE6" },
                { label: "Instagram ↗", href: "https://www.instagram.com/im__string", color: "#F0EDE6" },
                { label: "ACE Lab ↗", href: "https://ace.hanyang.ac.kr", color: "#F0EDE6" },
              ].map((l) => (
                <motion.a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  data-cursor-hover
                  className="px-5 py-2.5 rounded-full text-sm font-medium"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#777", fontFamily: "'Inter', sans-serif", cursor: "none", padding: "6px 10px" }}
                  whileHover={{
                    scale: 1.05, color: l.color, borderColor: l.color,
                    backgroundColor: l.color === "#00C9A7" ? "rgba(0,201,167,0.08)" : "rgba(255,255,255,0.04)",
                    boxShadow: l.color === "#00C9A7" ? "0px 0px 16px rgba(0,201,167,0.25)" : "0px 0px 16px rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── Right ── */}
          <div className="flex flex-col gap-10">

            {/* Stats grid */}
            <motion.div {...f(0.1)}>
              <p className="text-xs tracking-[0.28em] uppercase mb-5"
                style={{ color: "#3a3a3a", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
                At a glance
              </p>
              <div className="grid grid-cols-2 gap-5">
                {STATS.map((s, i) => (
                  <StatCard key={s.label} s={s} i={i} inView={inView} />
                ))}
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div {...f(0.22)}>
              <div className="flex justify-between items-center w-full mb-5" style={{ marginBottom: "15px" }}>
                <p className="text-xs tracking-[0.28em] uppercase m-0"
                  style={{ color: "#3a3a3a", fontFamily: "'Inter', sans-serif" }}>
                  Tech Stack
                </p>
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => setActiveFilter(prev => prev === "RESEARCH" ? "ALL" : "RESEARCH")}
                    className="flex items-center gap-1.5 transition-all duration-300 outline-none cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      if (!target) return;
                      const dot = target.querySelector('.research-dot') as HTMLElement;
                      const text = target.querySelector('.research-text') as HTMLElement;
                      if (dot) { dot.style.backgroundColor = '#00C9A7'; dot.style.boxShadow = '0 0 8px #00C9A7'; }
                      if (text) { text.style.color = '#00C9A7'; text.style.textShadow = '0 0 10px rgba(0,201,167,0.5)'; }
                    }}
                    onHoverEnd={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      if (!target) return;
                      const dot = target.querySelector('.research-dot') as HTMLElement;
                      const text = target.querySelector('.research-text') as HTMLElement;
                      if (activeFilter !== "RESEARCH") {
                        if (dot) { dot.style.backgroundColor = 'rgba(0,201,167,0.3)'; dot.style.boxShadow = 'none'; }
                        if (text) { text.style.color = '#555'; text.style.textShadow = 'none'; }
                      }
                    }}
                  >
                    <span className="research-dot w-[6px] h-[6px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: activeFilter === "RESEARCH" ? "#00C9A7" : "rgba(0,201,167,0.3)",
                        boxShadow: activeFilter === "RESEARCH" ? "0 0 8px #00C9A7" : "none"
                      }}
                    />
                    <span className="research-text text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors duration-300"
                      style={{
                        color: activeFilter === "RESEARCH" ? "#00C9A7" : "#555",
                        fontFamily: "'Inter', sans-serif",
                        textShadow: activeFilter === "RESEARCH" ? "0 0 10px rgba(0,201,167,0.5)" : "none"
                      }}>
                      Research
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveFilter(prev => prev === "DEVELOP" ? "ALL" : "DEVELOP")}
                    className="flex items-center gap-1.5 transition-all duration-300 outline-none cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      if (!target) return;
                      const dot = target.querySelector('.develop-dot') as HTMLElement;
                      const text = target.querySelector('.develop-text') as HTMLElement;
                      if (dot) { dot.style.backgroundColor = '#B388FF'; dot.style.boxShadow = '0 0 8px #B388FF'; }
                      if (text) { text.style.color = '#B388FF'; text.style.textShadow = '0 0 10px rgba(179,136,255,0.5)'; }
                    }}
                    onHoverEnd={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      if (!target) return;
                      const dot = target.querySelector('.develop-dot') as HTMLElement;
                      const text = target.querySelector('.develop-text') as HTMLElement;
                      if (activeFilter !== "DEVELOP") {
                        if (dot) { dot.style.backgroundColor = 'rgba(179,136,255,0.3)'; dot.style.boxShadow = 'none'; }
                        if (text) { text.style.color = '#555'; text.style.textShadow = 'none'; }
                      }
                    }}
                  >
                    <span className="develop-dot w-[6px] h-[6px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: activeFilter === "DEVELOP" ? "#B388FF" : "rgba(179,136,255,0.3)",
                        boxShadow: activeFilter === "DEVELOP" ? "0 0 8px #B388FF" : "none"
                      }}
                    />
                    <span className="develop-text text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors duration-300"
                      style={{
                        color: activeFilter === "DEVELOP" ? "#B388FF" : "#555",
                        fontFamily: "'Inter', sans-serif",
                        textShadow: activeFilter === "DEVELOP" ? "0 0 10px rgba(179,136,255,0.5)" : "none"
                      }}>
                      Develop
                    </span>
                  </motion.button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((sk, i) => {
                  const isResearch = ["Python", "PyTorch", "TensorFlow", "scikit-learn", "wav2vec2", "YOLOv5/v8", "Docker", "C/C++"].includes(sk);
                  const isDevelop = ["React", "Next.js", "TypeScript", "Three.js", "React Native", "JAVA", "Javascript", "Node.js", "TailwindCSS", "Figma"].includes(sk);

                  let isActive = true;
                  if (activeFilter === "RESEARCH" && !isResearch) isActive = false;
                  if (activeFilter === "DEVELOP" && !isDevelop) isActive = false;

                  const themeColor = isDevelop ? "#B388FF" : "#00C9A7";
                  const themeBg = isDevelop ? "rgba(179,136,255,0.12)" : "rgba(0,201,167,0.12)";
                  const themeBorder = isDevelop ? "rgba(179,136,255,0.5)" : "rgba(0,201,167,0.5)";
                  const themeShadow = isDevelop ? "0px 10px 20px -10px rgba(179,136,255,0.5)" : "0px 10px 20px -10px rgba(0,201,167,0.5)";

                  const currentBg = activeFilter !== "ALL" && isActive ? themeBg : "rgba(255,255,255,0.03)";
                  const currentBorderColor = activeFilter !== "ALL" && isActive ? themeBorder : "rgba(255,255,255,0.06)";
                  const currentColor = activeFilter !== "ALL" && isActive ? themeColor : "#888";
                  const currentShadow = activeFilter !== "ALL" && isActive ? themeShadow : "none";
                  const currentOpacity = activeFilter !== "ALL" && !isActive ? 0.15 : 1;

                  return (
                    <motion.span key={sk}
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? {
                        opacity: currentOpacity, y: 0,
                        backgroundColor: currentBg,
                        borderColor: currentBorderColor,
                        color: currentColor,
                        boxShadow: currentShadow
                      } : { opacity: 0, y: 10 }}
                      transition={{ delay: activeFilter === "ALL" ? 0.3 + i * 0.03 : 0, type: "spring", stiffness: 300 }}
                      whileHover={{
                        y: -5,
                        scale: 1.05,
                        backgroundColor: themeBg,
                        borderColor: themeBorder,
                        color: themeColor,
                        boxShadow: themeShadow
                      }}
                      className="text-sm px-6 py-3 rounded-full cursor-default transition-all duration-300"
                      style={{
                        border: `1px solid ${currentBorderColor}`,
                        fontFamily: "'Inter', sans-serif",
                        padding: "1px 13px",
                      }}>
                      {sk}
                    </motion.span>
                  )
                })}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div {...f(0.3)}>
              <p className="text-xs tracking-[0.28em] uppercase mb-5"
                style={{ color: "#3a3a3a", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
                Certifications
              </p>
              <div className="flex flex-col gap-4">
                {CERTS.map((cert, i) => (
                  <motion.div key={cert.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.38 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(0,201,167,0.3)" }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-8 sm:py-6 rounded-3xl cursor-pointer transition-all duration-300 gap-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", padding: "6px 19px" }}
                  >
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#00C9A7]"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                        <svg className="w-5 h-5 text-[#00C9A7] group-hover:text-[#0C0C0F] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-base sm:text-lg transition-colors duration-300 group-hover:text-white" style={{ color: "#E0DDD6", fontFamily: "'Inter', sans-serif" }}>
                          {cert.title}
                        </p>
                        <p className="text-sm mt-1" style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}>
                          {cert.org}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-bold px-5 py-2 rounded-full transition-all duration-300 text-[#00C9A7] group-hover:bg-[#00C9A7] group-hover:text-[#0C0C0F] group-hover:shadow-[0_0_12px_rgba(0,201,167,0.6)] self-start sm:self-auto"
                      style={{ border: "1px solid rgba(0,201,167,0.3)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em", padding: "4px 8px" }}>
                      {cert.year}
                    </span>
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
