import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mumblebackend-production-d137.up.railway.app",
        changeOrigin:true,
        secure: true, 
      },
    },
  },
});
