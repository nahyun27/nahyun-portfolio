"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <footer
      id="footer"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        {/* CTA heading */}
        <motion.h2
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="font-black leading-tight mb-10"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.8rem,6vw,6rem)",
            color: "#F5F0E8",
            letterSpacing: "-0.03em",
          }}
        >
          Let&apos;s build<br />
          something{" "}
          <span style={{ color: "#00C9A7" }}>great.</span>
        </motion.h2>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap gap-4 mb-16"
        >
          {[
            { label: "ksknh7@hanyang.ac.kr", href: "mailto:ksknh7@hanyang.ac.kr", underline: true },
            { label: "GitHub ↗", href: "https://github.com/nahyun27", underline: false },
            { label: "ACE Lab ↗", href: "https://ace.hanyang.ac.kr", underline: false },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="text-base font-medium transition-colors duration-200 hover:opacity-70"
              style={{
                color: "#00C9A7",
                fontFamily: "'Inter', sans-serif",
                textDecoration: l.underline ? "underline" : "none",
                textUnderlineOffset: "4px",
              }}
            >
              {l.label}
            </a>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="h-[1px] mb-8"
          style={{ backgroundColor: "rgba(245,240,232,0.12)" }}
        />

        {/* Footer line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          className="text-xs"
          style={{ color: "rgba(245,240,232,0.35)", fontFamily: "'Inter', sans-serif" }}
        >
          © 2025 Nahyun Kim — Built with Next.js &amp; Framer Motion
        </motion.p>
      </div>
    </footer>
  );
}
