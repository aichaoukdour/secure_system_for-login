/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        inwiPrimary: 'rgb(168, 4, 166)', // Correspond à ton oklch color
      },
    },
  },
  plugins: [],
}