/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Crimson Text', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae1ff',
          300: '#7cc8ff',
          400: '#36abfd',
          500: '#0c8fed',
          600: '#006fcf',
          700: '#0055a3',
          800: '#054986',
          900: '#0a3d6e',
          950: '#072649',
        },
        sage: {
          50: '#f6f8f6',
          100: '#e9f0ea',
          200: '#d5e3d7',
          300: '#b5cebb',
          400: '#8eb096',
          500: '#7c9885',
          600: '#5f7765',
          700: '#4c5f52',
          800: '#404e44',
          900: '#37423a',
        },
        warm: {
          50: '#faf9f7',
          100: '#f2efea',
          200: '#e6ddd2',
          300: '#d6c7b3',
          400: '#c2ab8e',
          500: '#b49176',
          600: '#a67e6a',
          700: '#8b6a58',
          800: '#72574c',
          900: '#5d483e',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
};