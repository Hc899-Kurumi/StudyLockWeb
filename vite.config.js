import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves a project site at https://<user>.github.io/<repo>/,
// so `base` must be "/<repo>/". CHANGE THIS to match your repository name.
// If you deploy to a user/org page (<user>.github.io) or a custom domain,
// set base to "/".
export default defineConfig({
  base: "/StudyLockWeb/",
  plugins: [react()],
  server: { port: 5173 },
});
