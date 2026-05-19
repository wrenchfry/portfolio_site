/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#06060f',
        panel: '#10132a',
        ice: '#e8efff',
        'ice-dim': '#9eabc8',
        'neon-green': '#22f39a',
        'neon-cyan': '#6fd8ff',
        'neon-gold': '#ffd84a',
        'neon-violet': '#b98cff',
        'neon-rose': '#ff7aa2',
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        mono: ['"VT323"', 'monospace'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 28px rgba(34, 243, 154, 0.24)',
        cyan: '0 0 28px rgba(111, 216, 255, 0.22)',
        gold: '0 0 28px rgba(255, 216, 74, 0.2)',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'translateX(-105%)' },
          '100%': { transform: 'translateX(105%)' },
        },
      },
      animation: {
        sweep: 'sweep 2.8s linear infinite',
      },
    },
  },
  plugins: [],
}
