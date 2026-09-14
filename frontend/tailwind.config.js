/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Same indigo palette as the landing page
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e1b4b',
          950: '#0f0d2e',
        },
        // Dark theme base — matches landing
        ink: {
          950: '#050508',
          900: '#0a0a12',
          800: '#111120',
          700: '#1a1a2e',
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};
