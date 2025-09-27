import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7264', // cổng API từ Swagger
        changeOrigin: true,
        secure: false,
        // /api/WeatherForecast  -->  /WeatherForecast
      }
    }
  }
})
