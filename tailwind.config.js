/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#0A0E1A',
          surface: '#131829',
          higher: '#1A1F35',
          border: 'rgba(168, 85, 247, 0.2)',
          purple: '#A855F7',
          purpleHover: '#9333EA',
          cyan: '#06B6D4',
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
          text: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B'
        }
      },
      fontFamily: {
        chakra: ['"Chakra Petch"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(168, 85, 247, 0.5)',
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'neon-strong': '0 0 35px 2px rgba(168, 85, 247, 0.65)'
      }
    },
  },
  plugins: [],
};
