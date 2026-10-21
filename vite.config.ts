import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), "backend"), "PORT");
  const webEnv = loadEnv(mode, process.cwd(), "WEB_PORT");
  const apiPort = process.env.PORT || env.PORT || "8787";
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: Number(process.env.WEB_PORT || webEnv.WEB_PORT || 3000),
      proxy: {
        "/api": `http://127.0.0.1:${apiPort}`,
      },
    },
  };
});
