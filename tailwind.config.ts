import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FFFDF9",
          100: "#FFF8F0",
          200: "#F5EDE4",
          300: "#EDE0D4",
          400: "#E0CFC2",
        },
        brown: {
          50:  "#EFEBE9",
          100: "#D7CCC8",
          200: "#BCAAA4",
          300: "#A1887F",
          400: "#8D6E63",
          500: "#5D4037",
          600: "#4E342E",
          700: "#3E2723",
          800: "#2C1810",
        },
        gold: {
          300: "#F0C070",
          400: "#E8A835",
          500: "#D4A24C",
          600: "#B8892E",
          700: "#9A6F1A",
        },
        coral: {
          400: "#FF9A76",
          500: "#E8855C",
          600: "#D4683D",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        inter:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":   "linear-gradient(135deg, #D4A24C 0%, #F0C070 50%, #D4A24C 100%)",
        "brown-gradient":  "linear-gradient(135deg, #3E2723 0%, #5D4037 100%)",
        "cream-gradient":  "linear-gradient(180deg, #FFF8F0 0%, #F5EDE4 100%)",
        "hero-overlay":    "linear-gradient(to right, rgba(62,39,35,0.92) 0%, rgba(62,39,35,0.7) 60%, rgba(62,39,35,0.2) 100%)",
      },
      boxShadow: {
        "soft":        "0 4px 24px rgba(62,39,35,0.08)",
        "soft-lg":     "0 8px 48px rgba(62,39,35,0.12)",
        "gold-glow":   "0 4px 20px rgba(212,162,76,0.35)",
        "card":        "0 2px 16px rgba(62,39,35,0.06), 0 8px 32px rgba(62,39,35,0.08)",
        "card-hover":  "0 8px 32px rgba(62,39,35,0.14), 0 24px 64px rgba(62,39,35,0.12)",
        "inner-soft":  "inset 0 2px 8px rgba(62,39,35,0.06)",
      },
      borderRadius: {
        "xl2": "1.25rem",
        "xl3": "1.75rem",
        "xl4": "2.5rem",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "spin-slow":   "spin 8s linear infinite",
        "pulse-slow":  "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":     "shimmer 2s linear infinite",
        "float":       "float 4s ease-in-out infinite",
        "badge-pop":   "badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        badgePop: {
          "0%":   { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
