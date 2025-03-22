/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        slide: 'slide 20s linear infinite running',
      },
      colors: {
        snow: '#FFFBFF',
        'royal-blue': '#4D6CFA',
        emerald: '#0CCE6B',
        almond: '#F1DABF',
        mocha: '#92817A',
        chestnut: '#362417',
        'flash-white': '#F3F5F7',
      },
      fontFamily: {
        ibm: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        large: '36px',
      },
    },
  },
  plugins: [],
};
