"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WORDS = ["Nahyun", "Kim"];

const HIGHLIGHTS = [
  { value: "2", label: "Patents filed" },
  { value: "3", label: "Papers" },
  { value: "10+", label: "Projects shipped" },
  { value: "NRF", label: "Research fellow" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { delay, duration: 0.6, ease: EASE },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="noise-overlay min-h-[100svh] flex flex-col relative overflow-hidden z-10"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="section-inner w-full flex-1 flex flex-col justify-center relative z-10" style={{ paddingTop: 120, paddingBottom: 40 }}>
        {/* Affiliation */}
        <motion.div
          {...fade(0.15)}
          className="glass-chip inline-flex items-center self-start"
          style={{ gap: 10, padding: "7px 16px", borderRadius: 999 }}
        >
          <span className="relative flex" style={{ width: 8, height: 8 }}>
            <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ backgroundColor: "var(--mint)", opacity: 0.6 }} />
            <span className="relative inline-flex w-full h-full rounded-full" style={{ backgroundColor: "var(--mint)" }} />
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--t2)" }}>
            Ph.D. student · ACE Lab, Hanyang University
          </span>
        </motion.div>

        {/* Name */}
        <h1
          aria-label="Nahyun Kim"
          className="flex flex-wrap"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: "-0.045em",
            color: "var(--text)",
            fontSize: "var(--fs-display)",
            marginTop: 28,
          }}
        >
          {WORDS.map((word, wi) => (
            <span key={word} className="flex" style={{ marginRight: wi < WORDS.length - 1 ? "0.24em" : 0 }}>
              {[...word, ...(wi === WORDS.length - 1 ? ["."] : [])].map((letter, li) => (
                // padding + negative margin keep descenders (the y) from being clipped by the reveal mask
                <span key={li} style={{ overflow: "hidden", display: "inline-flex", lineHeight: 1, padding: "0 0 0.24em", marginBottom: "-0.24em" }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: "115%" }}
                    animate={inView ? { y: 0 } : { y: "115%" }}
                    transition={{ delay: 0.3 + wi * 0.22 + li * 0.045, duration: 0.7, ease: EASE }}
                    style={letter === "." ? { background: "var(--hl-fill)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : undefined}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Role and one line on what that means */}
        <motion.p
          {...fade(0.95)}
          style={{
            marginTop: 28,
            maxWidth: 620,
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-lead)",
            lineHeight: 1.6,
            color: "var(--t3)",
          }}
        >
          <strong style={{ color: "var(--text)", fontWeight: 600 }}>AI Security Researcher &amp; Creative Developer.</strong>{" "}
          I attack and defend machine learning systems, mostly speech and audio models, and build playful things for the web on the side.
        </motion.p>

        {/* Calls to action */}
        <motion.div {...fade(1.05)} className="flex flex-wrap items-center" style={{ marginTop: 32, gap: 12 }}>
          <button
            onClick={() => scrollToId("projects")}
            data-cursor-hover
            className="inline-flex items-center text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(var(--mint-rgb),0.4)]"
            style={{ gap: 10, height: 48, padding: "0 26px", borderRadius: 999, background: "var(--fill-brand)", color: "var(--on-mint)", fontFamily: "var(--font-body)", cursor: "none" }}
          >
            View Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollToId("research")}
            data-cursor-hover
            className="glass-chip hv-mint inline-flex items-center text-sm font-bold transition-all duration-300"
            style={{ gap: 10, height: 48, padding: "0 24px", borderRadius: 999, color: "var(--text)", fontFamily: "var(--font-body)", cursor: "none" }}
          >
            Research
          </button>
          <a
            href="https://github.com/nahyun27"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="glass-chip hv-mint inline-flex items-center text-sm font-bold transition-all duration-300"
            style={{ gap: 10, height: 48, padding: "0 24px", borderRadius: 999, color: "var(--text)", fontFamily: "var(--font-body)", cursor: "none" }}
          >
            GitHub ↗
          </a>
        </motion.div>
      </div>

      {/* At a glance */}
      <motion.dl {...fade(1.25)} className="section-inner w-full relative z-10" style={{ paddingBottom: 36 }}>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: "1px solid var(--w80)" }}>
          {HIGHLIGHTS.map((h, i) => (
            // 2 columns on phones, 4 from md: a divider sits left of every item that is not first in its row
            <div
              key={h.label}
              className={`flex flex-col gap-1.5 pt-5 ${i % 2 ? "border-l pl-5 md:pl-7" : i ? "md:border-l md:pl-7" : ""}`}
              style={{ borderColor: "var(--w80)" }}
            >
              <dt className="t-label">{h.label}</dt>
              <dd className="order-first" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.03em", lineHeight: 1, color: "var(--text)" }}>
                {h.value}
              </dd>
            </div>
          ))}
        </div>
      </motion.dl>
    </section>
  );
}
