"use client";

import { motion } from "framer-motion";
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

const isPatent = (venue: string) => venue.startsWith("Patent");

export default function ResearchSection() {
  return (
    <section id="research" className="relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <SectionHeader
          index="04"
          label="Research"
          title="Publications & Patents."
          highlightWords={["Patents."]}
          description="Adversarial attacks on speech, audio and video models, plus some earlier systems security work."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PAPERS.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass glass-ring flex flex-col gap-4 p-6"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase"
                  style={{
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.1em",
                    color: isPatent(p.venue) ? "var(--mint)" : "var(--c-blue)",
                    background: isPatent(p.venue) ? "rgba(var(--mint-rgb),0.1)" : "var(--w40)",
                    border: isPatent(p.venue) ? "1px solid rgba(var(--mint-rgb),0.3)" : "1px solid var(--w100)",
                  }}
                >
                  {isPatent(p.venue) ? "Patent" : "Paper"}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "var(--t5)" }}>{p.id}</span>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--fs-h3)", letterSpacing: "-0.025em", lineHeight: 1.15, color: "var(--text)" }}>
                {p.title}
              </h3>
              <p className="flex-1" style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65, color: "var(--t3)" }}>{p.subtitle}</p>

              <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "1px solid var(--w70)" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--t2)" }}>{p.venue}</span>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ fontFamily: "var(--font-body)", color: "var(--t3)", background: "var(--w40)", border: "1px solid var(--w80)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
