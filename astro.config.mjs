import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://ronixx77.github.io",
  base: process.env.GITHUB_ACTIONS === "true" ? "/PortfolioForLiza" : "/",
  output: "static",
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
});
