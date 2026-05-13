/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pharmacare: {
          bg: "#f8fbfa",
          ink: "#10231f",
          muted: "#5e716c",
          line: "#d8e5e1",
          primary: "#1f8f72",
          soft: "#e8f5f1",
          staff: "#24587a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(16, 35, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
