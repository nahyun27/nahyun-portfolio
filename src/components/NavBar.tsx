"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "creative", label: "Creative" },
  { id: "awards", label: "Awards" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar at the very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[210] origin-left"
        style={{ scaleX, backgroundColor: "#00C9A7" }}
      />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-[200]"
        animate={{
          backgroundColor: scrolled ? "rgba(12,12,15,0.85)" : "rgba(12,12,15,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="section-inner flex items-center justify-between" style={{ height: 64 }}>
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-bold text-xl tracking-tight transition-colors duration-200 hover:opacity-70"
            style={{ fontFamily: "'Syne', sans-serif", color: "#00C9A7", cursor: "none" }}
            data-cursor-hover
          >
            NK.
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm font-medium transition-colors duration-200 hover:text-[#00C9A7]"
                style={{ fontFamily: "'Inter', sans-serif", color: "#888", cursor: "none" }}
                data-cursor-hover
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:ksknh7@hanyang.ac.kr"
              data-cursor-hover
              className="hidden md:flex items-center text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200"
              style={{
                borderColor: "rgba(0,201,167,0.4)",
                color: "#00C9A7",
                fontFamily: "'Inter', sans-serif",
                cursor: "none",
                padding: "6px 20px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(0,201,167,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#00C9A7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,201,167,0.4)";
              }}
            >
              Say Hi ↗
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px]"
              onClick={() => setMenuOpen(!menuOpen)}
              data-cursor-hover style={{ cursor: "none" }}
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] origin-center"
                style={{ backgroundColor: "#F0EDE6" }} />
              <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-[1.5px]"
                style={{ backgroundColor: "#F0EDE6" }} />
              <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] origin-center"
                style={{ backgroundColor: "#F0EDE6" }} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-8"
            style={{ backgroundColor: "#0C0C0F" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(l.id)}
                className="font-black text-4xl hover:text-[#00C9A7] transition-colors"
                style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6", cursor: "none" }}
                data-cursor-hover
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
