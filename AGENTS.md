# AGENTS.md

## Layout

- The app lives entirely in `ansi-pipe/` (Next.js 16, App Router). All commands run from there.
- Nested git repos: outer repo (`frontend/`, remote `github.com/Alex-Avant/ANSI-Pipe-Schedule-Calculator`) tracks `ansi-pipe/` files, but `ansi-pipe/` also has its own `.git` (no remote, separate history). Check `git log` in the right repo before committing.
- `../server/` is an empty placeholder (no code). The app makes no API calls; `src/services/` is empty and `.env.example` vars are unused.

## Commands (run in `ansi-pipe/`)

- Package manager is **pnpm only** (`pnpm-lock.yaml` + `pnpm-workspace.yaml`).
- `pnpm dev` / `pnpm build` both pass `--webpack` deliberately — do not remove; Next 16 defaults to Turbopack.
- `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so build/lint do NOT typecheck. Always run separately:
  - `pnpm lint`
  - `pnpm exec tsc --noEmit`
  - `pnpm test` (vitest)
  - Single file: `pnpm vitest run src/lib/__tests__/calculations.test.ts`
- `README.md` is stale create-next-app boilerplate — ignore it.

## Testing quirks

- Vitest uses `environment: 'node'` (no jsdom installed); component tests won't work.
- `vitest.setup.ts` hand-rolls a `localStorage` shim because the zustand persist middleware needs it — don't remove.
- "zustand persist middleware ... storage is currently unavailable" warnings during tests are expected noise.

## Architecture

- Single-page client app: `src/app/page.tsx` composes selector/result components from `src/components/shared/`.
- Pipe schedule data is `src/app/pipe_data.json` (~150 KB), loaded and parsed in `src/lib/pipe-data.ts` (fractional size strings like `"4 1/2"` parsed there — pipe-weight bugs have originated here).
- All state flows through one zustand store with `persist` in `src/store/index.ts`; formulas live in `src/lib/calculations.ts`; PDF/Excel/image export in `src/lib/export.ts`.
- shadcn-style primitives in `src/components/ui` (`cn()` helper in `src/lib/utils.ts`); path alias `@/` → `src/`.

## PWA gotcha

- `public/sw.js` precaches `/` (cache name `ansi-pipe-v3`) and is registered on every load (`ServiceWorkerRegister`). If UI changes "don't appear", the service worker is serving stale cache — bump `CACHE_NAME` to invalidate.
