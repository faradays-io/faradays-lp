# Boilerplate pipeline

General overview of how this boilerplate was built, from an empty Next.js
scaffold to the current state. Steps are roughly chronological. Bug fixes and
environment/settings tweaks are intentionally omitted — this is the "what was
added and why" panorama.

---

## 0. Base scaffold

```bash
pnpm dlx create-next-app@latest . --empty --src-dir
```

Stack it produced (current versions):

|                 |                                                       |
| --------------- | ----------------------------------------------------- |
| Framework       | Next.js `16.2.9` (App Router, Turbopack)              |
| UI runtime      | React `19.2.4`                                        |
| Styling         | Tailwind CSS `v4` (CSS-first, `@tailwindcss/postcss`) |
| Language        | TypeScript `5`                                        |
| Lint            | ESLint `9` (flat config)                              |
| Package manager | pnpm `11`                                             |

`--empty` = minimal `app/` (layout + page), no demo content.

---

## 1. Code style tooling

```bash
pnpm add -D prettier eslint-config-prettier prettier-plugin-tailwindcss eslint-plugin-simple-import-sort
```

- **Prettier** (`.prettierrc.json`): tabs, width 4, single quotes, no semicolons,
  no trailing comma, + `prettier-plugin-tailwindcss` (class sorting).
- **`.editorconfig`** + **`.prettierignore`** (ignores lockfile / build dirs).
- **ESLint flat config** (`eslint.config.mjs`): `eslint-config-next` +
  `simple-import-sort` (import/export sorting) + `eslint-config-prettier` last
  (disables rules that fight Prettier).
- Scripts: `format`, `format:check`.

Import sorting is owned by ESLint `simple-import-sort` only (no Prettier
import-order plugin).

---

## 2. Fonts & type system

**Registry** — `src/lib/fonts.ts` is the single source of truth.

- Google (via `next/font/google`, all variable): Manrope, Geist, Space Grotesk,
  Geist Mono, JetBrains Mono, Merriweather.
- Local (via `next/font/local`, `src/fonts/`, **woff2-only**): Alliance
  (No.1 / No.2), Fixel (variable), Aspekta (variable). Non-woff2 formats were
  converted (fonttools + brotli) and the rest deleted.
- Each font declares a CSS variable + `display: 'swap'`.

**Swap point** — the `TYPE` object (`heading` / `body` / `mono` / `serif`).
`layout.tsx` maps it to role vars `--ff-*` on `<html>`; `globals.css`
`@theme inline` binds those to `font-sans` / `font-heading` / `font-mono` /
`font-serif`. Re-theme the whole app from one place.

**Type scale** (`globals.css`) — perfect fourth (ratio 1.333), base **18px**
(rem ÷16, root stays 16px):

- Numeric: `text-xs … text-5xl`.
- Semantic: `text-display`, `text-h1…h6` (line-height 0.85–1.0, tracking
  −0.03em → 0) and `text-body-lg / body / body-sm` (line-height 1.2–1.5,
  tracking −0.01em → 0.01em).

**Compare page** — `/fonts` (`src/app/fonts/page.tsx`) renders every font on the
scale; the only route that loads all fonts. The root layout loads just the
active `TYPE` pair.

---

## 3. shadcn/ui

```bash
pnpm dlx shadcn@latest init --preset b3rmsMnMMy --template next
```

- Config `components.json`: style `radix-vega`, base color `neutral`, icon
  library `phosphor`.
- Deps added: `clsx`, `tailwind-merge`, `class-variance-authority`,
  `radix-ui`, `tw-animate-css`, `@phosphor-icons/react`.
- Theme tokens (colors / radius, light + `.dark`) written into `globals.css`
  (oklch). `cn()` helper at `src/lib/utils.ts`. Example `button` in
  `src/components/ui/`.
- Add more components: `pnpm dlx shadcn@latest add <name>`.

**Convention:** any non-static `className` uses `cn()` (clsx + tailwind-merge) —
never template literals.

---

## 4. Smooth scroll (Lenis + GSAP)

```bash
pnpm add lenis gsap
```

- **Global** — `src/components/lenis-provider.tsx`: `ReactLenis root` wrapping
  `<body>` children, driven by the **GSAP ticker** (`autoRaf: false`) so Lenis
  and `ScrollTrigger` share one RAF loop.
- **Tuning** — `src/lib/lenis-config.ts` (`DEFAULT_LENIS_OPTIONS`): shared
  sensitivity (`wheelMultiplier`, `touchMultiplier`, `lerp`) for the global
  scroll and every area.
- **Custom scrollbar** — `src/components/custom-ui/custom-scrollbar.tsx`:
  thumb positioned via direct DOM writes (no per-frame re-render), subscribes
  to the Lenis scroll event, `ResizeObserver` for sizing. Mounted once globally
  in the layout; supports local containers too. Thumb color is a dedicated
  constant gray token (`--scrollbar-thumb`, light/dark aware).
- **Native scrollbars hidden** app-wide (page + components) via `globals.css`,
  scroll stays functional — the custom bar is the only visible indicator.
- **Nested smooth scroll** — `src/components/custom-ui/smooth-scroll-area.tsx`
  (`SmoothScrollArea`): a scroll container with its own Lenis on a
  `data-lenis-prevent` scroller (root won't hijack it) + its own custom
  scrollbar. For panels/modals that need internal smooth scroll.
- **Demo** — the home page (`src/app/page.tsx`) exercises page scroll + a
  nested `SmoothScrollArea`.

---

## 5. Favicon

`src/app/icon.svg` — Next's file convention auto-injects the favicon link.

---

## 6. Type-safe environment variables

```bash
pnpm add @t3-oss/env-nextjs zod
```

- **Schema** — `src/env.ts` (`createEnv`): `server` / `client` / `shared`
  blocks validated with **zod v4**. Import `env` instead of `process.env` for
  typed, validated access; server vars throw if read on the client.
- **Build-time validation** — `next.config.ts` imports `./src/env`, so an
  invalid / missing var fails the build, not runtime. `emptyStringAsUndefined`
  on; `SKIP_ENV_VALIDATION` escape hatch.
- **Template** — `.env.example` (committed) documents the keys; real `.env*`
  stay gitignored.

---

## 7. Quality gates (Husky + lint-staged)

```bash
pnpm add -D husky lint-staged
```

- **`typecheck` script** — `tsc --noEmit`.
- **Husky** — `prepare` runs the hook installer (`.husky/install.mjs`).
- **`.husky/pre-commit`** → `lint-staged`: `eslint --fix` + `prettier` on
  staged files (config in `.lintstagedrc.json`).
- **`.husky/pre-push`** → `tsc --noEmit` (whole-program typecheck).

---

## 8. Theming — dark mode + project ease

```bash
pnpm add next-themes
```

- **Provider** — `src/components/theme-provider.tsx` wraps `next-themes`
  (`attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange`),
  mounted in the root layout; `<html>` gets `suppressHydrationWarning`. Drives
  the `.dark` class the `globals.css` token sets already target.
- **Toggle** — `src/components/custom-ui/theme-toggle.tsx`: collapsed shows the
  active theme's icon; on hover / focus it expands to offer Light + Dark;
  hovering Light spins the sun 180°. Mounted fixed top-right in the layout.
- **Project ease** — `globals.css` `@theme` defines
  `--ease-fluid: cubic-bezier(0.625, 0.05, 0, 1)` and points
  `--default-transition-timing-function` at it, so every `transition-*` uses it
  by default (plus an explicit `ease-fluid` utility).

---

## 9. App-router screens

Status / error / loading screens under `src/app/`, sharing one monochrome,
theme-token aesthetic with GSAP reveals gated behind reduced-motion:

- **`not-found.tsx`** — 404 ("SIGNAL LOST"). Client; rotating wireframe globe,
  diagnostic readout, pointer parallax.
- **`error.tsx`** — segment error boundary ("SYSTEM FAULT"). Client; `reset()`
  retry, logs the error.
- **`global-error.tsx`** — root-layout crash ("500"). Self-contained
  `<html>` / `<body>` with its own styles + system font; React `<title>`.
- **`loading.tsx`** — Suspense fallback. Server Component, pure-CSS spinning
  globe.

---
