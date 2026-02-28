"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";
import AnimatedHeading from "@/components/AnimatedHeading";

const PROJECTS = [
  {
    id: "01",
    emoji: "💽",
    title: "SSD WAF Optimization",
    subtitle: (
      <span>
        FEMU Blackbox FTL optimization via Hot/Cold data separation and Adaptive GC. Achieved <strong style={{ color: "#00C9A7" }}>48% WAF reduction</strong> and <strong style={{ color: "#00C9A7" }}>56% GC Overhead decrease</strong>.
      </span>
    ),
    tags: ["C", "FEMU FTL", "System Prog"],
    github: "https://github.com/nahyun27/femu-hotcold-ftl"
  },
  {
    id: "02",
    emoji: "🐚",
    title: "Linux Minishell",
    subtitle: "Minimalist Linux shell implementation in C, supporting core built-ins, pipes, and process execution.",
    tags: ["C", "Linux", "OS"],
    github: "https://github.com/nahyun27/linux-study-minishell"
  },
  {
    id: "03",
    emoji: "💻",
    title: "Software Dev Practices",
    subtitle: "Collaborative project applying agile methodologies, automated CI/CD pipelines, and software engineering practices.",
    tags: ["Agile", "CI/CD", "Testing"],
    github: "https://github.com/Software-Development-Practices"
  },
  {
    id: "04",
    emoji: "🎙️",
    title: "PerSI",
    subtitle: "Personalized speaker ID for hearing-impaired users with audio ML.",
    tags: ["wav2vec2", "pyannote", "PyTorch"],
    github: "https://github.com/PerSI-Org/PerSI_FrontEnd"
  },
  {
    id: "05",
    emoji: "💊",
    title: "ToFindPill",
    subtitle: "Pill recognition mobile app — snap a photo to instantly identify any medication.",
    tags: ["YOLOv5/v8", "React Native", "Python"],
    github: "https://github.com/ToFindPill"
  },
  {
    id: "06",
    emoji: "🎾",
    title: "TennisTown",
    subtitle: "Tennis host-guest matching platform — find a court partner across Seoul.",
    tags: ["React", "Node.js", "Firebase"]
  },
  {
    id: "07",
    emoji: "🛵",
    title: "Deli-Go",
    subtitle: "Delivery carpooling app — Grand Prize winner at 아이디어톤.",
    tags: ["React Native", "Maps API"]
  },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <section id="projects" ref={ref} className="min-h-screen flex items-center py-24 md:py-32 relative z-10"
      style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          03 — Projects
        </motion.p>
        <AnimatedHeading
          text="What I've|Built."
          highlightWords={["Built."]}
          className="mb-14"
          style={{ fontSize: "clamp(2rem, 8vw, 4rem)" }}
          delay={0.1}
        />
        <HorizontalSlider cards={PROJECTS} />
      </div>
    </section>
  );
}
