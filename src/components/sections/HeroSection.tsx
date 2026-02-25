"use client";

import { motion } from "framer-motion";

const TAGS = ["ENTJ-A", "Hanyang Univ.", "ACE-LAB", "Seoul, KR"];

const WORDS = ["NAHYUN", "KIM"];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="noise-bg min-h-screen flex flex-col justify-between pt-[60px] relative overflow-hidden"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 md:px-10 py-16">
        {/* Giant name */}
        <h1
          aria-label="NAHYUN KIM"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "#0A0A0A",
            fontSize: "clamp(4rem, 11vw, 11rem)",
          }}
        >
          {WORDS.map((word, wi) => (
            <span
              key={word}
              className="block overflow-hidden"
              style={{ whiteSpace: "nowrap" }}
            >
              {word.split("").map((letter, li) => (
                <motion.span
                  key={li}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.3 + wi * 0.25 + li * 0.045,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-base md:text-xl mb-8 max-w-lg"
          style={{ fontFamily: "'Inter', sans-serif", color: "#444" }}
        >
          AI Security Researcher &amp; Creative Developer
        </motion.p>

        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3 + i * 0.08, type: "spring", stiffness: 400, damping: 22 }}
              className="px-3 py-1.5 rounded-full border text-sm font-medium"
              style={{
                borderColor: "#0A0A0A",
                color: "#0A0A0A",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "transparent",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Geometric shape — bottom right */}
      <motion.div
        className="absolute bottom-20 right-10 md:right-20 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ width: 160, height: 160 }}
      >
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="68" stroke="#00C9A7" strokeWidth="2" strokeDasharray="8 6" />
          <circle cx="80" cy="80" r="44" stroke="#00C9A7" strokeWidth="1.5" opacity="0.4" />
          <circle cx="80" cy="12" r="6" fill="#00C9A7" />
        </svg>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="flex flex-col items-center gap-2 pb-10 z-10 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span
          className="tracking-[0.3em] uppercase text-xs"
          style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}
        >
          Scroll
        </span>
        <div className="relative w-[1px] h-10 overflow-hidden" style={{ backgroundColor: "#ddd" }}>
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{ backgroundColor: "#00C9A7" }}
            animate={{ y: ["0%", "100%", "100%", "0%"], height: ["0%", "100%", "0%", "0%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
