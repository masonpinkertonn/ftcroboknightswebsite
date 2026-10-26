import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/",
  plugins: [react(), tailwindcss()],
  // Load the locally guarded model-viewer module instead of a stale prebundle.
  optimizeDeps: { exclude: ["@google/model-viewer"] },
});
