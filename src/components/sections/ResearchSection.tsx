"use client";

import HorizontalSlider from "@/components/HorizontalSlider";
import SectionHeader from "@/components/SectionHeader";

const PAPERS = [
  {
    id: "01",
    title: "Anonymous",
    subtitle: "Universal adversarial audio attacks that transfer across models & speech recognition systems.",
    venue: "Patent, In submission",
    tags: ["Audio Attack", "Adversarial Patch"],
  },
  {
    id: "02",
    title: "Anonimous Attack",
    // subtitle: "Dynamic Perturbation Intensity Attack — a frequency-domain adversarial audio attack.",
    subtitle: "A novel adversarial attack proposing a method to adjust perturbation intensity by exploiting temporal characteristics.",
    venue: "Patent, In Review",
    tags: ["Video Attack", "Adversarial Attack"],
  },
  {
    id: "03",
    title: "ASR Survey",
    subtitle: "Comprehensive survey of adversarial attacks on automatic speech recognition systems.",
    venue: "KIPS ASK 2023",
    tags: ["Survey", "ASR", "Security"],
  },
  {
    id: "04",
    title: "Firmware Security",
    subtitle: "Firmware signing & encryption system for secure embedded device authentication.",
    venue: "KIPS ASK 2022",
    tags: ["Firmware", "Cryptography", "IoT"],
  },
];

export default function ResearchSection() {
  return (
    <section id="research" className="min-h-screen flex items-center py-24 md:py-32 relative z-10"
      style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <SectionHeader index="03" label="Research" title="Publications & Patents." highlightWords={["Patents."]} />
        <HorizontalSlider cards={PAPERS} />
      </div>
    </section>
  );
}
