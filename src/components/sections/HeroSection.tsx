"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TAGS = ["#ProblemSolver", "#AdversarialML", "#CreativeDeveloper", "#ENTJ"];
const WORDS = ["NAHYUN", "KIM"];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.1 });

  return (
    <section
      id="hero"
      ref={ref}
      className="noise-overlay h-[100svh] min-h-[650px] flex flex-col justify-between pt-[64px] relative overflow-hidden z-10"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Ambient glow — top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%", left: "-10%",
          width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 65%)",
          transform: "translateZ(0)",
        }}
      />
      {/* Ambient glow — bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%", right: "-5%",
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 65%)",
          transform: "translateZ(0)",
        }}
      />

      <div className="flex-1 flex flex-col justify-center py-20 relative z-10 px-4 sm:px-8 md:px-16">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs tracking-[0.35em] uppercase font-medium mb-10"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif", marginLeft: "20px" }}
        >
          Portfolio · 2026
        </motion.p>

        {/* Name — bleeds edge to edge, no overflow clip */}
        <h1
          aria-label="NAHYUN KIM"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#F0EDE6",
            fontSize: "clamp(2.5rem, 11vw, 11rem)",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            overflow: "visible",
          }}
        >
          {WORDS.map((word, wi) => (
            // No overflow:hidden — remove the clip that was cutting the letter
            <div key={word} style={{ display: "block", overflow: "visible", whiteSpace: "nowrap", paddingBottom: "0.08em" }}>
              {word.split("").map((letter, li) => (
                <motion.span key={li} className="inline-block"
                  initial={{ y: "110%" }}
                  animate={inView ? { y: 0 } : { y: "110%" }}
                  transition={{ delay: 0.35 + wi * 0.22 + li * 0.042, duration: 0.65, ease: "easeOut" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          ))}
        </h1>

        {/* Divider line + subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex items-center gap-5 mb-8 ml-5"
        >
          <div className="w-10 h-[1px]" style={{ backgroundColor: "#00C9A7" }} />
          <p className="text-base md:text-lg" style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}>
            AI Security Researcher &amp; Creative Developer
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div className="flex flex-wrap gap-3 ml-5"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.15, duration: 0.5 }}
          style={{ marginLeft: "45px", marginTop: "10px" }}
        >
          {TAGS.map((tag, i) => (
            <motion.span key={tag}
              initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: 1.25 + i * 0.07, type: "spring", stiffness: 380, damping: 24 }}
              whileHover={{
                scale: 1.05,
                color: "#00C9A7",
                borderColor: "rgba(0,201,167,0.4)",
                backgroundColor: "rgba(0,201,167,0.08)"
              }}
              className="px-4 py-2 rounded-full text-xs font-bold tracking-[0.05em] cursor-default transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#777",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(8px)",
                padding: "4px 10px"
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Sophisticated Geometric Shape */}
      <div
        className="absolute right-[-20vw] md:right-[-10vw] top-[10%] md:top-[15%] pointer-events-none opacity-40"
        style={{ width: "80vw", height: "80vw", maxWidth: "900px", maxHeight: "900px", transform: "translateZ(0)", willChange: "transform" }}
      >
        <motion.svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
          style={{ transformOrigin: "center center", transform: "translateZ(0)", willChange: "transform" }}
        >
          {/* Outer dashed ring */}
          <circle cx="400" cy="400" r="380" stroke="#00C9A7" strokeWidth="0.5" strokeDasharray="4 12" />
          {/* Inner solid ring */}
          <circle cx="400" cy="400" r="280" stroke="#F0EDE6" strokeWidth="0.5" opacity="0.3" />
          {/* Inner dotted ring */}
          <circle cx="400" cy="400" r="180" stroke="#00C9A7" strokeWidth="2" strokeDasharray="1 15" strokeLinecap="round" opacity="0.8" />

          {/* Orbiting ellipses */}
          <ellipse cx="400" cy="400" rx="360" ry="120" stroke="#00C9A7" strokeWidth="0.5" opacity="0.5" transform="rotate(30 400 400)" />
          <ellipse cx="400" cy="400" rx="360" ry="120" stroke="#F0EDE6" strokeWidth="0.5" opacity="0.3" transform="rotate(-60 400 400)" />

          {/* Abstract connecting lines */}
          <path d="M400 20 L780 400 L400 780 L20 400 Z" stroke="#F0EDE6" strokeWidth="0.5" opacity="0.15" />

          {/* Glowing Accents */}
          <circle cx="400" cy="20" r="6" fill="#00C9A7" style={{ filter: "drop-shadow(0 0 10px #00C9A7)" }} />
          <circle cx="780" cy="400" r="4" fill="#F0EDE6" />
          <circle cx="220" cy="400" r="4" fill="#00C9A7" />
        </motion.svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="flex flex-col items-center gap-2 pb-10 relative z-10"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.9 }}
      >
        <span className="tracking-[0.3em] uppercase text-xs" style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}>
          Scroll
        </span>
        <div className="relative w-[1px] h-12 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2"
            style={{ backgroundColor: "#00C9A7" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
