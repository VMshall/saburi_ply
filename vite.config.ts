import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  /**
   * IMPORTANT:
   * App is served from ROOT (http://145.223.18.7/)
   * This MUST be "/" or assets will load incorrectly
   */
  base: "/",

  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "./index.html"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },

  build: {
    /**
     * Output directory used by Apache
     * /var/www/saburiply-client/dist/spa
     */
    outDir: "dist/spa",

    /**
     * Ensures correct MIME + ES module output
     */
    target: "es2019",
    sourcemap: false,
    minify: "esbuild",
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) {
              return "vendor-animations";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-ui";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            if (id.includes("react-select")) {
              return "vendor-select";
            }
            if (id.includes("yup") || id.includes("zod") || id.includes("react-hook-form")) {
              return "vendor-validation";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            if (id.includes("embla-carousel")) {
              return "vendor-carousel";
            }
            if (id.includes("lottie-react")) {
              return "vendor-lottie";
            }
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            if (id.includes("date-fns")) {
              return "vendor-date";
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
