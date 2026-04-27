/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316', // orange-500
          dark: '#ea580c',   // orange-600
          light: '#fb923c',  // orange-400
        },
        secondary: {
          DEFAULT: '#000000',
          light: '#1f2937', // gray-800
        }
      }
    },
  },
  plugins: [],
}
