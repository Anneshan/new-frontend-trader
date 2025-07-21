import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    // Disable HMR overlay to reduce buffering
    hmr: {
      overlay: false,
    },
    // Optimize file watching
    watch: {
      usePolling: false,
      interval: 1000,
    },
    // Reduce middleware overhead
    middlewareMode: false,
  },
  // Optimize build performance
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
    exclude: ['@supabase/supabase-js'],
  },
  // Reduce esbuild overhead
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
  },
  // Disable CSS source maps in development
  css: {
    devSourcemap: false,
  },
  // Reduce logging
  logLevel: 'info',
  clearScreen: false,
})