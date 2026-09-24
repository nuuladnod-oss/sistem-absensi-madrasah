/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        madrasah: {
          50: '#f0fdf7',
          100: '#dbf9eb',
          200: '#b8f2d8',
          300: '#7fe4bd',
          400: '#41cd9d',
          500: '#19b280',
          600: '#13795b',
          700: '#0e5f48',
          800: '#0c4c3b',
          900: '#0a3f31',
        },
      },
      spacing: {
        touch: '48px',
      },
    },
  },
  plugins: [],
}