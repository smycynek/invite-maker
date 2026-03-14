import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  base: '/invite/',
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'es6',
  },
});
