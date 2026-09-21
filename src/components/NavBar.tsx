"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "creative", label: "Creative" },
  { id: "awards", label: "Awards" },
  { id: "blog", label: "Blog" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // highlight the section that currently crosses the middle of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    [...NAV_LINKS.map((l) => l.id), "hero"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[210] origin-left"
        style={{ scaleX, background: "var(--fill-brand)" }}
      />

      <nav
        className="fixed left-0 right-0 z-[200] flex justify-center"
        style={{ top: 14, padding: "0 16px", pointerEvents: "none" }}
      >
        <div
          className="flex items-center justify-between w-full"
          style={{
            pointerEvents: "auto",
            maxWidth: 1080,
            height: 56,
            padding: "0 8px 0 22px",
            borderRadius: 999,
            backgroundColor: scrolled ? "rgba(var(--bg-rgb),0.78)" : "rgba(var(--bg-rgb),0.5)",
            backdropFilter: "blur(20px) saturate(1.5)",
            WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            border: "1px solid var(--w80)",
            boxShadow: scrolled
              ? "var(--glass-hi), 0 12px 40px rgba(var(--shadow-rgb),calc(0.35 * var(--shadow-k)))"
              : "var(--glass-hi)",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-extrabold text-xl tracking-tight transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)", cursor: "none" }}
            data-cursor-hover
            aria-label="Back to top"
          >
            NK<span style={{ color: "var(--mint)" }}>.</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center" style={{ gap: 2 }}>
            {NAV_LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="relative text-sm font-medium transition-colors duration-200"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: isActive ? "var(--text)" : "var(--t3)",
                    cursor: "none",
                    padding: "8px 14px",
                    borderRadius: 999,
                  }}
                  data-cursor-hover
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0"
                      style={{ borderRadius: 999, backgroundColor: "var(--w60)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <ThemeToggle />
            <a
              href="mailto:ksknh7@hanyang.ac.kr"
              data-cursor-hover
              className="hidden md:inline-flex items-center text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(var(--mint-rgb),0.4)]"
              style={{
                background: "var(--fill-brand)",
                color: "var(--on-mint)",
                fontFamily: "'Inter', sans-serif",
                borderRadius: 999,
                cursor: "none",
                padding: "0 20px",
                height: 40,
              }}
            >
              Say Hi ↗
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col items-center justify-center gap-[5px]"
              style={{ cursor: "none", width: 40, height: 40 }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              data-cursor-hover
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] origin-center"
                style={{ backgroundColor: "var(--text)" }} />
              <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-[1.5px]"
                style={{ backgroundColor: "var(--text)" }} />
              <motion.span animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] origin-center"
                style={{ backgroundColor: "var(--text)" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-8"
            style={{ backgroundColor: "var(--bg)" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(l.id)}
                className="font-extrabold text-4xl hover:text-[color:var(--mint)] transition-colors"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)", cursor: "none" }}
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
