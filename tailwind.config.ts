import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F9",
        card: "#FFFFFF",
        ink: "#14161A",
        rule: "#E3E6EB",
        muted: "#6B7280",
        accent: "#1F4BFF",
        "accent-soft": "#E9EEFF",
        // live data / present role — git "added" green
        live: "#0E9F6E",
        "live-soft": "#E1F9F0",
        // manual data / confidential — amber, deliberately warm against the blue
        manual: "#B45309",
        "manual-soft": "#FDF1DE",
        // project category accents
        teal: "#0B7285",
        "teal-soft": "#E1F3F6",
        violet: "#7C3AED",
        "violet-soft": "#F1EBFE",
        // the gutter — a structural dark sidebar, not a page-wide theme
        gutter: "#0F1115",
        "gutter-line": "#242833",
        "gutter-muted": "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
