# SkillStreakr Web: the frontend stack

Every tool the frontend uses, **why** we chose it, **what we rejected**, and **how it is set up** in this repository. Tools marked **Planned** are decided but not installed yet.

See [README.md](README.md) for the full project and [CHECKS.md](CHECKS.md) for every check.

---

## Table of contents

1. [Stack at a glance](#1-stack-at-a-glance)
2. [Why a single-page app (and not Next.js)](#2-why-a-single-page-app-and-not-nextjs)
3. [React](#3-react)
4. [Vite](#4-vite)
5. [TypeScript](#5-typescript)
6. [Tailwind CSS](#6-tailwind-css)
7. [shadcn/ui and its packages](#7-shadcnui-and-its-packages)
8. [TanStack Router](#8-tanstack-router)
9. [TanStack Query](#9-tanstack-query)
10. [Talking to the API](#10-talking-to-the-api)
11. [ESLint](#11-eslint)
12. [Planned tools](#12-planned-tools)
13. [Public site: Astro (later)](#13-public-site-astro-later)
14. [Hosting](#14-hosting)
15. [What we do not use, and why](#15-what-we-do-not-use-and-why)
16. [All installed packages](#16-all-installed-packages)

---

## 1. Stack at a glance

| Layer | Choice | Status |
|---|---|---|
| UI library | React 19 | In use |
| Build tool / dev server | Vite 8 | In use |
| Language | TypeScript 6 (strict) | In use |
| Styling | Tailwind CSS 4 | In use |
| Components | shadcn/ui (Radix, Nova preset) + lucide icons | In use |
| Routing | TanStack Router (file-based) | In use |
| Server data | TanStack Query | In use |
| Linting | ESLint 10 + typescript-eslint + React plugins | In use |
| Package manager | npm | In use |
| API client | `fetch` wrapper with cookies | Next |
| Forms | React Hook Form + Zod | Next |
| Charts / heatmap | Recharts | Week 13–14 |
| Markdown | react-markdown | Notes feature |
| Dates | date-fns + date-fns-tz | Logs feature |
| Real-time | Server-Sent Events | v2 |
| Tests | Vitest + Testing Library, Playwright | Planned |
| Git hooks | husky + lint-staged + commitlint + Prettier | Next |
| Hosting | Cloudflare Pages | Week 16 |

---

## 2. Why a single-page app (and not Next.js)

| Reason | Detail |
|---|---|
| The app is a logged-in dashboard | About 90% of the screens are private and interactive; they don't need SEO or server rendering |
| The backend is separate | Express already is the backend. With Next.js we would have two backends and confusion about where code goes |
| Less complexity | No server/client component split, no caching surprises, no hydration bugs |
| Cheap hosting | The build is plain static files, served free from Cloudflare Pages, where commercial use is allowed (Vercel's free Hobby plan is not for commercial use) |
| Learning | Next.js is already used at work; this project teaches pure React deeply |
| SEO where it matters | Public pages (landing, public profile, share links) get their own Astro site later |

When Next.js would be the better choice: content-heavy or SEO-heavy apps, or apps without a separate backend.

---

## 3. React

| | |
|---|---|
| **What** | The UI library: the screen is built from components |
| **Version** | React 19 |
| **Why** | The most used UI library; the biggest job market; huge ecosystem (shadcn, TanStack) |
| **Set up** | `src/main.tsx` renders inside `<StrictMode>`, which runs extra checks in development (double renders find side-effect bugs) |
| **Rejected** | Vue, Svelte, Angular: good tools, but fewer jobs and a smaller ecosystem for what we need |

---

## 4. Vite

| | |
|---|---|
| **What** | Dev server and production bundler |
| **Version** | Vite 8 with `@vitejs/plugin-react` |
| **Why** | Starts instantly, updates the page on save without losing state (hot module replacement), builds small optimised files |
| **Rejected** | Create React App (abandoned), webpack (slow, lots of config) |

`vite.config.ts`:

| Setting | Why |
|---|---|
| `tanstackRouter({ target: 'react', autoCodeSplitting: true })` | Generates the route tree and splits every page into its own file. Must come **before** `react()` |
| `react()` | JSX and fast refresh |
| `tailwindcss()` | Tailwind 4 as a Vite plugin (no PostCSS config needed) |
| `resolve.alias: { '@': src }` | `@/` imports work at runtime |
| `server: { port: 5173, strictPort: true }` | Always 5173. If it's busy, Vite stops instead of moving to 5174, because the API's CORS allows only 5173 |

---

## 5. TypeScript

| | |
|---|---|
| **Version** | TypeScript 6 (the version the Vite template ships) |
| **Why** | Typed props, typed API data, typed routes; mistakes found before the browser |

The template uses **three tsconfig files**:

| File | Covers | Notes |
|---|---|---|
| `tsconfig.json` | Nothing itself; points to the other two | Also holds `paths` for `@/*`, because the shadcn CLI reads this file |
| `tsconfig.app.json` | `src/` (browser code) | `strict` (TypeScript 6 default), `moduleResolution: bundler`, `jsx: react-jsx`, `noEmit` (Vite builds, tsc only checks), `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `paths: { "@/*": ["./src/*"] }` |
| `tsconfig.node.json` | `vite.config.ts` (Node code) | `types: ["node"]` |

No `baseUrl`: TypeScript 6 deprecated it, and `paths` now works relative to the tsconfig file.

`npm run build` = `tsc -b && vite build`, so **a type error stops the build**.

---

## 6. Tailwind CSS

| | |
|---|---|
| **What** | Utility classes written directly in JSX: `className="flex items-center gap-2 text-blue-600"` |
| **Version** | Tailwind 4 with `@tailwindcss/vite` |
| **Why** | No separate CSS files to name and maintain; consistent spacing and colours; only the classes you use end up in the build; shadcn is built on it |
| **Set up** | `src/index.css` starts with `@import "tailwindcss";`. No `tailwind.config.js` in v4: the theme lives in CSS variables |
| **Rejected** | MUI (used at work, heavy, hard to customise), CSS Modules (more files), styled-components (runtime cost) |

---

## 7. shadcn/ui and its packages

| | |
|---|---|
| **What** | Ready-made, accessible components whose **code is copied into our repo** (`src/components/ui/`) |
| **Why** | We own and can change the code; no library version lock-in; accessible by default; the most popular choice for React + Tailwind |
| **Set up** | `npx shadcn@latest init` with template `vite`, base `radix`, preset `nova`, base colour `neutral`, CSS variables on, RTL off, pointer cursor on. Settings saved in `components.json` |
| **Add a component** | `npx shadcn@latest add dialog` creates `src/components/ui/dialog.tsx` |
| **Installed components** | `button`, `card`, `input`, `label` |

Packages that shadcn added, and the job of each:

| Package | Job |
|---|---|
| `radix-ui` | Behaviour and accessibility under the components (keyboard, focus, screen readers) |
| `class-variance-authority` | Component variants: `<Button variant="outline" size="sm">` |
| `cn` | The `cn()` helper in `src/lib/utils.ts` that merges Tailwind classes without conflicts. Published by shadcn as a faster drop-in for clsx + tailwind-merge |
| `lucide-react` | Icons |
| `tw-animate-css` | Animation classes (dialogs, dropdowns) |
| `@fontsource-variable/geist` | The Geist font, bundled locally (no Google Fonts request) |
| `shadcn` | Provides `shadcn/tailwind.css`, imported by `index.css` |

`src/index.css` holds the theme: colours as CSS variables (`--primary`, `--muted`, `--background`…) for light and dark mode, plus the font. To change the look, change those variables.

---

## 8. TanStack Router

| | |
|---|---|
| **What** | Routing: which page shows for which URL |
| **Why** | **Fully type-safe**: `<Link to="/loginn">` is a TypeScript error; typed params and search params; file-based routes; built-in preloading |
| **Rejected** | React Router: popular, but weaker types; we use TanStack Query anyway, and both come from the same team |

How it is set up:

| Piece | Where | What it does |
|---|---|---|
| File-based routing | `src/routes/` | Each file is a page: `index.tsx` -> `/`, `login.tsx` -> `/login`, `skills/$id.tsx` -> `/skills/123` |
| Router plugin | `vite.config.ts` | Watches `src/routes/` and writes `src/routeTree.gen.ts` on every save |
| `routeTree.gen.ts` | `src/` | Generated. Never edited, **but committed**, because `tsc` needs it before Vite runs |
| Root layout | `src/routes/__root.tsx` | Header with links, `<Outlet />` for the page, 404 page, devtools |
| Router context | `__root.tsx` + `main.tsx` | Passes `queryClient` to every route so pages can prefetch data |
| Type registration | `main.tsx` (`declare module`) | Makes every `<Link>` and `navigate()` type-checked |
| `defaultPreload: 'intent'` | `main.tsx` | Starts loading a page when the user hovers its link |
| `autoCodeSplitting` | `vite.config.ts` | Every page is its own small file, loaded only when needed |
| Active links | `__root.tsx` | The current link gets the `active` class: `[&.active]:font-semibold` |
| Devtools | `@tanstack/react-router-devtools` | Route inspector, shown only in development |

---

## 9. TanStack Query

| | |
|---|---|
| **What** | Fetching, caching and updating server data |
| **Why** | Handles loading, error, caching, refetching and deduplication for us. Data fetching in `useEffect` gets all of these wrong (race conditions, no cache, double requests) |
| **Rejected** | Redux / RTK Query (used at work; too much boilerplate for server data), SWR (fewer features for mutations) |

Defaults in `src/lib/query-client.ts`:

| Option | Value | Why |
|---|---|---|
| `staleTime` | 60 seconds | Data counts as fresh for a minute, so revisiting a page doesn't refetch |
| `retry` | 1 | One retry on failure, so errors show quickly |
| `refetchOnWindowFocus` | false | No refetch every time the user switches browser tabs |

How we use it per feature: `useQuery` for reading (`useSkills()`), `useMutation` for writing (`useCreateSkill()`), then `invalidateQueries` so the list refreshes without a reload. The Query devtools button appears only in development.

---

## 10. Talking to the API

(Next step.)

| Piece | Choice | Why |
|---|---|---|
| HTTP | Native `fetch` in a small wrapper (`src/lib/api-client.ts`) | No extra library; full control |
| Cookies | `credentials: 'include'` | Sends the login cookies; works with `credentials: true` in the API's CORS |
| Base URL | `VITE_API_URL` | Different per environment |
| Response shape | Reads `{ status, statusCode, data }`, throws `message` on failure | Matches the API |

Rejected: axios (not needed with modern `fetch`).

---

## 11. ESLint

| | |
|---|---|
| **What** | Finds bugs and bad patterns |
| **Why ESLint, not Oxlint** | The standard at companies; plugins for React hooks, TanStack Query and accessibility; Oxlint is faster but has no plugin system yet |
| **Config** | `eslint.config.js` (flat config) |

| Part | Job |
|---|---|
| `@eslint/js` recommended | Core JavaScript rules |
| `typescript-eslint` recommended | TypeScript rules |
| `eslint-plugin-react-hooks` | Rules of hooks; missing effect dependencies |
| `eslint-plugin-react-refresh` | Warns when a file breaks hot reload |
| Ignored files | `dist`, `src/routeTree.gen.ts` (generated) |
| Exception 1 | `src/components/ui/**`: fast-refresh rule off, because shadcn files also export variants (`buttonVariants`) |
| Exception 2 | `src/routes/**`: fast-refresh rule off, because the TanStack plugin handles hot reload for route files itself |

---

## 12. Planned tools

| Tool | When | Why |
|---|---|---|
| **React Hook Form + Zod** (`@hookform/resolvers`) | Skills / log forms | Fast forms, errors under each field, same Zod idea as the API |
| **Recharts** | Dashboard, heatmap | Simple React charts |
| **react-markdown** | Notes | Render markdown safely |
| **date-fns + date-fns-tz** | Logs, stats | Dates in the user's timezone |
| **Server-Sent Events** | Notifications (v2) | Server pushes updates; simpler than WebSockets for one-way data |
| **Vitest + Testing Library** | With the first features | Component tests the way a user uses them |
| **Playwright** | Before launch | End-to-end: signup -> add skill -> log -> dashboard |
| **husky + lint-staged + commitlint + Prettier** | Next | Same commit rules as the API |
| **Sentry** | Week 12 | Frontend error tracking |
| **@tanstack/eslint-plugin-query** | With the first queries | Catches query key mistakes |

---

## 13. Public site: Astro (later)

Landing page, pricing, blog, public profiles and share pages need SEO and link previews, which a SPA does badly. They will live in a separate **Astro** site (static pages + server rendering), with preview images made by **satori**. The app itself stays `noindex`.

---

## 14. Hosting

| | |
|---|---|
| **Where** | Cloudflare Pages (later S3 + CloudFront to learn AWS) |
| **Why** | `npm run build` outputs static files; Cloudflare serves them free from a global CDN; commercial use allowed |
| **Domain** | `app.skillstreakr.com`, the same parent domain as `api.skillstreakr.com`, so login cookies work |

---

## 15. What we do not use, and why

| Not used | Why |
|---|---|
| Next.js | See [section 2](#2-why-a-single-page-app-and-not-nextjs) |
| Create React App | Abandoned; Vite replaced it |
| Redux / RTK Query | TanStack Query covers server data; there's little global client state |
| MUI | Heavy and hard to customise; used at work already |
| axios | `fetch` is enough |
| React Router | TanStack Router has better type safety |
| Oxlint | No plugins yet; learn ESLint first |
| clsx + tailwind-merge | Replaced by shadcn's `cn` package |

---

## 16. All installed packages

### Runtime dependencies

| Package | Version | Used for |
|---|---|---|
| `react`, `react-dom` | ^19.3.1 | UI |
| `@tanstack/react-router` | ^1.170.46 | Routing |
| `@tanstack/react-query` | ^5.108.0 | Server data |
| `tailwindcss` | ^4.3.5 | Styling |
| `@tailwindcss/vite` | ^4.3.5 | Tailwind Vite plugin |
| `radix-ui` | ^1.8.1 | Component behaviour |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `cn` | ^0.5.2 | Class merging |
| `lucide-react` | ^1.74.0 | Icons |
| `tw-animate-css` | ^1.4.0 | Animations |
| `@fontsource-variable/geist` | ^5.3.0 | Font |
| `shadcn` | ^4.23.0 | shadcn base CSS + CLI |

### Development dependencies

| Package | Version | Used for |
|---|---|---|
| `vite` | ^8.3.6 | Dev server + build |
| `@vitejs/plugin-react` | ^6.1.2 | React support in Vite |
| `@tanstack/router-plugin` | ^1.169.0 | Generates the route tree |
| `@tanstack/react-router-devtools` | ^1.167.3 | Router devtools |
| `@tanstack/react-query-devtools` | ^5.108.0 | Query devtools |
| `typescript` | ~6.0.3 | Type checking |
| `@types/react`, `@types/react-dom` | ^19.3.0 | React types |
| `@types/node` | ^24.19.2 | Node types for `vite.config.ts` |
| `eslint` | ^10.14.0 | Linting |
| `@eslint/js` | ^10.0.1 | Core rules |
| `typescript-eslint` | ^8.72.1 | TypeScript rules |
| `eslint-plugin-react-hooks` | ^7.1.1 | Hooks rules |
| `eslint-plugin-react-refresh` | ^0.5.7 | Hot reload rules |
| `globals` | ^17.13.0 | Browser globals for ESLint |
