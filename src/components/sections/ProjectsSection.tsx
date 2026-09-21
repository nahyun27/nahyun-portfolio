"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import ProjectScene, { type SceneOrigin } from "@/components/ProjectScene";
import { Icon } from "@/components/ProjectIcon";
import { PROJECTS } from "@/data/projects";

export default function ProjectsSection() {
  const [open, setOpen] = useState<{ index: number; origin: SceneOrigin } | null>(null);

  const openScene = (index: number, e: React.MouseEvent<HTMLElement>) => {
    // keyboard activation reports 0,0, so fall back to the row centre
    let { clientX: x, clientY: y } = e;
    if (x === 0 && y === 0) {
      const r = e.currentTarget.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    setOpen({ index, origin: { x, y, R: Math.hypot(window.innerWidth, window.innerHeight) + 180 } });
  };

  const track = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="projects" className="min-h-screen flex items-center relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <SectionHeader index="03" label="Projects" title="Selected Work." highlightWords={["Work."]} marginBottom={28} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "var(--t3)", maxWidth: 520, marginBottom: 32, lineHeight: 1.7 }}>
          Pick one. Each project opens as its own little world, and a few of them you can actually play with.
        </p>

        <div>
          {PROJECTS.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: (i % 4) * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={track}
              onClick={(e) => openScene(i, e)}
              data-cursor-hover
              className="group relative block w-full text-left"
              style={{ borderTop: "1px solid var(--w70)", cursor: "none", ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
              aria-label={`Open ${p.title}`}
            >
              {/* the project's colour spreads from the cursor like ink in water */}
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                style={{ background: `radial-gradient(360px circle at var(--mx) var(--my), color-mix(in srgb, ${p.theme.accent} 30%, transparent), transparent 62%)` }}
              />
              <span className="relative grid items-center" style={{ gridTemplateColumns: "48px auto minmax(0,1fr) auto", gap: 18, padding: "16px 8px" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", color: "var(--t5)" }}>{p.id}</span>
                <span
                  className="blob-morph hidden sm:grid place-items-center transition-all duration-500 group-hover:scale-110"
                  style={{
                    width: 44,
                    height: 44,
                    color: "var(--t3)",
                    background: "var(--w40)",
                    border: "1px solid var(--w80)",
                    animation: "blob-morph 8s ease-in-out infinite",
                  }}
                >
                  <Icon name={p.icon} size={19} />
                </span>
                <span className="min-w-0 col-start-2 sm:col-start-3 col-span-2 sm:col-span-1">
                  <span
                    className="block truncate transition-transform duration-500 group-hover:translate-x-2"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2.3rem)", lineHeight: 1.1, letterSpacing: "-0.035em", color: "var(--text)" }}
                  >
                    {p.title}
                  </span>
                  <span className="block truncate" style={{ marginTop: 6, fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t4)" }}>
                    {p.tags.slice(0, 4).join("  ·  ")}
                  </span>
                </span>
                <span
                  className="hidden sm:grid place-items-center transition-all duration-500 group-hover:rotate-[-45deg]"
                  style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid var(--w120)", color: "var(--text)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </motion.button>
          ))}
          <div style={{ borderTop: "1px solid var(--w70)" }} />
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectScene projects={PROJECTS} startIndex={open.index} origin={open.origin} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
