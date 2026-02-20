import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SlowAge custom palette
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#F0EEFF",
          100: "#E0DBFF",
          200: "#C1B7FF",
          300: "#A293FF",
          400: "#836FEF",
          500: "#6C5CE7",
          600: "#5A4BD4",
          700: "#4839B0",
          800: "#36298C",
          900: "#241A68",
          950: "#150F44",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#E6FFF9",
          100: "#B3FFE9",
          200: "#80FFD9",
          300: "#4DFFC9",
          400: "#1AFFB9",
          500: "#00B894",
          600: "#009977",
          700: "#007A5A",
          800: "#005C3D",
          900: "#003D20",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#FFFBF0",
          100: "#FFF3D1",
          200: "#FFE7A3",
          300: "#FFDB75",
          400: "#FDCB6E",
          500: "#E5B54F",
          600: "#CC9F30",
          700: "#B38A11",
          800: "#8A6A00",
          900: "#614A00",
        },
        dark: {
          DEFAULT: "#0F0F1A",
          50: "#E8E8ED",
          100: "#C5C5D1",
          200: "#9A9AB2",
          300: "#6F6F93",
          400: "#4A4A6A",
          500: "#2D2D45",
          600: "#1E1E33",
          700: "#171728",
          800: "#131321",
          900: "#0F0F1A",
          950: "#0A0A12",
        },
        // shadcn/ui CSS variable references
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "score-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--score-width)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "score-fill": "score-fill 1s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "count-up": "count-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
