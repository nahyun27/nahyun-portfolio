"use client";

import { useEffect, useRef } from "react";

/**
 * Looping muted clip that costs nothing while idle.
 *
 * By default it plays only while it is on screen. Pass `active` to hand control to the parent, for
 * example a card that should play only under the cursor. On devices without hover, `active` is
 * ignored and the clip plays while it is mostly in view, so touch screens are not left with stills.
 */
export default function MediaClip({
  src,
  poster,
  label,
  fit = "cover",
  active,
  style,
}: {
  src: string;
  poster?: string;
  label: string;
  fit?: "cover" | "contain";
  active?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const controlled = active !== undefined;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;

    if (controlled && hoverCapable) {
      if (active) v.play().catch(() => {});
      else {
        v.pause();
        v.currentTime = 0;
      }
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: controlled ? 0.6 : 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, active, controlled]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={controlled ? "metadata" : "none"}
      aria-label={label}
      style={{ width: "100%", height: "100%", objectFit: fit, display: "block", ...style }}
    />
  );
}
