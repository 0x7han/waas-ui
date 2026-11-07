# waas-ui

Frontend Wallet-as-a-Service (WaaS) — React 19 + TypeScript + Vite.

## Stack

- React 19, react-router 8
- Vite 8, Vitest 5 + Testing Library (jsdom)
- Oxlint, TypeScript 7

## Scripts

| Script | Perintah |
|---|---|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Test | `npm run test` (`vitest run`) |
| Test watch | `npm run test:watch` |
| Lint | `npm run lint` |
| Preview | `npm run preview` |

## Struktur

```
src/
  app/        Routes (router.tsx) + router test
  pages/      HomePage, NotFoundPage (+ test)
  components/ Komponen reusable (sekarang kosong)
  hooks/      Custom hooks (sekarang kosong)
  lib/        Util / API client (sekarang kosong)
  test/       Setup Vitest (jest-dom, cleanup)
  assets/     Aset statis
```

Path alias `@/` → `src/` (Vite + `tsconfig.app.json`).

## Skills

Terpasang di `.agents/skills/`: `vite`, `vitest` (antfu/skills), `frontend-design` (anthropics/skills).
