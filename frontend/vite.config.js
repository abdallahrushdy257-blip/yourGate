import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      {
        name: "treat-js-files-as-jsx",
        enforce: "pre",
        async transform(code, id) {
          if (!id.match(/src\/.*\.[jm]s$/)) return null;
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
            jsxDev: !isProd,
          });
        },
      },
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      force: true,
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
              if (
                id.includes("jspdf") ||
                id.includes("html2canvas") ||
                id.includes("xlsx")
              ) {
                return "vendor-docs";
              }
            }
          },
        },
      },
    },
  };
});
