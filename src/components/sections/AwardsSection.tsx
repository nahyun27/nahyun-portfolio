"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";

const EXPERIENCES = [
  { year: "2025", title: "Patent: Adversarial Example Generation", org: "특허) 시퀀셜 데이터를 처리하는 인공지능 모델에 대한 적대적 예제 생성 방법 및 이를 위한 컴퓨터 장치" },
  { year: "2025", title: "Patent: Audio Misclassification", org: "특허) 배음 구조를 활용한 오디오 오분류 유도 방법 및 이를 위한 컴퓨터 장치" },
  { year: "2024", title: "Program: Adjusting Perturbation Intensity", org: "프로그램 등록) 시간적 변화량을 활용한 섭동 강도 조정 적대적 공격" },
  { year: "2024", title: "NRF Graduate Research Fellowship", org: "한국연구재단 이공분야 석사과정생 연구장려금 선정" },
  { year: "2021", title: "Excellence Award, SW Startup Ideathon", org: "제7회 한양대학교 ERICA SW 창업 아이디어톤 우수상" },
  { year: "2020", title: "Grand Prize, SW Startup Makerthon", org: "제2회 한양대학교 ERICA SW 창업 메이커톤 대상, Deli-Go (Delivery carpooling app)" },
  { year: "2020", title: "Research Participant, SW Convergence R&D", org: "한양대학교 ERICA SW융합연구개발 과제 참여" },
  { year: "2020", title: "Mentor, Science Gifted SW Hackathon", org: "대학부설 과학영재 교육원 SW 해커톤 대회 멘토 활동" },
];

export default function AwardsSection() {
  return (
    <section id="awards" className="relative z-10" style={{ backgroundColor: "transparent" }}>
      <div className="section-inner w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 lg:gap-20">
          <div>
            <div className="lg:sticky lg:top-32">
              <SectionHeader index="05" label="Experience" title="Awards & Experience." highlightWords={["Experience."]} marginBottom={0} />
            </div>
          </div>

          <ol style={{ borderTop: "1px solid var(--w70)" }}>
            {EXPERIENCES.map((ex, i) => (
              <motion.li
                key={ex.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: (i % 4) * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid grid-cols-[56px_minmax(0,1fr)] sm:grid-cols-[72px_minmax(0,1fr)] gap-x-4 py-5 px-2 transition-colors duration-300 hover:bg-[var(--w30)]"
                style={{ borderBottom: "1px solid var(--w70)" }}
              >
                <span
                  className="pt-1 transition-colors duration-300 group-hover:text-[color:var(--mint)]"
                  style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", color: "var(--t4)", fontVariantNumeric: "tabular-nums" }}
                >
                  {ex.year}
                </span>
                <span className="min-w-0">
                  <span className="block transition-transform duration-500 group-hover:translate-x-1"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.02rem, 1.6vw, 1.2rem)", letterSpacing: "-0.015em", lineHeight: 1.35, color: "var(--text)" }}>
                    {ex.title}
                  </span>
                  <span className="block mt-1.5" style={{ fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.6, color: "var(--t3)" }}>
                    {ex.org}
                  </span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
