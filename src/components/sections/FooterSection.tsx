"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSection("footer"); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setSection]);

  return (
    <footer
      id="footer"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      {/* Colored blobs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF6B6B, #FF3CAC)" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #5C5FFF, #00C9A7)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium tracking-[0.3em] uppercase mb-6"
          style={{ color: "#FF6B6B", fontFamily: "'Inter', sans-serif" }}
        >
          Let&apos;s Connect
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          className="font-syne font-black leading-none mb-10"
          style={{
            fontSize: "clamp(3rem, 8vw, 8rem)",
            color: "#FAFAF8",
            letterSpacing: "-0.03em",
          }}
        >
          Let&apos;s build<br />something
          <span style={{ color: "#FF6B6B" }}> together.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {[
            { label: "GitHub", href: "https://github.com/nahyun27", color: "#FF6B6B" },
            { label: "Email", href: "mailto:ksknh7@hanyang.ac.kr", color: "#00C9A7" },
            { label: "ACE Lab", href: "https://ace.hanyang.ac.kr", color: "#5C5FFF" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="px-6 py-3 rounded-full text-sm font-semibold border-2 transition-all duration-300"
              style={{
                borderColor: link.color,
                color: link.color,
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.color;
                (e.currentTarget as HTMLAnchorElement).style.color = "#0D0D0D";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = link.color;
              }}
            >
              {link.label} ↗
            </a>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-[1px] w-full mb-8"
          style={{ backgroundColor: "#ffffff15" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-sm"
          style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}
        >
          Made with{" "}
          <span style={{ color: "#FF6B6B" }}>❤️</span>
          {" "}by{" "}
          <span style={{ color: "#FAFAF8" }}>Nahyun Kim</span>
          {" "}— © {new Date().getFullYear()}
        </motion.p>
      </div>
    </footer>
  );
}
