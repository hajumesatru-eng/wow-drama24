import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Ubah output ke 'server' agar Astro tahu ini adalah aplikasi SSR (Dynamic) penuh
  output: 'server', 
  
  adapter: cloudflare({
    imageService: 'passthrough',
    // Kita matikan opsi bawaan platform proxy jika tidak digunakan untuk menghindari konflik ASSETS
    platformProxy: {
      enabled: false,
    }
  }),
  integrations: [sitemap()],
  
  // Tambahkan site URL agar integrasi sitemap Anda tidak lagi memunculkan peringatan [WARN] saat build
  site: 'https://wow-drama24.pages.dev', 
});