import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this project at https://kurumi-studio.github.io/StudyLockWeb/
// so base must be "/StudyLockWeb/" (case-sensitive) for assets to resolve.
export default defineConfig({
  base: "/StudyLockWeb/",
  plugins: [react()],
  server: { port: 5173 },
});
