import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Enable listneing on all local IPs
    host: true,
    proxy: {},
    // Allow any ngrok subdomain
    allowedHosts: [".ngrok-free.app", "localhost"],
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
    },
    // Optimize CSS for production
    devSourcemap: true,
  },
  build: {
    outDir: "dist",
    cssCodeSplit: true,
    cssMinify: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          utils: ["uuid", "ethers"],
        },
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
