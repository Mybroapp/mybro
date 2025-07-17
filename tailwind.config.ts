import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // Archivos dentro de /app
    "./components/**/*.{js,ts,jsx,tsx}" // Archivos dentro de /components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Tipografía moderna
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.1)", // Sombra suave
      },
    },
  },
  plugins: [],
};

export default config;
