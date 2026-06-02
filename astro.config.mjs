import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough', // Matikan sistem Cloudflare Images otomatis
    runtime: {
      mode: 'complete',
      bindingNames: [] // Paksa Astro untuk TIDAK mendaftarkan KV atau binding gaib apa pun
    }
  })
});