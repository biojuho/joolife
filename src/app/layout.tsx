import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlowAge | 슬로에이지 - 매일의 슬로에이징 점수",
  description:
    "하루 5가지 건강 체크로 나만의 슬로에이징 점수를 확인하세요. 수면, 운동, 식단, 스트레스, 소셜 — 매일 기록하고, 변화를 추적하세요.",
  keywords: [
    "슬로에이징",
    "건강관리",
    "건강점수",
    "슬로에이지",
    "slow aging",
    "health tracker",
  ],
  authors: [{ name: "JooLife" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F0F1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen`}
        style={{
          fontFamily:
            "'Pretendard Variable', var(--font-inter), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
