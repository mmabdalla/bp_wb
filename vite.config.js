import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend'),
      '@editor': path.resolve(__dirname, './frontend/editor'),
      '@renderer': path.resolve(__dirname, './frontend/renderer'),
      '@components': path.resolve(__dirname, './frontend/components'),
      '@backend': path.resolve(__dirname, './backend'),
      '@api': path.resolve(__dirname, './backend/api'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'frontend/index.html'),
        renderer: path.resolve(__dirname, 'frontend/renderer/main.tsx'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'renderer' ? 'renderer.js' : '[name].js';
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
