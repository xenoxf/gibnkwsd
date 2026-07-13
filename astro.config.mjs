import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://glenker.vercel.app',
  integrations: [sitemap()],
});
