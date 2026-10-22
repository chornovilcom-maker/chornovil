/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FAF8F5',
          100: '#F4F1EA',
          200: '#EBE6DC',
          300: '#DDD6C7',
          400: '#C5BCAB',
        },
        ink: {
          900: '#0B0B0D',
          800: '#141417',
          700: '#222328',
          600: '#3A3B42',
        },
        accent: {
          red: '#E6192E',
          'red-glow': 'rgba(230, 25, 46, 0.4)',
          gold: '#E5C158',
          blue: '#1A6DDB',
        }
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        editorial: ['Syne', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'mega-wide': '0.35em',
      }
    },
  },
  plugins: [],
}
