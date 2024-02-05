import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "path";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        background: "src/background.ts",
        popup: "index.html",
      },
    },
    assetsDir: "",
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
