"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";

export interface Card {
  id: string;
  title: string;
  subtitle: React.ReactNode;
  tags: string[];
  emoji?: string;
  github?: string;
  demo?: string;
  playstore?: string;
  appstore?: string;
}

const GH_SVG = (<svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>);
const APPLE_SVG = (<svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.91 3.65-.81 1.54.11 2.82.72 3.63 1.87-3.07 1.82-2.39 5.86.88 7.15-.71 1.77-1.55 3.52-3.24 4.04v-.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>);
const ANDROID_SVG = (<svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.7 5.4 19.5 2c.2-.3 0-.6-.3-.6s-.5.1-.6.4L16.8 5c-1.4-.6-3-.9-4.8-.9-1.8 0-3.4.3-4.8.9L5.3 1.8c-.1-.2-.4-.3-.6-.1-.2.1-.3.4-.1.6l1.8 3.4c-3.1 1.7-5.2 4.9-5.2 8.6v.8h21.6v-.8c0-3.7-2.1-6.9-5.1-8.9zm-9.3 5.4c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1zm7.2 0c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z" /></svg>);
const WEB_SVG = (<svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /><path d="M2 12h20" /></svg>);

function SpotlightCarouselCard({
  card,
  diff,
  onClick,
  isMobile
}: {
  card: Card;
  diff: number;
  onClick: () => void;
  isMobile: boolean;
}) {
  const isCenter = diff === 0;

  // Visual parameters based on distance from center
  let x = 0;
  let scale = 1;
  let opacity = 1;
  let blur = 0;
  let zIndex = 10;

  // Responsive Variables
  const baseWidth = isMobile ? 310 : 420;
  const baseHeight = isMobile ? 350 : 380;

  // Responsive offsets
  const off1 = isMobile ? 220 : 360;
  const off2 = isMobile ? 380 : 640;
  const offOut = isMobile ? 550 : 900;

  // Responsive edge opacities/scales
  const scale1 = isMobile ? 0.85 : 0.92;
  const scale2 = isMobile ? 0.75 : 0.82;
  const opac1 = isMobile ? 0.6 : 0.5;
  const opac2 = isMobile ? 0.15 : 0.2;

  if (diff === 0) {
    x = 0; scale = isMobile ? 1 : 1.05; opacity = 1; blur = 0; zIndex = 10;
  } else if (diff === 1) {
    x = off1; scale = scale1; opacity = opac1; blur = 4; zIndex = 5;
  } else if (diff === -1) {
    x = -off1; scale = scale1; opacity = opac1; blur = 4; zIndex = 5;
  } else if (diff === 2) {
    x = off2; scale = scale2; opacity = opac2; blur = 8; zIndex = 1;
  } else if (diff === -2) {
    x = -off2; scale = scale2; opacity = opac2; blur = 8; zIndex = 1;
  } else if (diff > 2) {
    x = offOut; scale = 0.5; opacity = 0; blur = 12; zIndex = -1;
  } else {
    x = -offOut; scale = 0.5; opacity = 0; blur = 12; zIndex = -1;
  }

  return (
    <motion.div
      initial={false}
      animate={{ x, scale, opacity, filter: `blur(${blur}px)`, zIndex }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      onClick={onClick}
      className={`absolute top-1/2 left-1/2 flex flex-col gap-4 rounded-3xl overflow-hidden transition-colors duration-500`}
      style={{
        width: baseWidth,  // Base width for the center card before scale
        height: baseHeight,
        marginTop: baseHeight / -2,
        marginLeft: baseWidth / -2,
        padding: isMobile ? "24px" : "32px",
        backgroundColor: "#1a1a2e",
        border: isCenter ? "1px solid rgba(0,201,167,0.4)" : "1px solid rgba(255,255,255,0.05)",
        boxShadow: isCenter ? "0 0 50px rgba(0,201,167,0.15), inset 0 0 20px rgba(0,201,167,0.05)" : "none",
        cursor: isCenter ? "default" : "pointer",
        userSelect: "none",
        pointerEvents: Math.abs(diff) > 2 ? "none" : "auto",
        visibility: Math.abs(diff) > 2 ? "hidden" : "visible"
      }}
    >
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Row: Emoji and Links */}
        <div className="flex items-center justify-between gap-4 mb-2">
          {card.emoji && <span style={{ fontSize: 32, lineHeight: 1 }}>{card.emoji}</span>}

          <div className="flex items-center gap-3">
            {card.appstore && (
              <a href={card.appstore} target="_blank" rel="noopener noreferrer"
                className="transition-all hover:text-[#00C9A7] hover:-translate-y-0.5"
                style={{ color: "#888" }} title="App Store">
                {APPLE_SVG}
              </a>
            )}
            {card.playstore && (
              <a href={card.playstore} target="_blank" rel="noopener noreferrer"
                className="transition-all hover:text-[#00C9A7] hover:-translate-y-0.5"
                style={{ color: "#888" }} title="Google Play">
                {ANDROID_SVG}
              </a>
            )}
            {card.demo && (
              <a href={card.demo} target="_blank" rel="noopener noreferrer"
                className="transition-all hover:text-[#00C9A7] hover:-translate-y-0.5"
                style={{ color: "#888" }} title="Website">
                {WEB_SVG}
              </a>
            )}
            {card.github && (
              <a href={card.github} target="_blank" rel="noopener noreferrer"
                className="transition-all hover:text-[#00C9A7] hover:-translate-y-0.5"
                style={{ color: "#888" }} title="GitHub">
                {GH_SVG}
              </a>
            )}
            <span className="shrink-0 font-bold text-sm ml-1"
              style={{ color: "#00C9A7", fontFamily: "'Syne', sans-serif" }}>
              {card.id}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-2xl md:text-[26px] leading-tight mb-2"
          style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6", letterSpacing: "-0.02em" }}>
          {card.title}
        </h3>

        {/* Subtitle / Description */}
        <div className="text-sm md:text-[15px] leading-[1.6] flex-1"
          style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}>
          {card.subtitle}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
          {card.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-semibold tracking-wide"
              style={{
                color: "rgba(0,201,167,0.9)",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "rgba(0,201,167,0.1)",
                padding: "4px 10px",
                borderRadius: "100px"
              }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function InfiniteCarousel({ cards }: { cards: Card[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const numCards = cards.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [handleNext]);

  // Handle Drag
  const handleDragEnd = (event: any, info: PanInfo) => {
    // Lower threshold so a small swipe triggers the next card easily
    const threshold = 15;

    // Check velocity as well for quick "flicks"
    const isFlick = Math.abs(info.velocity.x) > 300;

    if (info.offset.x < -threshold || (isFlick && info.velocity.x < 0)) {
      handleNext();
    } else if (info.offset.x > threshold || (isFlick && info.velocity.x > 0)) {
      handlePrev();
    }
  };

  return (
    // Breaks out of a centered max-width container to 100vw while staying perfectly horizontally centered 
    <div className="relative w-[100vw] h-[550px] left-1/2 -translate-x-1/2 overflow-hidden mt-8"
      style={{ touchAction: "pan-y" }}>

      <motion.div
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {cards.map((card, i) => {
          // Calculate logical diff considering infinite rotation logic
          let diff = i - (currentIndex % numCards);
          if (currentIndex < 0) {
            diff = i - ((numCards - (Math.abs(currentIndex) % numCards)) % numCards);
          }

          if (diff < -Math.floor(numCards / 2)) diff += numCards;
          if (diff > Math.floor(numCards / 2)) diff -= numCards;

          return (
            <SpotlightCarouselCard
              key={card.id}
              card={card}
              diff={diff}
              isMobile={isMobile}
              onClick={() => {
                if (diff !== 0) {
                  setCurrentIndex((prev) => prev + diff);
                }
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
