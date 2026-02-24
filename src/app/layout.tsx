import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JooLife (쥬라프) | AI 라이프스타일 매니저",
    template: "%s | JooLife",
  },
  description:
    "JooLife(쥬라프) - AI 기반 라이프스타일 매니지먼트 플랫폼. 콘텐츠 큐레이션, AI 추천, 자동화를 통해 삶에 활력을 더합니다.",
  keywords: [
    "JooLife",
    "쥬라프",
    "라이프스타일",
    "AI",
    "콘텐츠 관리",
    "Web3",
    "자동화",
  ],
  authors: [{ name: "JooLife Team" }],
  creator: "JooLife",
  metadataBase: new URL("https://joolife.io.kr"),
  openGraph: {
    title: "JooLife - AI 라이프스타일 매니저",
    description:
      "AI 기반 콘텐츠 큐레이션, 맞춤 추천, 자동화로 당신의 삶을 관리하세요.",
    url: "https://joolife.io.kr",
    siteName: "JooLife",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "JooLife - AI 라이프스타일 매니저",
    description:
      "AI 기반 콘텐츠 큐레이션, 맞춤 추천, 자동화로 당신의 삶을 관리하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
