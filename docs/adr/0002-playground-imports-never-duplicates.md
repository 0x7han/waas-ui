# Playground imports components, never duplicates; gallery coverage is curated

The dev-only gallery under `src/playground/` renders the real components by
importing them from `src/components/` (and the source stylesheets from
`src/tokens/` and per-family `*.css`). No component code or styles are ever
copied into the gallery, so edits to a component or its tokens appear in the
playground automatically through the normal module graph and HMR. There is
no sync step and no codegen.

Gallery *coverage*, however, is curated, not mirrored: each family has an
explicit `*Section.tsx` maintained by hand. Adding a component makes its
rendering available, but it appears in the gallery only once someone adds a
`<Demo>` block for it in the relevant section.

## Decision

- Stay with explicit curated sections (option A) for the ~25-component MVP.
- If demos repeatedly lag behind new components (two or three releases in a
  row ship without gallery entries), graduate to co-located demos (option B):
  each component ships a `*.demo.tsx` beside its source and the gallery
  auto-registers everything via `import.meta.glob`.
- Never duplicate component code into the playground. A demo that needs a
  special variant is a signal the component API is missing something — fix
  the API instead.
- The gallery stays dev-only: no `dist` entry, no exports subpath, routed
  behind `?playground` in development builds only.

## Consequences

- Component changes need zero gallery maintenance; only new components (or
  new states worth showcasing) require a `<Demo>` addition.
- Moving to option B later is a pure addition (registry + glob loader) with
  no changes to existing components.
