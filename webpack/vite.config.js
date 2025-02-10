import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // tailwindcss(),
    react()
  ],
  server: {
    port: 6001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  }
});