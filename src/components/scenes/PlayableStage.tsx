"use client";

import { useEffect, useRef, useState } from "react";
import MediaClip from "@/components/MediaClip";
import type { ProjectMedia, SceneTheme } from "@/data/projects";

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function on(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum > 0.6 ? "#0B0D10" : "#FFFFFF";
}

/**
 * A live project you can play without leaving the page. Until asked, it is only the preview clip:
 * the real site loads on the first click, so opening a scene costs nothing extra. Small or touch
 * screens get a new tab instead, since a 3D game inside a phone-sized frame is not a good time.
 */
export default function PlayableStage({ href, title, media, theme, verb = "Play", portrait = false }: { href: string; title: string; media?: ProjectMedia; theme: SceneTheme; verb?: string; portrait?: boolean }) {
  const [live, setLive] = useState(false);
  const [inline, setInline] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const t = theme;

  useEffect(() => {
    const check = () => setInline(window.matchMedia("(hover: hover) and (min-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // never leave the page cursor hidden behind if the frame goes away under the pointer
  useEffect(() => () => document.documentElement.classList.remove("cursor-native"), []);

  const start = () => {
    if (!inline) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    setLive(true);
    // the pointer is already over the frame after this click, so no mouseenter will come
    document.documentElement.classList.add("cursor-native");
  };

  const fullscreen = () => {
    const el = frameRef.current;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
  };

  const btn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 38,
    padding: "0 16px",
    borderRadius: 999,
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: t.fg,
    background: rgba(t.fg, 0.08),
    border: `1px solid ${rgba(t.fg, 0.18)}`,
    cursor: "none",
  };

  return (
    <div>
      <div
        ref={frameRef}
        onMouseEnter={() => live && document.documentElement.classList.add("cursor-native")}
        onMouseLeave={() => document.documentElement.classList.remove("cursor-native")}
        style={{
          position: "relative",
          // portrait: a phone shaped frame, as tall as the screen allows, centred in the stage
          ...(portrait
            ? { height: "min(80vh, 820px)", aspectRatio: "9 / 16", maxWidth: "100%", margin: "0 auto" }
            : { width: "100%", aspectRatio: "16 / 10", maxHeight: "72vh" }),
          borderRadius: 24,
          overflow: "hidden",
          background: t.bg,
          border: `1px solid ${rgba(t.fg, 0.14)}`,
          boxShadow: `0 40px 80px -40px ${rgba("#000000", 0.7)}`,
        }}
      >
        {live ? (
          <iframe
            src={href}
            title={`${title}, playable`}
            allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: t.bg }}
          />
        ) : (
          <>
            {media?.video ? (
              <div style={{ position: "absolute", inset: 0, filter: "brightness(0.55)" }}>
                <MediaClip src={media.video} poster={media.src} label={media.label} />
              </div>
            ) : media ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }} />
            ) : null}
            <button
              type="button"
              onClick={start}
              data-cursor-hover
              aria-label={inline ? `${verb} ${title} here` : `Open ${title} in a new tab`}
              className="group absolute inset-0 grid place-items-center"
              style={{ cursor: "none" }}
            >
              <span className="flex flex-col items-center" style={{ gap: 14 }}>
                <span
                  className="grid place-items-center transition-transform duration-500 group-hover:scale-110"
                  style={{ width: 96, height: 96, borderRadius: "50%", color: on(t.accent), background: t.accent, boxShadow: `0 0 0 10px ${rgba(t.accent, 0.18)}, 0 24px 50px -16px ${rgba(t.accent, 0.8)}` }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ marginLeft: 4 }}>
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
                  </svg>
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                  {inline ? `${verb} it here` : `${verb} in a new tab`}
                </span>
              </span>
            </button>
          </>
        )}
      </div>

      <div className={`flex flex-wrap items-center ${portrait ? "justify-center" : ""}`} style={{ gap: 8, marginTop: 14 }}>
        {live && (
          <>
            <button type="button" onClick={fullscreen} data-cursor-hover style={btn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
              Fullscreen
            </button>
            <button type="button" onClick={() => setLive(false)} data-cursor-hover style={btn}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
              Stop
            </button>
          </>
        )}
        <a href={href} target="_blank" rel="noopener noreferrer" data-cursor-hover style={{ ...btn, textDecoration: "none" }}>
          Open in a new tab ↗
        </a>
        {live && <span style={{ fontSize: 12, color: rgba(t.fg, 0.55), marginLeft: 4 }}>Click inside to give it the keyboard. Esc there stays in the game.</span>}
      </div>
    </div>
  );
}
