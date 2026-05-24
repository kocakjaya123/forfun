module.exports = {
  plugins: [
    // Use the official Tailwind PostCSS plugin so utilities are generated in dev
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
