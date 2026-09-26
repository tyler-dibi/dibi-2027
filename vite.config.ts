import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { resolve } from "node:path";
import { playgroundApi } from "./scripts/vite-playground-api";

export default defineConfig({
  plugins: [
    react(),
    playgroundApi(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
      },
      overlay: { initialIsOpen: "error" },
    }),
  ],
  resolve: {
    alias: [
      // Carbon's fonts.css uses webpack-style "~" imports.
      { find: /^~@sage\/(.*)$/, replacement: resolve(import.meta.dirname, "node_modules/@sage/$1") },
      // Designers import from the documented `carbon-react/lib/...` paths; serve the ESM build.
      { find: /^carbon-react\/lib\/(.*)$/, replacement: "carbon-react/esm/$1" },
    ],
  },
  server: {
    port: 5173,
  },
  build: {
    // The catalogue renders every Carbon component, so a single large bundle is expected.
    chunkSizeWarningLimit: 2500,
  },
  define: {
    // Set by Cloudflare Pages when it builds a branch. Empty for local builds.
    "import.meta.env.VITE_PUBLISHED_BRANCH": JSON.stringify(process.env.CF_PAGES_BRANCH ?? ""),
  },
});
