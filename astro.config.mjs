import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wow-drama24.pages.dev',

  integrations: [
    sitemap()
  ]
});
