/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Blue
        secondary: '#9333EA', // Purple
        background: '#F9FAFB', // Light Gray
      },
    },
  },
  plugins: [],
}