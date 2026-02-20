"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const teamMembers = [
  {
    name: "박주호",
    role: "대표 | CEO & Founder",
    initial: "주",
    bio: "더 나은 라이프스타일을 설계하고 실천하기 위해 쥬라프를 설립했습니다. 일상에 활력을 더하는 컨설팅을 제공합니다.",
    email: "joolife@joolife.io.kr",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-[clamp(4rem,3rem+5vw,8rem)] bg-white">
      <div className="mx-auto max-w-[1200px] px-[clamp(1rem,0.5rem+2vw,2rem)]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[0.3em] text-accent font-semibold uppercase">
            Our Team
          </span>
          <h2 className="font-heading text-[clamp(1.5rem,1.2rem+1.5vw,2rem)] font-bold text-[#1A1A1A] mt-4">
            함께하는 사람들
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-4" />
          <p className="text-[#6B6B66] mt-6 max-w-md mx-auto">
            열정과 전문성으로 당신의 라이프스타일 변화를 이끄는 팀입니다.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="flex justify-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="group w-full max-w-sm"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Avatar */}
                <div className="relative h-64 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A28] flex items-center justify-center">
                  <span className="text-5xl font-heading font-bold text-white/20 group-hover:text-accent/40 transition-colors duration-300">
                    {member.initial}
                  </span>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent transition-colors"
                      aria-label="이메일"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 text-center">
                  <h4 className="font-heading text-lg font-bold text-[#1A1A1A]">
                    {member.name}
                  </h4>
                  <span className="inline-block text-xs tracking-wider text-accent font-semibold mt-1 mb-4">
                    {member.role}
                  </span>
                  <p className="text-sm text-[#6B6B66] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
