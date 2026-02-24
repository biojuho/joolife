"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1A1A1A 0%, #2A2A28 50%, #1A1A1A 100%)",
      }}
    >
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[200px] h-[200px] rounded-full border border-white/5" />
        <div className="absolute top-[40%] left-[15%] w-2 h-2 rounded-full bg-accent/30" />
        <div className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 rounded-full bg-secondary/30" />
        <div className="absolute top-[60%] right-[35%] w-[80px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-[clamp(1rem,0.5rem+2vw,2rem)] text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] tracking-[0.3em] text-white/40 mb-8 font-medium"
        >
          LIFESTYLE CONSULTING
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading leading-tight mb-8"
        >
          <span className="block text-white text-[clamp(2.5rem,1.8rem+3.5vw,4rem)] font-bold">
            당신의 삶에
          </span>
          <span className="block text-white text-[clamp(2.5rem,1.8rem+3.5vw,4rem)] font-bold">
            <em className="not-italic text-accent">활력</em>을 더하다
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/50 text-[clamp(0.95rem,0.9rem+0.3vw,1.05rem)] max-w-lg mx-auto mb-12 leading-relaxed"
        >
          쥬라프와 함께 일상의 모든 순간을 특별하게 만들어보세요.
          <br className="hidden sm:block" />
          라이프스타일 컨설팅으로 더 나은 내일을 설계합니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:joolife@joolife.io.kr"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white text-sm font-semibold tracking-wider rounded-full transition-all duration-300 hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
          >
            문의하기
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "#about")}
            className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-white/80 text-sm font-semibold tracking-wider rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/40"
          >
            더 알아보기
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#about"
        onClick={(e) => handleScroll(e, "#about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
      >
        <span className="text-[10px] tracking-[0.2em] font-medium">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.a>
    </section>
  );
}
