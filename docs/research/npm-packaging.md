# NPM packaging: single package + subpath exports — research (ticket #4)

Scope: ticket #4 of the wayfinder map (#1). Recommends how to ship `waas-ui` as **one NPM package with subpath exports** inside the current single-package repo. No production code changes; this file only.
Fixed session decisions this builds on: Vanilla CSS + CSS variables; build on Radix primitives; compound components; single NPM package with subpath exports; single-package layout (no `packages/`); consumer-provided icon slots; MVP core ~25 components, DataTable deferred.
Reference versions observed 2026-09-19 via the NPM registry: `@radix-ui/react-dialog@1.1.23`, `@radix-ui/react-slot@1.3.3`, `radix-ui@1.6.7`, `@ark-ui/react@5.39.2`, `@base-ui-components/react@1.0.0-rc.0`, `@floating-ui/react@0.27.20`, `react@19.3.0`, `react-dom@19.3.0`, `tsdown@0.23.0`, `tsup@8.5.1`, `tailwind-merge@3.7.0`, `class-variance-authority@0.7.1`, `clsx@2.1.1`.

## 1. Recommended `exports` map (root + per-component subpaths)

### 1.1 Why `exports` is the mechanism

- In a package's `package.json`, the `main` and `exports` fields define entry points, and when `exports` is defined it takes precedence over `main` in supported Node versions ([Node.js — Package entry points](https://nodejs.org/api/packages.html#package-entry-points)).
- Once `exports` is defined, **all subpaths not listed are encapsulated** — `require('pkg/subpath.js')` throws `ERR_PACKAGE_PATH_NOT_EXPORTED` ([Node.js — Package entry points](https://nodejs.org/api/packages.html#package-entry-points)). Introducing `exports` later is therefore potentially breaking; every previously supported entry point must be listed ([Node.js — Package entry points](https://nodejs.org/api/packages.html#package-entry-points)).
- Keep legacy `main`/`module`/`types` pointers alongside `exports` for old tooling: the Vite library-mode docs explicitly recommend shipping `main` + `module` + `exports` together ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)).
- Always expose `./package.json` (`"./package.json": "./package.json"`): the `radix-ui@1.6.7` meta-package does exactly this, and tooling increasingly resolves it ([registry manifest for `radix-ui@1.6.7`](https://www.npmjs.com/package/radix-ui)).

### 1.2 Recommended shape: explicit root + explicit per-component subpaths

Prefer **explicit per-component entries** over one wildcard pattern for an MVP of ~25 components: Node.js itself recommends explicitly listing each subpath for packages with a small number of exports, reserving `*` patterns for large subpath counts ([Node.js — Subpath patterns](https://nodejs.org/api/packages.html#subpath-patterns)). Explicit entries give a stable public contract, better completions, and make it obvious when a deep import is (not) public. The `radix-ui` meta-package demonstrates the hybrid upper bound — `"."` plus a `"./*"` pattern plus `"./package.json"` ([registry manifest for `radix-ui@1.6.7`](https://www.npmjs.com/package/radix-ui)) — while `@base-ui-components/react` ships fully explicit per-component entries (`./button`, `./dialog`, … each with `esm/` + CJS variants) ([registry manifest for `@base-ui-components/react@1.0.0-rc.0`](https://www.npmjs.com/package/@base-ui-components/react)).

Sketch for `waas-ui` (dual ESM+CJS, `"type": "module"` — so ESM files are `.js`, CJS files are `.cjs`; see §4):

```json
{
  "name": "waas-ui",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist", "README.md"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": ["*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./button": {
      "types": "./dist/button.d.ts",
      "import": "./dist/button.js",
      "require": "./dist/button.cjs"
    },
    "./dialog": {
      "types": "./dist/dialog.d.ts",
      "import": "./dist/dialog.js",
      "require": "./dist/dialog.cjs"
    },
    "./theme.css": "./dist/theme.css",
    "./button/style.css": "./dist/button.css",
    "./package.json": "./package.json"
  }
}
```

Notes, each grounded:

- **Condition order matters: `types` first.** Every Radix published package nests `types` inside the `import`/`require` conditions (`"import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" }`) ([registry manifest for `@radix-ui/react-dialog@1.1.23`](https://www.npmjs.com/package/@radix-ui/react-dialog)); `tailwind-merge` likewise puts `"types"` first in each condition ([registry manifest for `tailwind-merge@3.7.0`](https://www.npmjs.com/package/tailwind-merge)); `clsx` uses the nested `import.types` / `default.types` form ([registry manifest for `clsx@2.1.1`](https://www.npmjs.com/package/clsx)). Follow the Radix/tailwind-merge ordering (`types`, `import`, `require`/`default`).
- **Extensioned vs extensionless subpaths.** Node advises exposing exactly one specifier style per module so all dependents import the same specifier ([Node.js — Extensions in subpaths](https://nodejs.org/api/packages.html#extensions-in-subpaths)). Use **extensionless** component subpaths (`waas-ui/button`, mirroring `@base-ui-components/react`'s `./button` style ([registry manifest for `@base-ui-components/react@1.0.0-rc.0`](https://www.npmjs.com/package/@base-ui-components/react))) and **extensioned** CSS subpaths (`waas-ui/button/style.css`, mirroring Vite's documented `"./style.css"` export ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode))).
- **Export targets must be relative URLs starting with `./` and must not traverse outside the package root** (no `../`, no bare `/`, no `.`/`..`/`node_modules` segments) ([Node.js — Path rules for export targets](https://nodejs.org/api/packages.html#path-rules-and-validation-for-export-targets)). All targets in the sketch satisfy this.
- **CSS subpaths need no `import`/`require` conditions** — plain string targets (`"./theme.css": "./dist/theme.css"`) are valid `exports` sugar, and Vite's own recommended `package.json` shows exactly this form ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)).
- **`.js`/`.cjs`/`.mjs` loading rules are fixed by Node, not by us:** `.mjs` is always ESM and `.cjs` is always CJS regardless of the nearest `type` field ([Node.js — `package.json` and file extensions](https://nodejs.org/api/packages.html#packagejson-and-file-extensions)). With `"type": "module"`, Vite generates `.js` (ESM) + `.cjs` (CJS) and warns that without `"type": "module"` the extensions flip to `.mjs`/`.js` ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)). Keep `"type": "module"` (the repo already has it — see `package.json` in the working tree) so `.js` output is ESM by definition ([Node.js — Determining module system](https://nodejs.org/api/packages.html#determining-module-system)).

### 1.3 What NOT to copy from the references

- `@ark-ui/react`'s registry `exports` points at `./src/*.ts` source files (e.g. `".": "./src/index.ts"`, `"./*": "./src/components/*/index.ts"`) ([registry manifest for `@ark-ui/react@5.39.2`](https://www.npmjs.com/package/@ark-ui/react)). That is its **pre-`clean-package`** source state — its scripts run `prepack: clean-package` / `postpack: clean-package restore` ([registry manifest for `@ark-ui/react@5.39.2`](https://www.npmjs.com/package/@ark-ui/react)) — i.e. the published tarball's `package.json` is rewritten at pack time. Do not ship `src/*.ts` targets directly; ship `dist/` targets (cf. `files: ["dist"]` convention recommended by Vite ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)) and used by Radix via `"files": ["dist", "README.md"]` ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json))).

## 2. CSS import strategy (global theme + per-component files)

Session decision: Vanilla CSS + CSS variables. Consequence: CSS ships as **real `.css` files**, not CSS-in-JS.

### 2.1 Recommendation

- **One global theme file** — `waas-ui/theme.css` (design tokens + theme variables; the file the tokens/theme tickets define). Consumers import it once.
- **One CSS file per styled component** — `waas-ui/button/style.css`, mirroring the JS subpath (`./button` ↔ `./button/style.css`), so a consumer who deep-imports `waas-ui/button` only pulls `button.css` + `theme.css`.
- **Never bundle all CSS into the JS barrel.** Vite library mode bundles imported CSS into a single `dist/my-lib.css` beside the JS and exposes it as one `"./style.css"` export ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)). That single-file output is correct for a single-entry demo lib but defeats per-component CSS granularity for a 25-component set.
- **Ship CSS as source-authored files** (copied to `dist/`, e.g. `dist/theme.css`, `dist/button.css`), not as tsdown-bundled output: tsdown's CSS support is explicitly **experimental** ("covers the core use cases, the API and behavior may change"; install `@tsdown/css` to enable) ([tsdown — CSS Support](https://tsdown.dev/options/css)). Relying on an experimental bundler path for the theming contract (the core of this library) is the wrong risk; plain files + `exports` entries are stable Node semantics ([Node.js — Subpath exports](https://nodejs.org/api/packages.html#subpath-exports)).
- **Do not `@import` component CSS from the JS root barrel.** Any JS module that imports a `.css` file becomes side-effectful, which interacts with `sideEffects` flagging (§3). Keep the rule: JS entries import no CSS; CSS is consumed via its own subpath imports. (That CSS files are side-effectful and need declaring is exactly what the `sideEffects` array form is for ([webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/)).)

### 2.2 `sideEffects` interaction for CSS

- With `"sideEffects": false`, bundlers may drop unreferenced modules entirely; files with real side effects (CSS) must be allow-listed in array form, e.g. `"sideEffects": ["./src/some-side-effectful-file.js"]` ([webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/)).
- Glob patterns without a `/` (like `*.css`) are treated as `**/*.css` ([webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/)), so `"sideEffects": ["*.css"]` covers `dist/**/*.css` regardless of depth. Radix sets the stricter `"sideEffects": false` with zero CSS shipped ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json)); because waas-ui ships CSS, use the array form with the `*.css` glob.

## 3. Tree-shakeability setup

### 3.1 The three mechanisms (and which does what)

1. **Pure ESM output** — tree-shaking fundamentally relies on the static structure of `import`/`export` ([webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/)). Ship ESM (`.js` under `"type": "module"`) as the primary `import` condition; every reference package does (`./dist/index.mjs` for Radix ([registry manifest for `@radix-ui/react-dialog@1.1.23`](https://www.npmjs.com/package/@radix-ui/react-dialog)), `./esm/*` for Base UI ([registry manifest for `@base-ui-components/react@1.0.0-rc.0`](https://www.npmjs.com/package/@base-ui-components/react)), `./dist/bundle-mjs.mjs` for tailwind-merge ([registry manifest for `tailwind-merge@3.7.0`](https://www.npmjs.com/package/tailwind-merge))).
2. **`"sideEffects": ["*.css"]`** — the module-level flag. `sideEffects: false` lets the bundler skip whole modules/subtrees when no direct export is used; `usedExports`+minifier analysis alone cannot reliably do this (dynamic-language problem: HOC calls like `withAppProvider()(Button)` cannot be proven pure) ([webpack — Clarifying tree shaking and `sideEffects`](https://webpack.js.org/guides/tree-shaking/#clarifying-tree-shaking-and-sideeffects)). waas-ui needs the array form (not bare `false`) because of shipped CSS (§2.2, ([webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/))).
3. **`/*#__PURE__*/` annotations on HOC/factory calls** — where a module must call a higher-order wrapper at definition time, annotate the call so minifiers can drop it when the export is unused (the webpack docs' own Button/HOC example: `const Button$1 = /* #__PURE__ */ withAppProvider()(Button)`) ([webpack — Clarifying tree shaking and `sideEffects`](https://webpack.js.org/guides/tree-shaking/#clarifying-tree-shaking-and-sideeffects)). Compound-component files built on Radix primitives plus local wrappers are exactly this shape; annotate wrapper invocations.

### 3.2 Barrel pitfalls and the per-component rule

- The root `"."` entry will necessarily be a barrel re-exporting all ~25 components. That is fine **only if** (a) every re-exported module is side-effect-free (guaranteed by §2's no-CSS-in-JS rule + `sideEffects` flag), and (b) docs steer performance-sensitive consumers to deep imports (`waas-ui/button`), which resolve to physically separate chunk files via the `exports` map (§1.2) — the same reason Base UI ships one entry per component ([registry manifest for `@base-ui-components/react@1.0.0-rc.0`](https://www.npmjs.com/package/@base-ui-components/react)).
- Keep per-component modules self-contained: `src/components/button/index.ts` re-exports only button files; shared code lives in `src/utils/` / `src/hooks/` and is imported, never duplicated (shared-module duplication across entries is the classic multi-entry treeshaking leak; the build tool's chunk-splitting handles shared imports — tsdown/rolldown code-splitting is the mechanism, cf. entry docs ([tsdown — Entry](https://tsdown.dev/options/entry))).
- Verify with `@arethetypeswrong/cli` + `publint` in CI (§7): tsdown itself lists `publint` and `@arethetypeswrong/core` among its peer dependencies ([registry manifest for `tsdown@0.23.0`](https://www.npmjs.com/package/tsdown)), i.e. the ecosystem's current bundler treats both as standard release checks.

## 4. Build-tool recommendation: **tsdown**

### 4.1 Decision

Use **tsdown** (`entry` = per-component glob + root barrel, `dts: true`, dual `esm`+`cjs` formats, `react`/`react-dom`/Radix externals). Run it on Node 22+ in CI (constraint below).

### 4.2 Why not the alternatives

| Tool | Verdict | Grounds |
|---|---|---|
| **tsup** | Reject | Upstream-deprecated: the README opens with "This project is not actively maintained anymore. Please consider using tsdown instead" with a migration guide pointer ([tsup README](https://raw.githubusercontent.com/egoist/tsup/master/README.md)). `tsup@8.5.1` still depends on Rollup 4 + esbuild ([registry manifest for `tsup@8.5.1`](https://www.npmjs.com/package/tsup)). Adopting a deprecated bundler for a new library is indefensible. |
| **tsc only** | Reject as primary | Radix per-package builds shell out to a custom `radix-build` script ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json)) and the `radix-ui` meta-package compiles with two `tsc` passes (`build:cjs` CommonJS-to-`dist/cjs`, `build:esm` plain `tsc`) ([registry manifest for `radix-ui@1.6.7`](https://www.npmjs.com/package/radix-ui)). That works for Radix's one-file-per-package layout but gives no chunk-splitting, no multi-entry orchestration, and slow `.d.ts` for 25 entries. tsdown generates + bundles `.d.ts` via `rolldown-plugin-dts` automatically ([tsdown — Declaration Files](https://tsdown.dev/options/dts)). |
| **Vite library mode** | Viable fallback, not first choice | First-class multi-entry support (`build.lib.entry` as object map) with the exact `exports`-map `package.json` this ticket recommends ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)). But: formats are entry-count-dependent (`es`+`umd` single-entry vs `es`+`cjs` multi-entry), CSS collapses to one file (§2.1), and `.d.ts` needs a separate plugin path. tsdown covers entries + dts + externals in one config. |
| **tsdown** | **Recommend** | Successor blessed by tsup's own README ([tsup README](https://raw.githubusercontent.com/egoist/tsup/master/README.md)); multi-entry via string/array/object/glob including negation and per-key output mapping (`'lib/*': 'src/*.ts'`) ([tsdown — Entry](https://tsdown.dev/options/entry)); `.d.ts` auto-enabled when `types`/`exports.types` is present, with an `isolatedDeclarations` fast path via oxc-transform ([tsdown — Declaration Files](https://tsdown.dev/options/dts)); TypeScript `^5 \|\| ^6 \|\| ^7` peer range already covers the repo's TS ~6.0.2 ([registry manifest for `tsdown@0.23.0`](https://www.npmjs.com/package/tsdown)). |

### 4.3 Config sketch (illustrative, not committed code)

```ts
// tsdown.config.ts (illustrative)
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'button': 'src/components/button/index.ts',
    // …one key per component; or a glob entry per https://tsdown.dev/options/entry
  },
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom', /^@radix-ui\//],
  outDir: 'dist',
});
```

- `entry` object form maps alias → file and controls output names (`main: src/index.ts` → `dist/main.js`) ([tsdown — Entry](https://tsdown.dev/options/entry)); glob + negation forms exist for scaling to 25 components ([tsdown — Entry](https://tsdown.dev/options/entry)).
- `dts: true` can be omitted once `exports.*.types` exists (auto-enable) but keeping it explicit is harmless ([tsdown — Declaration Files](https://tsdown.dev/options/dts)). For speed, enable `isolatedDeclarations` in `tsconfig` so dts generation uses oxc-transform instead of the slower `tsc` fallback ([tsdown — Declaration Files](https://tsdown.dev/options/dts); flag definition ([TSConfig — `isolatedDeclarations`](https://www.typescriptlang.org/tsconfig/isolatedDeclarations.html)).
- `external` must include `react` (and `react-dom`, Radix) — the exact rule Vite states for library mode ("make sure to also externalize any dependencies that you do not want to bundle, e.g. `vue` or `react`") ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)) applies identically to tsdown.
- **CI constraint:** tsdown 0.23 requires Node `^22.18.0 || ^24.11.0 || >=26.0.0` **to run** (build-time only; output `target` still covers old runtimes — build on 22+, test the tarball on lower versions) ([tsdown — Getting Started](https://tsdown.dev/guide/getting-started)). Pin CI accordingly; odd releases (23/25) unsupported ([tsdown — Getting Started](https://tsdown.dev/guide/getting-started)).

## 5. `peerDependencies` + supported ranges

### 5.1 Recommendation

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "@types/react": { "optional": true },
    "@types/react-dom": { "optional": true }
  }
}
```

Plus: `@radix-ui/*` primitives as **regular `dependencies`** (pinned), not peers. `typescript` stays a `devDependency` only.

### 5.2 Grounds

- **React range.** Three live practices: Radix peers `react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc` (and same for `react-dom`) ([registry manifest for `@radix-ui/react-dialog@1.1.23`](https://www.npmjs.com/package/@radix-ui/react-dialog)); Base UI peers `react: ^17 || ^18 || ^19` (+ `react-dom`, + `@types/react`) ([registry manifest for `@base-ui-components/react@1.0.0-rc.0`](https://www.npmjs.com/package/@base-ui-components/react)); Floating UI peers `react/react-dom: >=17.0.0` ([registry manifest for `@floating-ui/react@0.27.20`](https://www.npmjs.com/package/@floating-ui/react)). The repo already runs React 19 (`react`/`react-dom ^19.2.8` in working-tree `package.json`; Radix's own devDeps likewise pin `^19.2.8` ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json))). `^18 || ^19` covers the two majors that matter for a new 2026 library without promising 16/17 compat we won't test; widen to `^17 || ^18 || ^19` (Base UI form) only if CI actually matrix-tests 17.
- **`react-dom` must be peered too** — Radix, Base UI, and Floating UI all peer both `react` and `react-dom` (citations above); omitting `react-dom` risks duplicate-instance bugs in dialog/portal-style components.
- **`@types/react` as optional peer** — copy Radix exactly: `@types/react: *` + `@types/react-dom: *` in `peerDependencies` with `"optional": true` in `peerDependenciesMeta` ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json)). This gives TS consumers types without forcing the dep on JS consumers.
- **`@radix-ui/*` as regular dependencies** — Radix's own packages list sibling primitives (`@radix-ui/react-slot`, `-context`, `-primitive`, …) under `dependencies` (workspace-pinned), never peers ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json); published form shows pinned versions like `"@radix-ui/react-slot": "1.3.3"` ([registry manifest for `@radix-ui/react-dialog@1.1.23`](https://www.npmjs.com/package/@radix-ui/react-dialog))). waas-ui wraps specific Radix primitives per component; pinning them as deps (not peers) avoids version-negotiation burden on consumers and matches upstream practice.
- **TypeScript.** The repo pins `typescript ~6.0.2` (working-tree `package.json`); tsdown 0.23 peers `typescript ^5.0.0 || ^6.0.0 || ^7.0.0` ([registry manifest for `tsdown@0.23.0`](https://www.npmjs.com/package/tsdown)), so the TS6 toolchain is already supported by the recommended builder. Ship no `typescript` peer — types ship as prebuilt `.d.ts` ([tsdown — Declaration Files](https://tsdown.dev/options/dts)).
- **react-compiler note (repo context, not a peer):** the working tree uses `@vitejs/plugin-react` + `babel-plugin-react-compiler` (see `vite.config.ts`, `package.json`). That is app-demo compile tooling; library output must not require it — keep it in devDeps, consistent with Radix keeping build/test tooling (`@repo/builder`, `vitest`, `vite`) in devDeps ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json)).

## 6. `src` layout inside the single-package repo

Single-package layout (no `packages/` — session decision). Proposed tree:

```
src/
  index.ts                 # root barrel: tokens, theme, all components, hooks, utils (public)
  tokens/
    index.ts               # re-export tokens.css + token types (ticket #2 owns contents)
    tokens.css             # CSS variables (shipped → dist/tokens.css)
    tokens.types.ts
  theme/
    index.ts
    theme.css              # shipped → dist/theme.css (the "./theme.css" subpath)
  components/
    button/
      index.ts             # public entry → dist/button.js (package subpath ./button)
      button.tsx           # Root + subcomponents (compound pattern)
      button.css           # shipped → dist/button.css ("./button/style.css")
      button.types.ts
    dialog/
      index.ts
      dialog.tsx
      dialog.css
      dialog.types.ts
    …                      # one dir per component, identical shape
  hooks/
    index.ts               # public entry (optional "./hooks" subpath)
    use-*.ts
  utils/
    index.ts               # public entry (optional "./utils" subpath); clsx/tailwind-merge-class helpers
    cn.ts
  internal/
    …                      # NOT exported: shared unstyled logic; no exports-map entry
```

Grounds and conventions:

- One `index.ts` per publishable unit mirrors Radix, where each package's published entry compiles from `./src/index.ts` (`"source": "./src/index.ts"`, pre-publish `"main"/"module": "./src/index.ts"`, rewritten to `dist/` on publish via `publishConfig`) ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json)). waas-ui generalises this: one `src/<unit>/index.ts` per `exports` subpath.
- The `src/components/*/index.ts` grouping mirrors Ark UI's `src/components/*/index.ts` convention (visible in its source-state exports map `"./*": "./src/components/*/index.ts"`) ([registry manifest for `@ark-ui/react@5.39.2`](https://www.npmjs.com/package/@ark-ui/react)) — adopted as a *layout* convention only, with dist (not src) targets (§1.3).
- `tokens/`, `theme/`, `hooks/`, `utils/` as named in the ticket map 1:1 to directories so each can gain an exports subpath later without moving files (adding `exports` entries later is safe; *removing*/renaming published subpaths breaks consumers per the encapsulation rule ([Node.js — Package entry points](https://nodejs.org/api/packages.html#package-entry-points)) — so stabilise these five top-level names now).
- `internal/` stays off the exports map entirely: unlisted subpaths are unreachable via the package name ([Node.js — Subpath exports](https://nodejs.org/api/packages.html#subpath-exports)), giving a hard privacy boundary for shared helpers.
- Co-locating `*.css` next to its component (rather than one `styles/` dir) keeps the `./button` ↔ `./button/style.css` pairing mechanical at build/pack time; shadcn is deliberately **not** a layout reference here — it is an open-code distribution system (CLI + flat-file schema), "not a component library … you install from NPM" ([shadcn — Introduction](https://ui.shadcn.com/docs)) — so its copy-paste model does not apply to a versioned NPM package.

## 7. Publish validation checklist (CI)

1. `npm pack --dry-run` — assert only `dist/**`, `README.md`, `package.json` ship (`files: ["dist", …]` per Vite's recommendation ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)) / Radix's `["dist", "README.md"]` ([Radix dialog `package.json` source](https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json))).
2. `publint` — lints the packed tarball for cross-environment compat (its stated purpose: "Lint npm packages to ensure the widest compatibility across environments" ([publint](https://publint.dev/))). Precedent: tsdown peers `publint@^0.3.8` ([registry manifest for `tsdown@0.23.0`](https://www.npmjs.com/package/tsdown)).
3. `attw` (`@arethetypeswrong/cli`) — checks the `exports`→types resolution matrix that §1.2's condition ordering must satisfy (the tool's purpose: "analyzing TypeScript types of npm packages" ([Are The Types Wrong?](https://arethetypeswrong.github.io/))). Precedent: tsdown peers `@arethetypeswrong/core@^0.18.1` ([registry manifest for `tsdown@0.23.0`](https://www.npmjs.com/package/tsdown)).
4. Install-and-import smoke test on Node 18/20/22 against the packed tarball (mirrors tsdown's own guidance to build on 22+ but test output on lower versions ([tsdown — Getting Started](https://tsdown.dev/guide/getting-started))): `import 'waas-ui'`, `import 'waas-ui/button'`, `require('waas-ui')`, `require('waas-ui/button')`, plus `import 'waas-ui/theme.css'` under a bundler fixture.

## 8. Non-goals / deferred

- UMD build: Vite emits `es`+`umd` for single-entry libs ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)) but UMD is irrelevant for a React component set consumed via bundlers; ship ESM+CJS only (multi-entry convention per Vite ([Vite — Library Mode](https://vite.dev/guide/build.html#library-mode)) and Base UI's esm+CJS split ([registry manifest for `@base-ui-components/react@1.0.0-rc.0`](https://www.npmjs.com/package/@base-ui-components/react))).
- `exports` wildcard `"./*"` pattern: deferred until the component count makes explicit entries unwieldy (Node's own small-vs-large guidance ([Node.js — Subpath patterns](https://nodejs.org/api/packages.html#subpath-patterns)); the `radix-ui` meta-package shows the end-state ([registry manifest for `radix-ui@1.6.7`](https://www.npmjs.com/package/radix-ui))).
- Icon system: consumer-provided slots (session decision) — no icon files shipped, hence no icon subpaths.

## Sources (primary only)

- Node.js docs — Modules: Packages (entry points, `exports` sugar, subpath exports/patterns, dual CJS/ESM, file extensions, path rules): https://nodejs.org/api/packages.html
- NPM docs — `package.json` handling: https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
- Vite docs — Building for Production / Library Mode (+ `build.lib` options): https://vite.dev/guide/build.html
- tsdown docs — Getting Started (Node constraint), Entry, Declaration Files, CSS Support: https://tsdown.dev/guide/getting-started · https://tsdown.dev/options/entry · https://tsdown.dev/options/dts · https://tsdown.dev/options/css
- tsup README (deprecation notice → tsdown, migration guide): https://raw.githubusercontent.com/egoist/tsup/master/README.md
- webpack docs — Tree Shaking (`sideEffects`, glob semantics, `#__PURE__`): https://webpack.js.org/guides/tree-shaking/
- Radix `packages/react/dialog/package.json` source (publishConfig, sideEffects, peers/optional types, radix-build): https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/dialog/package.json
- Radix primitives root `package.json` (turborepo layout, React 19 devDeps — what we are NOT copying): https://raw.githubusercontent.com/radix-ui/primitives/main/package.json
- TypeScript TSConfig reference — `isolatedDeclarations`: https://www.typescriptlang.org/tsconfig/isolatedDeclarations.html
- shadcn docs — Introduction (open-code, not an NPM library): https://ui.shadcn.com/docs
- publint: https://publint.dev/ · Are The Types Wrong?: https://arethetypeswrong.github.io/
- Registry manifests (via `registry.npmjs.org/<pkg>/latest`, 2026-09-19): `react`, `react-dom`, `@types/react`, `@radix-ui/react-dialog`, `@radix-ui/react-slot`, `radix-ui`, `@ark-ui/react`, `@base-ui-components/react`, `@floating-ui/react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tsdown`, `tsup`, `@arethetypeswrong/cli`, `publint`.
