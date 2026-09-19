// Copies source-authored CSS to dist/. Library CSS ships as real files
// (never bundled into JS) so consumers import per-component stylesheets
// via subpath imports. JS entries must import no CSS.
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
mkdirSync(join(root, "dist"), { recursive: true });

const componentDirs = readdirSync(join(root, "src", "components"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join("src", "components", entry.name));

for (const dir of ["src/tokens", ...componentDirs]) {
  for (const file of readdirSync(join(root, dir))) {
    if (file.endsWith(".css")) {
      copyFileSync(join(root, dir, file), join(root, "dist", file));
    }
  }
}
