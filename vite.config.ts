import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr'
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), svgr()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    // Настройка для яндекс карт
    optimizeDeps: {
      include: ['@pbe/react-yandex-maps'],
    },
    build: {
      commonjsOptions: {
        include: [/@pbe\/react-yandex-maps/, /node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'yandex-maps': ['@pbe/react-yandex-maps'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@pbe/react-yandex-maps'],
    },
  };
});