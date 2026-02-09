/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        background: "var(--background-color)",
        foreground: "var(--foreground-color)",
        border: "var(--border-color)",
        destructive: "var(--destructive-color)",
        online: "var(--online-color)",
        golden: "var(--golden-color)",
        hover: "var(--hover-color)",
      },
    },
  },
  plugins: [],
};
