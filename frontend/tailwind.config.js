/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pharmacare: {
          bg: "#f8f9fb",
          surface: "#ffffff",
          low: "#f3f4f6",
          container: "#edeef0",
          ink: "#191c1e",
          muted: "#3e4943",
          outline: "#6e7a73",
          line: "#bdcac1",
          primary: "#00694d",
          primaryHover: "#008562",
          primarySoft: "#e8fff5",
          secondary: "#366664",
          secondarySoft: "#baece9",
          blue: "#2170e4",
          warning: "#b45309",
          warningSoft: "#fef3c7",
          danger: "#ba1a1a",
          dangerSoft: "#ffdad6",
          staff: "#24587a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 16px 32px rgba(16, 35, 31, 0.06)",
        soft: "0 8px 18px rgba(54, 102, 100, 0.08)",
      },
    },
  },
  plugins: [],
};
