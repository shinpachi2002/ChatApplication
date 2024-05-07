/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#7469B6",
        secondary:"#0E46A3",
        third:"#3F72AF"
      }
    },
  },
  plugins: [],
}