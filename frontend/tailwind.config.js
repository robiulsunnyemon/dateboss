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
          primary: '#9F1E19',     // Primary
          secondary: '#FCB943',   // Secondary
          bg: '#EFE7DA',          // BG
          surface: '#F5F1E6',     // Surface
          black: '#16120F',       // Black (100)
          muted: '#6E6A63',       // Muted / Neutral Gray
          success: '#199F22',     // Success color

          // Aliases for convenience
          red: '#9F1E19',
          gold: '#FCB943',
          dark: '#16120F',
          card: '#F5F1E6',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        display: ['Lora', 'Georgia', 'serif'],
        sans: ['Raleway', 'system-ui', 'sans-serif'],
        body: ['Raleway', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
