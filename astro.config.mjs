import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'; // Gunakan ini untuk SSR

export default defineConfig({
  output: 'server', // Wajib untuk SSR/Supabase
  adapter: vercel(),
 
  integrations: [sitemap()],
  site: 'https://wowdrama24.is-cool.dev', // Pastikan menggunakan domain Anda
});