"use client";

import { motion } from "framer-motion";

export interface DropRect {
  x: number;
  w: number;
}

/**
 * Liquid active-tab marker. Three blobs share one gooey (metaball) filter: a stiff lead pill,
 * a soft pill that lags and overshoots like jelly, and a small drip that trails behind and
 * pinches off while the marker travels between tabs. An unfiltered glass layer on top adds the
 * specular highlight and rim so the resting shape stays crisp.
 */
export default function NavDroplet({ rect, visible }: { rect: DropRect; visible: boolean }) {
  const fill = "linear-gradient(120deg, rgb(var(--mint-rgb)), var(--ring-color-2))";
  const shown = { opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 };

  return (
    <>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <filter id="nav-goo" x="-20%" y="-60%" width="140%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" />
          </filter>
        </defs>
      </svg>

      {/* liquid body, translucent after the goo filter */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#nav-goo)", opacity: "var(--drop-o)" }}
      >
        <motion.span
          className="absolute top-0 h-full"
          style={{ left: 0, borderRadius: 999, background: fill }}
          initial={false}
          animate={{ x: rect.x, width: rect.w, ...shown }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
        <motion.span
          className="absolute top-0 h-full"
          style={{ left: 0, borderRadius: 999, background: fill }}
          initial={false}
          animate={{ x: rect.x, width: rect.w, ...shown }}
          transition={{ type: "spring", stiffness: 150, damping: 16 }}
        />
        <motion.span
          className="absolute"
          style={{ left: 0, top: "50%", width: 18, height: 18, marginTop: -9, borderRadius: 999, background: fill }}
          initial={false}
          animate={{ x: rect.x + rect.w / 2 - 9, ...shown }}
          transition={{ type: "spring", stiffness: 70, damping: 11 }}
        />
      </div>

      {/* crisp glass rim and specular highlight */}
      <motion.span
        aria-hidden
        className="absolute top-0 h-full pointer-events-none"
        style={{
          left: 0,
          borderRadius: 999,
          background: "radial-gradient(120% 150% at 22% 0%, rgba(255,255,255,0.5), transparent 55%)",
          boxShadow:
            "inset 0 0 0 1px rgba(var(--mint-rgb),0.4), inset 0 -7px 12px -8px rgba(var(--mint-rgb),0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
        initial={false}
        animate={{ x: rect.x, width: rect.w, ...shown }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    </>
  );
}
