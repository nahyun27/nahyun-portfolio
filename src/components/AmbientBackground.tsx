"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

export default function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Soft parallax effect driven by scroll
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ minHeight: "100vh" }}>

      {/* Top right geometric shape (Torus knot / intersecting rings concept) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-20 opacity-[0.03]"
        style={{ width: "800px", height: "800px", y: y1, transform: "translateZ(0)", willChange: "transform" }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="#00C9A7" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M100 20 L180 100 L100 180 L20 100 Z" stroke="#F0EDE6" strokeWidth="0.5" />
          <circle cx="100" cy="20" r="3" fill="#00C9A7" />
          <circle cx="100" cy="180" r="3" fill="#00C9A7" />
          <circle cx="20" cy="100" r="3" fill="#00C9A7" />
          <circle cx="180" cy="100" r="3" fill="#00C9A7" />
        </svg>
      </motion.div>

      {/* Bottom left geometric shape (Abstract network / mesh) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute top-[60vh] -left-40 opacity-[0.03]"
        style={{ width: "600px", height: "600px", y: y2, transform: "translateZ(0)", willChange: "transform" }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="40" width="120" height="120" stroke="#F0EDE6" strokeWidth="0.5" transform="rotate(45 100 100)" />
          <rect x="60" y="60" width="80" height="80" stroke="#00C9A7" strokeWidth="0.25" strokeDasharray="2 2" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="60" stroke="#00C9A7" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </div>
  );
}
