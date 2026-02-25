"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimate, stagger } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const TAGS = ["ENTJ-A", "Hanyang Univ.", "ACE-LAB", "Seoul, KR"];

function AnimatedName() {
  const letters = "NAHYUN KIM".split("");
  return (
    <div className="flex flex-wrap items-baseline gap-0 overflow-hidden">
      {letters.map((l, i) => (
        <motion.span
          key={i}
          className="inline-block leading-none"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.4 + i * 0.06,
            duration: 0.7,
            ease: "easeOut",
          }}
          style={{ whiteSpace: l === " " ? "pre" : "normal" }}
        >
          {l === " " ? "\u00A0" : l}
        </motion.span>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("hero"); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <section
      id="hero"
      ref={ref}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden noise"
      style={{ background: "#FAFAF8" }}
    >
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF6B6B 0%, #FFD60A 100%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #5C5FFF 0%, #FF3CAC 100%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Eyebrow */}
        <motion.p
          className="text-sm font-medium tracking-[0.3em] uppercase mb-6"
          style={{ color: "#FF6B6B", fontFamily: "'Inter', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Portfolio — 2025
        </motion.p>

        {/* Main name */}
        <h1
          className="font-syne font-black overflow-hidden"
          style={{
            fontSize: "clamp(4rem, 14vw, 14rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "#0D0D0D",
          }}
        >
          <AnimatedName />
        </h1>

        {/* Subtitle */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
        >
          <div
            className="h-[2px] w-16 shrink-0"
            style={{ backgroundColor: "#FF6B6B" }}
          />
          <p
            className="text-lg md:text-2xl font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "#555" }}
          >
            AI Security Researcher &amp; Creative Developer
          </p>
        </motion.div>

        {/* Tag chips */}
        <motion.div
          className="flex flex-wrap gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              className="px-4 py-2 rounded-full text-sm font-medium border"
              style={{
                fontFamily: "'Inter', sans-serif",
                borderColor: "#FF6B6B",
                color: "#FF6B6B",
                backgroundColor: "transparent",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.6 + i * 0.1,
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              whileHover={{
                backgroundColor: "#FF6B6B",
                color: "#fff",
                scale: 1.05,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-12"
          style={{ backgroundColor: "#FF6B6B" }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
