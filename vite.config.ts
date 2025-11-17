import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    // Vite preview server automatically handles SPA routing
    port: 4173,
    allowedHosts: [
      'dashboard.thegreatlich.xyz',
      'localhost',
      '.localhost', // Allow all localhost subdomains
    ],
  },
})