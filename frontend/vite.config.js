import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js)$/,
    }),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("@mui") ||
              id.includes("@emotion") ||
              id.includes("bootstrap") ||
              id.includes("mdb-react-ui-kit") ||
              id.includes("styled-components")
            ) {
              return "vendor-ui";
            }
            if (id.includes("highcharts") || id.includes("recharts")) {
              return "vendor-charts";
            }
            if (id.includes("jspdf") || id.includes("html2canvas") || id.includes("xlsx")) {
              return "vendor-docs";
            }
          }
        },
      },
    },
  },
});
