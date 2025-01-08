/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,tsx,jsx}"
  ],
  theme: {
    extend: {
      screens: {
        mb: { min: "0", max: "767px" }
      }
    },
  },
  plugins: [],
}

