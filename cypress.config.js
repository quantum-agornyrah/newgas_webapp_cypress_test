import { defineConfig } from 'cypress';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
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
            dirs: ['./app/stores'],
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
    indexHtmlFile: 'cypress/support/component-index.html',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
});