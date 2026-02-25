"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

const EXPERIENCES = [
  { year: "2025", title: "Patent: Adversarial Example Generation", org: "특허) 시퀀셜 데이터를 처리하는 인공지능 모델에 대한 적대적 예제 생성 방법 및 이를 위한 컴퓨터 장치" },
  { year: "2025", title: "Patent: Audio Misclassification", org: "특허) 배음 구조를 활용한 오디오 오분류 유도 방법 및 이를 위한 컴퓨터 장치" },
  { year: "2024", title: "Program: Adjusting Perturbation Intensity", org: "프로그램 등록) 시간적 변화량을 활용한 섭동 강도 조정 적대적 공격" },
  { year: "2024", title: "NRF Graduate Research Fellowship", org: "한국연구재단 이공분야 석사과정생 연구장려금 선정" },
  { year: "2021", title: "Excellence Award — SW Startup Ideathon", org: "제7회 한양대학교 ERICA SW 창업 아이디어톤 우수상" },
  { year: "2020", title: "Grand Prize — SW Startup Makerthon", org: "제2회 한양대학교 ERICA SW 창업 메이커톤 대상" },
  { year: "2020", title: "Research Participant — SW Convergence R&D", org: "한양대학교 ERICA SW융합연구개발 과제 참여" },
  { year: "2020", title: "Mentor — Science Gifted SW Hackathon", org: "대학부설 과학영재 교육원 SW 해커톤 대회 멘토 활동" },
];

export default function AwardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="awards" ref={ref} className="min-h-screen flex items-center py-32 md:py-40"
      style={{ backgroundColor: "#0C0C0F" }}>
      <div className="section-inner w-full">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          <div className="md:w-1/3 shrink-0 relative">
            <div className="sticky top-40">
              <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                className="text-xs tracking-[0.32em] uppercase font-semibold mb-12"
                style={{ color: "#00C9A7", fontFamily: "'Inter', sans-serif" }}>
                05 — Experiences
              </motion.p>
              <AnimatedHeading
                text="Awards &|Experiences."
                className="mb-8"
                style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}
                delay={0.1}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {EXPERIENCES.map((ex, i) => (
              <motion.div key={ex.title + i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 pr-4 sm:pr-8 gap-4 sm:gap-10 border-b cursor-default transition-all duration-300"
                style={{ borderColor: 'rgba(255,255,255,0.05)', paddingLeft: '0px' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.backgroundColor = "rgba(0,201,167,0.04)";
                  el.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.backgroundColor = "transparent";
                  el.style.paddingLeft = "0px";
                }}
              >
                <div className="flex items-start gap-5">
                  <div className="mt-1 w-[2px] h-[24px] rounded-full scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-300"
                    style={{ backgroundColor: "#00C9A7" }} />
                  <div>
                    <h3 className="font-bold text-lg md:text-xl transition-colors duration-300 group-hover:text-white"
                      style={{ fontFamily: "'Syne', sans-serif", color: "#F0EDE6" }}>
                      {ex.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
                      {ex.org}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 text-[#00C9A7] group-hover:bg-[#00C9A7] group-hover:text-[#0C0C0F] group-hover:shadow-[0_0_12px_rgba(0,201,167,0.6)]"
                  style={{
                    border: "1px solid rgba(0,201,167,0.3)",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.05em",
                    padding: "4px 8px",
                  }}>
                  {ex.year}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
