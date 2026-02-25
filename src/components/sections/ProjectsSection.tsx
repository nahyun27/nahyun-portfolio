"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalSlider from "@/components/HorizontalSlider";
import AnimatedHeading from "@/components/AnimatedHeading";

const PROJECTS = [
  { id: "01", emoji: "💊", title: "ToFindPill", subtitle: "Pill recognition mobile app — snap a photo to instantly identify any medication.", tags: ["YOLOv5/v8", "React Native", "Python"] },
  { id: "02", emoji: "🎙️", title: "PerSI", subtitle: "Personalized speaker ID for hearing-impaired users with audio ML.", tags: ["wav2vec2", "pyannote", "PyTorch"] },
  { id: "03", emoji: "🎾", title: "TennisTown", subtitle: "Tennis host-guest matching platform — find a court partner across Seoul.", tags: ["React", "Node.js", "Firebase"] },
  { id: "04", emoji: "🛵", title: "Deli-Go", subtitle: "Delivery carpooling app — Grand Prize winner at 아이디어톤.", tags: ["React Native", "Maps API"] },
  // { id: "05", emoji: "🔒", title: "NetTransfer", subtitle: "Privacy-preserving network traffic generation using generative models.", tags: ["Python", "GAN", "Networking"] },
  // { id: "06", emoji: "🤖", title: "PQC-DDS", subtitle: "Post-quantum cryptography in the ROS2 robotics middleware.", tags: ["ROS2", "C++", "PQC"] },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="projects" ref={ref} className="min-h-screen flex items-center py-28"
      style={{ backgroundColor: "#0C0C0F" }}>
      <div className="section-inner w-full">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
          style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
          03 — Projects
        </motion.p>
        <AnimatedHeading
          text="What I've|Built."
          highlightWords={["Built."]}
          className="mb-14"
          style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}
          delay={0.1}
        />
        <HorizontalSlider cards={PROJECTS} />
      </div>
    </section>
  );
}
