"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";
import { Eyebrow } from "@/components/SectionHeader";

const FOCUS = [
  { title: "Adversarial ML", body: "Crafting perturbations that make models misbehave, and measuring how far they transfer." },
  { title: "Audio & speech security", body: "Attacks on speech recognition and audio classifiers, including harmonic-structure based misclassification." },
  { title: "Creative web", body: "Small interactive worlds, games and tools built with React, Three.js and a lot of tinkering." },
];

const STACK = [
  { group: "Research", color: "var(--mint)", items: ["Python", "PyTorch", "TensorFlow", "scikit-learn", "wav2vec2", "YOLOv5/v8", "Docker", "C/C++"] },
  { group: "Development", color: "var(--c-blue)", items: ["TypeScript", "React", "Next.js", "Three.js", "Node.js", "React Native", "TailwindCSS", "Java", "Figma"] },
];

const CERTS = [
  { title: "TOPCIT 468", year: "2023", org: "Software competency" },
  { title: "TEPS 329", year: "2024", org: "English proficiency" },
];

const LINKS = [
  { label: "Email", href: "mailto:ksknh7@hanyang.ac.kr", primary: true },
  { label: "GitHub", href: "https://github.com/nahyun27" },
  { label: "Instagram", href: "https://www.instagram.com/im__string" },
  { label: "Blog", href: "https://nahyun27.github.io/" },
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const f = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="about" ref={ref} className="relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <Eyebrow index="01" label="About" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-24 items-start mt-8">
          {/* ── Left: who ── */}
          <div className="flex flex-col gap-8">
            <AnimatedHeading
              text="Hello, I'm Nahyun."
              highlightWords={["Nahyun."]}
              style={{ fontSize: "var(--fs-h2)", fontWeight: 800, letterSpacing: "-0.035em" }}
              delay={0.07}
            />

            <motion.div {...f(0.15)} className="flex flex-col gap-4" style={{ maxWidth: 520, fontFamily: "var(--font-body)", fontSize: "var(--fs-lead)", lineHeight: 1.75, color: "var(--t3)" }}>
              <p>
                Ph.D. student in Computer Science at Hanyang University,{" "}
                <a href="https://ace.hanyang.ac.kr" target="_blank" rel="noopener noreferrer" data-cursor-hover
                  style={{ color: "var(--mint)", textDecoration: "underline", textUnderlineOffset: 4, cursor: "none" }}>
                  ACE Lab
                </a>
                . I work on <strong style={{ color: "var(--text)", fontWeight: 600 }}>AI security</strong> and{" "}
                <strong style={{ color: "var(--text)", fontWeight: 600 }}>adversarial ML</strong>, attacking and defending AI systems.
              </p>
              <p>On the side, I craft immersive web experiences and mobile apps.</p>
            </motion.div>

            <motion.div {...f(0.25)} className="flex flex-wrap gap-2.5">
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor-hover
                  className={`${l.primary ? "hv-mint-glow" : "glass-chip hv-mint"} inline-flex items-center h-10 px-[18px] rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5`}
                  style={{
                    fontFamily: "var(--font-body)",
                    cursor: "none",
                    color: l.primary ? "var(--mint)" : "var(--t2)",
                    border: l.primary ? "1px solid rgba(var(--mint-rgb),0.4)" : undefined,
                  }}
                >
                  {l.label} ↗
                </a>
              ))}
            </motion.div>

            {/* What I work on */}
            <motion.ul {...f(0.32)} className="flex flex-col mt-4" style={{ borderTop: "1px solid var(--w70)" }}>
              {FOCUS.map((x, i) => (
                <li key={x.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-5" style={{ borderBottom: "1px solid var(--w70)" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "var(--mint)", paddingTop: 4 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.015em", color: "var(--text)" }}>{x.title}</span>
                    <span className="block mt-1" style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "var(--t3)" }}>{x.body}</span>
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: toolbox ── */}
          <div className="flex flex-col gap-10 lg:pt-3">
            {STACK.map((g, gi) => (
              <motion.div key={g.group} {...f(0.18 + gi * 0.08)}>
                <p className="t-label inline-flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: g.color }} />
                  {g.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((sk) => (
                    <span key={sk} className="glass-chip px-3.5 py-1.5 rounded-full text-sm"
                      style={{ fontFamily: "var(--font-body)", color: "var(--t2)" }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div {...f(0.34)}>
              <p className="t-label mb-4">Certifications</p>
              <div className="flex flex-col" style={{ borderTop: "1px solid var(--w70)" }}>
                {CERTS.map((c) => (
                  <div key={c.title} className="flex items-center justify-between gap-4 py-4" style={{ borderBottom: "1px solid var(--w70)" }}>
                    <div className="min-w-0">
                      <p className="font-bold truncate" style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)" }}>{c.title}</p>
                      <p className="text-sm mt-0.5 truncate" style={{ fontFamily: "var(--font-body)", color: "var(--t3)" }}>{c.org}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ fontFamily: "var(--font-body)", color: "var(--mint)", border: "1px solid rgba(var(--mint-rgb),0.3)", letterSpacing: "0.05em" }}>
                      {c.year}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
