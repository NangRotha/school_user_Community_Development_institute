// frontend-user/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
       '/api': {
         target: 'https://school-backend-community-development.onrender.com',
         changeOrigin: true,
       }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
})