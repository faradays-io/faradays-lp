<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Package manager

- This project uses **pnpm** (lockfile: `pnpm-lock.yaml`). Never use `npm` or `yarn` here.
- pnpm is a **standalone install** at `~/.local/share/pnpm` (`PNPM_HOME`). A wrapper at `~/.local/bin/pnpm` (on `PATH`) execs it, so `pnpm` resolves in every shell — including processes spawned by tools like the shadcn CLI. (A symlink does NOT work: the launcher resolves its `.tools/` dir relative to the invoked path, so it must be a wrapper that `exec`s the real path.)
    - Calling a CLI binary directly (`./node_modules/.bin/<tool>`) skips pnpm's deps-status pre-check — handy in scripts.
- Store is **v11** (pnpm 11.x). If a `ERR_PNPM_UNEXPECTED_STORE` shows up, run `pnpm install` to relink.
- pnpm purges `node_modules` on relink and needs a TTY; in non-interactive shells set `CI=true` to auto-confirm.
- Build scripts: `sharp` + `unrs-resolver` are **approved** via `allowBuilds: { sharp: true, unrs-resolver: true }` in `pnpm-workspace.yaml`. pnpm 11 dropped `ignoredBuiltDependencies` (the create-next-app default) — that key is silently ignored, which made every `pnpm run`/`pnpm exec` fail its deps-status check with `ERR_PNPM_IGNORED_BUILDS`. Use `allowBuilds` (map of name→bool) to approve/deny build scripts.
- **`verifyDepsBeforeRun: false`** is set in `pnpm-workspace.yaml`. pnpm 11's deps-status pre-check spawns a nested `pnpm install` before every `pnpm run`/`pnpm exec`; in this standalone setup that nested install re-runs the `prepare` lifecycle and dies (no TTY / recursion), so `pnpm typecheck` etc. failed with a `runDepsStatusCheck` stack. Disabling the pre-check fixes it. Trade-off: pnpm won't auto-relink on dep drift — run `pnpm install` yourself after pulling.
- **Husky `prepare`**: uses `"prepare": "node .husky/install.mjs"`, NOT `"prepare": "husky"`. The husky _bin shim_ exits non-zero (silently) when pnpm runs it inside the `pnpm install` lifecycle here, breaking every install. The `.mjs` calls husky's API via plain `node` (sidesteps the shim) and guards on `CI`/`NODE_ENV=production`. Git hooks live in `.husky/` (`pre-commit` → `lint-staged`, `pre-push` → `tsc --noEmit`); hooks call binaries directly to skip the pre-check in the no-TTY hook shell.

# Lint & format

- ESLint 9 **flat config** (`eslint.config.mjs`) — `eslint-config-next` + `simple-import-sort` + `eslint-config-prettier` (last). Run: `./node_modules/.bin/eslint . [--fix]`.
- Prettier config in `.prettierrc.json` (tabs, width 4, single quotes, no semi, no trailing comma) + `prettier-plugin-tailwindcss`. Run: `pnpm format` / `pnpm format:check`.
- Import sorting is owned by ESLint `simple-import-sort` only — do not add Prettier `importOrder` plugins/keys.

# Fonts & type system

- **Registry**: `src/lib/fonts.ts` is the single source of truth. Google fonts via `next/font/google` (all variable → no `weight`), local via `next/font/local` from `src/fonts/`. Each declares `variable: '--font-x'` + `display: 'swap'`.
- **Local fonts are woff2-only** (option A): variable fonts where available (Aspekta, Fixel), Alliance No.1/No.2 are Light-only. Convert any new local font to woff2 before adding (`fonttools` + `brotli` are installed: `python3 -c "from fontTools.ttLib import TTFont; f=TTFont('x.otf'); f.flavor='woff2'; f.save('x.woff2')"`). Never commit otf/ttf.
- **Swap point**: the `TYPE` object in `fonts.ts` (`heading`/`body`/`mono`/`serif`). `layout.tsx` maps it to role vars `--ff-*` on `<html>`; `globals.css` `@theme inline` binds those to `font-sans`/`font-heading`/`font-mono`/`font-serif`. Change the project pair in ONE place: `TYPE`.
- **Type scale**: perfect fourth (1.333), base 18px (rem ÷16, root stays 16px), in `globals.css`. Numeric `text-xs…text-5xl` + semantic `text-display`, `text-h1…h6` (line-height 0.85–1.0, tracking -0.03em→0), `text-body-lg/body/body-sm` (line-height 1.2–1.5, tracking -0.01em→0.01em).
- **Compare fonts**: `/fonts` route (`src/app/fonts/page.tsx`) renders every `SPECIMENS` entry on the scale — it's the only route that loads all fonts. Root layout loads only the active `TYPE` pair.

# Styling & UI

- **shadcn/ui** is set up (`components.json`, style `radix-vega`, base color neutral, icon library `phosphor`). Theme tokens (colors/radius, light + `.dark`) live in `src/app/globals.css`. Add components with `pnpm dlx shadcn@latest add <name>` → `src/components/ui/`.
- **Always use `cn()`** (`@/lib/utils`, clsx + tailwind-merge) for any `className` that is NOT a plain static string literal — i.e. whenever combining/interpolating classes or applying conditional classes. Never use template literals in `className`. Examples:
    - `className={cn(font.className, 'rounded-xl border')}` — not ``className={`${font.className} rounded-xl border`}``
    - `className={cn('p-4', isActive && 'bg-accent')}`
    - Plain static strings stay as-is: `className="flex gap-4"`.
- **Largura da interface**: o canvas trava em **1920px** (`--container-page` no `@theme` do `globals.css` → utilitário `max-w-page`). Acima disso o conteúdo centraliza e só os fundos das seções seguem sangrando até as bordas da tela. Padrão para qualquer seção nova: fundo + padding vertical na `<section>`, e um wrapper interno `mx-auto w-full max-w-page px-7`. A goteira conta dentro da medida, então a largura útil trava em 1864px de 1920px pra cima — o conteúdo nunca volta a alargar em telas maiores. `max-w-section` (115rem) continua sendo a medida mais estreita de algumas seções, aplicada dentro do canvas.
- **Grade de 12 colunas**: as seções que usam a grade deixam a primeira e a última coluna vazias — o miolo (10 colunas + 9 goteiras) é `--grid-10`, derivado do canvas e não de um pai. É o que faz o hero (`grid-cols-12` + `col-start-2`/`col-start-7`) e a demo do `HeroFeatureFlow` (que vive noutra camada, sticky) abrirem exatamente na mesma largura. `--grid-gap` (2rem) move os dois juntos.
- **Smooth scroll**: Lenis is global via `src/components/lenis-provider.tsx` (wraps `<body>` children in the root layout). It's driven by GSAP's ticker (`autoRaf: false`) so Lenis + `ScrollTrigger` share one RAF loop — register ScrollTrigger-based animations normally and they stay in sync.
    - **Sensitivity / feel** is tuned in `src/lib/lenis-config.ts` (`DEFAULT_LENIS_OPTIONS`), shared by the global provider and every `SmoothScrollArea`. Knobs: `wheelMultiplier`/`touchMultiplier` (distance per input), `lerp` (snappiness). Change it in one place.
- **Nested smooth scroll**: `SmoothScrollArea` (`src/components/custom-ui/smooth-scroll-area.tsx`) — own Lenis on a `data-lenis-prevent` scroller (root won't hijack), rendered with its own `CustomScrollbar`. Per-area Lenis options via the `options` prop override the shared defaults.
