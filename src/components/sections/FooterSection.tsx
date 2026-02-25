"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <footer ref={ref} className="relative py-32 overflow-hidden flex flex-col justify-end"
      style={{ backgroundColor: "#080810", minHeight: "70vh" }}>

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "60vw", height: "40vw",
          background: "radial-gradient(ellipse, rgba(0,201,167,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="section-inner w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-xs tracking-[0.32em] uppercase font-semibold mb-8"
            style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
            Ready for a new project?
          </motion.p>

          <AnimatedHeading
            text="Let's build|something |together."
            highlightWords={["together."]}
            className="mb-16"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
            delay={0.1}
          />

          <motion.a
            href="mailto:ksknh7@hanyang.ac.kr"
            data-cursor-hover
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="px-8 flex items-center justify-center gap-3 font-semibold text-lg overflow-hidden group relative"
            style={{
              height: "72px",
              borderRadius: "36px",
              backgroundColor: "#00C9A7",
              color: "#0C0C0F",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Say Hello
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.a>
        </div>

        <div className="mt-40 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 w-full border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="text-sm" style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} Nahyun Kim — Built with Next.js & Framer Motion
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "ksknh7@hanyang.ac.kr", href: "mailto:ksknh7@hanyang.ac.kr" },
              { label: "GitHub ↗", href: "https://github.com/nahyun27" },
              { label: "ACE Lab ↗", href: "https://ace.hanyang.ac.kr" }
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                data-cursor-hover
                className="text-sm font-medium transition-colors"
                style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#00C9A7"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#555"; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
