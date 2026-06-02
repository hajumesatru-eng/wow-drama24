import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'hybrid', // Menggunakan mode Hybrid (kombinasi Statis & SSR)
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [sitemap()],
});