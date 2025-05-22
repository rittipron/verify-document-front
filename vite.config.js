// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@pages': '/src/pages',
      '@components': '/src/components',
      '@redux' : '/src/redux',
      '@services' : '/src/services',
      '@assets': '/src/assets',
      '@utils': '/src/utils',
      '@data': '/src/data',
    },
  },
});
