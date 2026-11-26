import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://liznovikova.art",
  output: "static",
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
});
