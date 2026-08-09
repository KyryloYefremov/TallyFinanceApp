import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@tally/domain": new URL("../packages/domain/src/index.ts", import.meta.url).pathname,
    },
  },
  server: {
    port: 5173,
  },
});

