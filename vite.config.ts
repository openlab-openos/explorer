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
  build: {
    // 确保使用 Terser 进行压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
      },
    },
    // 配置代码拆分
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        globals: {
          buffer: 'Buffer',
        },
      }
    }
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/dataapi": {
        target: "http://198.177.124.16:9527/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dataapi/, ""),
      },
      // 其他代理配置
    },
  },
});
