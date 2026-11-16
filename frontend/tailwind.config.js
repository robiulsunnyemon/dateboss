/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FBF8F3',
          200: '#F4EFE6',
          300: '#E9E2D5',
          400: '#DDD4C4'
        },
        brand: {
          red: '#8A1B22',
          redDark: '#6E1118',
          redLight: '#A3242C',
          gold: '#E8A738',
          goldDark: '#CF8E20',
          dark: '#141414',
          charcoal: '#21201E',
          muted: '#6B6760',
          card: '#F6F2EA'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
