"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { rng } from "@/lib/ftl/sim";
import type { SceneTheme } from "@/data/projects";
import { rgba, onColor } from "@/components/scenes/Pipeline";

/* ---------------------------------------------------------------------------------------------
   A small re-creation of how TennisTown runs a tournament day. Matches become ready as the
   bracket fills in and wait in a queue; when a court frees up, the next match is picked the same
   way the backend does it (onCourtFreedQ): first a match pinned to that court, then one that may
   play on several courts including it, then any unpinned match, each ordered by round (later
   rounds first, their players are already waiting) and then by queue order.
   Players are made up.
   --------------------------------------------------------------------------------------------- */

const COURTS = 4;
const NAMES = ["Ari", "Bo", "Cyan", "Dami", "Eun", "Finn", "Gyu", "Hana", "Io", "Jae", "Kai", "Luna", "Min", "Noa", "Oli", "Pia"];
const ROUND = ["R16", "QF", "SF", "Final"];

interface Match {
  id: number;
  round: number; // 0 = R16 ... 3 = final
  slot: number; // position inside its round
  a?: string;
  b?: string;
  court?: number; // pinned court
  multi?: number[]; // may play on any of these
  order: number; // wait_order
  winner?: string;
}

interface Court {
  match?: number;
  progress: number;
  speed: number;
}

interface World {
  matches: Match[];
  queue: number[];
  courts: Court[];
  log: { id: number; text: string; why: string }[];
  order: number;
  champion?: string;
  logId: number;
}

function fresh(seed: number): World {
  const r = rng(seed);
  const matches: Match[] = [];
  let id = 0;
  for (let round = 0; round < 4; round++) {
    const n = 8 >> round;
    for (let slot = 0; slot < n; slot++) {
      const m: Match = { id: id++, round, slot, order: 0 };
      if (round === 0) {
        m.a = NAMES[slot * 2];
        m.b = NAMES[slot * 2 + 1];
      }
      // a mix of pinned, multi-court and free matches, like a real draw sheet
      const k = r();
      if (k < 0.35) m.court = 1 + Math.floor(r() * COURTS);
      else if (k < 0.6) {
        const c = 1 + Math.floor(r() * (COURTS - 1));
        m.multi = [c, c + 1];
      }
      matches.push(m);
    }
  }
  const w: World = { matches, queue: [], courts: Array.from({ length: COURTS }, () => ({ progress: 0, speed: 0 })), log: [], order: 0, logId: 0 };
  matches.filter((m) => m.round === 0).forEach((m) => enqueue(w, m.id));
  return w;
}

function enqueue(w: World, id: number) {
  w.matches[id].order = ++w.order;
  w.queue.push(id);
}

const byPriority = (w: World) => (x: number, y: number) => w.matches[y].round - w.matches[x].round || w.matches[x].order - w.matches[y].order;

/** the court-freed rule, returns the chosen match and the reason */
function pick(w: World, court: number): { id: number; why: string } | null {
  const sort = byPriority(w);
  const pinned = w.queue.filter((id) => w.matches[id].court === court).sort(sort);
  if (pinned.length) return { id: pinned[0], why: `pinned to court ${court}` };
  const multi = w.queue.filter((id) => w.matches[id].multi?.includes(court)).sort(sort);
  if (multi.length) return { id: multi[0], why: `may use courts ${w.matches[multi[0]].multi!.join(" · ")}` };
  const free = w.queue.filter((id) => !w.matches[id].court && !w.matches[id].multi).sort(sort);
  if (free.length) return { id: free[0], why: "no court preference, next in line" };
  return null;
}

function step(prev: World, dt: number, r: () => number): World {
  const w: World = { ...prev, matches: prev.matches.map((m) => ({ ...m })), queue: [...prev.queue], courts: prev.courts.map((c) => ({ ...c })), log: [...prev.log] };
  if (w.champion) return w;

  w.courts.forEach((c, ci) => {
    if (c.match !== undefined) {
      c.progress += dt * c.speed;
      if (c.progress >= 1) {
        const m = w.matches[c.match];
        m.winner = r() < 0.5 ? m.a : m.b;
        c.match = undefined;
        c.progress = 0;
        if (m.round === 3) {
          w.champion = m.winner;
          return;
        }
        // the winner fills a slot in the next round; once both slots are in, that match is ready
        const next = w.matches.find((x) => x.round === m.round + 1 && x.slot === m.slot >> 1)!;
        if (m.slot % 2 === 0) next.a = m.winner;
        else next.b = m.winner;
        if (next.a && next.b) enqueue(w, next.id);
      }
    }
    if (c.match === undefined && !w.champion) {
      const choice = pick(w, ci + 1);
      if (choice) {
        w.queue = w.queue.filter((id) => id !== choice.id);
        c.match = choice.id;
        c.progress = 0;
        c.speed = 0.09 + r() * 0.08;
        const m = w.matches[choice.id];
        w.log = [{ id: ++w.logId, text: `Court ${ci + 1} → ${ROUND[m.round]} · ${m.a} vs ${m.b}`, why: choice.why }, ...w.log].slice(0, 3);
      }
    }
  });
  return w;
}

function CourtTile({ n, m, progress, theme }: { n: number; m?: Match; progress: number; theme: SceneTheme }) {
  const line = "rgba(255,255,255,0.55)";
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: m ? "#2E7D4F" : rgba(theme.fg, 0.06), border: `1px solid ${rgba(theme.fg, 0.16)}`, aspectRatio: "16 / 9", transition: "background .5s" }}>
      {/* court lines */}
      <div aria-hidden style={{ position: "absolute", inset: "12% 8%", border: `1.5px solid ${m ? line : rgba(theme.fg, 0.15)}` }}>
        <div style={{ position: "absolute", left: "50%", top: -6, bottom: -6, borderLeft: `2px solid ${m ? "rgba(255,255,255,0.8)" : rgba(theme.fg, 0.15)}` }} />
        <div style={{ position: "absolute", left: "22%", right: "22%", top: "50%", borderTop: `1.5px solid ${m ? line : rgba(theme.fg, 0.15)}` }} />
        <div style={{ position: "absolute", left: "22%", top: 0, bottom: 0, borderLeft: `1.5px solid ${m ? line : rgba(theme.fg, 0.15)}` }} />
        <div style={{ position: "absolute", right: "22%", top: 0, bottom: 0, borderLeft: `1.5px solid ${m ? line : rgba(theme.fg, 0.15)}` }} />
      </div>
      <span style={{ position: "absolute", left: 10, top: 8, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: m ? "#fff" : rgba(theme.fg, 0.5) }}>COURT {n}</span>
      <AnimatePresence>
        {m && (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 grid place-items-center"
          >
            <span style={{ padding: "5px 10px", borderRadius: 8, background: "rgba(8,30,18,0.72)", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", lineHeight: 1.35 }}>
              <span style={{ display: "block", fontSize: 9, letterSpacing: "0.14em", color: theme.accent }}>{ROUND[m.round]}</span>
              {m.a} <span style={{ opacity: 0.6 }}>vs</span> {m.b}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {m && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "rgba(0,0,0,0.3)" }}>
          <div style={{ width: `${Math.min(100, progress * 100)}%`, height: "100%", background: theme.accent }} />
        </div>
      )}
    </div>
  );
}

function CourtSim({ theme }: { theme: SceneTheme }) {
  const reduce = useReducedMotion();
  const seed = useRef(7);
  const random = useRef(rng(99));
  const [w, setW] = useState(() => fresh(7));
  const [playing, setPlaying] = useState(!reduce);
  const [fast, setFast] = useState(false);
  const t = theme;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setW((prev) => step(prev, (fast ? 3 : 1) * 0.1, random.current)), 100);
    return () => window.clearInterval(id);
  }, [playing, fast]);

  // a short bow for the champion, then a new draw
  useEffect(() => {
    if (!w.champion) return;
    const id = window.setTimeout(() => setW(fresh(++seed.current)), 3500);
    return () => window.clearTimeout(id);
  }, [w.champion]);

  const waiting = w.matches.filter((m) => !m.winner && !w.queue.includes(m.id) && !w.courts.some((c) => c.match === m.id)).length;
  const chip: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 13px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: t.fg, background: rgba(t.fg, 0.08), border: `1px solid ${rgba(t.fg, 0.16)}`, cursor: "none" };
  const where = (m: Match) => (m.court ? `C${m.court}` : m.multi ? `C${m.multi.join("·")}` : "any");

  return (
    <div style={{ color: t.fg }}>
      <div className="flex flex-wrap items-center justify-between" style={{ gap: 10, marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: rgba(t.fg, 0.6) }}>Tournament day, simulated</p>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button type="button" data-cursor-hover style={chip} onClick={() => setPlaying((p) => !p)}>{playing ? "❚❚ Pause" : "▶ Play"}</button>
          <button type="button" data-cursor-hover style={{ ...chip, background: fast ? rgba(t.accent, 0.2) : chip.background }} aria-pressed={fast} onClick={() => setFast((f) => !f)}>3×</button>
          <button type="button" data-cursor-hover style={chip} onClick={() => setW(fresh(++seed.current))}>↺ New draw</button>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 10 }}>
        {w.courts.map((c, i) => (
          <CourtTile key={i} n={i + 1} m={c.match !== undefined ? w.matches[c.match] : undefined} progress={c.progress} theme={t} />
        ))}
      </div>

      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" style={{ gap: 14, marginTop: 14 }}>
        <div style={{ padding: 14, borderRadius: 14, background: rgba(t.fg, 0.05), border: `1px solid ${rgba(t.fg, 0.12)}`, minHeight: 172 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: rgba(t.fg, 0.55) }}>
            QUEUE · {w.queue.length} READY{waiting ? ` · ${waiting} WAITING FOR WINNERS` : ""}
          </p>
          <ul className="flex flex-col" style={{ gap: 5, marginTop: 10 }}>
            <AnimatePresence initial={false}>
              {[...w.queue].sort(byPriority(w)).slice(0, 5).map((id) => {
                const m = w.matches[id];
                return (
                  <motion.li
                    key={id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex items-center"
                    style={{ gap: 8, fontSize: 12 }}
                  >
                    <span style={{ minWidth: 38, fontSize: 10, fontWeight: 800, color: t.accent }}>{ROUND[m.round]}</span>
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.a} vs {m.b}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 6px", borderRadius: 6, background: rgba(t.fg, 0.1) }}>{where(m)}</span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>

        <div style={{ padding: 14, borderRadius: 14, background: rgba(t.fg, 0.05), border: `1px solid ${rgba(t.fg, 0.12)}`, minHeight: 172 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: rgba(t.fg, 0.55) }}>WHY THIS MATCH</p>
          <ul className="flex flex-col" style={{ gap: 9, marginTop: 10 }}>
            <AnimatePresence initial={false}>
              {w.log.map((l, i) => (
                <motion.li key={l.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: i === 0 ? 1 : 0.55, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 700 }}>{l.text}</span>
                  <span style={{ display: "block", color: rgba(t.fg, 0.6) }}>{l.why}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {w.champion && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: 14, padding: "12px 16px", borderRadius: 14, textAlign: "center", fontWeight: 800, color: onColor(t.accent), background: t.accent }}
          >
            🏆 {w.champion} wins the draw. New draw in a moment.
          </motion.p>
        )}
      </AnimatePresence>

      <p style={{ marginTop: 12, fontSize: 12, lineHeight: 1.6, color: rgba(t.fg, 0.55) }}>
        When a court frees up: a match pinned to it first, then one allowed on several courts, then any free match. Later rounds go before earlier ones, then queue order. Same rule as the backend; the players are made up.
      </p>
    </div>
  );
}

/* --------------------------------- ranking board --------------------------------- */

interface Row {
  name: string;
  pts: number;
  prev: number;
}

/** RANK(): ties share a rank and the next rank skips */
function ranked(rows: Row[]) {
  const sorted = [...rows].sort((a, b) => b.pts - a.pts);
  return sorted.map((row, i) => ({ ...row, rank: sorted.findIndex((x) => x.pts === row.pts) + 1, i }));
}

function Ranking({ theme }: { theme: SceneTheme }) {
  const reduce = useReducedMotion();
  const random = useRef(rng(31));
  const [rows, setRows] = useState<Row[]>(() => NAMES.slice(0, 8).map((name, i) => ({ name, pts: 1200 - i * 60, prev: 1200 - i * 60 })));
  const [last, setLast] = useState<string | null>(null);
  const [prevRank, setPrevRank] = useState<Record<string, number>>({});
  const t = theme;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setRows((cur) => {
        const r = random.current;
        const a = Math.floor(r() * cur.length);
        let b = Math.floor(r() * cur.length);
        if (b === a) b = (a + 1) % cur.length;
        const gain = 40 + Math.round(r() * 80);
        setPrevRank(Object.fromEntries(ranked(cur).map((x) => [x.name, x.rank])));
        setLast(`${cur[a].name} beat ${cur[b].name} (+${gain} / -${Math.round(gain / 2)})`);
        return cur.map((row, i) => (i === a ? { ...row, prev: row.pts, pts: row.pts + gain } : i === b ? { ...row, prev: row.pts, pts: Math.max(0, row.pts - Math.round(gain / 2)) } : { ...row, prev: row.pts }));
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div style={{ color: t.fg }}>
      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: rgba(t.fg, 0.6) }}>Live ranking</p>
      <p style={{ marginTop: 6, fontSize: 13, color: rgba(t.fg, 0.7), minHeight: 20 }}>{last ?? "Waiting for the first result…"}</p>
      <ol className="flex flex-col" style={{ gap: 6, marginTop: 12 }}>
        {ranked(rows).map((row) => {
          const was = prevRank[row.name];
          const move = was ? was - row.rank : 0;
          return (
            <motion.li
              key={row.name}
              layout
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="grid items-center"
              style={{ gridTemplateColumns: "34px 1fr auto 52px", gap: 10, padding: "9px 14px", borderRadius: 12, background: rgba(t.fg, row.rank === 1 ? 0.12 : 0.05), border: `1px solid ${rgba(t.fg, 0.1)}` }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: row.rank <= 3 ? t.accent : t.fg }}>{row.rank}</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{row.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{row.pts.toLocaleString()}</span>
              <span style={{ fontSize: 12, fontWeight: 800, textAlign: "right", color: move > 0 ? "#7CE0B0" : move < 0 ? "#FF8A7A" : rgba(t.fg, 0.35) }}>
                {move > 0 ? `▲${move}` : move < 0 ? `▼${-move}` : "–"}
              </span>
            </motion.li>
          );
        })}
      </ol>
      <p style={{ marginTop: 12, fontSize: 12, lineHeight: 1.6, color: rgba(t.fg, 0.55) }}>
        Ranks come from <code style={{ fontFamily: "var(--font-mono)" }}>RANK() OVER (ORDER BY points DESC)</code>, so ties share a place, and the board keeps last period&apos;s points to show who moved. Made-up players.
      </p>
    </div>
  );
}

export default function TennisScene({ theme, tab }: { theme: SceneTheme; tab: "courts" | "ranking" }) {
  return tab === "courts" ? <CourtSim theme={theme} /> : <Ranking theme={theme} />;
}
