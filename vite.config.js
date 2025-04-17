import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Explicitly pass environment variables to Vite
      "import.meta.env.VITE_APP_URL": JSON.stringify(env.VITE_APP_URL),
    },
    server: {
      host: true,
      proxy: {},
      allowedHosts: [".ngrok-free.app", "localhost"],
    },
    css: {
      modules: {
        localsConvention: "camelCase",
        scopeBehaviour: "local",
      },
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
  };
});
