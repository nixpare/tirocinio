import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  root: 'frontend',
  build: {
    rollupOptions: {
      input: [
        resolve(__dirname, 'frontend/index.html'),
        resolve(__dirname, 'frontend/coccige.html'),
        resolve(__dirname, 'frontend/atlante.html'),
        resolve(__dirname, 'frontend/femore.html'),
        resolve(__dirname, 'frontend/deduzione.html')
      ]
    }
  },
  server: {
    port: 3000
  }
})
