"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface Card {
  id: string;
  title: string;
  subtitle: string;
  venue?: string;
  tags: string[];
  emoji?: string;
}

interface HorizontalSliderProps {
  cards: Card[];
}

export default function HorizontalSlider({ cards }: HorizontalSliderProps) {
  const constraintRef = useRef<HTMLDivElement>(null);
  const [dragged, setDragged] = useState(false);
  const inView = useInView(constraintRef, { once: true });

  return (
    <div className="relative">
      {/* Drag hint */}
      <AnimatePresence>
        {!dragged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center gap-2 mb-5 select-none pointer-events-none"
          >
            <motion.span
              animate={{ x: [-2, 0, -2] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif", fontSize: 13 }}
            >
              ←
            </motion.span>
            <span
              className="tracking-[0.2em] uppercase"
              style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif", fontSize: 11 }}
            >
              drag to explore
            </span>
            <motion.span
              animate={{ x: [2, 0, 2] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif", fontSize: 13 }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overflow container — acts as drag constraint */}
      <div
        ref={constraintRef}
        style={{ overflow: "hidden" }}
      >
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.08}
          dragMomentum
          onDragStart={() => setDragged(true)}
          className="flex gap-4"
          style={{
            width: "max-content",
            paddingBottom: 8,
            cursor: dragged ? "grabbing" : "grab",
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
              whileHover={{
                y: -8,
                borderColor: "#00C9A7",
                transition: { duration: 0.2 },
              }}
              className="flex flex-col gap-3 shrink-0 rounded-2xl bg-white border-2"
              style={{
                width: 272,
                minHeight: 230,
                padding: "24px",
                borderColor: "#0A0A0A",
                userSelect: "none",
              }}
            >
              {card.emoji && (
                <span style={{ fontSize: 28, lineHeight: 1 }}>{card.emoji}</span>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3
                  className="font-bold text-lg leading-tight flex-1"
                  style={{ fontFamily: "'Syne', sans-serif", color: "#0A0A0A" }}
                >
                  {card.title}
                </h3>
                <span
                  className="shrink-0 font-bold text-xs"
                  style={{ color: "#00C9A7", fontFamily: "'Syne', sans-serif" }}
                >
                  {card.id}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}
              >
                {card.subtitle}
              </p>

              {card.venue && (
                <p
                  className="text-xs font-medium"
                  style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}
                >
                  {card.venue}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: "#00C9A7",
                      color: "#00C9A7",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
