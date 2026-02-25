"use client";

import { motion } from "framer-motion";

const TAGS = ["ENTJ-A", "Hanyang Univ.", "ACE-LAB", "Seoul, KR"];
const WORDS = ["NAHYUN", "KIM"];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="noise-overlay min-h-screen flex flex-col justify-between pt-[64px] relative overflow-hidden"
      style={{ backgroundColor: "#0C0C0F" }}
    >
      {/* Ambient glow — top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%", left: "-10%",
          width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* Ambient glow — bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%", right: "-5%",
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(0,201,167,0.05) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <div className="section-inner flex-1 flex flex-col justify-center py-20 relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs tracking-[0.35em] uppercase font-medium mb-10"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}
        >
          Portfolio · 2025
        </motion.p>

        {/* Name */}
        <h1
          aria-label="NAHYUN KIM"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#F0EDE6",
            fontSize: "clamp(4.5rem, 11.5vw, 12rem)",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          {WORDS.map((word, wi) => (
            <span key={word} className="block overflow-hidden p-4 -m-4" style={{ whiteSpace: "nowrap" }}>
              {word.split("").map((letter, li) => (
                <motion.span key={li} className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.35 + wi * 0.22 + li * 0.042, duration: 0.65, ease: "easeOut" }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Divider line + subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex items-center gap-5 mb-8"
        >
          <div className="w-10 h-[1px]" style={{ backgroundColor: "#00C9A7" }} />
          <p className="text-base md:text-lg" style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}>
            AI Security Researcher &amp; Creative Developer
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.5 }}
        >
          {TAGS.map((tag, i) => (
            <motion.span key={tag}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.25 + i * 0.07, type: "spring", stiffness: 380, damping: 24 }}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#888",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Geometric shape */}
      <motion.div
        className="absolute right-12 md:right-20 bottom-24 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ width: 140, height: 140, opacity: 0.5 }}
      >
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="70" r="60" stroke="#00C9A7" strokeWidth="1" strokeDasharray="6 5" />
          <circle cx="70" cy="70" r="38" stroke="#00C9A7" strokeWidth="0.5" opacity="0.5" />
          <circle cx="70" cy="10" r="4" fill="#00C9A7" />
        </svg>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="flex flex-col items-center gap-2 pb-10 relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}
      >
        <span className="tracking-[0.3em] uppercase text-xs" style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}>
          Scroll
        </span>
        <div className="relative w-[1px] h-10 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{ backgroundColor: "#00C9A7" }}
            animate={{ y: ["0%", "100%", "100%", "0%"], height: ["0%", "100%", "0%", "0%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
