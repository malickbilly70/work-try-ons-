/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Gilroy-Black', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        mb: {
          dark: '#12141e',      // Official dark background #12141e
          blue: '#3878bc',      // Official accent blue #3878bc
          white: '#ffffff',     // Official white #ffffff
          surface: '#1a1d2d',   // Complementary dark surface
          surfaceLight: '#24283d',
          border: '#2a2f47',
          accentHover: '#2d639c',
          textMuted: '#94a3b8',
          textLight: '#e2e8f0',
          // Light Mode Colors
          lightBg: '#f8fafc',
          lightSurface: '#ffffff',
          lightBorder: '#e2e8f0',
          lightText: '#0f172a',
          lightMuted: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
