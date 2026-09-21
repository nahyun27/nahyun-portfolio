"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useMotionValue, useSpring, type MotionValue } from "framer-motion";

const EMAIL = "ksknh7@hanyang.ac.kr";

const LINKS = [
  { label: "GitHub", href: "https://github.com/nahyun27" },
  { label: "Instagram", href: "https://www.instagram.com/im__string" },
  { label: "Blog", href: "https://nahyun27.github.io/" },
  { label: "ACE Lab", href: "https://ace.hanyang.ac.kr" },
];

// headline words, each drifts a different amount with the cursor so the line feels layered
const WORDS = [
  { text: "Let's build", depth: 8 },
  { text: "something", depth: 16 },
  { text: "extraordinary", depth: 26, hl: true },
  { text: "together.", depth: 12 },
];

// ---- Seoul clock without hydration mismatch
function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 15000);
  return () => window.clearInterval(id);
}
const seoulTime = () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" }).format(new Date());

function useSeoulTime() {
  return useSyncExternalStore(subscribe, seoulTime, () => "");
}

// ---- water that follows the pointer
const BLOBS = [
  { size: 210, stiffness: 240, damping: 20 },
  { size: 160, stiffness: 150, damping: 17 },
  { size: 120, stiffness: 95, damping: 15 },
  { size: 84, stiffness: 60, damping: 13 },
  { size: 52, stiffness: 38, damping: 12 },
];

function Blob({ tx, ty, size, stiffness, damping }: { tx: MotionValue<number>; ty: MotionValue<number>; size: number; stiffness: number; damping: number }) {
  const x = useSpring(tx, { stiffness, damping, mass: 1 });
  const y = useSpring(ty, { stiffness, damping, mass: 1 });
  return <motion.circle r={size / 2} cx={x} cy={y} fill="url(#footer-water)" />;
}

function Water({ active, boxRef }: { active: boolean; boxRef: React.RefObject<HTMLElement | null> }) {
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const lastMove = useRef(-1e9);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !active) return;
    const rect = () => box.getBoundingClientRect();
    const r0 = rect();
    tx.set(r0.width * 0.7);
    ty.set(r0.height * 0.45);

    const onMove = (e: PointerEvent) => {
      const r = rect();
      tx.set(e.clientX - r.left);
      ty.set(e.clientY - r.top);
      lastMove.current = performance.now();
    };
    box.addEventListener("pointermove", onMove);

    // without a pointer the water drifts on its own, so touch screens and idle visitors still see it move
    let raf = 0;
    const drift = (now: number) => {
      if (now - lastMove.current > 2200) {
        const r = rect();
        tx.set(r.width * (0.62 + 0.22 * Math.sin(now / 2600)));
        ty.set(r.height * (0.48 + 0.2 * Math.cos(now / 3300)));
      }
      raf = requestAnimationFrame(drift);
    };
    raf = requestAnimationFrame(drift);
    return () => {
      box.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active, boxRef, tx, ty]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: "var(--water-o)" }} aria-hidden>
      <defs>
        <linearGradient id="footer-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--orb-a)" />
          <stop offset="100%" stopColor="var(--ring-color-2)" />
        </linearGradient>
        <filter id="footer-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
        </filter>
      </defs>
      <g filter="url(#footer-goo)">
        {BLOBS.map((b) => (
          <Blob key={b.size} tx={tx} ty={ty} {...b} />
        ))}
      </g>
    </svg>
  );
}

// ---- button that leans toward the cursor
function Magnetic({ children, strength = 0.32 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const Arrow = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const time = useSeoulTime();
  const [copied, setCopied] = useState(false);

  const setPointer = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    e.currentTarget.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // clipboard can be blocked, the mailto button still works
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer
      ref={ref}
      onPointerMove={setPointer}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--px", "0");
        e.currentTarget.style.setProperty("--py", "0");
      }}
      className="relative w-full overflow-hidden flex flex-col z-10"
      style={{ minHeight: "100svh", backgroundColor: "transparent", ["--px" as string]: 0, ["--py" as string]: 0 }}
    >
      <Water active={inView} boxRef={ref} />

      <div className="section-inner w-full relative z-10 flex flex-col flex-1" style={{ paddingTop: 104, paddingBottom: 28 }}>
        {/* status */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={seen ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center"
          style={{ gap: 10 }}
        >
          <span className="glass-chip inline-flex items-center" style={{ gap: 10, padding: "8px 16px", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t2)" }}>
            <span className="relative flex" style={{ width: 8, height: 8 }}>
              <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ background: "#22C55E", opacity: 0.6 }} />
              <span className="relative inline-flex w-full h-full rounded-full" style={{ background: "#22C55E" }} />
            </span>
            Open to collaborations
          </span>
          <span className="glass-chip inline-flex items-center" style={{ gap: 8, padding: "8px 16px", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--t3)", fontVariantNumeric: "tabular-nums", minWidth: 120, justifyContent: "center" }}>
            Seoul {time || "--:--"}
          </span>
        </motion.div>

        {/* headline */}
        <div className="flex-1 flex flex-col justify-center" style={{ padding: "20px 0" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.98, color: "var(--text)", fontSize: "clamp(2.6rem, min(10.4vw, 13vh), 9.6rem)" }}>
            {WORDS.map((w, i) => (
              <span key={w.text} className="block" style={{ overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={seen ? { y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* a second layer takes the cursor drift so the reveal and the parallax never fight */}
                  <span
                    className="block transition-transform duration-500 ease-out"
                    style={{ transform: `translate3d(calc(var(--px) * ${w.depth}px), calc(var(--py) * ${w.depth * 0.5}px), 0)` }}
                  >
                    {w.hl ? (
                      <span style={{ background: "var(--hl-fill-2)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{w.text}</span>
                    ) : (
                      w.text
                    )}
                  </span>
                </motion.span>
              </span>
            ))}
          </h2>
        </div>

        {/* actions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={seen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center"
          style={{ gap: 14, marginBottom: 32 }}
        >
          <Magnetic>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor-hover
              className="group inline-flex items-center transition-shadow duration-300 hover:shadow-[0_24px_54px_-14px_rgba(var(--mint-rgb),0.7)]"
              style={{ gap: 14, height: 68, padding: "0 38px", borderRadius: 999, background: "var(--fill-brand)", color: "var(--on-mint)", fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 800, cursor: "none" }}
            >
              Say Hello
              <span className="transition-transform duration-500 group-hover:rotate-45"><Arrow /></span>
            </a>
          </Magnetic>

          <button
            onClick={copy}
            data-cursor-hover
            aria-live="polite"
            className="glass-chip hv-mint inline-flex items-center transition-all duration-300"
            style={{ gap: 12, height: 68, padding: "0 28px", borderRadius: 999, color: "var(--text)", fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, cursor: "none" }}
          >
            {copied ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--mint)" }} aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Copied to clipboard
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {EMAIL}
              </>
            )}
          </button>
        </motion.div>

        {/* footer bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between" style={{ gap: 20, borderTop: "1px solid var(--w70)", paddingTop: 24 }}>
          <div className="flex items-center" style={{ gap: 14 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, letterSpacing: "-0.04em", color: "var(--text)" }}>
              NK<span style={{ color: "var(--mint)" }}>.</span>
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--t4)" }}>© {new Date().getFullYear()} Nahyun Kim</span>
          </div>

          <div className="flex flex-wrap items-center justify-center" style={{ gap: 8 }}>
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="group glass-chip hv-mint inline-flex items-center transition-all duration-300"
                style={{ gap: 7, height: 40, padding: "0 16px", borderRadius: 999, color: "var(--t2)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, cursor: "none" }}
              >
                {l.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ opacity: 0.7 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17 17 7M8 7h9v9" /></svg>
                </span>
              </a>
            ))}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-terminal"))}
              data-cursor-hover
              aria-label="Open the site terminal"
              title="or press the ` key"
              className="inline-flex items-center transition-all duration-300 hover:-translate-y-0.5"
              style={{ gap: 7, height: 40, padding: "0 16px", borderRadius: 999, color: "var(--mint)", background: "rgba(var(--mint-rgb),0.1)", border: "1px solid rgba(var(--mint-rgb),0.35)", fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 13, fontWeight: 700, cursor: "none" }}
            >
              {">_"} terminal
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
              data-cursor-hover
              aria-label="Back to top"
              className="glass-chip hv-mint inline-grid place-items-center transition-all duration-300"
              style={{ width: 40, height: 40, borderRadius: "50%", color: "var(--text)", cursor: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
