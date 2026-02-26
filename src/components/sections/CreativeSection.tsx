"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

const PROJECTS = [
  {
    id: "01",
    title: "Rise of Halfmoon",
    subtitle: "Strategic moon phase card game. Match phases, create lunar cycles, and outsmart your opponent.",
    tags: ["React", "Game Logic", "Web"],
    github: "https://github.com/nahyun27/rise-of-halfmoon",
    demo: "https://rise-of-halfmoon.vercel.app/",
    color: "#F6C90E"
  },
  {
    id: "02",
    title: "Stack Tower 3D",
    subtitle: "Addictive 3D stacking game. Click at the perfect moment to stack blocks and reach for the sky.",
    tags: ["Next.js", "Three.js", "3D"],
    github: "https://github.com/nahyun27/stack-tower-3d",
    demo: "https://tower-stacking.vercel.app/",
    color: "#00E5FF"
  },
  {
    id: "03",
    title: "Floating Memories",
    subtitle: "Immersive 3D interactive photo gallery. Navigate through the cosmos of your life's moments in zero gravity.",
    tags: ["React Three Fiber", "WebGL", "Creative"],
    github: "https://github.com/nahyun27/floating-memories",
    demo: "https://floating-memories.vercel.app/",
    color: "#B388FF"
  },
  {
    id: "04",
    title: "Beware Of Darkness",
    subtitle: "Tense Unity maze escape game. Your vision narrows relentlessly while you collect coins to survive.",
    tags: ["Unity", "C#", "Level Design"],
    github: "https://github.com/nahyun27/Beware-Of-Darkness",
    color: "#FF5252"
  },
];

function ProjectCard({ project, index, inView }: { project: any, index: number, inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 cursor-default"
      style={{
        backgroundColor: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem", // Explicit padding fixes the cut-off text issue completely
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
    >
      {/* Background static corner glow base */}
      <div
        className="absolute top-0 right-0 w-72 h-72 pointer-events-none rounded-full blur-[90px] opacity-[0.15] transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: project.color, transform: "translate(30%, -30%)" }}
      />

      {/* Dynamic Mouse-tracking Spotlight Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, ${project.color}15, transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header (ID and Links) */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-sm font-black tracking-[0.2em]" style={{ color: project.color, fontFamily: "'Inter', sans-serif" }}>
              {project.id}
            </span>
            <div className="w-8 h-[2px] rounded-full transition-all duration-500 group-hover:w-16"
              style={{ backgroundColor: project.color, boxShadow: `0 0 10px ${project.color}` }} />
          </div>

          <div className="flex gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full transition-all duration-300 backdrop-blur-md"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#E0DDD6" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${project.color}25`; e.currentTarget.style.color = project.color; e.currentTarget.style.borderColor = project.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#E0DDD6"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                title="GitHub">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full transition-all duration-300 backdrop-blur-md"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#E0DDD6" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${project.color}25`; e.currentTarget.style.color = project.color; e.currentTarget.style.borderColor = project.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#E0DDD6"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                title="Live Demo">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Title & Desc */}
        <h3 className="font-bold text-2xl md:text-3xl mb-4 transition-colors duration-300 drop-shadow-lg"
          style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6", letterSpacing: "-0.01em" }}>
          {project.title}
        </h3>
        <p className="text-base leading-relaxed mb-10 flex-1"
          style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}>
          {project.subtitle}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2.5 mt-auto">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-4 py-2 text-xs font-semibold rounded-full backdrop-blur-md transition-colors duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#A0A0A0",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFF"; e.currentTarget.style.borderColor = project.color; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#A0A0A0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Exquisite dynamic border on hover */}
      <motion.div
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none transition-opacity duration-500"
        style={{
          border: `1px solid ${project.color}`,
          opacity: isHovered ? 0.5 : 0
        }}
      />
    </motion.div>
  );
}

export default function CreativeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="creative" ref={ref} className="min-h-screen flex items-center py-24 md:py-40"
      style={{ backgroundColor: "#0C0C0F" }}>
      <div className="section-inner w-full">

        {/* Header */}
        <div className="mb-20">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-xs tracking-[0.32em] uppercase font-semibold mb-6"
            style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
            04 — Web & Games
          </motion.p>
          <AnimatedHeading
            text="Interactive|Experiences."
            highlightWords={["Experiences."]}
            style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)" }}
            delay={0.1}
          />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}
