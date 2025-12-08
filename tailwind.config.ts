import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        /* UI용 폰트 (omyu pretty) */
        ui: ["uiFont", "SUIT", "Pretendard", "sans-serif"],

        /* 본문/메시지용 폰트 (Hakgyoansim Geurimilgi) */
        letter: ["letterFont", "SUIT", "Pretendard", "sans-serif"],
      },

      colors: {
        primary: "var(--color-primary)",
        "primary-strong": "var(--color-primary-strong)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
      },

      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },

      boxShadow: {
        lg: "var(--shadow-lg)",
      },

      fontSize: {
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        "2xl": "var(--text-2xl)",
      },
    },
  },
  plugins: [],
} satisfies Config;
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        /* UI용 폰트 (omyu pretty) */
        ui: ["uiFont", "SUIT", "Pretendard", "sans-serif"],

        /* 본문/메시지용 폰트 (Hakgyoansim Geurimilgi) */
        letter: ["letterFont", "SUIT", "Pretendard", "sans-serif"],
      },

      colors: {
        primary: "var(--color-primary)",
        "primary-strong": "var(--color-primary-strong)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
      },

      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },

      boxShadow: {
        lg: "var(--shadow-lg)",
      },

      fontSize: {
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        "2xl": "var(--text-2xl)",
      },
    },
  },
  plugins: [],
} satisfies Config;