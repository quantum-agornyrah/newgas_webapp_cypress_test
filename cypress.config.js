import { defineConfig } from 'cypress';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        plugins: [
          vue(),
          AutoImport({
            imports: ['vue', 'pinia', 'vue-router'],
            dirs: ['./app/stores', './app/utils'],
          }),
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./app', import.meta.url)),
            '~': fileURLToPath(new URL('./app', import.meta.url)),
          },
        },
      },
    },
  },

  viewportWidth: 1280,
  viewportHeight: 900,
});