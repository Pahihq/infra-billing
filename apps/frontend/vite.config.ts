import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // tsconfigPaths makes Vite honor the tsconfig `paths` aliases (@/* → src/*) at dev + build.
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the NestJS backend during local dev.
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
  },
});
