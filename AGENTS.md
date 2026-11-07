# AGENTS.md

Rules for AI coding agents working in this repository.

## Language

- This repository is English-only.
- Code, comments, commit messages, PR titles/descriptions, and documentation MUST be written in English.
- Never commit placeholder text in another language.

## Commit messages

All commits MUST follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `style` | Formatting, whitespace (no logic change) |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration |
| `chore` | Maintenance not covered by the above |
| `revert` | Reverts a previous commit |

Rules:

- `<scope>` is REQUIRED when the change touches one area (e.g. `router`, `pages`, `components`, `hooks`, `lib`, `test`, `config`). Use `repo` for repo-wide changes.
- Subject: imperative mood, lowercase start, NO trailing period, max 72 characters.
- Body is REQUIRED for non-trivial changes: explain **why**, not **what** (the diff shows what).
- One logical change per commit. Do not mix refactors with features.
- Reference issues in the footer: `Closes #123`, `Refs #456`.
- Forbidden subjects: `fix bug`, `update`, `wip`, `misc`, `changes`, `asdf`.

Good:

```
feat(router): add 404 fallback route

Unknown paths previously rendered a blank page, which made broken
links indistinguishable from loading failures.

Closes #42
```

Bad:

```
fixed stuff
update app
```

## Branches and PRs

- Branch names: `<type>/<short-description>` (e.g. `feat/wallet-balance`, `fix/counter-overflow`).
- PR title MUST use the same format as a commit subject.
- PR description MUST cover: what changed, why, and how it was verified (test/build output).
- Keep PRs small and single-purpose. Split unrelated changes into separate PRs.

## Code standards

- TypeScript strict mode. No `any` without justification; no unused locals/parameters.
- Import via the `@/` alias (`@/pages/HomePage`), never deep relative paths for cross-folder imports.
- Follow the existing patterns in the touched file (export style, naming, structure) before introducing a new convention.
- Keep changes minimal: no unrelated refactors, no drive-by formatting, no new abstraction without a caller.
- Update `README.md` when scripts, structure, or setup change.

## Testing

- Tests use Vitest + React Testing Library, colocated as `*.test.tsx` next to the source.
- Test behavior and user-visible outcomes, not implementation details (no snapshot-only tests, no mock-echo tests).
- Before finishing any change, run and report:

```bash
npm test
npm run build
npm run lint
```

All three MUST pass. Never claim success without running them.

## Security and hygiene

- NEVER commit secrets, `.env` files, `node_modules/`, `dist/`, or `*.tsbuildinfo`.
- Dependency changes MUST update `package.json` and `package-lock.json` together (`npm install -D <pkg>`).
- Do not hand-edit files under `.agents/skills/` or `.claude/skills/`; manage them with `npx skills add` / `npx skills remove`.
- Do not edit generated build output in `dist/`.
