"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  highlightWords?: string[];
}

export default function AnimatedHeading({ text, className = "", style = {}, delay = 0.1, highlightWords = [] }: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  // If the text contains "|", we split by it to create new lines.
  const lines = text.split("|");

  return (
    <h2
      ref={ref}
      className={`font-black leading-tight ${className}`}
      style={{
        fontFamily: "'Syne', sans-serif",
        color: "#F0EDE6",
        letterSpacing: "-0.025em",
        ...style
      }}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-hidden p-2 -m-2">
          {line.split(" ").map((word, wordIndex) => {
            const isHighlighted = highlightWords.some(hw => word.includes(hw));
            return (
              <span key={wordIndex} className="inline-block overflow-hidden p-2 -m-2 mr-[0.25em]">
                <motion.span
                  className="inline-block"
                  style={{ color: isHighlighted ? "#00C9A7" : "inherit" }}
                  initial={{ y: "110%", rotateZ: 2 }}
                  animate={inView ? { y: 0, rotateZ: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: delay + (lineIndex * 0.1) + (wordIndex * 0.04)
                  }}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}
