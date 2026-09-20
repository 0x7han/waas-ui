# Defer NPM publish; install via GitHub meanwhile

NPM publication is deferred. Until it happens, consumers install `waas-ui`
directly from GitHub. The package name `waas-ui` is confirmed free on the
registry; publishing is blocked only on maintainer login, not on packaging —
the tarball already passes `npm pack --dry-run`, `publint`, and `attw`.

## Decision

- Keep the package publish-ready (`files`, `exports`, `sideEffects`,
  dual ESM+CJS, `publint`/`attw` gates) without publishing it.
- Support GitHub installs via the `prepare` script (`npm run build`), so a
  git dependency builds `dist/` on the consumer's machine after checkout.
- Document the GitHub install path in `README.md` as the only supported
  install until the registry release.

## Consequences

- Consumers need a build toolchain on install (Node 18+, devDeps install
  so `tsdown` and `typescript` are present for the `prepare` build).
- `dist/` stays gitignored; GitHub installs rely on `prepare`, never on
  committed build output.
- When the maintainer runs `npm login` + `npm publish`, no packaging
  changes are required — flip the README install section to the registry.
