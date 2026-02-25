"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-10"
        style={{
          height: 60,
          borderBottom: scrolled ? "1px solid rgba(10,10,10,0.08)" : "1px solid transparent",
          backgroundColor: "rgb(245, 240, 232)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "border-color 0.3s ease",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="font-bold tracking-tight text-xl"
          style={{ fontFamily: "'Syne', sans-serif", color: "#0A0A0A", cursor: "none" }}
          data-cursor-hover
        >
          NK.
        </button>

        {/* Center links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-sm font-medium transition-colors duration-200 hover:text-[#00C9A7]"
              style={{ fontFamily: "'Inter', sans-serif", color: "#0A0A0A", cursor: "none" }}
              data-cursor-hover
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:ksknh7@hanyang.ac.kr"
            className="hidden md:flex items-center text-sm font-semibold border border-[#0A0A0A] rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-[#00C9A7] hover:border-[#00C9A7] hover:text-white"
            style={{ fontFamily: "'Inter', sans-serif", cursor: "none" }}
            data-cursor-hover
          >
            Say Hi ↗
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px]"
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor-hover
            style={{ cursor: "none" }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1.5px] bg-[#0A0A0A] origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[1.5px] bg-[#0A0A0A]"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1.5px] bg-[#0A0A0A] origin-center"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-8"
            style={{ backgroundColor: "#F5F0E8" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(l.id)}
                className="font-bold text-4xl hover:text-[#00C9A7] transition-colors"
                style={{ fontFamily: "'Syne', sans-serif", cursor: "none" }}
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
