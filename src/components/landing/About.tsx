"use client";

import { motion } from "framer-motion";
import { Globe, Star, Heart } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.7 },
};

const values = [
  {
    icon: Globe,
    title: "Mission",
    description:
      "모든 사람이 자신만의 라이프스타일을 설계하고, 더 의미 있는 일상을 살아갈 수 있도록 돕습니다.",
  },
  {
    icon: Star,
    title: "Vision",
    description:
      "2030년까지 아시아를 대표하는 라이프스타일 컨설팅 플랫폼이 되겠습니다.",
  },
  {
    icon: Heart,
    title: "Core Values",
    description:
      "활력 (Vitality) · 균형 (Balance) · 성장 (Growth) · 신뢰 (Trust)",
  },
];

export default function About() {
  return (
    <section id="about" className="py-[clamp(4rem,3rem+5vw,8rem)] bg-off-white">
      <div className="mx-auto max-w-[1200px] px-[clamp(1rem,0.5rem+2vw,2rem)]">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-[11px] tracking-[0.3em] text-accent font-semibold uppercase">
            About Us
          </span>
          <h2 className="font-heading text-[clamp(1.5rem,1.2rem+1.5vw,2rem)] font-bold text-[#1A1A1A] mt-4">
            쥬라프를 소개합니다
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-4" />
        </motion.div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-heading font-bold text-accent/20">
                  J
                </span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-heading text-[clamp(1.25rem,1.1rem+0.75vw,1.5rem)] font-bold text-[#1A1A1A] mb-6">
              일상을 디자인하는 파트너
            </h3>
            <p className="text-[#6B6B66] leading-relaxed mb-4">
              JooLife(쥬라프)는 2026년 설립된 라이프스타일 컨설팅 전문 기업입니다.
              우리는 개인과 기업의 일상에 활력과 균형을 더하는 것을 목표로 합니다.
            </p>
            <p className="text-[#6B6B66] leading-relaxed">
              건강, 업무 환경, 개인 성장, 그리고 일과 삶의 조화 —
              쥬라프는 삶의 모든 영역에서 긍정적인 변화를 이끌어냅니다.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent-bg flex items-center justify-center mx-auto mb-5">
                  <Icon size={24} className="text-accent" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1A1A1A] mb-3">
                  {value.title}
                </h4>
                <p className="text-[#6B6B66] text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
