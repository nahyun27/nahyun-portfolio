"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shell, type Chunk, type Command } from "@/lib/nsh/engine";

type Entry =
  | { id: number; kind: "cmd"; user: string; path: string; text: string }
  | { id: number; kind: "chunk"; chunk: Chunk };

interface Props {
  /** extra commands registered into the shell (used by the site terminal) */
  commands?: Record<string, Command>;
  /** suggested commands shown as clickable chips */
  chips?: string[];
  /** type and run this command once when the terminal first shows */
  autoDemo?: string;
  height?: number | string;
  autoFocus?: boolean;
  /** called after `exit` / `quit` */
  onExit?: () => void;
  /** overrides for the terminal palette */
  palette?: Partial<Record<"fg" | "dim" | "user" | "path" | "err" | "bg" | "chip", string>>;
}

const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace";

export default function NshTerminal({ commands, chips = [], autoDemo, height = 420, autoFocus, onExit, palette }: Props) {
  const p = { fg: "#D7F7DE", dim: "rgba(215,247,222,0.55)", user: "#4ADE80", path: "#7DD3FC", err: "#FCA5A5", bg: "#08110B", chip: "rgba(74,222,128,0.14)", ...palette };
  const shell = useMemo(() => new Shell(commands), [commands]);
  const idRef = useRef(1);
  const nextId = () => idRef.current++;

  const [log, setLog] = useState<Entry[]>(() => shell.banner().map((chunk) => ({ id: 0, kind: "chunk" as const, chunk })));
  const [value, setValue] = useState("");
  const [ended, setEnded] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const histIdx = useRef<number | null>(null);
  const draft = useRef("");
  const demoDone = useRef(false);
  const timers = useRef<number[]>([]);

  const submit = useCallback(
    (line: string) => {
      const { user, path } = shell.promptParts();
      const res = shell.run(line);
      setLog((prev) => {
        const next = [...prev, { id: nextId(), kind: "cmd" as const, user, path, text: line }];
        if (res.echo !== undefined) next.push({ id: nextId(), kind: "chunk", chunk: { kind: "out", text: res.echo + "\n" } });
        for (const chunk of res.chunks) next.push({ id: nextId(), kind: "chunk", chunk });
        return res.clear ? [] : next;
      });
      histIdx.current = null;
      setValue("");
      if (res.exit) {
        setEnded(true);
        onExit?.();
      }
    },
    [shell, onExit]
  );

  const typeAndRun = useCallback(
    (cmd: string) => {
      if (busy || ended) return;
      setBusy(true);
      setValue("");
      let i = 0;
      const step = () => {
        i++;
        setValue(cmd.slice(0, i));
        if (i < cmd.length) timers.current.push(window.setTimeout(step, 22 + Math.random() * 26));
        else
          timers.current.push(
            window.setTimeout(() => {
              submit(cmd);
              setBusy(false);
            }, 260)
          );
      };
      timers.current.push(window.setTimeout(step, 120));
    },
    [busy, ended, submit]
  );

  // one starter demo so the terminal is visibly alive
  useEffect(() => {
    if (!autoDemo || demoDone.current) return;
    demoDone.current = true;
    const t = window.setTimeout(() => typeAndRun(autoDemo), 900);
    timers.current.push(t);
  }, [autoDemo, typeAndRun]);

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, value]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (busy || ended) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      submit(value);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = shell.history;
      if (!h.length) return;
      if (histIdx.current === null) {
        if (e.key === "ArrowDown") return;
        draft.current = value;
        histIdx.current = h.length - 1;
      } else if (e.key === "ArrowUp") histIdx.current = Math.max(0, histIdx.current - 1);
      else if (histIdx.current >= h.length - 1) {
        histIdx.current = null;
        setValue(draft.current);
        return;
      } else histIdx.current += 1;
      setValue(h[histIdx.current]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      const { user, path } = shell.promptParts();
      setLog((prev) => [...prev, { id: nextId(), kind: "cmd", user, path, text: value + "^C" }]);
      setValue("");
      histIdx.current = null;
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLog([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "d" && value === "") {
      e.preventDefault();
      submit("exit");
    }
  };

  const restart = () => {
    shell.cwd = shell.resolve("~");
    setLog(shell.banner().map((chunk) => ({ id: nextId(), kind: "chunk" as const, chunk })));
    setEnded(false);
    setValue("");
    inputRef.current?.focus();
  };

  const { user, path } = shell.promptParts();
  const chunkColor = (k: Chunk["kind"]) => (k === "err" ? p.err : k === "info" ? p.dim : p.fg);

  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          background: p.bg,
          color: p.fg,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          overflow: "hidden",
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <div className="flex items-center" style={{ gap: 8, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }} />
          <span style={{ marginLeft: 10, color: p.dim, fontSize: 12 }}>nsh, browser edition</span>
        </div>
        <div ref={scrollRef} className="thin-scroll" style={{ height, overflowY: "auto", padding: "12px 16px 14px" }}>
          {log.map((e) =>
            e.kind === "cmd" ? (
              <div key={e.id} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                <span style={{ color: p.user, fontWeight: 700 }}>{e.user}</span>
                <span style={{ color: p.dim }}>:</span>
                <span style={{ color: p.path, fontWeight: 700 }}>{e.path}</span>
                <span style={{ color: p.dim }}>$ </span>
                {e.text}
              </div>
            ) : (
              <div key={e.id} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: chunkColor(e.chunk.kind) }}>
                {e.chunk.text.replace(/\n$/, "")}
              </div>
            )
          )}
          {ended ? (
            <div style={{ marginTop: 6 }}>
              <button
                onClick={restart}
                style={{ color: p.user, fontFamily: MONO, fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, cursor: "none" }}
                data-cursor-hover
              >
                session closed, press to start a new one
              </button>
            </div>
          ) : (
            <div className="flex" style={{ whiteSpace: "pre" }}>
              <span style={{ color: p.user, fontWeight: 700 }}>{user}</span>
              <span style={{ color: p.dim }}>:</span>
              <span style={{ color: p.path, fontWeight: 700 }}>{path}</span>
              <span style={{ color: p.dim }}>$&nbsp;</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="nsh command line"
                style={{ flex: 1, minWidth: 0, background: "transparent", border: 0, outline: 0, color: p.fg, font: "inherit", caretColor: p.user }}
              />
            </div>
          )}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: 8, alignItems: "center" }}>
          <span style={{ color: p.dim, fontFamily: MONO, fontSize: 12 }}>try</span>
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => typeAndRun(c)}
              disabled={busy || ended}
              data-cursor-hover
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: p.fg,
                background: p.chip,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999,
                padding: "5px 12px",
                opacity: busy || ended ? 0.5 : 1,
                cursor: "none",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
