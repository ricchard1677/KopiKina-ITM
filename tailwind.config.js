/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KopiKina 2026 brand colors
        brand: {
          50:  '#fdf2f2',
          100: '#fce4e4',
          200: '#f9cece',
          300: '#f4a8a9',
          400: '#ec7172',
          500: '#de4344',
          600: '#ab1f27',  // Attacus Red — PRIMARY
          700: '#911920',
          800: '#7a181e',
          900: '#68181e',
          950: '#39070b',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#faefca',
          200: '#f5dc90',
          300: '#efc554',
          400: '#e9b02e',
          500: '#c38d2c',  // Golden Yellow — SECONDARY
          600: '#a97424',
          700: '#875a1e',
          800: '#70481e',
          900: '#5e3b1c',
        },
        bone: '#E4E0DA',   // Bone White — SECONDARY
        ink:  '#000013',   // Black Perfect — SECONDARY
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
