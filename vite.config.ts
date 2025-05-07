import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import styleTmport from 'vite-plugin-style-import';
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    nodePolyfills({
      // 包含你需要的 polyfills
      include: ['buffer'], // 可以根据需要添加更多模块
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
      },
    },
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
      },
    },
    commonjsOptions: {
      requireReturnsDefault: 'namespace'
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
      "/airdrop": {
        target: "http://109.123.230.163:8099/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/airdrop/, ""),
      },
    },
  },
});