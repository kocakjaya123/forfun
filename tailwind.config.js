export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'emerald': '#10b981',
          'emerald-dark': '#047857',
          'accent': '#f59e0b',
          'bg': '#0f172a',
          'muted': '#94a3b8'
        },
        income: '#10b981',
        expense: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '1' },
          '50%': { transform: 'translateY(-8px)', opacity: '0.95' },
        },
      },
      boxShadow: {
        soft: '0 6px 18px rgba(2,6,23,0.25)'
      }
    },
  },
  plugins: [],
}
