import { defineConfig } from "tsdown";

export default defineConfig({
  // Explicit per-component keys per docs/research/npm-packaging.md §4.3:
  // each key controls its dist output name (button -> dist/button.js).
  entry: { index: "src/index.ts", button: "src/components/button/index.ts" },
  format: ["esm", "cjs"],
  dts: { build: true },
  deps: { neverBundle: ["react", "react-dom", /^@radix-ui\//] },
  outDir: "dist",
  clean: true,
  platform: "neutral",
  treeshake: true,
});
