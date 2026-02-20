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
  title: "JooLife (쥬라프) | 라이프스타일 컨설팅",
  description:
    "JooLife(쥬라프) - 라이프스타일 컨설팅 서비스. 당신의 삶에 활력을 더합니다.",
  openGraph: {
    title: "JooLife - 라이프스타일 컨설팅",
    description: "당신의 삶에 활력을 더하는 라이프스타일 파트너",
    url: "https://joolife.io.kr",
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
