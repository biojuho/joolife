import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/60 py-16">
      <div className="mx-auto max-w-[1200px] px-[clamp(1rem,0.5rem+2vw,2rem)]">
        {/* Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <span className="text-white font-heading text-xl font-bold tracking-wider">
              JooLife
            </span>
            <p className="text-sm mt-2">
              당신의 삶에 활력을 더하는 라이프스타일 파트너
            </p>
          </div>
          <div className="flex gap-6 mt-6 md:mt-0">
            <Link
              href="#about"
              className="text-sm hover:text-white transition-colors"
            >
              소개
            </Link>
            <Link
              href="#team"
              className="text-sm hover:text-white transition-colors"
            >
              팀
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom */}
        <div className="text-xs leading-relaxed space-y-1 text-white/40">
          <p>쥬라프 (JooLife) | 대표: 박주호 | 사업자등록번호: 266-31-02086</p>
          <p>
            주소: 경기 안양시 동안구 관평로212번길 21 공작부영아파트 309동 1312호
          </p>
          <p>전화: 010-3159-3708 | 이메일: joolife@joolife.io.kr</p>
          <p className="mt-4">© 2026 JooLife. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
