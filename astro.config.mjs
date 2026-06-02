import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static', // Astro 6 mengharuskan ini, tapi tetap mendukung SSR per halaman!
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [sitemap()],
});