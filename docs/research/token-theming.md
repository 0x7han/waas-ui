# Token + Theming + CSS Contract — Research (Ticket #3)

> Scope: Vanilla CSS + CSS variables for waas-ui (session decision, fixed).
> Primary sources only. Every factual claim carries a source link.

## 1. How the reference systems do it (grounding)

### 1.1 Material 3 — semantic role tokens, not raw values

- M3 defines **design tokens as the building blocks shared by design, tools, and code**, with reference tokens (raw palettes) compiled into **system tokens** (semantic roles) applied to components
  ([M3 design-tokens overview](https://m3.material.io/foundations/design-tokens/overview)).
- Color is consumed through **semantic color roles** ("the connective tissue between UI elements and what color goes where", e.g. `primary`, `on-primary`, `surface`, `surface-container`, `error`, `outline`)
  ([M3 color roles](https://m3.material.io/styles/color/roles)).
  - Takeaway for waas-ui: components must reference **semantic aliases** (`--waas-accent-solid`), never raw palette steps directly. This is the M3 system-token layer.
- M3 type scale is a fixed **15-role scale**: Display L/M/S, Headline L/M/S, Title L/M/S, Label L/M/S(? large/medium/small), Body L/M/S — each role bundling font/size/line-height/tracking/weight
  ([M3 type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens)).
  - Takeaway: ship a closed typography role list (Display→Overline in our ticket maps onto M3's Display→Label), each role a *composite* of size/leading/tracking/weight tokens.
- M3 motion keeps **easing + duration tokens** as the themable legacy system (expressive/spring physics is the new default on native, but easing/duration tokens remain the web transition mechanism)
  ([M3 easing & duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs),
  [applying easing & duration](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration)).
  - Takeaway: a small tiered duration scale + 2–3 eases is the established pattern; mirror it rather than exposing raw `ms` values per component.

### 1.2 Radix Colors — 12-step functional scale, class-scoped themes, aliasing discipline

- Every scale has **12 steps with a prescribed use case**: 1 = app bg, 2 = subtle bg, 3–5 = component bg / hover / active, 6 = subtle borders, 7 = interactive borders + focus rings, 8 = hovered borders, 9–10 = solid bg / hovered solid, 11 = low-contrast text, 12 = high-contrast text; text steps carry APCA-based contrast guarantees against same-scale backgrounds
  ([understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale),
  [Radix Colors home](https://www.radix-ui.com/colors)).
- Light theme is scoped as `:root, .light, .light-theme` (verified in shipped CSS) and dark theme as `.dark, .dark-theme` (verified in shipped CSS), shipped as **separate per-scale files** (`gray.css` + `gray-dark.css`), with Display-P3 overrides gated behind `@supports (color: display-p3) + @media (color-gamut: p3)`
  ([gray.css](https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/gray.css),
  [gray-dark.css](https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/gray-dark.css),
  [installation](https://www.radix-ui.com/colors/docs/overview/installation)).
- Radix documents three aliasing layers, in this order: **semantic aliases** (`--accent-*` → `--blue-*`), **use-case aliases** (`--accent-border: var(--blue-7)`), and **mutable aliases** (same var name, remapped under `.dark`, e.g. `--panel: white` → `--panel: var(--slate-2)`); it explicitly warns against component-named aliases like `--card-bg` because one variable serves many use cases
  ([aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)).
  - Takeaways: (a) adopt the 12-step *semantics* as our internal palette grammar so any Radix/primer palette can be dropped in; (b) theme switching = **class/attribute-scoped re-mapping**, not file swapping; (c) name aliases by *role + state*, never by component.

### 1.3 Open Props — `:where(html)` scoping, adaptive shadows, opt-in granularity

- All props are declared on **`:where(html)`** — zero-specificity scoping, so any consumer rule overrides without specificity fights (verified in shipped bundle)
  ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css),
  [Open Props home / usage](https://open-props.style/)).
- Naming grammar is flat and numeric: `--font-size-00…8` + `--font-size-fluid-0…3` (`clamp()`), `--font-weight-1…9`, `--font-lineheight-00…5`, `--font-letterspacing-0…7`, `--size-000…15` (+ `px`, `fluid`, `relative`, `content/header` variants), `--ease-*` / `--ease-in/out/in-out-*` / elastic / spring (`linear()`) / bounce, `--radius-1…6` + `--radius-round: 1e5px`, `--shadow-1…6` + inner shadows, `--layer-1…5` z-index scale, `--border-size-1…5`, named layout breakpoints `--size-xs: 360px … --size-xxl: 1920px`
  ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
- Adaptive theming is done via **`@media (prefers-color-scheme: dark)` re-mapping the same variables** (shadow color/strength + bloom keyframes switch under the media query, verified in bundle) and the package ships **opt-in per-token files** (`indigo.min.css`, `easings.min.css`, `sizes.min.css`, …) plus shadow-DOM (`:host`-scoped) builds
  ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css),
  [Open Props home](https://open-props.style/)).
  - Takeaways: (a) `:where(:root)` scoping for zero-specificity defaults; (b) shadows must be *adaptive* (shadow-color/strength vars remapped per theme, not hardcoded rgba); (c) ship tokens as one bundle + opt-in per-category files.

### 1.4 Tailwind v4 — CSS-first `@theme` namespaces; shadcn — the `:root` + `.dark` contract

- Tailwind v4 stores design decisions in **`@theme` variables**; each `--namespace-*` generates matching utilities (`--color-*` → `bg-*`/`text-*`, `--radius-*` → `rounded-*`, `--breakpoint-*` → responsive variants, `--ease-*`/`--animate-*` → motion utilities). Plain `:root` vars are explicitly for values that should *not* become utilities
  ([theme variables](https://tailwindcss.com/docs/theme)).
- Dark mode defaults to `prefers-color-scheme` but is **re-pointable at any selector** via `@custom-variant dark (&:where(.dark, .dark *))` — class strategy — or a data attribute via `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`
  ([dark mode](https://tailwindcss.com/docs/dark-mode)).
- shadcn builds the proven `:root` + `.dark` contract on top: **background/foreground pairs** (`--primary` surface + `--primary-foreground` content; background suffix omitted on the surface), full inventory `background, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1…5, sidebar*`, radius derived from one `--radius` base (`--radius-sm: calc(var(--radius)*0.6)` … `--radius-4xl`), and Tailwind interop through `@theme inline { --color-primary: var(--primary); … }` so utilities resolve through the semantic vars; new tokens (e.g. `warning`) follow the same `:root` + `.dark` + `@theme inline` recipe
  ([shadcn theming](https://ui.shadcn.com/docs/theming)).
  - Takeaways: (a) our `:root` var names should be chosen so a one-line `@theme inline` map gives Tailwind users full utility coverage — without us depending on Tailwind; (b) `border` / `input` / `ring` as first-class tokens is validated by shadcn's inventory; (c) radius-from-one-base derivation is the pattern to copy.

### 1.5 CSS platform primitives (W3C/MDN)

- Custom properties cascade and inherit like any property; `var()` with fallbacks resolves at use time; scoping a re-definition to a subtree re-themes that subtree — the mechanism behind all attribute/class theming
  ([CSS Custom Properties L1](https://www.w3.org/TR/css-variables-1/),
  [MDN: `var()`](https://developer.mozilla.org/en-US/docs/Web/CSS/var)).
- `@layer` ordering beats specificity: **unlayered author styles beat layered ones**, and earlier-declared layers lose to later ones — so a library that puts its CSS in named layers is *by construction* overridable by consumer CSS
  ([CSS Cascade 5](https://www.w3.org/TR/css-cascade-5/),
  [MDN: `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)).
- `prefers-reduced-motion: reduce` is the OS-level motion opt-out signal; guidance is to tone motion down to opacity-only ("dissolve") transitions
  ([Media Queries 5](https://www.w3.org/TR/mediaqueries-5/#pref-reduced-motion),
  [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).

## 2. Proposed semantic token inventory for waas-ui

Prefix: `--waas-`. Three layers — **primitive** (palette/raw, swappable), **semantic** (roles components consume), **component-adjacent** (strictly state mappings, no component names per Radix's warning).

### 2.1 Color

| Token group | Tokens | Notes / grounding |
|---|---|---|
| Neutral scale | `--waas-gray-1…12` | 12-step Radix grammar (§1.2). Default scale: Radix Gray/Slate values; consumers may re-point at any palette |
| Accent/brand scale | `--waas-accent-1…12` | Semantic alias over brand palette (Radix [semantic aliases](https://www.radix-ui.com/colors/docs/overview/aliasing)) |
| Status scales | `--waas-success-1…12`, `--waas-warning-1…12`, `--waas-danger-1…12`, `--waas-info-1…12` | Ticket requires success/warning/info (+ danger). Map: success→green/grass, warning→amber/yellow, danger→red/tomato, info→blue/sky. Note Radix's caveat: allow *two* aliases over one scale (e.g. `--waas-info-*` and `--waas-accent-*` both → blue) |
| Surfaces | `--waas-bg`, `--waas-bg-subtle`, `--waas-surface`, `--waas-surface-hover`, `--waas-surface-active`, `--waas-surface-solid`, `--waas-surface-solid-hover` | Use-case aliases for steps 1–5 + 9–10 ([use-case aliases](https://www.radix-ui.com/colors/docs/overview/aliasing)); shadcn's `background/card/popover` triple is the same idea at coarser grain ([shadcn](https://ui.shadcn.com/docs/theming)) |
| Text | `--waas-text`, `--waas-text-contrast`, `--waas-text-subtle` | Steps 12 / 12-emphasis / 11 |
| Borders & inputs | `--waas-border-subtle`, `--waas-border`, `--waas-border-strong`, `--waas-input`, `--waas-ring` | Steps 6/7/8 + shadcn's first-class `border/input/ring` ([shadcn](https://ui.shadcn.com/docs/theming)). `--waas-ring` doubles as focus-ring color (Radix step-8 use case) |
| On-colors | `--waas-on-accent`, `--waas-on-success`, `--waas-on-warning`, `--waas-on-danger`, `--waas-on-info` | = shadcn `*-foreground` pattern (`--primary` + `--primary-foreground`); white on step 9 except sky/mint/lime/yellow/amber-9 which take dark text ([scale doc](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)) |
| Overlay/scrim | `--waas-overlay` | Mutable alias: light `black-a8`-ish → dark deeper scrim ([mutable aliases](https://www.radix-ui.com/colors/docs/overview/aliasing)) |

Status roles beyond the four (e.g. "pending", "valid") reuse scales via extra aliases rather than new palettes, per Radix's guidance.

### 2.2 Typography (Display → Overline)

Composite roles (each = size + line-height + tracking + weight), following M3's 15-role type-scale-tokens model
([M3 type scale](https://m3.material.io/styles/typography/type-scale-tokens)) with M3's "Label" renamed to the ticket's "Overline" slot:

`--waas-font-display / -h1 / -h2 / -h3 / -title / -body-lg / -body / -body-sm / -caption / -overline`,
each backed by primitives `--waas-fs-*` (scale incl. `clamp()` fluid steps, cf. Open Props `--font-size-fluid-*`), `--waas-lh-*`, `--waas-tracking-*`, `--waas-weight-*`
([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
Font stacks: `--waas-font-sans / -serif / -mono` (system stacks first, cf. Open Props `--font-system-ui` etc.).

### 2.3 Spacing (xs → 4xl)

`--waas-space-xs / -sm / -md / -lg / -xl / -2xl / -3xl / -4xl` mapped onto a 4px-base geometric ramp (4/8/12/16/24/32/48/64), i.e. Open Props `--size-1…9` proportions
([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
Components consume only these; raw `px` values are a contract violation.

### 2.4 Radius (none → full)

`--waas-radius-none: 0`, `--waas-radius-sm/md/lg/xl/full`, with `full: 1e5px` (Open Props `--radius-round` trick) and sm…xl **derived from one `--waas-radius` base** via `calc()` multipliers exactly like shadcn (`0.6/0.8/1/1.4/1.8/2.2/2.6`)
([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css),
[shadcn radius scale](https://ui.shadcn.com/docs/theming)).
Brand theming = setting one variable.

### 2.5 Elevation (none → xl)

`--waas-elevation-none / -xs / -sm / -md / -lg / -xl` built from **adaptive shadow primitives**: `--waas-shadow-color` + `--waas-shadow-strength` remapped per theme (light `220 3% 15% / 1%`-style → dark near-black `220 40% 2% / 25%`-style), layered multi-stop shadows per level — the Open Props `--shadow-1…6` construction verbatim
([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
Mutable-alias rule: never hardcode `rgba(0,0,0,…)` in a component.

### 2.6 Motion (durations + eases)

- Durations: `--waas-duration-instant: 0ms`, `--waas-duration-fast: 120ms`, `--waas-duration-base: 200ms`, `--waas-duration-slow: 350ms`, `--waas-duration-slower: 500ms` — tiered scale in the M3 easing/duration-token tradition
  ([M3 tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)).
- Eases: `--waas-ease-standard` (emphasized-out-ish `cubic-bezier(.2,0,0,1)` family), `--waas-ease-in`, `--waas-ease-out`, `--waas-ease-spring` (`linear()` spring, cf. Open Props `--ease-spring-*`)
  ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
- Global guard (non-negotiable): `@media (prefers-reduced-motion: reduce)` collapses durations to `0.01ms`/opacity-only, per platform guidance
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).

### 2.7 Breakpoints (mobile → large)

Tokens (not media queries — tokens carry the *values*; components rarely need them, layouts do):
`--waas-bp-mobile: 480px`, `--waas-bp-tablet: 768px`, `--waas-bp-desktop: 1024px`, `--waas-bp-wide: 1440px`, `--waas-bp-large: 1920px`.
Values align with Open Props' named layout sizes (`--size-xs: 360px … --size-xxl: 1920px`, md `768px`, lg `1024px`, xl `1440px`)
([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css))
and Tailwind's rem-based defaults (`--breakpoint-sm: 40rem` default cited in
[theme docs](https://tailwindcss.com/docs/theme)); we use px for predictability, documented as values-not-variants.

### 2.8 Naming + `:root` scoping (recommendation)

- kebab-case, always `--waas-` prefixed (collision-proof vs Tailwind/Open Props/shadcn namespaces).
- Declare defaults in **`:where(:root)`** — inherits Open Props' zero-specificity trick so consumer overrides always win on specificity ties
  ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
- Wrap all library CSS in ordered `@layer`s: `@layer waas.tokens, waas.base, waas.components, waas.utilities;` — mirrors Tailwind v4's own `theme, base, components, utilities` layer order
  ([theme docs](https://tailwindcss.com/docs/theme)).

## 3. Theming strategy: light / dark / custom / brand

**Recommended: `data-theme` attribute as primary, `.dark` class as compat alias, `prefers-color-scheme` as auto-fallback.**

| Mechanism | Role | Grounding |
|---|---|---|
| `:where(:root)` / `[data-theme="light"]` | Default (light) values | `:root, .light, .light-theme` = Radix light scoping ([gray.css](https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/gray.css)); `:root` + `.dark` = shadcn contract ([theming](https://ui.shadcn.com/docs/theming)) |
| `[data-theme="dark"]`, plus `.dark, .dark-theme` alias selectors | Explicit dark: **mutable-alias remap block** (same var names, dark values) | Radix dark scoping `.dark, .dark-theme` ([gray-dark.css](https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/gray-dark.css)); Radix mutable-alias pattern ([aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)) |
| `@media (prefers-color-scheme: dark)` (only when no explicit `data-theme` present, via `:root:not([data-theme])`) | OS-following auto mode | Open Props adapts theme inside the media query ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)); Tailwind default dark behavior ([dark mode](https://tailwindcss.com/docs/dark-mode)) |
| `[data-theme="<brand>"]` (e.g. `acme`) or per-subtree `style="--waas-accent-9: …"` | Custom/brand themes: re-map accent + surface aliases; composes with light/dark (`[data-theme="dark"][data-brand="acme"]`) | Generalizes Radix semantic-alias swap ([aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)); subtree scoping falls out of custom-property inheritance ([CSS Variables](https://www.w3.org/TR/css-variables-1/)) |
| Scoped preview: any container with the attribute | Per-panel dark cards, docs previews | Inheritance makes theming subtree-local by construction |

Why attribute-first over class-only: identical specificity mechanics to `.dark`, but (a) supports N themes (`light/dark/<brand>…`) where a boolean class cannot, (b) Tailwind v4 documents the data-attribute dark variant as a first-class recipe (`@custom-variant dark (&:where([data-theme=dark], …))`)
([dark mode](https://tailwindcss.com/docs/dark-mode)).
Keep `.dark` as a zero-cost alias selector (`:where([data-theme="dark"], .dark, .dark-theme)`) for Radix/shadcn interop.

Brand onboarding recipe (no source edits): fork the alias block, re-point `--waas-accent-*` at brand palette + set `--waas-radius` + font stacks. One file, ~30 lines.

## 4. CSS contract: global vs per-component + consumer overrides

### 4.1 Global vs per-component split

- **Global (required): `tokens.css`** — every `--waas-*` definition + theme remap blocks. Single source of truth; versioned; documented per-token.
- **Global (optional, opt-in files): `tokens/<category>.css`** — per-category splits (colors, typography, spacing, motion…) mirroring Open Props' individual imports (`indigo.min.css`, `easings.min.css`, …)
  ([Open Props](https://open-props.style/)).
- **Per-component: state aliases, not new tokens.** Components consume semantic vars (`background: var(--waas-surface-solid-hover)`) and expose a documented short list of **component-scoped override points** (e.g. `--waas-button-bg` defaulting to `var(--waas-surface-solid)`), following Radix's use-case-alias pattern and its warning never to hardcode component names into the *global* namespace
  ([aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)).
- Components must use `var(…, <fallback>)` defensively so partial token adoption never breaks rendering ([MDN `var()`](https://developer.mozilla.org/en-US/docs/Web/CSS/var)).

### 4.2 Consumer override mechanism (no source touches) — three tiers, all supported

1. **Cascade layers (primary, structural).** Ship library CSS inside `@layer waas.*`. Because unlayered author CSS beats layered CSS regardless of specificity, consumer stylesheets override by default with zero `!important`
   ([MDN `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer),
   [CSS Cascade 5](https://www.w3.org/TR/css-cascade-5/)).
   Declare order up front (`@layer waas.tokens, waas.base, waas.components, waas.utilities;`) so later layers predictably win, as Tailwind does.
2. **Higher-specificity / later variable re-definition (theming).** Override any token at `:root`, a scope, or per-subtree — `:where(:root)` defaults guarantee the consumer wins ties
   ([open-props.min.css](https://cdn.jsdelivr.net/npm/open-props@1.7.13/open-props.min.css)).
   This is also the brand mechanism (§3).
3. **Opt-in files (payload control).** Consumers import `waas/tokens`, `waas/components/button`, etc. à la Open Props individual imports
   ([Open Props](https://open-props.style/)); tree-shaking-friendly with the single-package subpath-export layout (sibling ticket #4's decision).

Explicit non-goal: no `!important` in library CSS, no CSS-in-JS theme provider required — a `<html data-theme="dark">` flip is the whole API.

## 5. Tailwind interop (optional, never required)

- waas-ui ships **zero Tailwind dependency**. Interop is a documented recipe: consumers map our vars into Tailwind's namespaces with `@theme inline`, exactly the shadcn bridge pattern:
  `@theme inline { --color-accent: var(--waas-surface-solid); --radius-lg: var(--waas-radius-lg); … }`
  ([shadcn theming](https://ui.shadcn.com/docs/theming),
  [Tailwind `@theme` + `inline`](https://tailwindcss.com/docs/theme)).
- Why `inline`: Tailwind docs warn that referencing one variable from another without `inline` resolves against the wrong scope; shadcn's scaffold uses `@theme inline` for every token for this reason
  ([theme: referencing other variables](https://tailwindcss.com/docs/theme),
  [shadcn](https://ui.shadcn.com/docs/theming)).
- Naming compatibility: our `--waas-*` names never collide with Tailwind's `--color-*/--radius-*/--ease-*` namespaces, so the map is purely additive; Tailwind's `dark:` variant works unchanged if consumers point it at our attribute (`@custom-variant dark (&:where([data-theme=dark], …))`)
  ([dark mode](https://tailwindcss.com/docs/dark-mode)).
- Tokens must be readable via `var(--waas-*)` in arbitrary values / inline styles regardless of Tailwind presence (Tailwind generates real CSS vars for theme values — same expectation in reverse)
  ([theme docs](https://tailwindcss.com/docs/theme)).

## 6. Open decisions for implementation tickets

1. Exact accent palette values (recommend Radix Indigo/Blue 1–12 light + dark files vendored or re-tokenized under `--waas-accent-*`).
2. Whether `chart-1…5` equivalents are needed at MVP (shadcn ships them; ticket's component list doesn't require charts — defer).
3. P3-gamut overrides: copy Radix's `@supports/color-gamut` progressive enhancement or defer to v2.
