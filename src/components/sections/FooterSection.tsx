"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <footer ref={ref} className="relative pt-40 pb-12 overflow-hidden flex flex-col justify-end"
      style={{ backgroundColor: "#060608", minHeight: "80vh" }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Dynamic Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 z-0"
        animate={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(0,201,167,0.07), transparent 70%)`,
        }}
      />

      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: "120%", height: "600px",
          background: "radial-gradient(ellipse at top, rgba(0,201,167,0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div className="section-inner w-full relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-32">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 px-6 py-2 rounded-full border backdrop-blur-md"
            style={{ borderColor: "rgba(0,201,167,0.3)", backgroundColor: "rgba(0,201,167,0.05)" }}
          >
            <p className="text-[0.65rem] md:text-xs tracking-[0.3em] uppercase font-bold"
              style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif", padding: "6px 20px" }}>
              Ready for a new project?
            </p>
          </motion.div>

          <div className="relative mb-16">
            <AnimatedHeading
              // text="Let's build|something|extraordinary."
              text="Let's build|something|together."
              // highlightWords={["extraordinary."]}
              highlightWords={["together."]}
              className="leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 9vw, 7.5rem)", letterSpacing: "-0.02em" }}
              delay={0.2}
            />
          </div>

          <motion.a
            href="mailto:ksknh7@hanyang.ac.kr"
            data-cursor-hover
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center px-10 py-5 sm:px-12 sm:py-6 rounded-full overflow-hidden"
            style={{
              backgroundColor: "rgba(0, 201, 167, 0.1)",
              border: "1px solid rgba(0, 201, 167, 0.4)",
              color: "#00C9A7",
              boxShadow: "0 10px 40px -10px rgba(0,201,167,0.4)"
            }}
          >
            {/* Hover Fill */}
            <div className="absolute inset-0 w-full h-full bg-[#00C9A7] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1]" />

            <span className="relative z-10 flex items-center gap-3 font-bold text-base sm:text-lg tracking-wide group-hover:text-[#060608] transition-colors duration-300"
              style={{ fontFamily: "'Inter', sans-serif", padding: "4px 20px" }}>
              Say Hello
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-1 group-hover:-translate-y-1">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </motion.a>
        </div>

        {/* Footer Bottom Setup */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 w-full pt-10 border-t relative"
          style={{ borderColor: 'rgba(255,255,255,0.06)', marginTop: "100px" }}>

          <div className="flex flex-col items-center lg:items-start gap-1">
            <h2 className="text-3xl font-black tracking-tighter" style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6" }}>NK.</h2>
            <p className="text-sm font-medium" style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
              © {new Date().getFullYear()} Nahyun Kim. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { label: "Email", href: "mailto:ksknh7@hanyang.ac.kr" },
              { label: "GitHub", href: "https://github.com/nahyun27" },
              { label: "Instagram", href: "https://www.instagram.com/im__string" },
              { label: "ACE Lab", href: "https://ace.hanyang.ac.kr" }
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href} target="_blank" rel="noopener noreferrer"
                data-cursor-hover
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                className="text-sm font-semibold tracking-widest transition-colors duration-300 relative group uppercase"
                style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#F0EDE6"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#777"; }}
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] rounded-full bg-[#00C9A7] transition-all duration-300 ease-out group-hover:w-full" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
