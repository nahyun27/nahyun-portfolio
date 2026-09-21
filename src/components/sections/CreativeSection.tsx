"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import ProjectScene, { type SceneOrigin } from "@/components/ProjectScene";
import MediaClip from "@/components/MediaClip";
import { Icon } from "@/components/ProjectIcon";
import { LINK_ICONS, ARROW_ICON } from "@/components/LinkIcons";
import { SIDE_PROJECTS } from "@/data/sideProjects";
import type { Project } from "@/data/projects";

function Card({ p, index, featured, onOpen }: { p: Project; index: number; featured: boolean; onOpen: (index: number, e: React.MouseEvent<HTMLElement>) => void }) {
  const media = p.media?.[0];
  const [primary, ...rest] = p.links;
  // only the card under the cursor (or holding keyboard focus) plays its clip
  const [live, setLive] = useState(false);

  const track = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ delay: (index % 3) * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={track}
      onMouseEnter={() => setLive(true)}
      onMouseLeave={() => setLive(false)}
      onFocusCapture={() => setLive(true)}
      onBlurCapture={() => setLive(false)}
      className={`glass glass-ring group flex flex-col overflow-hidden ${featured ? "md:col-span-2" : ""}`}
      style={{ borderRadius: 30, ["--ring-color" as string]: p.theme.accent, ["--mx" as string]: "50%", ["--my" as string]: "30%" }}
    >
      {/* the project's own colour blooms under the cursor */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ zIndex: 1, background: `radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, ${p.theme.accent} 20%, transparent), transparent 62%)` }}
      />

      {/* preview, opens the scene */}
      <button
        type="button"
        onClick={(e) => onOpen(index, e)}
        data-cursor-hover
        aria-label={`Open ${p.title}`}
        className="relative block w-full overflow-hidden"
        style={{ aspectRatio: featured ? "16 / 8" : "16 / 10", flex: "1 1 auto", background: p.theme.bg, cursor: "none", zIndex: 2 }}
      >
        {media?.video && (
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
            <MediaClip src={media.video} poster={media.src} label={p.title} active={live} />
          </div>
        )}
        <span
          className="glass-chip absolute grid place-items-center"
          style={{ left: 16, top: 16, height: 30, padding: "0 12px", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#fff", background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.22)" }}
        >
          {p.id}
        </span>
        <span
          aria-hidden
          className="absolute grid place-items-center opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
          style={{
            left: "50%",
            top: "50%",
            width: 92,
            height: 92,
            marginLeft: -46,
            marginTop: -46,
            borderRadius: "50%",
            color: "#fff",
            background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.5), rgba(255,255,255,0.12) 55%), rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.14em",
          }}
        >
          OPEN
        </span>
      </button>

      {/* body */}
      <div className="relative flex flex-col flex-1" style={{ padding: featured ? "28px 30px 30px" : "24px 26px 26px", gap: 16, zIndex: 2 }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <span
            className="blob-morph grid place-items-center shrink-0"
            style={{
              width: 46,
              height: 46,
              color: "#0B0D10",
              background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,0.6), transparent 45%), linear-gradient(140deg, ${p.theme.accent}, ${p.theme.accent2})`,
              boxShadow: `0 12px 24px -10px ${p.theme.accent}`,
              animation: "blob-morph 8s ease-in-out infinite",
            }}
          >
            <Icon name={p.icon} size={20} strokeWidth={1.9} />
          </span>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: featured ? "clamp(1.7rem, 3vw, 2.3rem)" : "clamp(1.35rem, 2vw, 1.6rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)" }}>
            {p.title}
          </h3>
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            lineHeight: 1.65,
            color: "var(--t3)",
            display: "-webkit-box",
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.summary}
        </p>

        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {p.tags.map((t) => (
            <span key={t} style={{ padding: "4px 11px", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--t3)", background: "var(--w40)", border: "1px solid var(--w80)" }}>
              {t}
            </span>
          ))}
        </div>

        {/* the way out to the real thing: big, labelled, impossible to miss */}
        <div className="flex flex-wrap" style={{ gap: 10, marginTop: "auto", paddingTop: 6 }}>
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(var(--mint-rgb),0.6)]"
            style={{ gap: 10, height: 52, padding: "0 28px", borderRadius: 999, background: "var(--fill-brand)", color: "var(--on-mint)", fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 800, cursor: "none", flex: featured ? "0 0 auto" : "1 1 auto" }}
          >
            {LINK_ICONS[primary.kind]}
            {primary.label}
            {ARROW_ICON}
          </a>
          {rest.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="glass-chip hv-mint inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
              style={{ gap: 10, height: 52, padding: "0 24px", borderRadius: 999, color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, cursor: "none" }}
            >
              {LINK_ICONS[l.kind]}
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function CreativeSection() {
  const [open, setOpen] = useState<{ index: number; origin: SceneOrigin } | null>(null);

  const openScene = (index: number, e: React.MouseEvent<HTMLElement>) => {
    let { clientX: x, clientY: y } = e;
    if (x === 0 && y === 0) {
      const r = e.currentTarget.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    setOpen({ index, origin: { x, y, R: Math.hypot(window.innerWidth, window.innerHeight) + 180 } });
  };

  return (
    <section id="creative" className="min-h-screen flex items-center relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <SectionHeader index="04" label="Web & Games" title="Interactive Side Projects." highlightWords={["Interactive"]} marginBottom={36} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
          {SIDE_PROJECTS.map((p, i) => (
            <Card key={p.id} p={p} index={i} featured={i === 0} onOpen={openScene} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectScene projects={SIDE_PROJECTS} startIndex={open.index} origin={open.origin} onClose={() => setOpen(null)} backLabel="Back" />}
      </AnimatePresence>
    </section>
  );
}
