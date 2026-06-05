import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap'; // Import sitemap

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://wowdrama24.is-cool.dev', // PENTING: Tambahkan URL ini
  integrations: [sitemap()], // Tambahkan ke daftar integrasi
});