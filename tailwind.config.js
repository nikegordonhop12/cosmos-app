/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        cosmic: '#0a0a1a',
        deep: '#0f0f2e',
        gold: '#d4af37',
        'gold-light': '#f0d060',
        silver: '#c0c0c0',
        mystic: '#6b21a8',
        'mystic-light': '#a855f7',
        ember: '#ff6b35',
        rune: '#4a9eff',
        emerald: '#50c878',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        rune: ['MedievalSharp', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'spin-slow': 'spin 30s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'card-flip': 'cardFlip 0.6s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(212,175,55,0.8)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 70%, #000 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
        'mystic-gradient': 'linear-gradient(135deg, #1a0a2e 0%, #0f0f2e 50%, #0a1a2e 100%)',
      },
    },
  },
  plugins: [],
}
