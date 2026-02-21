"use client";

import { User, Bell, Palette, Shield, Globe } from "lucide-react";

const settingSections = [
  {
    icon: User,
    title: "프로필",
    description: "이름, 프로필 사진, 관심사를 설정합니다.",
  },
  {
    icon: Bell,
    title: "알림",
    description: "이메일 및 푸시 알림 설정을 관리합니다.",
  },
  {
    icon: Palette,
    title: "테마",
    description: "라이트/다크 모드, 대시보드 레이아웃을 설정합니다.",
  },
  {
    icon: Shield,
    title: "개인정보 & 보안",
    description: "데이터 동의, 계정 보안을 관리합니다.",
  },
  {
    icon: Globe,
    title: "언어",
    description: "서비스 언어를 변경합니다.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">설정</h1>
        <p className="text-[#6B6B66] mt-1">계정 및 서비스 설정을 관리합니다.</p>
      </div>

      <div className="space-y-3">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.title}
              className="w-full bg-white rounded-2xl border border-gray-200/60 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#6B6B66]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A1A] text-sm">
                  {section.title}
                </h3>
                <p className="text-[#A3A39E] text-xs mt-0.5">
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
