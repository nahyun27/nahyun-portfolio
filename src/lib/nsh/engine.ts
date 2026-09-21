/**
 * Browser port of nsh (github.com/nahyun27/linux-study-minishell).
 *
 * The C original forks, pipes and execs real programs, which a browser cannot do. This keeps the
 * shell's own logic (quote aware tokenizing, `;` sequencing, multi stage pipes, `< > >> 2>`
 * redirection, `&` background jobs, `!!` / `!n` history expansion, cd/pwd/history builtins) and runs
 * it over a virtual file system with a small set of simulated commands.
 */
import { NSH_C, NSH_MAKEFILE, NSH_README } from "./sources";

export type ChunkKind = "out" | "err" | "info";
export interface Chunk {
  text: string;
  kind: ChunkKind;
}
export interface RunResult {
  chunks: Chunk[];
  /** the command line after `!!` / `!n` expansion, when it differs from the input */
  echo?: string;
  exit?: boolean;
  clear?: boolean;
}

export interface CmdCtx {
  shell: Shell;
  args: string[];
  stdin: string | null;
  /** true when stdout goes straight to the terminal */
  tty: boolean;
}
export interface CmdResult {
  out?: string;
  err?: string;
}
export type Command = (ctx: CmdCtx) => CmdResult;

const HOME = "/home/visitor";
const START_DATE = "Mar  2 17:57";

// ---------------------------------------------------------------- parsing

type Tok = { t: "w"; v: string } | { t: "op"; v: "|" | "<" | ">" | ">>" | "2>" | "&" };

function tokenize(src: string): Tok[] | { error: string } {
  const toks: Tok[] = [];
  let cur = "";
  let has = false;
  let quote: string | null = null;
  const flush = () => {
    if (has) toks.push({ t: "w", v: cur });
    cur = "";
    has = false;
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === quote) quote = null;
      else cur += c;
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      has = true;
      continue;
    }
    if (c === " " || c === "\t") {
      flush();
    } else if (c === "|" || c === "<" || c === "&") {
      flush();
      toks.push({ t: "op", v: c });
    } else if (c === ">") {
      if (has && cur === "2" && src[i - 1] === "2") {
        cur = "";
        has = false;
        toks.push({ t: "op", v: "2>" });
      } else {
        flush();
        if (src[i + 1] === ">") {
          toks.push({ t: "op", v: ">>" });
          i++;
        } else toks.push({ t: "op", v: ">" });
      }
    } else {
      cur += c;
      has = true;
    }
  }
  if (quote) return { error: `unterminated ${quote === "'" ? "single" : "double"} quote` };
  flush();
  return toks;
}

/** split on `;` that is not inside quotes */
function splitSemicolons(line: string): string[] {
  const parts: string[] = [];
  let cur = "";
  let quote: string | null = null;
  for (const c of line) {
    if (quote) {
      if (c === quote) quote = null;
      cur += c;
    } else if (c === "'" || c === '"') {
      quote = c;
      cur += c;
    } else if (c === ";") {
      parts.push(cur);
      cur = "";
    } else cur += c;
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
}

interface Stage {
  argv: string[];
  stdin?: string;
  stdout?: { path: string; append: boolean };
  stderr?: string;
}

function parseCommand(src: string): { stages: Stage[]; bg: boolean } | { error: string } {
  const toks = tokenize(src);
  if ("error" in toks) return toks;
  const stages: Stage[] = [{ argv: [] }];
  let bg = false;
  let pending: "<" | ">" | ">>" | "2>" | null = null;
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    const stage = stages[stages.length - 1];
    if (tk.t === "w") {
      if (pending === "<") stage.stdin = tk.v;
      else if (pending === ">") stage.stdout = { path: tk.v, append: false };
      else if (pending === ">>") stage.stdout = { path: tk.v, append: true };
      else if (pending === "2>") stage.stderr = tk.v;
      else stage.argv.push(tk.v);
      pending = null;
      continue;
    }
    if (tk.v === "&") {
      if (i !== toks.length - 1) return { error: "syntax error near '&'" };
      bg = true;
    } else if (tk.v === "|") {
      if (pending || stage.argv.length === 0) return { error: "syntax error near '|'" };
      stages.push({ argv: [] });
    } else {
      if (pending) return { error: `syntax error near '${tk.v}'` };
      pending = tk.v;
    }
  }
  if (pending) return { error: "syntax error: missing file name" };
  if (stages[stages.length - 1].argv.length === 0) return { error: "syntax error: empty command" };
  return { stages, bg };
}

// ---------------------------------------------------------------- shell

interface Job {
  pid: number;
  name: string;
  doneAt: number;
}

export class Shell {
  cwd = HOME;
  files = new Map<string, string>();
  dirs = new Set<string>(["/", "/home", HOME, "/tmp"]);
  history: string[] = [];
  user = "visitor";
  host = "nsh";
  commands = new Map<string, Command>();
  private jobs: Job[] = [];
  private nextPid = 4201;
  private clearFlag = false;
  private exitFlag = false;

  constructor(extra?: Record<string, Command>) {
    this.files.set(`${HOME}/nsh.c`, NSH_C);
    this.files.set(`${HOME}/Makefile`, NSH_MAKEFILE);
    this.files.set(`${HOME}/README.md`, NSH_README);
    this.files.set(
      `${HOME}/about.txt`,
      "Nahyun Kim\nAI security researcher and creative developer.\nThis shell is a browser port of nsh, the minishell I wrote in C.\n"
    );
    this.registerBuiltins();
    if (extra) for (const [k, v] of Object.entries(extra)) this.commands.set(k, v);
  }

  // ---- paths
  resolve(p: string): string {
    let path = p === "~" || p === "" ? HOME : p.startsWith("~/") ? HOME + p.slice(1) : p;
    if (!path.startsWith("/")) path = `${this.cwd}/${path}`;
    const out: string[] = [];
    for (const seg of path.split("/")) {
      if (!seg || seg === ".") continue;
      if (seg === "..") out.pop();
      else out.push(seg);
    }
    return "/" + out.join("/");
  }
  isDir(path: string) {
    return this.dirs.has(path);
  }
  readFile(path: string): string | null {
    return this.files.get(path) ?? null;
  }
  listDir(path: string): string[] {
    const prefix = path === "/" ? "/" : path + "/";
    const names = new Set<string>();
    for (const f of this.files.keys()) if (f.startsWith(prefix) && !f.slice(prefix.length).includes("/")) names.add(f.slice(prefix.length));
    for (const d of this.dirs) if (d !== path && d.startsWith(prefix) && !d.slice(prefix.length).includes("/")) names.add(d.slice(prefix.length));
    return [...names].sort();
  }

  promptParts() {
    const path = this.cwd === HOME ? "~" : this.cwd.startsWith(HOME + "/") ? "~" + this.cwd.slice(HOME.length) : this.cwd;
    return { user: `${this.user}@${this.host}`, path };
  }

  banner(): Chunk[] {
    return [
      { kind: "info", text: "Welcome to nsh, Nahyun Shell  (˵^ ᵕ ^˵)\nType a command, or 'exit' / 'quit' to leave. Try 'help'.\n" },
    ];
  }

  // ---- running
  run(rawLine: string): RunResult {
    const chunks: Chunk[] = [];
    this.clearFlag = false;
    this.exitFlag = false;

    // reap finished background jobs before the next command, like nsh does before the prompt
    const now = Date.now();
    this.jobs = this.jobs.filter((j) => {
      if (j.doneAt <= now) {
        chunks.push({ kind: "info", text: `[done] ${j.pid}\n` });
        return false;
      }
      return true;
    });

    let line = rawLine.trim();
    if (!line) return { chunks };

    // history expansion
    let echo: string | undefined;
    if (line === "!!" || /^!\d+$/.test(line)) {
      const idx = line === "!!" ? this.history.length - 1 : parseInt(line.slice(1), 10) - 1;
      const h = this.history[idx];
      if (h === undefined) {
        chunks.push({ kind: "err", text: `nsh: ${line}: event not found\n` });
        return { chunks };
      }
      line = h;
      echo = h;
    }
    if (this.history[this.history.length - 1] !== line) this.history.push(line);

    for (const part of splitSemicolons(line)) {
      const parsed = parseCommand(part);
      if ("error" in parsed) {
        chunks.push({ kind: "err", text: `nsh: ${parsed.error}\n` });
        continue;
      }
      this.runPipeline(parsed.stages, parsed.bg, chunks);
      if (this.exitFlag) break;
    }
    return { chunks, echo, exit: this.exitFlag || undefined, clear: this.clearFlag || undefined };
  }

  private runPipeline(stages: Stage[], bg: boolean, chunks: Chunk[]) {
    if (bg) {
      const first = stages[0].argv;
      const secs = first[0] === "sleep" ? Math.max(0, parseFloat(first[1] ?? "0") || 0) : 0.4;
      const pid = this.nextPid++;
      this.jobs.push({ pid, name: first[0], doneAt: Date.now() + secs * 1000 });
      chunks.push({ kind: "info", text: `[bg] ${pid}\n` });
    }
    let carry: string | null = null;
    for (let i = 0; i < stages.length; i++) {
      const st = stages[i];
      const isLast = i === stages.length - 1;
      let stdin: string | null = carry;
      if (st.stdin !== undefined) {
        const src = this.readFile(this.resolve(st.stdin));
        if (src === null) {
          chunks.push({ kind: "err", text: `nsh: ${st.stdin}: No such file or directory\n` });
          return;
        }
        stdin = src;
      }
      const redirected = !!st.stdout;
      const res = this.exec(st.argv, stdin, isLast && !redirected, stages.length === 1);
      if (res.err) {
        if (st.stderr) this.writeFile(st.stderr, res.err, false);
        else chunks.push({ kind: "err", text: res.err });
      } else if (st.stderr) this.writeFile(st.stderr, "", false);
      const out = res.out ?? "";
      if (st.stdout) {
        this.writeFile(st.stdout.path, out, st.stdout.append);
        carry = "";
      } else if (isLast) {
        if (out) chunks.push({ kind: "out", text: out });
      } else carry = out;
    }
  }

  writeFile(path: string, data: string, append: boolean) {
    const abs = this.resolve(path);
    const parent = abs.slice(0, abs.lastIndexOf("/")) || "/";
    if (!this.dirs.has(parent)) return;
    this.files.set(abs, append ? (this.files.get(abs) ?? "") + data : data);
  }

  private exec(argv: string[], stdin: string | null, tty: boolean, single: boolean): CmdResult {
    const name = argv[0];
    if (name === "exit" || name === "quit") {
      this.exitFlag = true;
      return { out: "Bye! See you again~  ૮ ˶ᵔ ᵕ ᵔ˶ ა\n" };
    }
    if (name === "cd") {
      if (!single) return {};
      const target = this.resolve(argv[1] ?? "~");
      if (!this.isDir(target)) return { err: `cd: ${argv[1]}: No such directory\n` };
      this.cwd = target;
      return {};
    }
    const cmd = this.commands.get(name);
    if (!cmd) return { err: `nsh: ${name}: command not found\n` };
    return cmd({ shell: this, args: argv.slice(1), stdin, tty });
  }

  // ---- commands
  activeJobs(): Job[] {
    const now = Date.now();
    return this.jobs.filter((j) => j.doneAt > now);
  }
  requestClear() {
    this.clearFlag = true;
  }

  private registerBuiltins() {
    const c = this.commands;

    const gather = (ctx: CmdCtx, names: string[], cmd: string): { text: string; err: string } => {
      if (names.length === 0) return { text: ctx.stdin ?? "", err: "" };
      let text = "";
      let err = "";
      for (const n of names) {
        const abs = ctx.shell.resolve(n);
        const f = ctx.shell.readFile(abs);
        if (f !== null) text += f;
        else if (ctx.shell.isDir(abs)) err += `${cmd}: ${n}: Is a directory\n`;
        else err += `${cmd}: ${n}: No such file or directory\n`;
      }
      return { text, err };
    };
    const lines = (t: string) => (t === "" ? [] : t.replace(/\n$/, "").split("\n"));
    const join = (l: string[]) => (l.length ? l.join("\n") + "\n" : "");

    c.set("pwd", ({ shell }) => ({ out: shell.cwd + "\n" }));
    c.set("history", ({ shell, args }) => {
      if (args[0] === "-c") {
        shell.history = [];
        return {};
      }
      return { out: shell.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}\n`).join("") };
    });
    c.set("echo", ({ args }) => {
      const nl = args[0] === "-n" ? "" : "\n";
      return { out: (args[0] === "-n" ? args.slice(1) : args).join(" ") + nl };
    });
    c.set("whoami", ({ shell }) => ({ out: shell.user + "\n" }));
    c.set("uname", ({ args }) => ({ out: args.includes("-a") ? "Linux nsh 6.1.0 #1 SMP simulated x86_64 GNU/Linux\n" : "Linux\n" }));
    c.set("date", () => ({
      out: new Date().toLocaleString("ko-KR", { dateStyle: "full", timeStyle: "long" }) + "\n",
    }));
    c.set("clear", ({ shell }) => {
      shell.requestClear();
      return {};
    });
    c.set("sleep", () => ({}));
    c.set("cat", (ctx) => {
      const { text, err } = gather(ctx, ctx.args, "cat");
      return { out: text, err };
    });
    c.set("ls", (ctx) => {
      const flags = ctx.args.filter((a) => a.startsWith("-")).join("");
      const paths = ctx.args.filter((a) => !a.startsWith("-"));
      const long = flags.includes("l");
      const all = flags.includes("a");
      let out = "";
      let err = "";
      const targets = paths.length ? paths : ["."];
      targets.forEach((p, idx) => {
        const abs = ctx.shell.resolve(p);
        if (ctx.shell.readFile(abs) !== null) {
          out += (long ? this.longLine(abs) : abs.split("/").pop()) + "\n";
          return;
        }
        if (!ctx.shell.isDir(abs)) {
          err += `ls: cannot access '${p}': No such file or directory\n`;
          return;
        }
        if (targets.length > 1) out += `${idx ? "\n" : ""}${p}:\n`;
        let names = ctx.shell.listDir(abs);
        if (all) names = [".", "..", ...names];
        else names = names.filter((n) => !n.startsWith("."));
        if (long) out += names.map((n) => this.longLine(abs === "/" ? "/" + n : `${abs}/${n}`, n) + "\n").join("");
        else out += ctx.tty ? (names.length ? names.join("  ") + "\n" : "") : join(names);
      });
      return { out, err };
    });
    c.set("grep", (ctx) => {
      const flags = ctx.args.filter((a) => /^-[a-zA-Z]+$/.test(a)).join("");
      const rest = ctx.args.filter((a) => !/^-[a-zA-Z]+$/.test(a));
      const pat = rest[0];
      if (pat === undefined) return { err: "grep: missing pattern\n" };
      const files = rest.slice(1);
      let re: RegExp;
      try {
        re = new RegExp(pat, flags.includes("i") ? "i" : "");
      } catch {
        re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags.includes("i") ? "i" : "");
      }
      const { text, err } = gather(ctx, files, "grep");
      const invert = flags.includes("v");
      const hits = lines(text).map((l, i) => ({ l, i })).filter(({ l }) => re.test(l) !== invert);
      if (flags.includes("c")) return { out: hits.length + "\n", err };
      const prefix = files.length > 1 ? "" : "";
      return { out: join(hits.map(({ l, i }) => `${prefix}${flags.includes("n") ? i + 1 + ":" : ""}${l}`)), err };
    });
    c.set("sort", (ctx) => {
      const flags = ctx.args.filter((a) => /^-[a-zA-Z]+$/.test(a)).join("");
      const { text, err } = gather(ctx, ctx.args.filter((a) => !/^-[a-zA-Z]+$/.test(a)), "sort");
      let l = lines(text);
      if (flags.includes("n")) l.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
      else l.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      if (flags.includes("r")) l.reverse();
      if (flags.includes("u")) l = l.filter((x, i) => i === 0 || x !== l[i - 1]);
      return { out: join(l), err };
    });
    const headTail = (which: "head" | "tail") => (ctx: CmdCtx): CmdResult => {
      let n = 10;
      const files: string[] = [];
      for (let i = 0; i < ctx.args.length; i++) {
        const a = ctx.args[i];
        if (a === "-n") n = parseInt(ctx.args[++i] ?? "10", 10);
        else if (/^-\d+$/.test(a)) n = parseInt(a.slice(1), 10);
        else files.push(a);
      }
      const { text, err } = gather(ctx, files, which);
      const l = lines(text);
      return { out: join(which === "head" ? l.slice(0, n) : l.slice(Math.max(0, l.length - n))), err };
    };
    c.set("head", headTail("head"));
    c.set("tail", headTail("tail"));
    c.set("wc", (ctx) => {
      const flags = ctx.args.filter((a) => /^-[a-zA-Z]+$/.test(a)).join("");
      const { text, err } = gather(ctx, ctx.args.filter((a) => !/^-[a-zA-Z]+$/.test(a)), "wc");
      const nl = (text.match(/\n/g) ?? []).length;
      const words = text.split(/\s+/).filter(Boolean).length;
      const bytes = new TextEncoder().encode(text).length;
      const parts: number[] = [];
      if (flags.includes("l")) parts.push(nl);
      if (flags.includes("w")) parts.push(words);
      if (flags.includes("c")) parts.push(bytes);
      if (!parts.length) parts.push(nl, words, bytes);
      return { out: parts.map((p) => String(p).padStart(parts.length === 1 ? 0 : 7)).join(" ").trimStart() + "\n", err };
    });
    c.set("awk", (ctx) => {
      const prog = ctx.args[0] ?? "";
      const m = /^\{\s*print\s*(.*?)\s*;?\s*\}$/.exec(prog);
      if (!m) return { err: "awk: only programs like '{print $1,$2}' are supported in this demo\n" };
      const items = m[1] === "" ? ["$0"] : m[1].split(",").map((s) => s.trim());
      const { text, err } = gather(ctx, ctx.args.slice(1), "awk");
      const out = lines(text).map((l) => {
        const f = l.split(/\s+/).filter(Boolean);
        return items
          .map((it) => {
            if (it === "$0") return l;
            if (it === "$NF") return f[f.length - 1] ?? "";
            const n = /^\$(\d+)$/.exec(it);
            if (n) return f[parseInt(n[1], 10) - 1] ?? "";
            const s = /^"(.*)"$/.exec(it);
            return s ? s[1] : it;
          })
          .join(" ");
      });
      return { out: join(out), err };
    });
    c.set("ps", (ctx) => {
      const all = ctx.args.some((a) => /^-?[Aae]/.test(a) || a === "aux");
      const row = (pid: number, tty: string, time: string, cmd: string) =>
        `${String(pid).padStart(5)} ${tty.padEnd(8)} ${time} ${cmd}\n`;
      let out = "  PID TTY          TIME CMD\n";
      if (all) {
        out += row(1, "?", "00:00:03", "systemd") + row(2, "?", "00:00:00", "kthreadd");
        out += row(412, "?", "00:00:01", "systemd-journald") + row(438, "?", "00:00:00", "systemd-udevd");
        out += row(611, "?", "00:00:00", "systemd-logind") + row(640, "?", "00:00:00", "sshd") + row(702, "?", "00:00:00", "cron");
      }
      out += row(1188, "pts/0", "00:00:00", "nsh");
      for (const j of ctx.shell.activeJobs()) out += row(j.pid, "pts/0", "00:00:00", j.name);
      out += row(4200 + ctx.shell.history.length + 900, "pts/0", "00:00:00", "ps");
      return { out };
    });
    c.set("touch", (ctx) => {
      for (const n of ctx.args) if (ctx.shell.readFile(ctx.shell.resolve(n)) === null) ctx.shell.writeFile(n, "", false);
      return {};
    });
    c.set("rm", (ctx) => {
      let err = "";
      for (const n of ctx.args.filter((a) => !a.startsWith("-"))) {
        const abs = ctx.shell.resolve(n);
        if (!ctx.shell.files.delete(abs)) err += `rm: cannot remove '${n}': No such file or directory\n`;
      }
      return { err };
    });
    c.set("mkdir", (ctx) => {
      for (const n of ctx.args) ctx.shell.dirs.add(ctx.shell.resolve(n));
      return {};
    });
    c.set("help", () => ({
      out:
        "nsh, browser edition. What works here:\n" +
        "  builtins   cd  pwd  history [-c]  exit  quit    and  !!  !n\n" +
        "  commands   ls [-la]  cat  grep [-inv c]  sort [-rnu]  head  tail  wc [-lwc]\n" +
        "             awk '{print $1,$2}'  echo  date  ps [-A]  touch  rm  mkdir  clear  sleep\n" +
        "  syntax     a | b | c     a ; b     a < in > out     a >> out     a 2> err     a &\n" +
        "  files      nsh.c is the real source of this shell. Try: grep \"int \" < nsh.c\n" +
        "  keys       Up/Down history   Ctrl+C clear line   Ctrl+D exit   Ctrl+L clear screen\n",
    }));
  }

  private longLine(abs: string, label?: string): string {
    const isDir = this.isDir(abs);
    const size = isDir ? 4096 : (this.files.get(abs) ?? "").length;
    const name = label ?? abs.split("/").pop();
    return `${isDir ? "drwxr-xr-x" : "-rw-r--r--"} 1 ${this.user} ${this.user} ${String(size).padStart(6)} ${START_DATE} ${name}`;
  }
}
