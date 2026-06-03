import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel'; // Coba hapus "/serverless" di sini

export default defineConfig({
  output: 'server',
  adapter: vercel(),
});