import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  build: {
    target: 'esnext',
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [
        resolve(__dirname, 'frontend/index.html'),
        resolve(__dirname, 'frontend/femore.html'),
        resolve(__dirname, 'frontend/deduzione.html'),
        resolve(__dirname, 'frontend/template.html')
      ]
    }
  },
  server: {
    port: 3000
  }
})
