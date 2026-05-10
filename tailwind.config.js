/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        surface2: "#171717",
        border: "#262626",
        text: "#f5f5f5",
        muted: "#a3a3a3",
        accent: "#00ff88",
        accentSecondary: "#00d4ff"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,255,136,0.08), 0 24px 60px rgba(0,255,136,0.08)"
      }
    }
  },
  plugins: []
};
