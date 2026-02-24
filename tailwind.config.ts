import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A7C59",
          light: "#5E9B6F",
          dark: "#3A6247",
          50: "#F0F7F2",
          100: "#DCF0E2",
          200: "#B8E0C4",
          300: "#8FC9A2",
          400: "#6BAF80",
          500: "#4A7C59",
          600: "#3A6247",
          700: "#2D4D38",
          800: "#213929",
          900: "#16261C",
        },
        secondary: {
          DEFAULT: "#8FB996",
          light: "#A8CCAE",
          dark: "#76A67E",
        },
        accent: {
          DEFAULT: "#F4A261",
          light: "#F7BC8A",
          dark: "#E88D3C",
        },
        cream: {
          DEFAULT: "#FDFAF6",
          dark: "#F5EFE6",
          darker: "#E8DFD1",
        },
        text: {
          DEFAULT: "#2D3436",
          light: "#636E72",
          lighter: "#B2BEC3",
        },
        success: "#00B894",
        warning: "#FDCB6E",
        error: "#E17055",
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
