/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Same indigo palette as the dashboard
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
        // Dark theme base
        ink: {
          950: '#050508', // page background
          900: '#0a0a12',
          800: '#111120',
          700: '#1a1a2e',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-x':   'gradient-x 8s ease infinite',
        'float':        'float 6s ease-in-out infinite',
        'marquee':      'marquee 30s linear infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine':        'shine 3s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-15px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shine: {
          '0%':   { 'background-position': '200% center' },
          '100%': { 'background-position': '-200% center' },
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        'grid-pattern': `linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px)`,
      },
    },
  },
  plugins: [],
};
