import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    root: ".",
    plugins: [react(), tailwindcss(), svgr()],
    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // HMR is disabled through DISABLE_HMR.
      // File watching is disabled to keep the local preview stable.
      hmr: false,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:5000",
          changeOrigin: true,
        },
      },
    },
    build: {
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-react";
            }
            if (id.includes("motion")) return "vendor-motion";
            if (id.includes("@pbe/react-yandex-maps")) return "vendor-yandex-maps";
            if (id.includes("jspdf")) return "vendor-pdf";
            if (id.includes("axios")) return "vendor-axios";
            if (id.includes("lucide-react")) return "vendor-icons";
          },
        },
      },
    },
  };
});
