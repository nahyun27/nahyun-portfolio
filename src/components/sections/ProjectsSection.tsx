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
    tags: ["C", "FEMU", "FTL", "SystemProgramming"],
    github: "https://github.com/nahyun27/femu-hotcold-ftl"
  },
  {
    id: "02",
    emoji: "🔍",
    title: "Paperprobe",
    subtitle: (
      <span>
        RAG-based academic paper Q&A system with multi-paper comparison, similarity graph visualization, and <strong style={{ color: "#00C9A7" }}>semantic prompt injection detection</strong>.
      </span>
    ),
    tags: ["FastAPI", "ChromaDB", "Next.js", "D3.js", "RAG"],
    github: "https://github.com/nahyun27/paperprobe"
  },
  {
    id: "03",
    emoji: "🐚",
    title: "nsh> Nahyun Shell",
    subtitle: (
      <span>
        Unix shell in C featuring multi-stage recursive pipes, I/O redirection, semicolon-sequenced commands, and{" "}
        <strong style={{ color: "#00C9A7" }}>arrow-key history navigation</strong>{" "}
        via <strong style={{ color: "#00C9A7" }}>termios raw mode</strong> with colored prompt and SIGINT handling.
      </span>
    ),
    tags: ["C", "Linux", "SystemProgramming", "Shell", "termios"],
    github: "https://github.com/nahyun27/linux-study-minishell"
  },
  {
    id: "04",
    emoji: "🎙️",
    title: "PerSI",
    subtitle: (
      <span>
        Personalized speaker identification app for hearing-impaired users — registers acquaintances' voices via{" "}
        <strong style={{ color: "#00C9A7" }}>pyannote diarization</strong> and identifies them in real-time using{" "}
        <strong style={{ color: "#00C9A7" }}>wav2vec2 embeddings</strong>, visualizing conversations as chat.
      </span>
    ),
    tags: ["React Native", "FastAPI", "PyTorch", "wav2vec2", "pyannote", "GCP", "MongoDB"],
    github: "https://github.com/PerSI-Org/PerSI_FrontEnd"
  },
  {
    id: "05",
    emoji: "💊",
    title: "ToFindPill",
    subtitle: (
      <span>
        Pill recognition app for clinicians — photograph multiple pills at once and get instant ID via a{" "}
        <strong style={{ color: "#00C9A7" }}>YOLOv5 detection → YOLOv8 classification</strong>{" "}
        two-stage pipeline (Top-1 acc 99.76%, inference{" "}
        <strong style={{ color: "#00C9A7" }}>5s → 1.5s</strong>
        ). Full SDLC with SRS, QA/QC strategy, and Jira-managed sprints.
      </span>
    ),
    tags: ["YOLOv5", "YOLOv8", "React Native", "Node.js", "MongoDB", "Python"],
    github: "https://github.com/ToFindPill"
  },
  {
    id: "06",
    emoji: "🎾",
    title: "TennisTown",
    subtitle: (
      <span>
        Tennis tournament platform I helped build from the ground up — featuring{" "}
        <strong style={{ color: "#00C9A7" }}>real-time bracket tracking</strong>{" "}
        and in-app score submission with tournament registration, draw management, court-by-court match status, and BP reward system.
      </span>
    ),
    tags: ["React", "Node.js", "Firebase"],
    demo: "https://www.tennistown.team/",
    playstore: "https://play.google.com/store/apps/details?id=com.momzit.tennistown&hl=ko",
    appstore: "https://apps.apple.com/kr/app/%ED%85%8C%EB%8B%88%EC%8A%A4%ED%83%80%EC%9A%B4/id1632821276"
  },
  {
    id: "07",
    emoji: "💻",
    title: "Software Dev Practices",
    subtitle: "Collaborative project applying agile methodologies, automated CI/CD pipelines, and software engineering practices.",
    tags: ["Agile", "CI/CD", "Testing"],
    github: "https://github.com/Software-Development-Practices"
  },
  {
    id: "08",
    emoji: "🔬",
    title: "ACE Lab Website",
    subtitle: (
      <span>
        Official website for Hanyang Univ. ERICA's AI & Cyber Security Lab — built with{" "}
        <strong style={{ color: "#00C9A7" }}>dark/light mode</strong> and{" "}
        <strong style={{ color: "#00C9A7" }}>Korean/English i18n</strong>
        , featuring lab news, publications, members, and album pages.
      </span>
    ),
    tags: ["Next.js", "Tailwind CSS", "i18n"],
    demo: "https://ace.hanyang.ac.kr"
  },
  {
    id: "09",
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
          text="Selected|Work."
          highlightWords={["Work."]}
          className="mb-14"
          style={{ fontSize: "clamp(2rem, 8vw, 4rem)" }}
          delay={0.1}
        />
        <HorizontalSlider cards={PROJECTS} />
      </div>
    </section>
  );
}
