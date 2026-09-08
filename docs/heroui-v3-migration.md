# HeroUI v2 → v3 Migration Tracker

> **Living document.** Update the status table + phase log after every phase.
> Started: 2026-09-08 · Base commit: `17dfd51`

---

## Why this is four migrations, not one

`@heroui/react@3.2.4` declares hard peer dependencies:

```json
"react":       ">=19.0.0",
"react-dom":   ">=19.0.0",
"tailwindcss": ">=4.0.0",
"react-aria":  "^3.51.0",
"react-aria-components": "^1.20.0"
```

HeroUI is the **last** domino, not the first.

| | From | To | Forced by |
|---|---|---|---|
| React | 18 | 19 | HeroUI v3 peer dep |
| Next.js | 14.2.7 | 15.5.25 | React 19 unsupported on Next 14 |
| Tailwind | 3.4.1 | 4.x | HeroUI v3 peer dep |
| HeroUI | 2.7.4 | 3.2.4 | the goal |

---

## Phase status

| Phase | Scope | Status | Branch | Commit |
|---|---|---|---|---|
| **0** | React 19 + Next 15 (HeroUI/Tailwind untouched) | 🔄 In progress | `migration/phase-0-react19-next15` | — |
| **1** | Tailwind v3 → v4 (CSS-first config) | ⬜ Not started | — | — |
| **2** | Color token map (v2 semantic → v3 oklch) | ⬜ Not started | — | — |
| **3** | Component API migration (leaf-first) | ⬜ Not started | — | — |
| **4** | Visual regression sweep | ⬜ Not started | — | — |

Legend: ⬜ Not started · 🔄 In progress · ✅ Done · ⚠️ Blocked

---

## Codebase inventory (measured 2026-09-08)

- **68 files** import `@heroui/react`
- **1,155 occurrences** of HeroUI v2 semantic color classes in `src/`
- **50 files** use `framer-motion`
- **3 files** use Next `params` (async API migration surface)
- `tailwind.config.ts`: 3 custom plugins + full custom `heroui()` theme

### HeroUI import inventory

```
26  cn            15  Tabs / Tab      5  Tooltip, Alert
24  Button         6  Link, Image     4  Card, CardBody, Input
 3  Chip, Checkbox, Select/SelectItem, Table(6 parts)
 2  ScrollShadow, Textarea, TimeInput
 1  HeroUIProvider, ToastProvider, Accordion, Divider, Switch, CardFooter
```

### Top color tokens at risk (Phase 2)

| Class | Count | Note |
|---|---|---|
| `text-default-400` | 175 | `default-*` ramp has **no 1:1 v3 equivalent** |
| `text-default-500` | 160 | ″ |
| `text-foreground` | 76 | maps to v3 `--foreground` |
| `bg-default-100` | 69 | ″ |
| `text-default-600` | 57 | ″ |
| `border-default-200` | 48 | ″ |
| `text-primary` / `bg-primary` | 66 | maps to v3 `--accent` |

---

## Key decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Next 15, not 16** (16.3.4 is latest) | 14→16 is two majors at once. Next 16 adds its own breaking changes on top of React 19. Revisit 15→16 as a separate task after HeroUI v3 lands. |
| D2 | **Keep framer-motion** | Migration docs say "remove Framer Motion" — that means HeroUI no longer depends on it *internally*. We have 50 files using it, incl. an entire blog series about it. It stays. |
| D3 | **Incremental, not Full Migration** | With 1,155 styling touchpoints we need a working reference to diff against at every step. |
| D4 | **Phase 2 before Phase 3** | Token breakage is silent (no build error, just invisible text). Fix tokens while components still render, so regressions are attributable. |
| D5 | **Tabs migrated last in Phase 3** | 15 files, highest-complexity compound rewrite. Validate the pattern on Buttons first. |

---

## Phase 0 — React 19 + Next 15

**Goal:** Land React 19 while HeroUI v2 and Tailwind v3 stay untouched, so React 19 fallout is isolated from HeroUI fallout.

### Dependency audit — ALL GREEN ✅

Every React-touching dependency already accepts React 19 **at its currently installed version**. No blockers, no forced upgrades.

| Package | Installed | React peer range | Verdict |
|---|---|---|---|
| `@heroui/react` | 2.7.4 | `>=18 \|\| >=19.0.0-rc.0` | ✅ tolerates R19 |
| `framer-motion` | 11.18.2 | `^18.0.0 \|\| ^19.0.0` | ✅ |
| `next-mdx-remote` | 6.0.0 | `>=16` | ✅ |
| `@tsparticles/react` | 3.0.0 | `>=16.8.0` | ✅ |
| `@number-flow/react` | 0.6.0 | `^18 \|\| ^19` | ✅ |
| `remotion` / `@remotion/cli` | 4.0.434 | `>=16.8.0` | ✅ |
| `next-themes` | 0.3.0 | `^16.8 … \|\| ^19` | ✅ |
| `react-hook-form` | 7.53.0 | `… \|\| ^19` | ✅ |
| `lucide-react` | 0.436.0 | `… \|\| ^19.0.0` | ✅ |
| `@tabler/icons-react` | 3.31.0 | `>= 16` | ✅ |

> Note: `@heroui/react@2.7.4` also requires `framer-motion >=11.5.6` — satisfied (11.18.2).

### Work items

- [ ] Branch `migration/phase-0-react19-next15`
- [ ] Bump `react`, `react-dom` → 19; `@types/react`, `@types/react-dom` → 19
- [ ] Bump `next`, `eslint-config-next` → 15.5.25
- [ ] `next.config.mjs`: `experimental.serverComponentsExternalPackages` → `serverExternalPackages` (moved out of experimental in 15)
- [ ] Async request APIs — `params` is now a Promise in 3 files:
  - [ ] `src/app/posts/[postId]/page.tsx`
  - [ ] `src/app/projects/[projectId]/page.tsx`
  - [ ] `src/app/api/posts/[postId]/likes/route.ts`
- [ ] `pnpm build` clean
- [ ] `pnpm lint` clean
- [ ] Manual smoke test (see checklist)

### Verification checklist

- [ ] Home page renders (intro, tech stack grid, recent projects/posts)
- [ ] `/posts` — list, search, topic filters
- [ ] `/posts/[postId]` — MDX renders, interactive demos mount
- [ ] `/projects` + `/projects/[projectId]`
- [ ] `/contact` — form submits, toast fires
- [ ] Theme switch (light/dark)
- [ ] Like button (API route w/ async params)

### Rollback

```bash
git checkout master && git branch -D migration/phase-0-react19-next15
```

---

## Phase log

### 2026-09-08 — Phase 0 opened
- Ran dependency compatibility audit. **Result: all green**, no dependency blocks React 19.
- Confirmed HeroUI v3 stable at `3.2.4` (npm `latest`).
- Confirmed v3 still exports `cn` (re-export from `tailwind-variants`) → the 26 `cn` imports need **no change**.
- Confirmed `Image`, `Divider`, `TimeInput` are **absent** from v3 `.d.ts` (removed/renamed as documented).
- Confirmed `navbar.tsx` is custom, not HeroUI `Navbar` (which v3 removed) — dodged.
- Confirmed **zero** usage of removed hooks (`useDisclosure`, `useSwitch`, `useInput`).
- Decided Next 15 over Next 16 (D1).

---

## Reference

- Migration index: https://heroui.com/docs/react/migration
- Styling guide (Phase 2 token map): https://heroui.com/docs/react/migration/styling
- Hooks guide: https://heroui.com/docs/react/migration/hooks
- MCP: `heroui-react` added to local config 2026-09-08 (loads on next restart)
