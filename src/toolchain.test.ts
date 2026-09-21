import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { WAAS_UI_VERSION } from "./index";

const root = join(dirname(new URL(import.meta.url).pathname), "..");

function readJson(path: string): Record<string, unknown> {
  const text = readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(text) as Record<string, unknown>;
}

const pkgJson = readJson(`${root}/package.json`);
const pkgVersion = typeof pkgJson["version"] === "string" ? pkgJson["version"] : "";

describe("render harness", () => {
  it("renders library output through Testing Library", () => {
    render(createElement("output", { "aria-label": "version" }, WAAS_UI_VERSION));
    expect(screen.getByLabelText("version").textContent).toBe(pkgVersion);
  });
});


function run(cmd: string, args: string[]): string {
  return execFileSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 300000,
    env: { ...process.env, PATH: `${join(root, "node_modules", ".bin")}:${process.env.PATH ?? ""}` },
  });
}

describe("toolchain", () => {
  it("enforces strict TypeScript on library sources", () => {
    const tsconfig = readJson(`${root}/tsconfig.app.json`);
    const options = tsconfig.compilerOptions as Record<string, unknown>;
    expect(options.strict).toBe(true);
    expect(options.noUncheckedIndexedAccess).toBe(true);
    run("npx", ["tsc", "-b"]);
  });

  it("builds dual ESM+CJS with types via tsdown", () => {
    run("npm", ["run", "build"]);
    for (const file of ["dist/index.js", "dist/index.cjs", "dist/index.d.ts"]) {
      expect(existsSync(`${root}/${file}`), file).toBe(true);
    }
    const pkg = readJson(`${root}/package.json`);
    const exports = pkg.exports as Record<string, unknown>;
    expect(exports["."]).toBeTruthy();
  });

  it("passes pack gates: publint and attw on the packed tarball", () => {
    run("npm", ["run", "build"]);
    // --ignore-scripts: pack would otherwise re-run `prepare` (npm run build)
    // and its tsdown log lines would pollute the --json stdout.
    const packOut = run("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"]);
    const entry = JSON.parse(packOut) as Record<string, { files: { path: string }[] }>;
    const first = Object.values(entry)[0];
    const paths = first?.files.map((f) => f.path) ?? [];
    for (const p of paths) {
      expect(
        p === "package.json" || p === "README.md" || p.startsWith("dist/"),
        p,
      ).toBe(true);
    }
    expect(paths).toContain("dist/index.js");
    expect(paths).toContain("dist/index.cjs");
    expect(paths).toContain("dist/index.d.ts");
    expect(paths).toContain("dist/index.d.cts");
    run("npx", ["publint"]);
    run("npx", ["attw", "--pack", ".", "--profile", "node16", "--entrypoints", ".", "./button", "./form", "./selection", "./navigation", "./overlay", "./data"]);
  });

  it("imports the packed tarball entry from Node", () => {
    run("npm", ["run", "build"]);
    const tarball = run("npm", ["pack", "--silent"]).trim().split("\n").pop() ?? "";
    expect(tarball.endsWith(".tgz")).toBe(true);
    try {
      const probeDir = `${root}/node_modules/.tmp/pack-probe`;
      run("mkdir", ["-p", probeDir]);
      run("tar", ["-xzf", `${root}/${tarball}`, "-C", probeDir]);
      run("ln", ["-sfn", `${root}/node_modules`, `${probeDir}/node_modules`]);
      const esm = run("node", [
        "--input-type=module",
        "-e",
        `import { WAAS_UI_VERSION } from ${JSON.stringify(`${probeDir}/package/dist/index.js`)}; if (WAAS_UI_VERSION !== ${JSON.stringify(pkgVersion)}) throw new Error("bad version");`,
      ]);
      expect(typeof esm).toBe("string");
      const cjs = run("node", [
        "-e",
        `const m = require(${JSON.stringify(`${probeDir}/package/dist/index.cjs`)}); if (m.WAAS_UI_VERSION !== ${JSON.stringify(pkgVersion)}) throw new Error("bad version");`,
      ]);
      expect(typeof cjs).toBe("string");
    } finally {
      run("rm", ["-rf", `${root}/node_modules/.tmp/pack-probe`, tarball]);
    }
  });
});
