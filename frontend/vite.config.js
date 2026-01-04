import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // puerto local de desarrollo
    proxy: {
      // Proxy para llamadas al backend
      "/api": {
        target: "http://backend:3000", // nombre del servicio en docker-compose
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
