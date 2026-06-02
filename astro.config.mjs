import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  // Paksa Astro untuk mematikan fitur session eksperimental/bawaan jika ada
  experimental: {
    session: false
  }
});