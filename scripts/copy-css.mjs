// Copies source-authored CSS to dist/. Library CSS ships as real files
// (never bundled into JS) so consumers import per-component stylesheets
// via subpath imports. JS entries must import no CSS.
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
mkdirSync(join(root, "dist"), { recursive: true });

for (const file of readdirSync(join(root, "src", "tokens"))) {
  if (file.endsWith(".css")) {
    copyFileSync(join(root, "src", "tokens", file), join(root, "dist", file));
  }
}
