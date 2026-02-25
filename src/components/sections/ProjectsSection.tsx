"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const PROJECTS = [
  {
    title: "ToFindPill",
    desc: "Pill recognition mobile app using computer vision. Snap a photo to instantly identify medication.",
    tech: ["YOLOv5/v8", "React Native", "Python"],
    emoji: "💊",
    color: "#FFD60A",
  },
  {
    title: "PerSI",
    desc: "Personalized speaker identification system for the hearing-impaired using state-of-the-art audio ML.",
    tech: ["wav2vec2", "pyannote", "PyTorch"],
    emoji: "🎙️",
    color: "#FFB400",
  },
  {
    title: "TennisTown",
    desc: "Tennis host-guest matching platform connecting players across Seoul. Smart court booking system.",
    tech: ["React", "Node.js", "Firebase"],
    emoji: "🎾",
    color: "#FFD60A",
  },
  {
    title: "Deli-Go",
    desc: "Delivery carpooling service app — winners of 아이디어톤 대상 (Grand Prize).",
    tech: ["React Native", "Maps API"],
    emoji: "🛵",
    color: "#FF9A3C",
  },
  {
    title: "NetTransfer",
    desc: "Privacy-preserving network traffic generation using generative models for secure data sharing.",
    tech: ["Python", "GAN", "Networking"],
    emoji: "🔒",
    color: "#FFD60A",
  },
  {
    title: "PQC-DDS",
    desc: "Post-quantum cryptography implementation within the ROS2 robotics middleware framework.",
    tech: ["ROS2", "C++", "PQC", "Cryptography"],
    emoji: "🤖",
    color: "#FFB400",
  },
];

const ACCENT = "#FFD60A";

function ProjectCard({ project, index, inView }: {
  project: typeof PROJECTS[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.6, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden cursor-default"
      style={{ backgroundColor: "#fff", border: "1.5px solid #FFE88A" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
    >
      {/* Overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6 rounded-3xl"
            style={{ backgroundColor: project.color }}
          >
            <span className="text-4xl mb-3">{project.emoji}</span>
            <h3 className="font-syne font-black text-2xl text-black mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-black/70 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              {project.desc}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "rgba(0,0,0,0.1)", fontFamily: "'Inter', sans-serif" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default card face */}
      <div className="p-8">
        <div className="text-4xl mb-4">{project.emoji}</div>
        <h3
          className="font-syne font-black text-xl md:text-2xl mb-2"
          style={{ color: "#0D0D0D" }}
        >
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: project.color + "25",
                color: "#7A6000",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("projects"); },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#FFFEF0" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium tracking-[0.3em] uppercase mb-4"
          style={{ color: "#B8860B", fontFamily: "'Inter', sans-serif" }}
        >
          03 — Projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="font-syne font-black text-5xl md:text-7xl leading-none mb-4"
          style={{ color: "#0D0D0D" }}
        >
          What I&apos;ve<br />
          <span style={{ color: ACCENT }}>Built.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="text-base mb-16"
          style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}
        >
          Hover any card to explore ✦
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((proj, i) => (
            <ProjectCard key={proj.title} project={proj} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
