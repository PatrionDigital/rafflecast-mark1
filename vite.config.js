import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Enable listneing on all local IPs
    host: true,
    proxy: {},
    // Allow any ngrok subdomain
    allowedHosts: [".ngrok-free.app", "localhost"],
  },
  css: {
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
        // Simple static asset names without custom logic
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
