import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const usePreact = process.env.VITE_USE_PREACT === '1';
  return {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      ...(usePreact ? {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
        'react/jsx-dev-runtime': 'preact/jsx-runtime'
      }: {})
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id){
          if(id.includes('node_modules')){
            if(/react-router/.test(id)) return 'router';
            if(/react-dom\//.test(id)) return 'react-dom';
            if(/react(-dom)?(?!\/)/.test(id)) return 'react';
            if(/i18next|react-i18next/.test(id)) return 'i18n';
          }
          // BlogPost page heavy chunk separation
          if(id.includes('/src/pages/BlogPost')) return 'page-blogpost';
          // Shared large sections (v4) – optional grouping
          if(id.includes('/src/components/sections/v4')) return 'sections-v4';
          return undefined;
        }
      }
    },
    chunkSizeWarningLimit: 400
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
};
});
