"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";
import { tint } from "@/lib/color";

const ACCENT = "var(--mint)";

type LinkKind = "web" | "github" | "apple" | "android";

interface ProjectLink {
  label: string;
  href: string;
  kind: LinkKind;
}

interface ProjectMedia {
  src: string;
  label: string;
  caption?: string;
  /** cover crops to fill the frame, contain letterboxes */
  fit?: "cover" | "contain";
  position?: string;
  /** frame background for images that ship with their own (e.g. white charts) */
  bg?: string;
}

interface Project {
  id: string;
  emoji: string;
  title: string;
  badge?: string;
  summary: string;
  media?: ProjectMedia[];
  metrics?: { value: string; label: string }[];
  highlights: string[];
  tags: string[];
  links: ProjectLink[];
}

const PROJECT_DATA: Omit<Project, "id">[] = [
  {
    emoji: "💽",
    title: "SSD WAF Optimization",
    summary:
      "Hot/Cold data separation inside the FEMU blackbox SSD emulator, so garbage collection stops shuffling frequently rewritten pages together with long lived ones.",
    metrics: [
      { value: "48%", label: "lower WAF" },
      { value: "56%", label: "less GC overhead" },
      { value: "2x", label: "write throughput, 1h FIO" },
    ],
    highlights: [
      "Split the blackbox FTL free line list into separate hot and cold line pools, each with its own write pointer.",
      "Classified every LPN by write frequency inside a decaying window, and promoted it to hot only after repeated short rewrite intervals.",
      "Hot lines use greedy GC on invalid page count, cold lines use a cost benefit score from line age and invalid pages. Emergency borrowing keeps either pool from running dry.",
      "Added WAF accounting (host writes vs NAND writes) and compared baseline against the new FTL on a 64GB emulated SSD with 25% over provisioning.",
    ],
    media: [
      {
        src: "/images/projects/femu-waf-baseline.png",
        label: "Baseline",
        caption: "Baseline FTL: WAF keeps climbing and settles near 7.8.",
        fit: "contain",
        bg: "#fff",
      },
      {
        src: "/images/projects/femu-waf-improved.png",
        label: "Hot/Cold FTL",
        caption: "Hot/Cold FTL: WAF settles near 3.9 under the same kind of write load.",
        fit: "contain",
        bg: "#fff",
      },
    ],
    tags: ["C", "FEMU", "FTL", "System Programming"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/femu-hotcold-ftl", kind: "github" }],
  },
  {
    emoji: "🎾",
    title: "TennisTown",
    badge: "Live",
    summary:
      "A tennis tournament platform I helped build from the ground up, available on the web, App Store and Google Play.",
    highlights: [
      "Real time bracket tracking, with court by court match status.",
      "In app score submission by players.",
      "Tournament registration and draw management.",
      "BP reward system.",
      "React Native app for iOS and Android with a Node.js and Firebase backend.",
    ],
    tags: ["React Native", "Node.js", "Firebase"],
    links: [
      { label: "Website", href: "https://www.tennistown.team/", kind: "web" },
      {
        label: "App Store",
        href: "https://apps.apple.com/kr/app/%ED%85%8C%EB%8B%88%EC%8A%A4%ED%83%80%EC%9A%B4/id1632821276",
        kind: "apple",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.momzit.tennistown&hl=ko",
        kind: "android",
      },
    ],
  },
  {
    emoji: "⚖️",
    title: "KCPEC Platform",
    badge: "In production",
    summary:
      "An online education and counseling platform for court mandated crime prevention programs, built and operated end to end as a freelance full stack developer.",
    metrics: [
      { value: "4", label: "payment methods" },
      { value: "3", label: "OAuth providers" },
    ],
    highlights: [
      "Course playback, progress tracking and quizzes, with certificates and pledges generated from PPTX templates to PDF, using per course serial numbers carried over from the previous site.",
      "Toss Payments for card, easy pay, bank transfer and virtual accounts, with a webhook that confirms deposits automatically.",
      "Kakao, Naver and Google OAuth login on top of httpOnly cookie JWT sessions.",
      "Gemini drafts counseling reports, then a staff review workflow finalizes them.",
      "Admin dashboard for sales and visitor statistics, plus member, order and issued document management.",
      "Migrated the previous site's member and order history, and audited and fixed payment and security issues found in production.",
      "Moved the domain to Cloudflare DNS and AWS EC2, with an Nginx reverse proxy, SSL and systemd services.",
    ],
    tags: ["FastAPI", "PostgreSQL", "Next.js", "TypeScript", "Tailwind CSS", "AWS EC2", "Nginx"],
    links: [
      { label: "Live Site", href: "https://kcpec.co.kr", kind: "web" },
      { label: "GitHub", href: "https://github.com/nahyun27/kcpec-platform", kind: "github" },
    ],
  },
  {
    emoji: "🔍",
    title: "Paperprobe",
    summary:
      "Upload academic PDFs and ask questions grounded in their content, compare several papers side by side, and see how they relate in an interactive similarity graph.",
    metrics: [
      { value: "5", label: "papers compared at once" },
      { value: "KO / EN", label: "injection detection" },
    ],
    highlights: [
      "Ingestion pipeline: pdfplumber parsing, chunking and MiniLM embeddings stored per paper in ChromaDB, with streaming answers from FastAPI.",
      "Comparison view lines up up to five papers by purpose, method, results and limitations.",
      "D3.js network graph drawn from cosine similarity between paper embeddings.",
      "Semantic prompt injection detection: embedding similarity flags malicious instructions hidden in papers, ranks them by risk, and a defense prompt is added to every query.",
      "Swappable LLM backend, local Ollama (llama3.2) or the Gemini API.",
    ],
    media: [
      { src: "/images/projects/paperprobe-qa.gif", label: "Paper Q&A", caption: "Ask questions about an uploaded paper and get streamed answers." },
      { src: "/images/projects/paperprobe-compare.gif", label: "Compare", caption: "Compare up to five papers by purpose, method, results and limitations." },
      { src: "/images/projects/paperprobe-graph.gif", label: "Graph", caption: "Interactive similarity graph of the paper collection." },
      { src: "/images/projects/paperprobe-security.gif", label: "Injection detection", caption: "Suspicious chunks flagged and ranked by risk level." },
    ],
    tags: ["FastAPI", "ChromaDB", "Next.js", "D3.js", "RAG"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/paperprobe", kind: "github" }],
  },
  {
    emoji: "🐚",
    title: "nsh> Nahyun Shell",
    summary:
      "A Unix shell written in C, covering process creation, pipes, redirection and a hand rolled line editor.",
    metrics: [{ value: "∞", label: "pipe stages" }],
    highlights: [
      "Recursive multi stage pipes built on fork, pipe and dup2, so a | b | c | d works with no stage limit.",
      "I/O redirection (<, >, >>, 2>), background jobs that are reaped before the next prompt, and semicolon separated commands that respect quotes.",
      "Line editor in termios raw mode with arrow key history, mid line editing, !! and !n expansion and a colored prompt.",
      "Signal handling that keeps the shell alive on Ctrl+C while foreground children still terminate.",
    ],
    media: [
      {
        src: "/images/projects/nsh-demo.png",
        label: "Demo",
        caption: "A session in nsh: redirection, history, !! expansion and semicolon separated commands.",
        fit: "cover",
        position: "top",
      },
    ],
    tags: ["C", "Linux", "System Programming", "termios"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/linux-study-minishell", kind: "github" }],
  },
  {
    emoji: "🎙️",
    title: "PerSI",
    summary:
      "A speaker identification app for hearing impaired users. Register the voices of people you know, then see who is talking in real time as a chat.",
    highlights: [
      "Voices are registered with pyannote diarization and matched live using wav2vec2 embeddings.",
      "Conversations are shown as a chat timeline, with every utterance labeled by the identified speaker.",
      "React Native app with login, speaker registration and editing, recording and chat room screens.",
      "FastAPI and PyTorch backend on GCP, with MongoDB for data.",
    ],
    tags: ["React Native", "FastAPI", "PyTorch", "wav2vec2", "pyannote", "GCP", "MongoDB"],
    links: [{ label: "GitHub", href: "https://github.com/PerSI-Org/PerSI_FrontEnd", kind: "github" }],
  },
  {
    emoji: "💊",
    title: "ToFindPill",
    summary:
      "A pill recognition app for clinicians. Photograph several pills at once and get each one identified in seconds.",
    metrics: [
      { value: "99.76%", label: "Top 1 accuracy" },
      { value: "1.5s", label: "inference, down from 5s" },
    ],
    highlights: [
      "Two stage pipeline: YOLOv5 detects every pill in the photo, YOLOv8 classifies each detected pill.",
      "Brought inference from 5s down to 1.5s while holding 99.76% Top 1 accuracy.",
      "React Native client with a Node.js and MongoDB backend.",
      "Run as a full SDLC project with an SRS, a QA/QC strategy and Jira managed sprints.",
    ],
    tags: ["YOLOv5", "YOLOv8", "React Native", "Node.js", "MongoDB", "Python"],
    links: [{ label: "GitHub", href: "https://github.com/ToFindPill", kind: "github" }],
  },
  {
    emoji: "💻",
    title: "Software Dev Practices",
    summary:
      "A team project built around the way software is actually shipped: agile process, automated pipelines and tests.",
    highlights: [
      "Worked as a team with agile methodology.",
      "Automated build and delivery through CI/CD pipelines.",
      "Testing built into the workflow.",
    ],
    tags: ["Agile", "CI/CD", "Testing"],
    links: [{ label: "GitHub", href: "https://github.com/Software-Development-Practices", kind: "github" }],
  },
  {
    emoji: "🔬",
    title: "ACE Lab Website",
    badge: "Live",
    summary:
      "The official website of Hanyang Univ. ERICA's AI & Cyber Security Lab, covering research, members, publications and photo albums.",
    highlights: [
      "Dark and light mode.",
      "Full Korean and English i18n, with visitor language detection and shareable language links.",
      "Pages for lab news, research, members, publications and albums, plus admin pages for managing content.",
    ],
    tags: ["React", "Supabase", "i18n", "styled-components"],
    links: [{ label: "Live Site", href: "https://ace.hanyang.ac.kr", kind: "web" }],
  },
];

// ids follow the array order, so reordering the list needs no renumbering
const PROJECTS: Project[] = PROJECT_DATA.map((p, i) => ({ ...p, id: String(i + 1).padStart(2, "0") }));

const ICONS: Record<LinkKind, React.ReactNode> = {
  web: (
    <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      <path d="M2 12h20" />
    </svg>
  ),
  github: (
    <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
  apple: (
    <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.91 3.65-.81 1.54.11 2.82.72 3.63 1.87-3.07 1.82-2.39 5.86.88 7.15-.71 1.77-1.55 3.52-3.24 4.04v-.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  ),
  android: (
    <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.7 5.4 19.5 2c.2-.3 0-.6-.3-.6s-.5.1-.6.4L16.8 5c-1.4-.6-3-.9-4.8-.9-1.8 0-3.4.3-4.8.9L5.3 1.8c-.1-.2-.4-.3-.6-.1-.2.1-.3.4-.1.6l1.8 3.4c-3.1 1.7-5.2 4.9-5.2 8.6v.8h21.6v-.8c0-3.7-2.1-6.9-5.1-8.9zm-9.3 5.4c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1zm7.2 0c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z" />
    </svg>
  ),
};

const ARROW_SVG = (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

function LinkButton({ link, primary }: { link: ProjectLink; primary: boolean }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center gap-2 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 " +
        (primary
          ? "hover:shadow-[0_8px_24px_rgba(var(--mint-rgb),0.35)]"
          : "hover:bg-[rgba(var(--mint-rgb),0.1)] hover:border-[rgba(var(--mint-rgb),0.7)]")
      }
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: "9px 18px",
        background: primary ? "var(--fill-brand)" : "transparent",
        color: primary ? "var(--on-mint)" : ACCENT,
        border: `1px solid ${primary ? ACCENT : "rgba(var(--mint-rgb),0.4)"}`,
      }}
    >
      {ICONS[link.kind]}
      {link.label}
      {ARROW_SVG}
    </a>
  );
}

function MediaViewer({ media, title }: { media: ProjectMedia[]; title: string }) {
  const [index, setIndex] = useState(0);
  const item = media[index];

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          paddingBottom: "62%",
          backgroundColor: item.bg ?? "var(--w40)",
          border: "1px solid var(--w60)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={item.src}
          alt={`${title}: ${item.label}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: item.fit ?? "cover", objectPosition: item.position ?? "center" }}
        />
      </div>

      {media.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {media.map((m, i) => {
            const active = i === index;
            return (
              <button
                key={m.src}
                onClick={() => setIndex(i)}
                aria-pressed={active}
                className="rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  padding: "5px 12px",
                  color: active ? ACCENT : "var(--t3)",
                  backgroundColor: active ? `${tint(ACCENT, 8)}` : "transparent",
                  border: `1px solid ${active ? tint(ACCENT, 31) : "var(--w80)"}`,
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      )}

      {item.caption && (
        <p className="text-[12px] md:text-[13px] leading-[1.6]" style={{ color: "var(--t3)", fontFamily: "'Inter', sans-serif" }}>
          {item.caption}
        </p>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const selected = PROJECTS.find((p) => p.id === selectedId) || PROJECTS[0];
  const scrollRef = useRef<HTMLDivElement>(null);

  // a new project always starts at the top of the panel
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);
  const total = PROJECTS.length.toString().padStart(2, "0");

  return (
    <section id="projects" ref={ref} className="min-h-screen flex items-center py-24 md:py-32 relative z-10"
      style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">

        {/* Header */}
        <div className="mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            className="text-xs tracking-[0.32em] uppercase font-semibold mb-6"
            style={{ color: ACCENT, fontFamily: "'Inter', sans-serif" }}>
            03 / Projects
          </motion.p>
          <AnimatedHeading
            text="Selected|Work."
            highlightWords={["Work."]}
            style={{ fontSize: "clamp(2rem, 8vw, 4rem)" }}
            delay={0.1}
          />
        </div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-2 flex-wrap" style={{ marginBottom: "20px", marginTop: "20px" }}>
          {PROJECTS.map((project) => {
            const isActive = selectedId === project.id;
            return (
              <button
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                aria-pressed={isActive}
                className="flex items-center gap-1.5 rounded-full text-xs font-black tracking-wider transition-all duration-300"
                style={{
                  padding: "2px 7px",
                  fontFamily: "'Inter', sans-serif",
                  color: isActive ? ACCENT : "var(--w250)",
                  border: `1px solid ${isActive ? tint(ACCENT, 38) : "var(--w80)"}`,
                  backgroundColor: isActive ? tint(ACCENT, 7) : "transparent",
                }}
              >
                <span>{project.id}</span>
                <span className="font-medium" style={{ color: isActive ? "var(--text-soft)" : "var(--w250)", fontSize: "11px" }}>
                  {project.title.split(" ").slice(0, 2).join(" ")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Master / detail */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 items-stretch">

          {/* Left: project list (desktop) */}
          <div className="w-full lg:w-[38%] flex-col hidden lg:flex">
            {PROJECTS.map((project, i) => {
              const isActive = selectedId === project.id;
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  whileHover={{ x: 6 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => setSelectedId(project.id)}
                  aria-pressed={isActive}
                  className="group relative w-full text-left outline-none focus:outline-none"
                >
                  <div
                    className="relative flex items-center gap-4 border-b transition-all duration-300"
                    style={{
                      borderColor: "var(--w50)",
                      backgroundColor: isActive ? "var(--w25)" : "transparent",
                      padding: "9px 14px",
                    }}
                  >
                    <motion.div
                      animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-0 bottom-0 w-[3px] origin-top rounded-r-full"
                      style={{ backgroundColor: ACCENT }}
                    />

                    <span
                      className="text-[14px] font-black tracking-widest shrink-0 transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif", color: isActive ? ACCENT : "var(--w150)" }}
                    >
                      {project.id}
                    </span>

                    <span className="text-2xl shrink-0 transition-all duration-300"
                      style={{ opacity: isActive ? 1 : 0.35, filter: isActive ? "none" : "grayscale(1)" }}>
                      {project.emoji}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-bold text-lg md:text-xl leading-tight transition-colors duration-300 truncate group-hover:text-[color:var(--text)]"
                        style={{ fontFamily: "var(--font-display)", color: isActive ? "var(--text)" : "var(--t4)" }}
                      >
                        {project.title}
                      </h4>
                      <p className="text-[12px] uppercase tracking-[0.15em] font-bold truncate transition-colors duration-300"
                        style={{ fontFamily: "'Inter', sans-serif", marginTop: 4, color: isActive ? "var(--w400)" : "var(--w120)" }}>
                        {project.tags.slice(0, 3).join("  ·  ")}
                      </p>
                    </div>

                    <motion.div
                      animate={{ x: isActive ? 0 : -4, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 flex items-center"
                      style={{ color: ACCENT }}
                    >
                      <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: `linear-gradient(90deg, ${tint(ACCENT, 2)} 0%, transparent 70%)` }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Connector */}
          <div className="hidden lg:flex flex-col items-center justify-center w-[4%] relative">
            <div className="w-px h-full max-h-40 mx-auto"
              style={{ background: `linear-gradient(180deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`, opacity: 0.35 }} />
            <div className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
          </div>

          {/* Right: detail panel */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.6 }}
            className="relative w-full lg:w-[58%] rounded-3xl flex flex-col overflow-hidden h-auto"
            style={{
              backgroundColor: "var(--surface)",
              border: `1px solid ${tint(ACCENT, 15)}`,
              boxShadow: `0 30px 80px rgba(var(--shadow-rgb),calc(0.6 * var(--shadow-k))), 0 0 80px ${tint(ACCENT, 3)}`,
              padding: "1.2rem",
            }}
          >
            <div ref={scrollRef}
              className="thin-scroll scroll-fade relative z-10 lg:max-h-[max(440px,calc(100vh-200px))] lg:overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col gap-5"
                style={{ padding: "12px 20px 36px" }}
              >
                {/* Counter and badge */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase"
                    style={{ color: ACCENT, fontFamily: "'Inter', sans-serif" }}>
                    {selected.id} / {total}
                  </span>
                  {selected.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
                      style={{
                        color: ACCENT,
                        border: `1px solid ${tint(ACCENT, 25)}`,
                        backgroundColor: `${tint(ACCENT, 7)}`,
                        padding: "3px 9px",
                        fontFamily: "'Inter', sans-serif",
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
                      {selected.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl leading-none">{selected.emoji}</span>
                  <h3 className="font-black text-2xl md:text-4xl leading-tight break-words"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                    {selected.title}
                  </h3>
                </div>

                {/* Summary */}
                <p className="text-[14px] md:text-base leading-[1.7]"
                  style={{ color: "var(--t2)", fontFamily: "'Inter', sans-serif" }}>
                  {selected.summary}
                </p>

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {selected.links.map((link, i) => (
                    <LinkButton key={link.href} link={link} primary={i === 0} />
                  ))}
                </div>

                {/* Screenshots */}
                {selected.media && <MediaViewer media={selected.media} title={selected.title} />}

                {/* Metrics */}
                {selected.metrics && (
                  <div className="flex flex-wrap gap-3">
                    {selected.metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl"
                        style={{
                          backgroundColor: `${tint(ACCENT, 6)}`,
                          border: `1px solid ${tint(ACCENT, 18)}`,
                          padding: "12px 18px",
                        }}>
                        <div className="font-black text-2xl md:text-3xl leading-none"
                          style={{ fontFamily: "var(--font-display)", color: ACCENT }}>
                          {m.value}
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.12em] font-semibold"
                          style={{ color: "var(--t3)", fontFamily: "'Inter', sans-serif", marginTop: 8 }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                <ul className="flex flex-col gap-3 border-t" style={{ borderColor: "var(--w50)", paddingTop: 20 }}>
                  {selected.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
                      className="flex gap-3 text-[13px] md:text-[15px] leading-[1.65]"
                      style={{ color: "var(--t2)", fontFamily: "'Inter', sans-serif" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-[2px] shrink-0" style={{ backgroundColor: ACCENT, marginTop: "0.62em" }} />
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 border-t" style={{ borderColor: "var(--w50)", paddingTop: 16 }}>
                  {selected.tags.map((tag) => (
                    <span key={tag}
                      className="text-[10px] font-bold uppercase tracking-[0.15em] rounded-full"
                      style={{
                        backgroundColor: `${tint(ACCENT, 8)}`,
                        border: `1px solid ${tint(ACCENT, 19)}`,
                        color: ACCENT,
                        fontFamily: "'Inter', sans-serif",
                        padding: "5px 10px",
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            </div>

            <div className="absolute inset-0 pointer-events-none z-0"
              style={{ background: `radial-gradient(ellipse at 80% 120%, ${tint(ACCENT, 6)} 0%, transparent 60%)` }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
