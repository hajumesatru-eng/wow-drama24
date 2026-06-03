import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server', 
  
  adapter: cloudflare({
    imageService: 'passthrough',
    
    // PERBAIKAN UTAMA: Cegah Astro membuat binding otomatis yang memicu error Cloudflare
    platformProxy: {
      enabled: false,
    },
    
    // Matikan pencarian otomatis KV Session bawaan agar tidak memicu error kv_namespaces[0]
    runtime: {
      mode: 'complete',
      binding: false,
    }
  }),
  
  integrations: [sitemap()],
  site: 'https://wowdrama24.is-cool.dev', // Pastikan menggunakan domain Anda
});