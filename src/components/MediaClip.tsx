"use client";

import { useEffect, useRef } from "react";

/**
 * Looping muted clip that only plays while it is on screen. It replaces the multi megabyte GIFs:
 * same look, a fraction of the bytes, and it stops costing CPU once you scroll past.
 */
export default function MediaClip({
  src,
  poster,
  label,
  fit = "cover",
  style,
}: {
  src: string;
  poster?: string;
  label: string;
  fit?: "cover" | "contain";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      style={{ width: "100%", height: "100%", objectFit: fit, display: "block", ...style }}
    />
  );
}
