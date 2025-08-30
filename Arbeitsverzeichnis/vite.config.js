import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    strictPort: false,
    port: Number(process.env.PORT || 5173),
    hmr: {
      clientPort: Number(process.env.GITPOD_WORKSPACE_URL ? 443 : (process.env.HMR_CLIENT_PORT || 5173)),
      host: process.env.CODESPACE_NAME ? `${process.env.CODESPACE_NAME}-5173.app.github.dev` : undefined,
      protocol: process.env.CODESPACE_NAME ? 'https' : undefined,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/posts': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/chat': {
        target: 'http://localhost:8787', // Dummy Backend (kann mit z.B. Cloudflare Worker/Express ersetzt werden)
        changeOrigin: true,
        secure: false
      }
    }
  }
}));
