/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mb: {
          dark: '#12141e',      // #12141e
          blue: '#3878bc',      // #3878bc
          white: '#ffffff',     // #ffffff
          surface: '#1a1d2d',   // complementary dark surface card color
          surfaceLight: '#24283d',
          border: '#2a2f47',
          accentHover: '#2d639c',
          textMuted: '#94a3b8',
          textLight: '#e2e8f0'
        }
      }
    },
  },
  plugins: [],
}
