"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

const PROJECTS = [
  {
    id: "01",
    title: "Rise of Halfmoon",
    subtitle: "Strategic moon phase card game. Match phases, create lunar cycles, and outsmart your opponent.",
    tags: ["React", "Game Logic", "Web"],
    github: "https://github.com/nahyun27/rise-of-halfmoon",
    demo: "https://rise-of-halfmoon.vercel.app/",
    color: "#F6C90E",
    image: "/images/halfmoon.gif"
  },
  {
    id: "02",
    title: "Stack Tower 3D",
    subtitle: "Addictive 3D stacking game. Click at the perfect moment to stack blocks and reach for the sky.",
    tags: ["Next.js", "Three.js", "3D"],
    github: "https://github.com/nahyun27/stack-tower-3d",
    demo: "https://tower-stacking.vercel.app/",
    color: "#00E5FF",
    image: "/images/tower.gif"
  },
  {
    id: "03",
    title: "Floating Memories",
    subtitle: "Immersive 3D interactive photo gallery. Navigate through the cosmos of your life's moments in zero gravity.",
    tags: ["React Three Fiber", "WebGL", "Creative"],
    github: "https://github.com/nahyun27/floating-memories",
    demo: "https://floating-memories.vercel.app/",
    color: "#B388FF",
    image: "/images/floating.gif"
  },
  {
    id: "04",
    title: "Beware Of Darkness",
    subtitle: "Tense Unity maze escape game. Your vision narrows relentlessly while you collect coins to survive.",
    tags: ["Unity", "C#", "Level Design"],
    github: "https://github.com/nahyun27/Beware-Of-Darkness",
    color: "#FF5252",
    image: "/images/beware.gif"
  },
];

const GH_SVG = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const DEMO_SVG = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function CreativeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.1 });

  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const selectedProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];

  return (
    <section id="creative" ref={ref} className="min-h-screen flex items-center py-24 md:py-40 relative z-10"
      style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">

        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            className="text-xs tracking-[0.32em] uppercase font-semibold mb-6"
            style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
            04 — Web &amp; Games
          </motion.p>
          <AnimatedHeading
            text="Interactive|Side Projects."
            highlightWords={["Interactive"]}
            style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)" }}
            delay={0.1}
          />
        </div>

        {/* Master-Detail Grid */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 items-stretch">
          {/* ── Left: Project List ── */}
          <div className="w-full lg:w-[40%] flex flex-col">
            {PROJECTS.map((project, i) => {
              const isActive = selectedId === project.id;
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  whileHover={{ x: 6 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => setSelectedId(project.id)}
                  className="group relative w-full text-left outline-none focus:outline-none"
                >
                  {/* Row */}
                  <div
                    className="relative flex items-center gap-5 px-8 py-7 transition-all duration-400 border-b"
                    style={{
                      borderColor: "rgba(255,255,255,0.05)",
                      backgroundColor: isActive ? "rgba(255,255,255,0.025)" : "transparent",
                      padding: "7px 14px"
                    }}
                  >
                    {/* Active left accent bar */}
                    <motion.div
                      animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-0 bottom-0 w-[3px] origin-top rounded-r-full"
                      style={{ backgroundColor: project.color }}
                    />

                    {/* Number */}
                    <span
                      className="text-[14px] font-black tracking-widest shrink-0 transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif", color: isActive ? project.color : "rgba(255,255,255,0.15)" }}
                    >
                      {project.id}
                    </span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-bold text-xl md:text-2xl leading-tight transition-colors duration-300 mb-2 truncate group-hover:text-white"
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          color: isActive ? "#F0EDE6" : "#666"
                        }}
                      >
                        {project.title}
                      </h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {project.tags.map(tag => (
                          <span key={tag}
                            className="text-[13px] uppercase tracking-[0.15em] font-bold transition-colors duration-300"
                            style={{ fontFamily: "'Inter', sans-serif", color: isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow / connector hint */}
                    <motion.div
                      animate={{ x: isActive ? 0 : -4, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 flex items-center transition-transform duration-300 group-hover:translate-x-1.5"
                      style={{ color: project.color }}
                    >
                      <svg width="30" height="30" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>

                    {/* Hover shimmer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, ${project.color}06 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ── Connector Bridge ── */}
          <div className="hidden lg:flex flex-col items-center justify-center w-[6%] relative">
            <motion.div
              animate={{ backgroundColor: selectedProject.color, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-px h-full max-h-40 mx-auto"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${selectedProject.color} 50%, transparent 100%)`,
                opacity: 0.35,
              }}
            />
            <motion.div
              animate={{ backgroundColor: selectedProject.color, boxShadow: `0 0 10px ${selectedProject.color}` }}
              transition={{ duration: 0.5 }}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedProject.color }}
            />
          </div>

          {/* ── Right: Detail Panel ── */}
          <motion.div
            animate={{ borderColor: `${selectedProject.color}30` }}
            whileHover={{ y: -6, boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 100px ${selectedProject.color}15` }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[48%] rounded-3xl flex flex-col overflow-hidden transition-shadow duration-500"
            style={{
              backgroundColor: "#0D0D10",
              border: `1px solid ${selectedProject.color}20`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${selectedProject.color}08`,
              minHeight: "520px",
              padding: "1.7rem 2rem",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col h-full"
              >

                {/* Content */}
                <div className="flex-1 px-8 pb-8 pt-5 md:px-10 md:pb-10 flex flex-col gap-3">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className="text-[10px] font-black tracking-[0.2em] uppercase block mb-2"
                        style={{ color: selectedProject.color, fontFamily: "'Inter', sans-serif" }}
                      >
                        {selectedProject.id} / {PROJECTS.length.toString().padStart(2, "0")}
                      </span>
                      <h3
                        className="font-black text-2xl md:text-3xl leading-tight"
                        style={{ fontFamily: "'Syne', sans-serif", color: "#F4F1EB", letterSpacing: "-0.02em" }}
                      >
                        {selectedProject.title}
                      </h3>
                    </div>

                    {/* Link buttons */}
                    <div className="flex gap-2 shrink-0 pt-1">
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
                          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = selectedProject.color; (e.currentTarget as HTMLAnchorElement).style.borderColor = selectedProject.color; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 15px ${selectedProject.color}40`; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
                          title="GitHub"
                        >
                          {GH_SVG}
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
                          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = selectedProject.color; (e.currentTarget as HTMLAnchorElement).style.borderColor = selectedProject.color; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 15px ${selectedProject.color}40`; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
                          title="Live Demo"
                        >
                          {DEMO_SVG}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Image block */}
                  {selectedProject.image && (
                    <div className="relative w-full rounded-2xl overflow-hidden group shadow-xl" style={{ paddingBottom: "55%", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      {/* Interactive hover glow over the image */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 50px ${selectedProject.color}40, inset 0 0 10px ${selectedProject.color}20` }} />

                      {/* Color overlay fade at bottom */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none transition-opacity duration-700 group-hover:opacity-70"
                        style={{ background: `linear-gradient(to top, #0D0D10, transparent)` }}
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm md:text-base leading-[1.75] flex-1"
                    style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
                    {selectedProject.subtitle}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", paddingTop: "10px" }}>
                    {selectedProject.tags.map((tag: string) => (
                      <span key={tag}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full"
                        style={{
                          backgroundColor: `${selectedProject.color}14`,
                          border: `1px solid ${selectedProject.color}30`,
                          color: selectedProject.color,
                          fontFamily: "'Inter', sans-serif", padding: "5px 10px"
                        }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* BG glow */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: `radial-gradient(ellipse at 80% 120%, ${selectedProject.color}10 0%, transparent 60%)`,
                transition: "background 0.8s ease",
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
