import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/users_per_day": {///
        target: "http://198.177.124.16:9527/users_per_day",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/users_per_day/, ""),
      },
      "/new_transactions": {
        target: "http://198.177.124.16:9527/new_transactions",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/new_transactions/, ""),
      },
      "/amount_per_day": {
        target: "http://198.177.124.16:9527/amount_per_day",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/amount_per_day/, ""),
      },
    },
  },
});
