"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { Icon } from "@/components/ProjectIcon";
import { tint } from "@/lib/color";

// ── Data ────────────────────────────────────────────────────────────────────

const SERIES = [
  {
    title: "운영체제 Deep Dive",
    total: 10,
    current: 3,
    status: "진행 중",
    description: "실제 Linux 커널 구현을 바탕으로 OS 핵심 개념 파헤치기",
    color: "var(--mint)",
    posts: [
      { title: "Part 1: Process & Execution", desc: "ls를 치면 무슨 일이 일어날까?", url: "https://nahyun27.github.io/posts/os-process-part1/", done: true },
      { title: "Part 2: IPC, Pipe", desc: "ls | grep .c는 어떻게 동작할까?", url: "https://nahyun27.github.io/posts/os-ipc-pipe-part2/", done: true },
      { title: "Part 3: Shared Memory", desc: "Zero Copy IPC, Shared Memory", url: "https://nahyun27.github.io/posts/os-shared-memory-part3/", done: true },
    ],
  },
  {
    title: "양자컴퓨터 입문",
    total: 3,
    current: 3,
    status: "완결",
    description: "큐비트부터 RSA 위협까지, 양자컴퓨팅의 기초와 보안 영향",
    color: "var(--c-lilac)",
    posts: [
      { title: "Part 1: 큐비트가 뭐길래?", desc: "양자역학 기초", url: "https://nahyun27.github.io/posts/quantum-computing-basics-part1/", done: true },
      { title: "Part 2: 양자 알고리즘", desc: "Shor & Grover", url: "https://nahyun27.github.io/posts/quantum-algorithms-part2/", done: true },
      { title: "Part 3: 양자 보안", desc: "PQC vs QKD", url: "https://nahyun27.github.io/posts/quantum-security-part3/", done: true },
    ],
  },
];

const POSTS = [
  { title: "AI 시대, 개발자에게 필요한 것", desc: "AI 도구 활용과 본질적 사고의 균형", category: "Perspective", url: "https://nahyun27.github.io/posts/ai-era-developer/" },
  { title: "MasterKey: ASR 백도어 공격 분석", desc: "음성 인식 시스템 취약점을 이용한 백도어 공격 메커니즘", category: "Security", url: "https://nahyun27.github.io/posts/masterkey-paper-review/" },
  { title: "VOAPI²: API 취약점 자동 테스팅", desc: "Voice API 보안 취약점 자동 검증 프레임워크", category: "Security", url: "https://nahyun27.github.io/posts/voapi2-paper-review/" },
  { title: "HTLC와 Lightning Network의 핵심", desc: "Hash Time-Locked Contract로 보는 Layer 2 결제 메커니즘", category: "Blockchain", url: "https://nahyun27.github.io/posts/htlc-lightning-network/" },
  { title: "Paperprobe: RAG 기반 논문 Q&A 시스템", desc: "LangChain + FAISS로 논문 읽기 자동화", category: "Projects", url: "https://nahyun27.github.io/posts/paperprobe/" },
  { title: "Rise of the Half Moon: 달 위상 전략 게임", desc: "D3-Force 그래프 보드 + 3단계 AI 구현", category: "Projects", url: "https://nahyun27.github.io/posts/rise-of-halfmoon-development/" },
  { title: "Stack Tower: 3D 타이밍 게임", desc: "Three.js + Cannon.js 물리 엔진 최적화", category: "Projects", url: "https://nahyun27.github.io/posts/stack-tower-3d-physics-game/" },
  { title: "GitHub 프로필 README 꾸미기", desc: "깃허브 스탯, 뱃지, Solved.ac 프로필 활용법", category: "Development", url: "https://nahyun27.github.io/posts/github-profile-readme-guide/" },
];

const CATEGORIES = ["All", "Security", "Blockchain", "Projects", "Perspective", "Development"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Security: "var(--c-rose)",
  Blockchain: "var(--c-amber)",
  Projects: "var(--mint)",
  Perspective: "var(--c-lilac)",
  Development: "var(--c-blue)",
};

// ── Series Card ──────────────────────────────────────────────────────────────

const track = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const ArrowUpRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

// ── Series ───────────────────────────────────────────────────────────────────

function SeriesCard({ series, index }: { series: typeof SERIES[0]; index: number }) {
  const isDone = series.status === "완결";
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass glass-ring flex flex-col"
      style={{ borderRadius: 28, padding: "28px 28px 18px", ["--ring-color" as string]: series.color, gap: 18 }}
    >
      <div className="flex items-start justify-between" style={{ gap: 16 }}>
        <div className="min-w-0">
          <span
            className="inline-flex items-center"
            style={{ gap: 7, padding: "4px 12px", borderRadius: 999, marginBottom: 14, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: series.color, background: tint(series.color, 12), border: `1px solid ${tint(series.color, 30)}` }}
          >
            {isDone ? <Icon name="check" size={11} strokeWidth={3} /> : <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor" }} />}
            {isDone ? "Completed" : "In progress"}
          </span>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)" }}>{series.title}</h3>
          <p style={{ marginTop: 8, fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.6, color: "var(--t3)" }}>{series.description}</p>
        </div>
        <div className="shrink-0 text-right" style={{ fontFamily: "var(--font-display)" }}>
          <div style={{ fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>
            {series.current}
            <span style={{ color: "var(--t5)", fontSize: 18 }}>/{series.total}</span>
          </div>
          <div style={{ marginTop: 4, fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--t5)" }}>parts</div>
        </div>
      </div>

      {/* one segment per part */}
      <div className="flex" style={{ gap: 4 }} aria-label={`${series.current} of ${series.total} parts published`}>
        {Array.from({ length: series.total }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.4, ease: "easeOut" }}
            style={{ flex: 1, height: 5, borderRadius: 999, transformOrigin: "left", background: i < series.current ? series.color : "var(--w60)" }}
          />
        ))}
      </div>

      <ol className="flex flex-col" style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {series.posts.map((post, i) => {
          const n = String(i + 1).padStart(2, "0");
          const inner = (
            <>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: post.done ? series.color : "var(--t6)" }}>{n}</span>
              <span className="min-w-0">
                <span className="block truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: post.done ? "var(--text)" : "var(--t5)" }}>
                  {post.title.replace(/^Part \d+:\s*/, "")}
                </span>
                {"desc" in post && post.desc && (
                  <span className="block truncate" style={{ marginTop: 2, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "var(--t4)" }}>{post.desc}</span>
                )}
              </span>
              {post.done ? (
                <span className="transition-transform duration-300 group-hover/p:translate-x-0.5 group-hover/p:-translate-y-0.5" style={{ color: "var(--t3)" }}><ArrowUpRight size={16} /></span>
              ) : (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t6)" }}>soon</span>
              )}
            </>
          );
          const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto", alignItems: "center", gap: 12, padding: "11px 10px", borderTop: "1px solid var(--w50)", borderRadius: 12 };
          return (
            <li key={post.title}>
              {post.done && "url" in post ? (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="group/p transition-colors duration-300 hover:bg-[var(--w30)]"
                  style={{ ...rowStyle, cursor: "none" }}
                >
                  {inner}
                </a>
              ) : (
                <div style={rowStyle}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </motion.article>
  );
}

// ── Posts ────────────────────────────────────────────────────────────────────

function PostRow({ post, index }: { post: typeof POSTS[0]; index: number }) {
  const color = CATEGORY_COLORS[post.category] ?? "var(--mint)";
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      onMouseMove={track}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: (index % 4) * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[150px_minmax(0,1fr)_44px] items-center"
      style={{ gap: "6px 18px", padding: "20px 8px", borderTop: "1px solid var(--w70)", cursor: "none", ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      {/* the category colour spreads from the cursor, like ink in water */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{ background: `radial-gradient(340px circle at var(--mx) var(--my), ${tint(color, 16)}, transparent 62%)` }}
      />
      <span
        className="relative col-span-2 md:col-span-1 inline-flex items-center self-start md:self-center"
        style={{ gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color }}
      >
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.75) 0 18%, ${color} 42%)` }} />
        {post.category}
      </span>
      <span className="relative min-w-0">
        <span
          className="block transition-transform duration-500 group-hover:translate-x-1.5"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.1rem, 1.9vw, 1.45rem)", letterSpacing: "-0.025em", lineHeight: 1.25, color: "var(--text)" }}
        >
          {post.title}
        </span>
        <span className="block" style={{ marginTop: 5, fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.55, color: "var(--t3)" }}>{post.desc}</span>
      </span>
      <span
        className="relative grid place-items-center justify-self-end transition-all duration-500 group-hover:rotate-45"
        style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--w120)", color: "var(--text)" }}
      >
        <ArrowUpRight size={17} />
      </span>
    </motion.a>
  );
}

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");
  const filtered = activeCategory === "All" ? POSTS : POSTS.filter((p) => p.category === activeCategory);
  const count = (c: string) => (c === "All" ? POSTS.length : POSTS.filter((p) => p.category === c).length);

  return (
    <section id="blog" className="min-h-screen flex items-center relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <SectionHeader index="06" label="Writing" title="Thoughts & Articles." highlightWords={["Articles."]} marginBottom={40} />

        {/* Series */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 20, marginBottom: 72 }}>
          {SERIES.map((s, i) => (
            <SeriesCard key={s.title} series={s} index={i} />
          ))}
        </div>

        {/* Latest posts */}
        <div className="flex flex-wrap items-end justify-between" style={{ gap: 20, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 2.6vw, 2rem)", letterSpacing: "-0.03em", color: "var(--text)" }}>Latest posts</h3>
          <div className="glass-chip flex flex-wrap" style={{ gap: 2, padding: 4, borderRadius: 999 }} role="tablist" aria-label="Filter posts">
            {CATEGORIES.map((cat) => {
              const on = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveCategory(cat)}
                  data-cursor-hover
                  className="relative"
                  style={{ padding: "7px 14px", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: on ? "var(--mint)" : "var(--t3)", cursor: "none", transition: "color 0.25s ease" }}
                >
                  {on && (
                    <motion.span
                      layoutId="blog-filter"
                      className="absolute inset-0"
                      style={{ borderRadius: 999, background: "rgba(var(--mint-rgb),0.14)", boxShadow: "inset 0 0 0 1px rgba(var(--mint-rgb),0.32)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {cat}
                    <span style={{ marginLeft: 6, opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>{count(cat)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {filtered.map((post, i) => (
              <PostRow key={post.url} post={post} index={i} />
            ))}
            <div style={{ borderTop: "1px solid var(--w70)" }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
