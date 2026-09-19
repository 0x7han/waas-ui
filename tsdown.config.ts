import { defineConfig } from "tsdown";

export default defineConfig({
  // Root barrel today; per-component keys follow the research sketch
  // ('button': 'src/components/button/index.ts', ...) or a glob entry
  // once src/components/* exists — see docs/research/npm-packaging.md §4.3.
  entry: ["src/index.ts", "src/components/*/index.ts"],
  format: ["esm", "cjs"],
  dts: { build: true },
  deps: { neverBundle: ["react", "react-dom", /^@radix-ui\//] },
  outDir: "dist",
  clean: true,
  platform: "neutral",
  treeshake: true,
});
