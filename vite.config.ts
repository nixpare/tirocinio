import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true
  }
})
