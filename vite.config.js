import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Enable CSS modules if needed for component-specific styles
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
    },
    // PostCSS plugins could be added here
    // postcss: {
    //   plugins: [/* plugins here */],
    // },
    // Optimize CSS for production
    devSourcemap: true,
  },
  build: {
    outDir: "dist",
    // Optimize CSS output in production
    cssCodeSplit: true,
    cssMinify: true,
    // Additional build optimizations
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        // Output configuration for better code splitting
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          utils: ["uuid", "ethers"],
        },
        // Ensure CSS is properly extracted
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
