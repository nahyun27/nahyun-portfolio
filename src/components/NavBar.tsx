"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSectionStore } from "@/store/useSectionStore";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "creative", label: "Creative" },
  { id: "awards", label: "Awards" },
];

const SECTION_COLORS: Record<string, string> = {
  hero: "#FF6B6B",
  about: "#00C9A7",
  research: "#5C5FFF",
  projects: "#FFD60A",
  creative: "#FF3CAC",
  awards: "#FFB400",
  footer: "#FF6B6B",
};

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useSectionStore((s) => s.activeSection);
  const color = SECTION_COLORS[activeSection] ?? "#FF6B6B";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12"
        style={{ height: 64 }}
        animate={{
          backgroundColor: scrolled ? "rgba(250,250,248,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="font-syne font-black text-xl tracking-tight"
          style={{ color: color, transition: "color 0.4s ease", cursor: "none" }}
          data-hover
        >
          NK.
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.slice(1).map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="text-sm font-medium transition-colors duration-200 relative"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: activeSection === s.id ? color : "#555",
                cursor: "none",
              }}
              data-hover
            >
              {s.label}
              {activeSection === s.id && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* CTA */}
        <a
          href="mailto:ksknh7@hanyang.ac.kr"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300"
          style={{
            borderColor: color,
            color: color,
            fontFamily: "'Inter', sans-serif",
            cursor: "none",
            transition: "border-color 0.4s ease, color 0.4s ease",
          }}
          data-hover
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = color;
            (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = color;
          }}
        >
          Say Hi 👋
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-50"
          data-hover
          style={{ cursor: "none" }}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px]"
            style={{ backgroundColor: color }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-[2px]"
            style={{ backgroundColor: color }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px]"
            style={{ backgroundColor: color }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center"
            style={{ backgroundColor: "#0D0D0D" }}
          >
            {SECTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(s.id)}
                className="font-syne font-black text-4xl mb-6 transition-colors"
                style={{ color: "#FAFAF8", cursor: "none" }}
                data-hover
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#FAFAF8";
                }}
              >
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
