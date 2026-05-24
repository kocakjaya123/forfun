import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative asset paths so built `dist/index.html` works when opened directly
  base: './',
  plugins: [react()],
})
