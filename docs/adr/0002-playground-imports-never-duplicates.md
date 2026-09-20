# Playground imports components, never duplicates; every export is showcased

The dev-only gallery under `src/playground/` renders the real components by
importing them from `src/components/` (and the source stylesheets from
`src/tokens/` and per-family `*.css`). No component code or styles are ever
copied into the gallery, so edits to a component or its tokens appear in the
playground automatically through the normal module graph and HMR. There is
no sync step and no codegen.

Gallery coverage is **mandatory, not best-effort**: every public export —
every component and every compound part — MUST appear in the gallery. Each
family keeps an explicit `*Section.tsx` maintained by hand. Adding a
component or compound part makes its rendering available, but it counts as
showcased only once a `<Demo>` block renders it in the relevant section.
A component ships if and only if its demo ships with it.

## Decision

- Stay with explicit curated sections (option A) for the ~25-component MVP.
- Every public export MUST be showcased: the gallery is a release gate, not
  a courtesy. Enforcement is automated, not a checklist:
  `src/playground/coverage.test.ts` scans every family barrel for public
  value exports and fails when one has no `<Demo>` reference in the gallery.
  Helpers, hooks, and stores (`useFormField`, `getPaginationItems`,
  `createToastStore`, `toast`, …) are allow-listed as non-visual; compound
  aliases (`FormField.*`, `RadioGroupItem`) count through their namespace.
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

- Component changes need zero gallery maintenance; new components or parts
  require a `<Demo>` in the same change — no demo, no merge.
- Moving to option B later is a pure addition (registry + glob loader) with
  no changes to existing components.
