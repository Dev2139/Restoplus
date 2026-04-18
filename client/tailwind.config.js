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
          DEFAULT: '#facc15', // yellow-400
          dark: '#eab308',   // yellow-500
          light: '#fde047',  // yellow-300
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
