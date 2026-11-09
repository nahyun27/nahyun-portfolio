"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Pipeline, { rgba, onColor } from "@/components/scenes/Pipeline";
import { SPRITES } from "@/data/invaderSprites";
import { KOREA_PROVINCES, KOREA_VIEWBOX } from "@/data/koreaMap";
import type { SceneTheme } from "@/data/projects";

const label: React.CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" };
const note = (t: SceneTheme): React.CSSProperties => ({ marginTop: 12, fontSize: 12, lineHeight: 1.6, color: rgba(t.fg, 0.55) });

/* ================================ KCPEC ================================ */
// workflow only: the real content (surveys, letters, cases) is never shown anywhere on this site

export function KcpecCounseling({ theme }: { theme: SceneTheme }) {
  return (
    <Pipeline
      theme={theme}
      title="Counseling report, start to finish"
      steps={[
        { label: "Survey submitted", actor: "Client", detail: "The client fills in the counseling survey online after paying for the session.", artifact: "status: submitted" },
        { label: "AI first draft", actor: "Gemini", detail: "Gemini drafts the counseling opinion from the survey answers. Nothing goes out at this point.", artifact: "status: draft_generated" },
        { label: "Handed to staff", actor: "Admin dashboard", detail: "The draft lands in the staff queue with the survey beside it.", artifact: "status: sent_to_staff" },
        { label: "Reviewed and finalized", actor: "Counselor", detail: "A counselor edits the draft and uploads the final version. A person signs off on every report.", artifact: "status: completed" },
        { label: "Document issued", actor: "Document service", detail: "The final report is filled into a Word template table, converted to PDF and given the next serial number for that course, continuing the numbering of the previous site.", artifact: "2026-kcpec-XX-0001.pdf" },
      ]}
    />
  );
}

export function KcpecPayment({ theme }: { theme: SceneTheme }) {
  return (
    <Pipeline
      theme={theme}
      title="An order, including the bank transfer path"
      alt={{ at: 2, toggle: "Customer asks for a refund", label: "Refunded", detail: "The order is cancelled through Toss and marked refunded, and anything issued from it is withdrawn.", artifact: "status: refunded" }}
      steps={[
        { label: "Checkout", actor: "Customer", detail: "Card, easy pay, bank transfer or a virtual account, all through Toss Payments.", artifact: "status: pending" },
        { label: "Deposit confirmed", actor: "Toss webhook", detail: "For virtual accounts the money arrives later. A webhook confirms the deposit and flips the order without anyone watching the bank.", artifact: "status: paid" },
        { label: "Access unlocked", actor: "Backend", detail: "The course or counseling session opens up in the customer's account.", artifact: "course unlocked" },
        { label: "Progress and quizzes", actor: "Customer", detail: "Lecture progress is tracked per video and the quiz must be passed.", artifact: "progress: 100%" },
        { label: "Certificate", actor: "Document service", detail: "A PPTX template becomes a PDF certificate with a per course serial number.", artifact: "certificate.pdf" },
      ]}
    />
  );
}

/* ================================ PerSI ================================ */

const PERSI_SPEAKERS = [
  { name: "Mom", color: "#7A2E1D" },
  { name: "Jiwoo", color: "#1D5A7A" },
  { name: "Dad", color: "#3E6B1F" },
];

// a made-up family conversation, the shape of what the app returns
const PERSI_SEGMENTS = [
  { s: 0, from: 0, to: 3.2, text: "Did everyone eat already?", conf: 0.91 },
  { s: 1, from: 3.4, to: 5.6, text: "Not yet, I just got home.", conf: 0.87 },
  { s: 2, from: 5.9, to: 9.4, text: "Let's order something. Pizza?", conf: 0.78 },
  { s: -1, from: 9.7, to: 11.6, text: "Delivery, I left it at the door!", conf: 0.32 },
  { s: 0, from: 12, to: 14.4, text: "Oh, that was quick.", conf: 0.89 },
  { s: 1, from: 14.7, to: 17.2, text: "I'll get it. Who wants a drink?", conf: 0.84 },
];
const PERSI_LEN = 18;

export function PersiConversation({ theme }: { theme: SceneTheme }) {
  const reduce = useReducedMotion();
  const [time, setTime] = useState(reduce ? PERSI_LEN : 0);
  const [playing, setPlaying] = useState(!reduce);
  const chatRef = useRef<HTMLDivElement>(null);
  const bars = useMemo(() => Array.from({ length: 120 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)) * 0.75), []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((v) => (v >= PERSI_LEN + 2 ? 0 : v + 0.1)), 100);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [time, reduce]);

  const segAt = (sec: number) => PERSI_SEGMENTS.find((g) => sec >= g.from && sec <= g.to);
  const shown = PERSI_SEGMENTS.filter((g) => time >= g.to);
  const ink = "#2A0F08";
  const card = "#FFF6F0";

  return (
    <div style={{ color: ink }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <p style={{ ...label, color: rgba(theme.fg, 0.7) }}>A conversation, split by voice</p>
        <button type="button" data-cursor-hover onClick={() => setPlaying((p) => !p)} style={{ height: 32, padding: "0 13px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: theme.fg, background: rgba(theme.fg, 0.1), border: `1px solid ${rgba(theme.fg, 0.2)}`, cursor: "none" }}>
          {playing ? "❚❚ Pause" : "▶ Play"}
        </button>
      </div>

      <div style={{ borderRadius: 20, background: card, padding: 16, boxShadow: "0 30px 60px -30px rgba(42,15,8,0.5)" }}>
        {/* waveform coloured by who the model thinks is speaking */}
        <div className="relative flex items-center" style={{ height: 64, gap: 2 }}>
          {bars.map((h, i) => {
            const sec = (i / bars.length) * PERSI_LEN;
            const g = segAt(sec);
            const c = !g ? rgba(ink, 0.15) : g.s < 0 ? "#9A8A84" : PERSI_SPEAKERS[g.s].color;
            return <span key={i} style={{ flex: 1, height: `${(g ? h : 0.12) * 100}%`, borderRadius: 2, background: c, opacity: sec <= time ? 1 : 0.35, transition: "opacity .2s" }} />;
          })}
          <span aria-hidden style={{ position: "absolute", top: -4, bottom: -4, left: `${Math.min(100, (time / PERSI_LEN) * 100)}%`, width: 2, background: ink }} />
        </div>
        <div className="flex flex-wrap" style={{ gap: 12, marginTop: 10, fontSize: 11, fontWeight: 700 }}>
          {PERSI_SPEAKERS.map((s) => (
            <span key={s.name} className="inline-flex items-center" style={{ gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} /> {s.name}
            </span>
          ))}
          <span className="inline-flex items-center" style={{ gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#9A8A84" }} /> not registered
          </span>
        </div>

        {/* the chat it turns into */}
        <div ref={chatRef} className="flex flex-col" style={{ gap: 10, marginTop: 16, height: 250, overflowY: "auto", paddingRight: 4 }}>
          <AnimatePresence initial={false}>
            {shown.map((g) => {
              const sp = g.s < 0 ? null : PERSI_SPEAKERS[g.s];
              const mine = g.s === 1;
              return (
                <motion.div
                  key={g.from}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${mine ? "flex-row-reverse" : ""}`}
                  style={{ gap: 8, alignItems: "flex-end" }}
                >
                  <span className="grid place-items-center shrink-0" style={{ width: 30, height: 30, borderRadius: 999, fontSize: 12, fontWeight: 800, color: "#fff", background: sp ? sp.color : "#9A8A84" }}>
                    {sp ? sp.name[0] : "?"}
                  </span>
                  <span style={{ maxWidth: "75%" }}>
                    <span style={{ display: "block", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: rgba(ink, 0.55), textAlign: mine ? "right" : "left", marginBottom: 3 }}>
                      {sp ? `${sp.name} · ${Math.round(g.conf * 100)}%` : `Unknown · ${Math.round(g.conf * 100)}%, below 50%`}
                    </span>
                    <span style={{ display: "block", padding: "8px 12px", borderRadius: 14, fontSize: 13, lineHeight: 1.45, background: sp ? rgba(sp.color, 0.12) : rgba(ink, 0.06), border: sp ? "none" : `1px dashed ${rgba(ink, 0.3)}` }}>
                      {g.text}
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {!shown.length && <p style={{ fontSize: 13, color: rgba(ink, 0.5) }}>Listening…</p>}
        </div>
      </div>
      <p style={{ ...note(theme), color: rgba(theme.fg, 0.7) }}>
        Each stretch of audio gets a speaker and a confidence. Below 0.5 the app says it does not know the voice and shows only the transcript. Made-up conversation; the real app works in Korean.
      </p>
    </div>
  );
}

export function PersiPipeline({ theme }: { theme: SceneTheme }) {
  return (
    <Pipeline
      theme={theme}
      title="From a recording to who said what"
      alt={{ at: 3, toggle: "A voice nobody registered", label: "Unknown speaker", detail: "The classifier's best guess is under 0.5, so the segment is labelled unknown and only its transcript is shown.", artifact: "speaker: unknown" }}
      steps={[
        { label: "Record or upload", actor: "App", detail: "Record the conversation in the app or upload a call recording.", artifact: "conversation.wav" },
        { label: "Split by speaker", actor: "pyannote.audio", detail: "Diarization cuts the audio into segments, one voice each.", artifact: "6 segments" },
        { label: "Embed and transcribe", actor: "wav2vec 2.0", detail: "Each segment becomes an embedding, and the same pass produces its transcript.", artifact: "embeddings + text" },
        { label: "Who is it?", actor: "Conv1D classifier", detail: "Trained on about two minutes of each registered person's voice, it names the speaker with a confidence.", artifact: "Mom · 0.91" },
        { label: "Chat view", actor: "App", detail: "Segments come back as a chat with names and pictures, synced to the audio.", artifact: "chat" },
      ]}
    />
  );
}

/* ============================ Software Dev Practices ============================ */

export function DevPipeline({ theme }: { theme: SceneTheme }) {
  return (
    <Pipeline
      theme={theme}
      title="The Jenkinsfile, step by step"
      interval={1500}
      alt={{ at: 5, toggle: "Fail the quality gate", label: "Pipeline aborted", detail: "SonarQube's gate failed, so Jenkins stops before archiving anything and posts the failure to the team's Slack channel.", artifact: "✕ Slack: quality gate failed" }}
      steps={[
        { label: "Pull request", actor: "GitHub webhook", detail: "A PR into develop triggers Jenkins.", artifact: "SETB-42/feature-boss" },
        { label: "Checkout", actor: "Jenkins", detail: "Fresh checkout of develop inside a Docker build agent.", artifact: "develop @ a1b2c3" },
        { label: "Build", actor: "Gradle", detail: "./gradlew build -x test, compile first so failures are quick to read.", artifact: "BUILD SUCCESSFUL" },
        { label: "Test", actor: "JUnit", detail: "Boss stage, HP colour, dying effect, settings, music, pause and summary tests.", artifact: "tests passed" },
        { label: "Static analysis", actor: "SonarQube", detail: "Code smells, duplication and coverage are measured on every run.", artifact: "analysis uploaded" },
        { label: "Quality gate", actor: "SonarQube", detail: "Jenkins waits for the gate. Only a pass lets the pipeline continue.", artifact: "gate: passed" },
        { label: "Archive the jar", actor: "Jenkins", detail: "The runnable jar is kept as a build artifact, and a push to master publishes it as a release.", artifact: "invaders.jar" },
        { label: "Tell the team", actor: "Slack", detail: "A JUnit summary goes to the CI channel.", artifact: "✓ Slack: all green" },
      ]}
    />
  );
}

const HP_COLOURS = ["#FF6B6B", "#FFD166", "#7EE787"]; // 1, 2, 3 hit points left

/** the team's real sprites, in formation, with HP shown as colour the way the game does it */
export function InvadersFormation({ theme }: { theme: SceneTheme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 640, H = 360, px = 3;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const rows = [
      { a: "EnemyShipC1", b: "EnemyShipC2", hp: 1 },
      { a: "EnemyShipB1", b: "EnemyShipB2", hp: 2 },
      { a: "EnemyShipB1", b: "EnemyShipB2", hp: 2 },
      { a: "EnemyShipA1", b: "EnemyShipA2", hp: 3 },
    ];
    const draw = (name: string, x: number, y: number, color: string) => {
      const s = SPRITES[name];
      ctx.fillStyle = color;
      s.forEach((row, j) => [...row].forEach((c, i) => c === "1" && ctx.fillRect(x + i * px, y + j * px, px, px)));
    };

    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const frame = Math.floor(t * 2) % 2;
      const dx = reduce ? 0 : Math.sin(t * 0.8) * 60;
      const dy = reduce ? 0 : Math.floor(t / 6) % 3 * 8;
      rows.forEach((r, ri) => {
        for (let c = 0; c < 8; c++) draw(frame ? r.b : r.a, 110 + c * 52 + dx, 60 + ri * 40 + dy, HP_COLOURS[r.hp - 1]);
      });
      draw("EnemyShipSpecial", ((t * 70) % (W + 120)) - 60, 22, "#FF6BD6");
      const sx = W / 2 + (reduce ? 0 : Math.sin(t * 1.3) * 160);
      draw("Ship", sx - 20, H - 44, "#79C0FF");
      if (!reduce) {
        const by = H - 50 - ((t * 260) % (H - 60));
        draw("Bullet", sx - 4, by, "#FFFFFF");
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div style={{ color: theme.fg }}>
      <p style={{ ...label, color: rgba(theme.fg, 0.6), marginBottom: 12 }}>The game the pipeline shipped</p>
      <div style={{ borderRadius: 18, overflow: "hidden", background: "#000", border: `1px solid ${rgba(theme.fg, 0.14)}` }}>
        <canvas ref={ref} style={{ display: "block", width: "100%", aspectRatio: "16 / 9", imageRendering: "pixelated" }} aria-label="Space Invaders formation drawn from the project's sprite file" role="img" />
      </div>
      <div className="flex flex-wrap" style={{ gap: 14, marginTop: 12, fontSize: 12, fontWeight: 700 }}>
        {[3, 2, 1].map((hp) => (
          <span key={hp} className="inline-flex items-center" style={{ gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: HP_COLOURS[hp - 1] }} /> {hp} HP
          </span>
        ))}
      </div>
      <p style={note(theme)}>Sprites decoded straight from the repo&apos;s own bitmap file. Enemies show their remaining hit points as colour, one of the features the team built and tested.</p>
    </div>
  );
}

/* ================================ ACE Lab ================================ */

export function AcePipeline({ theme }: { theme: SceneTheme }) {
  return (
    <Pipeline
      theme={theme}
      title="Visitor stats without tracking people"
      steps={[
        { label: "A page is opened", actor: "Browser", detail: "The site records the visit with a random id kept in the browser. No IP address is stored.", artifact: "anon id" },
        { label: "Insert only", actor: "Supabase RLS", detail: "Anyone may add a row to page_views, but nobody can read rows back except signed-in admins.", artifact: "country · region · city · referrer" },
        { label: "Aggregate", actor: "Postgres function", detail: "The public site never sees rows. A database function returns totals per region instead.", artifact: "get_public_geo_stats()" },
        { label: "Relative map", actor: "Public page", detail: "Visitors see shading and bars only, no raw counts.", artifact: "map" },
      ]}
    />
  );
}

// made-up relative weights for the public-style map
const ACE_WEIGHTS: Record<string, number> = {
  Seoul: 1, "Gyeonggi-do": 0.86, Incheon: 0.38, Daejeon: 0.3, Busan: 0.28, Daegu: 0.2, "Chungcheongnam-do": 0.18, Gwangju: 0.16,
  Ulsan: 0.12, "Gyeongsangnam-do": 0.14, "Gyeongsangbuk-do": 0.12, Sejongsi: 0.1, "Chungcheongbuk-do": 0.1, "Jeollabuk-do": 0.08,
  "Jeollanam-do": 0.07, "Gangwon-do": 0.09, "Jeju-do": 0.06,
};

export function AceMap({ theme }: { theme: SceneTheme }) {
  const [hover, setHover] = useState<string | null>(null);
  const t = theme;
  const top = Object.entries(ACE_WEIGHTS).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <div style={{ color: t.fg }}>
      <p style={{ ...label, color: rgba(t.fg, 0.6), marginBottom: 12 }}>What the public page shows</p>
      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center" style={{ gap: 18 }}>
        <div style={{ position: "relative", padding: 12, borderRadius: 18, background: rgba(t.fg, 0.04), border: `1px solid ${rgba(t.fg, 0.12)}` }}>
          <svg viewBox={KOREA_VIEWBOX} style={{ width: "100%", height: "auto", display: "block", maxHeight: 420 }} role="img" aria-label="Map of South Korea shaded by relative visits">
            {KOREA_PROVINCES.map((p) => (
              <path
                key={p.name}
                d={p.d}
                onMouseEnter={() => setHover(p.name)}
                onMouseLeave={() => setHover(null)}
                style={{
                  fill: rgba(t.accent, 0.1 + 0.85 * (ACE_WEIGHTS[p.name] ?? 0)),
                  fillRule: "evenodd",
                  stroke: hover === p.name ? t.fg : rgba(t.bg, 0.9),
                  strokeWidth: hover === p.name ? 2.5 : 1,
                  transition: "stroke .2s",
                }}
              />
            ))}
          </svg>
          <span style={{ position: "absolute", left: 16, bottom: 12, fontSize: 12, fontWeight: 700, color: rgba(t.fg, 0.8) }}>{hover ?? "Hover a region"}</span>
        </div>
        <ul className="flex flex-col" style={{ gap: 10 }}>
          {top.map(([name, w]) => (
            <li key={name}>
              <div className="flex justify-between" style={{ fontSize: 12, fontWeight: 700 }}>
                <span>{name}</span>
              </div>
              <div style={{ marginTop: 5, height: 8, borderRadius: 999, background: rgba(t.fg, 0.08), overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${w * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ height: "100%", background: `linear-gradient(90deg, ${t.accent2}, ${t.accent})` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p style={note(t)}>Like the live site, the map shows shading, a region name on hover and relative bars, never counts. The numbers here are made up.</p>
    </div>
  );
}

/* ================================ nsh ================================ */

const TREE_COMMANDS = [
  "ps -A | grep -i system | awk '{print $1,$4}'",
  'sort < nsh.c | grep "int " | awk \'{print $1,$2}\' > delme3',
  "cat nsh.c | head -6 | tail -5 | head -1",
];

function parse(cmd: string) {
  return cmd.split("|").map((part) => {
    let p = part.trim();
    let inFile: string | undefined, outFile: string | undefined;
    const out = p.match(/>\s*(\S+)\s*$/);
    if (out) {
      outFile = out[1];
      p = p.slice(0, out.index).trim();
    }
    const inp = p.match(/<\s*(\S+)/);
    if (inp) {
      inFile = inp[1];
      p = (p.slice(0, inp.index) + p.slice(inp.index! + inp[0].length)).trim();
    }
    return { argv: p, inFile, outFile };
  });
}

export function NshTree({ theme }: { theme: SceneTheme }) {
  const reduce = useReducedMotion();
  const [ci, setCi] = useState(0);
  const [shown, setShown] = useState(0);
  const t = theme;
  const procs = parse(TREE_COMMANDS[ci]);
  const total = procs.length * 2;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setShown((s) => (s >= total + 3 ? 0 : s + 1)), 700);
    return () => window.clearInterval(id);
  }, [total, reduce]);
  const visible = reduce ? total : shown;

  const box: React.CSSProperties = { padding: "10px 12px", borderRadius: 12, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.5, background: rgba(t.fg, 0.06), border: `1px solid ${rgba(t.fg, 0.16)}` };

  return (
    <div style={{ color: t.fg }}>
      <p style={{ ...label, color: rgba(t.fg, 0.6) }}>What nsh does with a pipeline</p>
      <div className="flex flex-wrap" style={{ gap: 8, margin: "12px 0 18px" }}>
        {TREE_COMMANDS.map((c, i) => (
          <button
            key={c}
            type="button"
            data-cursor-hover
            aria-pressed={ci === i}
            onClick={() => {
              setCi(i);
              setShown(0);
            }}
            style={{ padding: "6px 11px", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, textAlign: "left", color: ci === i ? onColor(t.accent) : t.fg, background: ci === i ? t.accent : rgba(t.fg, 0.07), border: `1px solid ${rgba(t.fg, 0.14)}`, cursor: "none" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ ...box, display: "inline-block", fontWeight: 700 }}>nsh (parent) · execute_pipe_recursive()</div>
      <div className="flex flex-col" style={{ gap: 10, marginTop: 12, paddingLeft: 18, borderLeft: `2px solid ${rgba(t.fg, 0.16)}` }}>
        {procs.map((p, i) => {
          const forked = visible > i * 2;
          const wired = visible > i * 2 + 1;
          const stdin = p.inFile ? `< ${p.inFile}` : i > 0 ? `pipe ${i} read end` : "terminal";
          const stdout = p.outFile ? `> ${p.outFile}` : i < procs.length - 1 ? `pipe ${i + 1} write end` : "terminal";
          return (
            <div key={`${ci}-${i}`} className="grid items-center" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: 10, opacity: forked ? 1 : 0.15, translate: forked ? "0 0" : "-10px 0", transition: "opacity .35s, translate .35s" }}>
              <div style={box}>
                <span style={{ color: t.accent, fontWeight: 700 }}>fork() → child {i + 1}</span>
                <br />
                execvp: {p.argv}
              </div>
              <div style={{ ...box, background: "transparent", borderStyle: "dashed", opacity: wired ? 1 : 0.15, transition: "opacity .35s" }}>
                stdin ← {stdin}
                <br />
                stdout → {stdout}
                {(p.inFile || p.outFile || procs.length > 1) && <span style={{ display: "block", color: rgba(t.fg, 0.5) }}>dup2() then close the spare fds</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p style={note(t)}>
        nsh splits on <code>|</code>, forks one child per stage and connects neighbours with pipes, recursively. Redirections are applied with <code>dup2</code> inside the child just before <code>execvp</code>, and the parent waits for the whole chain.
      </p>
    </div>
  );
}

/* ================================ Paperprobe ================================ */

export function PaperChunking({ theme }: { theme: SceneTheme }) {
  const reduce = useReducedMotion();
  const WORDS = 2600, SIZE = 500, OVER = 50, CELL = 10; // one cell = ten words
  const cells = WORDS / CELL;
  const starts = useMemo(() => {
    const s: number[] = [];
    for (let i = 0; i < WORDS; i += SIZE - OVER) {
      s.push(i);
      if (i + SIZE >= WORDS) break;
    }
    return s;
  }, []);
  const [k, setK] = useState(0);
  const t = theme;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setK((v) => (v + 1) % (starts.length + 1)), 1100);
    return () => window.clearInterval(id);
  }, [starts.length, reduce]);

  const cur = Math.min(k, starts.length - 1);
  const from = starts[cur] / CELL, to = Math.min(cells, (starts[cur] + SIZE) / CELL);
  const prevTo = cur > 0 ? Math.min(cells, (starts[cur - 1] + SIZE) / CELL) : -1;

  return (
    <div style={{ color: t.fg }}>
      <p style={{ ...label, color: rgba(t.fg, 0.6) }}>How a paper is cut up before embedding</p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(40, 1fr)", gap: 2, marginTop: 14 }}>
        {Array.from({ length: cells }, (_, i) => {
          const inside = i >= from && i < to;
          const overlap = inside && i < prevTo;
          const done = i < from;
          return (
            <span
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 3,
                background: overlap ? t.accent2 : inside ? t.accent : done ? rgba(t.fg, 0.22) : rgba(t.fg, 0.08),
                transition: "background .35s",
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap" style={{ gap: 14, marginTop: 12, fontSize: 12, fontWeight: 700 }}>
        <span className="inline-flex items-center" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: t.accent }} /> current chunk (500 words)</span>
        <span className="inline-flex items-center" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: t.accent2 }} /> shared with the previous one (50)</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>chunk {cur + 1} / {starts.length}</span>
      </div>
      <div className="grid grid-cols-3" style={{ gap: 10, marginTop: 18 }}>
        {[
          { v: "500", l: "words per chunk" },
          { v: "50", l: "words of overlap" },
          { v: "> 0.3", l: "similarity to draw an edge" },
        ].map((m) => (
          <div key={m.l} style={{ padding: "12px 14px", borderRadius: 14, background: rgba(t.fg, 0.05), border: `1px solid ${rgba(t.fg, 0.12)}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800 }}>{m.v}</div>
            <div style={{ fontSize: 11, color: rgba(t.fg, 0.6), marginTop: 4 }}>{m.l}</div>
          </div>
        ))}
      </div>
      <p style={note(t)}>
        Each square is ten words. The overlap means a sentence cut at a boundary still appears whole in one chunk. Every chunk is embedded with MiniLM; a paper&apos;s vector is the mean of its chunks, and two papers are linked in the graph when their cosine similarity passes 0.3.
      </p>
    </div>
  );
}
