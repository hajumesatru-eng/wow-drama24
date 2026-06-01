import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://wow-drama24.pages.dev",
  output: "server",
  adapter: cloudflare(),
  integrations: [sitemap()]
});