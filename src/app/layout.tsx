import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "슬로에이징 코치 | 12주 저속노화 프로그램",
    template: "%s | 슬로에이징 코치",
  },
  description:
    "식단, 운동, 수면을 AI가 분석해 개인화된 저속노화 코칭을 받아보세요. 매일 5분 체크리스트로 생체나이를 되돌립니다.",
  keywords: [
    "저속노화",
    "슬로에이징",
    "안티에이징",
    "웰에이징",
    "건강관리",
    "생체나이",
  ],
  openGraph: {
    title: "슬로에이징 코치 — 나이는 숫자일 뿐",
    description: "12주 저속노화 프로그램으로 과학적으로 노화 속도를 늦추세요",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
