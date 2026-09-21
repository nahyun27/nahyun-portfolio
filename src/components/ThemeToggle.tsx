"use client";

import { applyTheme, currentTheme } from "@/lib/theme";

/**
 * Theme lives on <html data-theme>. The inline script in layout.tsx sets it before first paint,
 * and both icons are always rendered so CSS decides which one shows (no hydration mismatch).
 */
export default function ThemeToggle() {
  const toggle = () => applyTheme(currentTheme() === "light" ? "dark" : "light");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      data-cursor-hover
      className="theme-toggle relative shrink-0 rounded-full transition-colors duration-300 hover:text-[color:var(--mint)] hover:border-[color:var(--mint)]"
      style={{
        width: 36,
        height: 36,
        color: "var(--t2)",
        border: "1px solid var(--w100)",
        backgroundColor: "var(--w20)",
        cursor: "none",
      }}
    >
      <svg className="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg className="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
