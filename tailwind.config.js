export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f8b4d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Poppins', 'sans-serif'],
      },
      animation: {
        'float-heart': 'float-heart 3s ease-in-out infinite',
        'party-hearts': 'party-hearts 3s ease-out forwards',
      },
      keyframes: {
        'float-heart': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '1' },
          '50%': { transform: 'translateY(-20px)', opacity: '0.8' },
        },
        'party-hearts': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), -500px) scale(0)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
