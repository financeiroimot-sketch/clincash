import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      page: "/src/pages",
      utils: "/src/utils",
      assets: "/src/assets",
      components: "/src/components",
      services: "/src/services",
    }
  }
});
