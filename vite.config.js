import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages publishes this project beneath /birthday-3d-web/.
  // Local development remains available from http://localhost:5173/.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
