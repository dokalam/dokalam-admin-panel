import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      rotate: {
        "270": "270deg",
      },
      colors: {
        primary: "#0ea960",
        primary_start: "#0ea960",
        primary_end: "#008844",
        background: "#F6F9FC",
        background2: "#F1F1F1",
        background3: "#FFF",
        background4: "#FFF",
        background5: "#F9FCFC",
        background6: "#e0e0e0",
        background7: "#a4bbbb",
        border: "#d1d1d1",
        border2: "#ececec",
        text: "#434343",
        text2: "#333",
        text3: "#000",
        text4: "#666",
        text5: "#999",
        text6: "#5d5d5d",
        background_dark: "#222222",
        background2_dark: "#151515",
        background3_dark: "#000",
        background4_dark: "#2e2e2e",
        background5_dark: "#1d1d1d",
        background6_dark: "#393939",
        background7_dark: "#11111b",
        border_dark: "#444444",
        border2_dark: "#282828",
        text_dark: "#F6F9FC",
        text2_dark: "#F1F1F1",
        text3_dark: "#FFF",
        text4_dark: "#999",
        text5_dark: "#888",
        text6_dark: "#D8D8D8",
        red_color: "#FF2400",
        green_color: "#309334",
        red_error: "#CC0000",
        warning: "#FF8800",
        info: "#33b5e5",
        white: "#FFFFFF",
        black: "#222222",
        rgba0: "rgba(14,169,96,0.9)",
        rgba1: "rgba(14,169,96,0.7)",
        rgba2: "rgba(14,169,96,0.3)",
        rgba3: "rgba(14,169,96,0.1)",
        rgba4: "rgba(14,169,96,0.05)",
        warn_start: "#FF8800",
        warn_end: "#ffbb33",
      },
      boxShadow: {
        "bottom": "0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.06)", // Shadow only on bottom
        "bottom-dark": "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.2)", // Dark mode variant
        'top': '0 -3px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)', // Shadow only on top
        'top-dark': '0 -3px 6px -1px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.2)', // Dark mode variant
      },
      fontFamily: {
        "iransans-md": ["iransans-md"],
        "iransans-light": ["iransans-light"],
        "iransans-bold": ["iransans-bold"],
        "iransans-black": ["iransans-black"],
        "iransans-ULight": ["iransans-ULight"],
        "iransans-light-en": ["iransans-light-en"],
        "iransans-md-en": ["iransans-md-en"],
        "iransans-black-en": ["iransans-black-en"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gradientColorStops: {
        primaryGradient: "var(--primary_start) 0%, var(--primary_end) 100%",
      },
      screens: {
        "4xs": "320px",
        "3xs": "375px",
        "2xs": "425px",
        xs: "550px",
        "3xl": "1750px",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['dark'],
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.4s ease-out',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
