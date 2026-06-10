import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // three.js is inherently large; keep the advisory quiet but still split it
    // into a long-cacheable vendor chunk separate from app code.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            'zustand',
          ],
        },
      },
    },
  },
})
