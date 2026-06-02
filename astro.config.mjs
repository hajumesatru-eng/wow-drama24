import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    // Memaksa Astro untuk TIDAK membuat binding otomatis yang merusak validasi Cloudflare Pages
    platformProxy: {
      enabled: false
    }
  })
});