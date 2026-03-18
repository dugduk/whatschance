import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/megamillions': {
        target: 'https://www.megamillions.com',
        changeOrigin: true,
        rewrite: () => '/cmspages/utilservice.asmx/GetLatestDrawData',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'text/xml, application/xml, text/html'
        }
      },
      '/api/powerball': {
        target: 'https://www.calottery.com',
        changeOrigin: true,
        rewrite: () => '/api/DrawGameApi/DrawGamePastDrawResults/12/1/1',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json'
        }
      }
    }
  }
})
