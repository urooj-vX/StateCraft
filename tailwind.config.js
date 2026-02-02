/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom colors if needed, but Tailwind defaults are great
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming we might add Inter later, or rely on system
      }
    },
  },
  plugins: [],
}
