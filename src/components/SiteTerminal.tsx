"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import NshTerminal from "@/components/scenes/NshTerminal";
import type { Command } from "@/lib/nsh/engine";
import { PROJECTS } from "@/data/projects";
import { applyTheme, currentTheme } from "@/lib/theme";

const EMAIL = "ksknh7@hanyang.ac.kr";

/** commands that only make sense on this site; everything else is the nsh engine */
const SITE_COMMANDS: Record<string, Command> = {
  projects: () => ({
    out: PROJECTS.map((p) => `${p.id}  ${p.title}`).join("\n") + "\n\nopen <number> to step inside one\n",
  }),
  open: ({ args }) => {
    const n = parseInt(args[0] ?? "", 10);
    const p = PROJECTS[n - 1];
    if (!p) return { err: `open: pick a number between 1 and ${PROJECTS.length}\n` };
    window.dispatchEvent(new CustomEvent("open-project", { detail: n - 1 }));
    return { out: `opening ${p.title}...\n` };
  },
  about: () => ({
    out:
      "Nahyun Kim\nAI security researcher at Hanyang University ACE Lab, and creative developer.\n" +
      "Adversarial ML, audio security, and things that are fun to poke at.\n",
  }),
  contact: () => ({ out: `email     ${EMAIL}\ngithub    github.com/nahyun27\nblog      nahyun27.github.io\n` }),
  theme: ({ args }) => {
    const want = args[0];
    const next = want === "light" || want === "dark" ? want : currentTheme() === "light" ? "dark" : "light";
    applyTheme(next);
    return { out: `theme: ${next}\n` };
  },
  sudo: ({ args }) => {
    if (args.join(" ") === "hire nahyun")
      return { out: `[sudo] password for visitor: ********\nnahyun has been added to your team.\n(the real way is ${EMAIL})\n` };
    return { err: "visitor is not in the sudoers file. This incident will be reported.\n" };
  },
  help: () => ({
    out:
      "site commands\n" +
      "  projects        list the projects        open <n>     step inside one\n" +
      "  about  contact  who and where            theme [x]    light, dark or toggle\n" +
      "  sudo hire nahyun                         exit         close this terminal\n\n" +
      "shell (a browser port of nsh, my C minishell)\n" +
      "  ls cat grep sort head tail wc awk echo date ps  |  ;  < > >> 2>  &  !!  !n  history\n" +
      "  nsh.c in this directory is the real source. Try: grep \"int \" < nsh.c | head -5\n",
  }),
};

const CHIPS = ["projects", "open 5", "theme light", "about", "sudo hire nahyun", "grep \"int \" < nsh.c | head -3"];

export default function SiteTerminal() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "Escape") setOpen(false);
      else if ((e.key === "`" || e.key === "~") && tag !== "INPUT" && tag !== "TEXTAREA" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    const onProject = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpen);
    window.addEventListener("open-project", onProject);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpen);
      window.removeEventListener("open-project", onProject);
    };
  }, []);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 350, padding: 16 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          role="dialog"
          aria-modal="true"
          aria-label="Site terminal"
        >
          <button
            aria-label="Close terminal"
            onClick={close}
            className="absolute inset-0"
            style={{ background: "rgba(4,10,8,0.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", cursor: "none" }}
          />
          <motion.div
            className="relative w-full"
            style={{ maxWidth: 840 }}
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } }}
            exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.18 } }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 10, color: "rgba(215,247,222,0.75)", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
              <span>Site terminal. Esc to close, ` to toggle.</span>
              <button onClick={close} data-cursor-hover style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", cursor: "none" }}>
                close
              </button>
            </div>
            <NshTerminal commands={SITE_COMMANDS} chips={CHIPS} height={360} autoFocus onExit={() => window.setTimeout(close, 700)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
