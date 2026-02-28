"use client";

import { useState, useRef } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue } from "framer-motion";

interface Card {
  id: string;
  title: string;
  subtitle: React.ReactNode;
  venue?: string;
  tags: string[];
  emoji?: string;
  github?: string;
}

// A single card component to handle mouse tracking locally
function SpotlightCard({ card, delay }: { card: Card, delay: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col gap-3 shrink-0 rounded-2xl overflow-hidden"
      style={{
        width: 300,
        minHeight: 260,
        padding: "26px",
        backgroundColor: "#141417",
        border: "1px solid rgba(255,255,255,0.07)",
        userSelect: "none",
      }}
    >
      {/* Spotlight effect that reveals itself on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 201, 167, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* Dynamic Mint border outline on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          border: '1px solid transparent',
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 201, 167, 0.4),
              transparent 60%
            ) border-box
          `,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Content wrapper with relative z-index so it sits above the background gradient */}
      <div className="relative z-10 flex flex-col h-full gap-3">
        {card.emoji && <span style={{ fontSize: 28, lineHeight: 1 }}>{card.emoji}</span>}

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight flex-1"
            style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6" }}>
            {card.title}
          </h3>
          <div className="flex items-center gap-3">
            {card.github && (
              <a href={card.github} target="_blank" rel="noopener noreferrer"
                className="transition-colors hover:text-[#00C9A7]"
                style={{ color: "#888" }}
                title="GitHub">
                <svg className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
            )}
            <span className="shrink-0 font-bold text-xs"
              style={{ color: "#00C9A7", fontFamily: "'Syne', sans-serif" }}>
              {card.id}
            </span>
          </div>
        </div>

        <div className="text-sm leading-relaxed flex-1"
          style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
          {card.subtitle}
        </div>

        {card.venue && (
          <p className="text-xs font-medium"
            style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
            {card.venue}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-auto pt-2">
          {card.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium tracking-wide transition-colors duration-300 hover:text-white"
              style={{
                color: "rgba(0,201,167,0.8)",
                fontFamily: "'Inter', sans-serif",
              }}>
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HorizontalSlider({ cards }: { cards: Card[] }) {
  const constraintRef = useRef<HTMLDivElement>(null);
  const [dragged, setDragged] = useState(false);
  const inView = useInView(constraintRef, { once: true });

  return (
    <div>
      {!dragged && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} exit={{ opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-2 mb-5 select-none pointer-events-none"
        >
          {["←", "drag to explore", "→"].map((t, i) => (
            i % 2 === 0 ? (
              <motion.span key={i}
                animate={{ x: i === 0 ? [-2, 0, -2] : [2, 0, 2] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                {t}
              </motion.span>
            ) : (
              <span key={i} className="tracking-[0.2em] uppercase"
                style={{ color: "#555", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
                {t}
              </span>
            )
          ))}
        </motion.div>
      )}

      <div ref={constraintRef} style={{ overflow: "hidden", paddingTop: "20px" }}>
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.08}
          dragMomentum
          onDragStart={() => setDragged(true)}
          className="flex gap-4"
          style={{ width: "max-content", paddingBottom: 16, cursor: dragged ? "grabbing" : "grab" }}
        >
          {cards.map((card, i) => (
            <SpotlightCard key={card.id} card={card} delay={inView ? 0.1 + i * 0.07 : 0} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
