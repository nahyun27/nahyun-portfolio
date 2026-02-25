"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";

const PROJECTS = [
  {
    id: "01",
    emoji: "💊",
    title: "ToFindPill",
    subtitle: "Pill recognition mobile app. Snap a photo to instantly identify any medication.",
    tags: ["YOLOv5/v8", "React Native", "Python"],
  },
  {
    id: "02",
    emoji: "🎙️",
    title: "PerSI",
    subtitle: "Personalized speaker ID system for hearing-impaired users powered by audio ML.",
    tags: ["wav2vec2", "pyannote", "PyTorch"],
  },
  {
    id: "03",
    emoji: "🎾",
    title: "TennisTown",
    subtitle: "Tennis host-guest matching platform connecting players for court sessions across Seoul.",
    tags: ["React", "Node.js", "Firebase"],
  },
  {
    id: "04",
    emoji: "🛵",
    title: "Deli-Go",
    subtitle: "Delivery carpooling service app — Grand Prize winner at 아이디어톤.",
    tags: ["React Native", "Maps API"],
  },
  {
    id: "05",
    emoji: "🔒",
    title: "NetTransfer",
    subtitle: "Privacy-preserving network traffic generation using generative models.",
    tags: ["Python", "GAN", "Networking"],
  },
  {
    id: "06",
    emoji: "🤖",
    title: "PQC-DDS",
    subtitle: "Post-quantum cryptography implementation in the ROS2 robotics middleware.",
    tags: ["ROS2", "C++", "PQC"],
  },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center py-24"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase font-semibold mb-10"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          03 — Projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.65, ease: "easeOut" }}
          className="font-black leading-tight mb-14"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.4rem,5vw,4rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
          }}>
          What I&apos;ve<br />Built.
        </motion.h2>

        <HorizontalSlider cards={PROJECTS} />
      </div>
    </section>
  );
}
