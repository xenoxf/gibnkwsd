import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://glenker.vercel.app',
  vite: {
    css: {
      devSourcemap: true,
    },
  },
});
