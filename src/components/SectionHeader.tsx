"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

/** Number chip plus label, the small pill that opens every section. */
export function Eyebrow({ index, label }: { index: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-chip inline-flex items-center"
      style={{
        gap: 10,
        padding: "5px 14px 5px 5px",
        borderRadius: 999,
      }}
    >
      <span
        className="grid place-items-center"
        style={{
          minWidth: 28,
          height: 22,
          padding: "0 8px",
          borderRadius: 999,
          background: "var(--fill-brand)",
          color: "var(--on-mint)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.04em",
        }}
      >
        {index}
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--t2)",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  highlightWords?: string[];
  /** css font-size for the title */
  size?: string;
  marginBottom?: number;
}

export default function SectionHeader({
  index,
  label,
  title,
  highlightWords = [],
  size = "clamp(2rem, 5.4vw, 3.75rem)",
  marginBottom = 48,
}: SectionHeaderProps) {
  return (
    <div style={{ marginBottom }}>
      <Eyebrow index={index} label={label} />
      <div style={{ marginTop: 20 }}>
        <AnimatedHeading
          text={title}
          highlightWords={highlightWords}
          style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.035em" }}
          delay={0.1}
        />
      </div>
    </div>
  );
}
