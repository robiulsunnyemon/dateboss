/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#9F1E19',
          redHover: '#851713',
          cream: '#FAF7F2',
          beige: '#EFE7DA',
          softBeige: '#F5F1E6',
          border: '#E5DDD0',
          charcoal: '#16120F',
          muted: '#6E6A63',
          gold: '#FCB943',
        }
      },
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'serif'],
        sans: ['"Raleway"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
