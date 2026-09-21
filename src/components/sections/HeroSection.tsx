"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AdversarialName from "@/components/AdversarialName";

const TAGS = ["#ProblemSolver", "#ProblemDefiner", "#EarlyAdopter", "#ENTJ"];
const WORDS = ["Nahyun", "Kim"];

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="noise-overlay h-[100svh] min-h-[680px] flex flex-col relative overflow-hidden z-10"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Quiet geometric accent, kept faint so the name stays the focus */}
      <div
        className="absolute pointer-events-none opacity-30"
        style={{ right: "-12vw", top: "14%", width: "72vw", height: "72vw", maxWidth: 820, maxHeight: 820, transform: "translateZ(0)" }}
      >
        <svg viewBox="0 0 800 800" fill="none" className="hero-orbit w-full h-full">
          <circle cx="400" cy="400" r="380" stroke="var(--mint)" strokeWidth="0.6" strokeDasharray="4 12" />
          <circle cx="400" cy="400" r="260" stroke="var(--text)" strokeWidth="0.5" opacity="0.35" />
          <circle cx="400" cy="400" r="150" stroke="var(--mint)" strokeWidth="2" strokeDasharray="1 15" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="400" cy="400" rx="360" ry="120" stroke="var(--mint)" strokeWidth="0.6" opacity="0.5" transform="rotate(30 400 400)" />
          <circle cx="400" cy="20" r="16" fill="var(--mint)" opacity="0.22" />
          <circle cx="400" cy="20" r="6" fill="var(--mint)" />
          <circle cx="250" cy="400" r="4" fill="var(--mint)" />
        </svg>
      </div>

      <div className="section-inner w-full flex-1 flex flex-col justify-center relative z-10" style={{ paddingTop: 96, paddingBottom: 48 }}>
        {/* Status chip */}
        <motion.div
          {...fade(0.15)}
          className="glass-chip inline-flex items-center self-start"
          style={{
            gap: 10,
            padding: "7px 16px",
            borderRadius: 999,
          }}
        >
          <span className="relative flex" style={{ width: 8, height: 8 }}>
            <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ backgroundColor: "var(--mint)", opacity: 0.6 }} />
            <span className="relative inline-flex w-full h-full rounded-full" style={{ backgroundColor: "var(--mint)" }} />
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--t2)" }}>
            Portfolio 2026
          </span>
        </motion.div>

        {/* Name, wrapped so hovering it can fool a pretend classifier */}
        <AdversarialName>
        <h1
          aria-label="Nahyun Kim"
          className="flex flex-wrap"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: "-0.045em",
            color: "var(--text)",
            fontSize: "clamp(3.2rem, 11.5vw, 10rem)",
            marginTop: 28,
          }}
        >
          {WORDS.map((word, wi) => (
            <span key={word} className="flex" style={{ marginRight: wi < WORDS.length - 1 ? "0.24em" : 0 }}>
              {[...word].map((letter, li) => (
                // padding + negative margin keep descenders (the y) from being clipped by the reveal mask
                <span key={li} style={{ overflow: "hidden", display: "inline-flex", lineHeight: 1, padding: "0 0 0.24em", marginBottom: "-0.24em" }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: "115%" }}
                    animate={inView ? { y: 0 } : { y: "115%" }}
                    transition={{ delay: 0.3 + wi * 0.22 + li * 0.045, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
              {wi === WORDS.length - 1 && (
                <span style={{ overflow: "hidden", display: "inline-flex", lineHeight: 1, padding: "0 0 0.24em", marginBottom: "-0.24em" }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: "115%" }}
                    animate={inView ? { y: 0 } : { y: "115%" }}
                    transition={{ delay: 0.3 + wi * 0.22 + word.length * 0.045, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: "var(--hl-fill)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    .
                  </motion.span>
                </span>
              )}
            </span>
          ))}
        </h1>
        </AdversarialName>

        {/* Role */}
        <motion.p
          {...fade(0.95)}
          style={{
            marginTop: 30,
            maxWidth: 640,
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(1.05rem, 1.9vw, 1.4rem)",
            lineHeight: 1.55,
            color: "var(--t2)",
          }}
        >
          <strong style={{ color: "var(--text)", fontWeight: 600 }}>AI Security Researcher</strong> &amp; Creative Developer
        </motion.p>

        {/* Tags */}
        <motion.div {...fade(1.05)} className="flex flex-wrap" style={{ marginTop: 22, gap: 8 }}>
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="hv-mint text-xs font-bold tracking-[0.04em] cursor-default transition-all duration-300"
              style={{
                border: "1px solid var(--w80)",
                color: "var(--t3)",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "var(--w20)",
                borderRadius: 999,
                padding: "5px 12px",
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Calls to action */}
        <motion.div {...fade(1.2)} className="flex flex-wrap items-center" style={{ marginTop: 38, gap: 12 }}>
          <button
            onClick={() => scrollToId("projects")}
            data-cursor-hover
            className="inline-flex items-center text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(var(--mint-rgb),0.4)]"
            style={{ gap: 10, height: 48, padding: "0 26px", borderRadius: 999, background: "var(--fill-brand)", color: "var(--on-mint)", fontFamily: "'Inter', sans-serif", cursor: "none" }}
          >
            View Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
          <a
            href="https://github.com/nahyun27"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="glass-chip hv-mint inline-flex items-center text-sm font-bold transition-all duration-300"
            style={{ gap: 10, height: 48, padding: "0 24px", borderRadius: 999, color: "var(--text)", fontFamily: "'Inter', sans-serif", cursor: "none" }}
          >
            GitHub ↗
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="flex flex-col items-center relative z-10"
        style={{ gap: 8, paddingBottom: 32 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.9 }}
      >
        <span className="tracking-[0.3em] uppercase text-xs" style={{ color: "var(--t5)", fontFamily: "'Inter', sans-serif" }}>
          Scroll
        </span>
        <div className="relative w-[1px] h-10 overflow-hidden" style={{ backgroundColor: "var(--w60)" }}>
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2"
            style={{ backgroundColor: "var(--mint)" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
