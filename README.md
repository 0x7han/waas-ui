# waas-ui

Reusable React UI/UX component library for SaaS applications — admin
dashboards, B2B tools, billing apps, and data-heavy internal products.
Vanilla CSS + CSS variables theming, accessible compound components built
on Radix primitives, one package with per-component subpath exports.

> NPM publication is deferred. Install from GitHub until the registry
> release (see [ADR-0001](docs/adr/0001-defer-npm-publish-github-install.md)).

## Install

```bash
npm install github:0x7han/waas-ui#v0.1.1
```

The `prepare` script builds `dist/` on install, so no build step is needed
afterwards. Requires Node 18+.

To follow `main` instead of a tag (not recommended for production):

```bash
npm install github:0x7han/waas-ui
```

## Setup

Import the tokens once, then the component styles you use:

```tsx
import "waas-ui/tokens";
import "waas-ui/theme.css";
import "waas-ui/button/style.css";
```

Wrap your app in the theme provider:

```tsx
import { ThemeProvider } from "waas-ui";

<ThemeProvider theme="light">
  <App />
</ThemeProvider>;
```

Switch themes with the `theme` prop (`"light"`, `"dark"`, or a brand key)
plus the optional `brand` prop. The provider sets `data-theme` /
`data-brand` on `<html>` and keeps the `.dark` alias in sync for
Radix/shadcn interop. OS color-scheme is the fallback when no theme is set.

## Usage

```tsx
import { Button } from "waas-ui/button";
import { ThemeProvider } from "waas-ui";

<ThemeProvider theme="dark">
  <Button variant="primary" onClick={save}>
    Save
  </Button>
</ThemeProvider>;
```

Available subpaths: `waas-ui` (root barrel), `waas-ui/button`,
`waas-ui/form`, `waas-ui/selection`, `waas-ui/navigation`,
`waas-ui/overlay`, `waas-ui/data` — each with a matching
`<name>/style.css` stylesheet, plus `waas-ui/tokens` and
`waas-ui/theme.css`.

Pass your own icons into `icon` slots — the library never bundles an
icon set:

```tsx
import { Button } from "waas-ui/button";
import { SaveIcon } from "./icons";

<Button icon={<SaveIcon />}>Save</Button>;
```

## Theming

Override any `--waas-*` token without touching library source:

```css
:root {
  --waas-accent-9: #0d74ce;
  --waas-radius: 10px;
}
```

Brand themes compose with light/dark via `[data-theme][data-brand]`.
Tailwind users can map tokens through `@theme inline` — no Tailwind
dependency is required. See
[docs/research/token-theming.md](docs/research/token-theming.md).

## Development

```bash
npm ci
npm test -- --run
npm run build
```

Release gates: `npm run pack:check`, `npx publint`,
`npx attw --pack . --entrypoints . ./button ./form ./selection ./navigation ./overlay ./data`.

## Playground

Local dev-only gallery of every component family with Light/Dark/Brand
switching. Never published to NPM (no `dist` entry, no exports subpath).

```bash
npm ci
npm run dev
```

Then open `http://localhost:5173/?playground`.
