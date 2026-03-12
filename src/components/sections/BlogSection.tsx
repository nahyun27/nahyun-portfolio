"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

// ── Data ────────────────────────────────────────────────────────────────────

const SERIES = [
  {
    title: "운영체제 Deep Dive",
    total: 10,
    current: 3,
    status: "진행 중",
    description: "실제 Linux 커널 구현을 바탕으로 OS 핵심 개념 파헤치기",
    color: "#00C9A7",
    posts: [
      { title: "Part 1: Process & Execution", desc: "ls를 치면 무슨 일이 일어날까?", url: "https://nahyun27.github.io/posts/os-process-part1/", done: true },
      { title: "Part 2: IPC - Pipe", desc: "ls | grep .c는 어떻게 동작할까?", url: "https://nahyun27.github.io/posts/os-ipc-pipe-part2/", done: true },
      { title: "Part 3: Shared Memory", desc: "Zero Copy IPC, Shared Memory", url: "https://nahyun27.github.io/posts/os-shared-memory-part3/", done: true },
      { title: "Part 4: Virtual Memory", done: false },
      { title: "Part 5: Synchronization & Deadlock", done: false },
      { title: "Part 6: File System Internals", done: false },
    ],
  },
  {
    title: "양자컴퓨터 입문",
    total: 3,
    current: 3,
    status: "완결",
    description: "큐비트부터 RSA 위협까지, 양자컴퓨팅의 기초와 보안 영향",
    color: "#A78BFA",
    posts: [
      { title: "Part 1: 큐비트가 뭐길래?", desc: "양자역학 기초", url: "https://nahyun27.github.io/posts/quantum-computing-basics-part1/", done: true },
      { title: "Part 2: 양자 알고리즘", desc: "Shor & Grover", url: "https://nahyun27.github.io/posts/quantum-algorithms-part2/", done: true },
      { title: "Part 3: 양자 보안", desc: "PQC vs QKD", url: "https://nahyun27.github.io/posts/quantum-security-part3/", done: true },
    ],
  },
];

const POSTS = [
  { title: "AI 시대, 개발자에게 필요한 것", desc: "AI 도구 활용과 본질적 사고의 균형", category: "Perspective", url: "https://nahyun27.github.io/posts/ai-era-developer/" },
  { title: "MasterKey - ASR 백도어 공격 분석", desc: "음성 인식 시스템 취약점을 이용한 백도어 공격 메커니즘", category: "Security", url: "https://nahyun27.github.io/posts/masterkey-paper-review/" },
  { title: "VOAPI² - API 취약점 자동 테스팅", desc: "Voice API 보안 취약점 자동 검증 프레임워크", category: "Security", url: "https://nahyun27.github.io/posts/voapi2-paper-review/" },
  { title: "HTLC와 Lightning Network의 핵심", desc: "Hash Time-Locked Contract로 보는 Layer 2 결제 메커니즘", category: "Blockchain", url: "https://nahyun27.github.io/posts/htlc-lightning-network/" },
  { title: "Paperprobe: RAG 기반 논문 Q&A 시스템", desc: "LangChain + FAISS로 논문 읽기 자동화", category: "Projects", url: "https://nahyun27.github.io/posts/paperprobe/" },
  { title: "Rise of the Half Moon: 달 위상 전략 게임", desc: "D3-Force 그래프 보드 + 3단계 AI 구현", category: "Projects", url: "https://nahyun27.github.io/posts/rise-of-halfmoon-development/" },
  { title: "Stack Tower: 3D 타이밍 게임", desc: "Three.js + Cannon.js 물리 엔진 최적화", category: "Projects", url: "https://nahyun27.github.io/posts/stack-tower-3d-physics-game/" },
  { title: "GitHub 프로필 README 꾸미기", desc: "깃허브 스탯, 뱃지, Solved.ac 프로필 활용법", category: "Development", url: "https://nahyun27.github.io/posts/github-profile-readme-guide/" },
];

const CATEGORIES = ["All", "Security", "Blockchain", "Projects", "Perspective", "Development"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Security: "#F87171",
  Blockchain: "#FBBF24",
  Projects: "#00C9A7",
  Perspective: "#A78BFA",
  Development: "#60A5FA",
};

// ── Series Card ──────────────────────────────────────────────────────────────

function SeriesCard({ series, index, inView }: { series: typeof SERIES[0]; index: number; inView: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isDone = series.status === "완결";
  const pct = Math.round((series.current / series.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        backgroundColor: "#111116",
        border: `1px solid ${series.color}30`,
        boxShadow: `0 0 40px ${series.color}08`,
        padding: "15px",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0" >
            {/* Status badge */}
            <span
              className="inline-flex items-center text-[10px] font-black tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-3"
              style={{
                backgroundColor: series.color + "15",
                color: series.color,
                border: `1px solid ${series.color}40`,
                padding: "3px 6px",
                marginBottom: "10px",
              }}
            >
              {isDone ? "✓ 완결" : `● ${series.current}/${series.total} 진행 중`}
            </span>
            <h3 className="font-black text-xl leading-tight mb-1.5" style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6" }}>
              {series.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
              {series.description}
            </p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 mt-1"
            style={{ color: "#555"}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mt-5" style={{marginTop: "5px"}}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}>
              Progress
            </span>
            <span className="text-[10px] font-bold" style={{ color: series.color, fontFamily: "'Inter', sans-serif" }}>
              {pct}%
            </span>
          </div>
          <div className="w-full h-[3px] rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : { width: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 + 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: series.color }}
            />
          </div>
        </div>
      </div>

      {/* Expandable Post List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t px-6 pb-4 pt-4 flex flex-col gap-1" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {series.posts.map((post, pi) => (
                post.done ? (
                  <a
                    key={pi}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl group/post transition-all duration-200"
                    style={{ textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = series.color + "0A"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
                  >
                    <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: series.color + "20" }}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill={series.color}><path d="M1.5 5l2.5 2.5L8.5 2" stroke={series.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold transition-colors duration-200 group-hover/post:text-white truncate" style={{ color: "#C0BCBA", fontFamily: "'Inter', sans-serif" }}>
                        {post.title}
                      </p>
                      {post.desc && <p className="text-xs mt-0.5 truncate" style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}>{post.desc}</p>}
                    </div>
                    <svg className="shrink-0 opacity-0 group-hover/post:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={series.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
                  </a>
                ) : (
                  <div key={pi} className="flex items-center gap-3 py-2.5 px-3 rounded-xl opacity-25">
                    <span className="shrink-0 w-4 h-4 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    <p className="text-sm font-semibold truncate" style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}>
                      {post.title}
                    </p>
                    <span className="ml-auto shrink-0 text-[9px] font-bold uppercase tracking-widest" style={{ color: "#444", fontFamily: "'Inter', sans-serif" }}>Soon</span>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Post Row ─────────────────────────────────────────────────────────────────

function PostRow({ post, index }: { post: typeof POSTS[0]; index: number }) {
  const color = CATEGORY_COLORS[post.category] || "#00C9A7";
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-5 group transition-all duration-300 rounded-xl"
      style={{ textDecoration: "none" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "12px"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `inset 3px 0 0 ${color}`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0px"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base leading-snug mb-1 transition-colors duration-200 group-hover:text-white" style={{ color: "#D0CCC8", fontFamily: "'Syne', sans-serif" }}>
          {post.title}
        </p>
        <p className="text-sm truncate" style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
          {post.desc}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{
            padding: "3px 7px",
            backgroundColor: color + "14",
            color,
            border: `1px solid ${color}35`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {post.category}
        </span>
        <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </div>
    </motion.a>
  );
}

// ── Blog Section ─────────────────────────────────────────────────────────────

export default function BlogSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = activeCategory === "All" ? POSTS : POSTS.filter(p => p.category === activeCategory);

  return (
    <section id="blog" ref={ref} className="min-h-screen flex items-center py-24 md:py-40 relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">

        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
            style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}
          >
            06 — Writing
          </motion.p>
          <AnimatedHeading
            text="Thoughts &|Articles."
            highlightWords={["Articles."]}
            style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)" }}
            delay={0.1}
          />
        </div>

        {/* ── Featured Series ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8" style={{ marginBottom: "0.5rem" }}>
            <h2 className="font-black text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6" }}>
              Featured Series
            </h2>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERIES.map((s, i) => <SeriesCard key={s.title} series={s} index={i} inView={inView} />)}
          </div>
        </motion.div>

        {/* ── Recent Posts ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8" style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
            <h2 className="font-black text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6" }}>
              Latest Posts
            </h2>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8" style={{marginTop:"10px", marginBottom: "10px"}}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  padding: "4px 8px",
                  fontFamily: "'Inter', sans-serif",
                  color: activeCategory === cat ? "#00C9A7" : "#555",
                  backgroundColor: activeCategory === cat ? "rgba(0,201,167,0.08)" : "transparent",
                  border: `1px solid ${activeCategory === cat ? "rgba(0,201,167,0.35)" : "rgba(255,255,255,0.06)"}`,
                  cursor: "none"
                }}
                data-cursor-hover
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full"
                    style={{ backgroundColor: "#00C9A7" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Posts */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2"
            >
              {filtered.map((post, i) => <PostRow key={post.url} post={post} index={i} />)}
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
