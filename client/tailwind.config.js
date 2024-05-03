/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#c8e7ff",
        secondary:"#aed9e0",
      }
    },
  },
  plugins: [],
}