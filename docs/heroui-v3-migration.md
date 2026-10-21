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
| **0** | React 19 + Next 15 (HeroUI/Tailwind untouched) | ✅ Done | `migration/phase-0-react19-next15` | see log |
| **1** | Tailwind v3 → v4 **+ HeroUI 2.8** | ✅ Done | `migration/phase-1-tailwind-v4` | `a5f593c` |
| **2** | Color token map (v2 semantic → v3 oklch) | ✅ Done (folded into 3) | `migration/phase-3-heroui-v3` | `dda16e7` (3f) |
| **3** | Component API migration (leaf-first) | ✅ Done | `migration/phase-3-heroui-v3` | `3e3a357`…`dda16e7` (3a–3f) |
| **4** | Visual regression sweep + audit fixes | ✅ Done | `migration/phase-3-heroui-v3` | `9f9b05a`…`beb989c` (4a–4k, 5a–5c) |

Phases 2–4 all live on `migration/phase-3-heroui-v3`, which sits directly on
`master` (0 behind), so it merges as a fast-forward.

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

### v3 token map (as shipped)

v3's colour system is a **reduction**, not a rename. Numbered scales are gone entirely,
`primary` becomes `accent`, and `secondary` is **removed** — this project restores it
as a brand token (4h). Rows marked ⚠️ differ from the official guide's advice; the
commit in brackets explains why.

| v2 (yours) | count | v3 | Note |
|---|---|---|---|
| `text-default-400` | 175 | `text-muted` | 400/500/600 all collapse to one token |
| `text-default-500` | 160 | `text-muted` | ″ |
| `text-default-600` | 57 | `text-muted` / `text-foreground` | judgement call |
| `text-foreground` | 76 | `text-foreground` | ✅ unchanged |
| `bg-default-50/100/200` | 69 | `bg-surface` / `-secondary` / `-tertiary` | `content1-3` → the same surface ladder |
| `bg-default-300/400/600` | — | `bg-border-secondary` / `bg-border-tertiary` / `bg-muted` | ⚠️ 3f sent these to `surface-tertiary` (lighter than 200 → invisible); fixed in 4j |
| `border-default-200` | 48 | `border-border` (`separator` for dividers) | ⚠️ `border-default` is a fill colour, not a border (3f) |
| `text-primary` / `bg-primary` | 66 | `text-accent` / `bg-accent` | primary → accent |
| `text-primary-500/600/700` | ~36 | `text-accent` | numbered scales removed |
| `text-secondary` (all shades) | 37 | `text-secondary` (brand token in `globals.css`) | ⚠️ guide says `text-default` (near-invisible); 3f used `accent`, which merged blob/tree etc.; restored in 4h |
| `text-success-500` etc. | ~60 | `text-success` | numbered scales removed |
| `text-{success,warning,danger}-600…900` | 54 | `text-*-soft-foreground` | ⚠️ base tokens are ~2:1 on white (4i) |
| `text-tiny/small/medium/large` | — | `text-xs/sm/base/lg` | |
| `rounded-small/medium/large`, `radius='sm'` | — | `rounded-[8px]/[12px]/[14px]` | ⚠️ exact v2 px; `rounded-sm/md/lg` are smaller (4a, 4j) |
| `classNames` prop | — | `className` on the matching **sub-component** | ⚠️ e.g. `classNames.tabList` goes on `<Tabs>`, not `Tabs.List` (inside the pill) — 4f |

> ⚠️ **Design consequence, not just a rename:** your three-level grey ramp
> (`default-400/500/600`, 392 uses) collapses into a single `muted` token. Text hierarchy
> that currently reads as three distinct greys will flatten unless we reintroduce it
> deliberately. This is a decision to make with eyes open, not a mechanical substitution.

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
| D6 | **HeroUI 2.7.4 → 2.8.10 inside Phase 1** | HeroUI 2.7.4 *cannot* run on Tailwind v4 (see Phase 1 log). 2.8.x can. Without this the staged plan collapses into a big-bang Tailwind+v3 migration. Component API stays v2, so this stays a styling-only phase. |
| D8 | **Restore `secondary` as a brand token** | v3 removed it, but the demos use it as a second hue beside accent (blob vs tree, month vs year, opcode vs FIN). Light #006fee / dark #338ef7 (4h). |
| D9 | **Tab style left mixed** | Content tabs keep v3's solid pill; only the navbar theme switcher matches the outlined nav pill (owner's call, 2026-10-21). |
| D10 | **v2 page background restored** | `--background` #fff / #000 and `body` bg/colour, so dark mode is near-black like v2 instead of v3's 0.12 grey (owner's call, 4k). |
| D11 | **Extra Button hues are variable modifiers, not `bg-*` utilities** | `.button--success`, `--success-soft`, `--warning-soft`, `--brand-secondary` fill `--button-bg/-hover/-pressed/-fg`; a `bg-*` utility wins over the `.button` hover rule and kills hover feedback (4h/4i). |
| D7 | **Bulk edits are scripted, never hand-edited** | Renames run as one boundary-aware pass over the file tree. Safer than `sed`: it skips comments and non-class contexts, which is what caught `blur = '6px'` and HeroUI's `variant='shadow'` prop. Phase 2's 1,155 tokens use the same method. |

---

## Phase 0 — React 19 + Next 15

**Goal:** Land React 19 while HeroUI v2 and Tailwind v3 stay untouched, so React 19 fallout is isolated from HeroUI fallout.

### Dependency audit

All React-touching dependencies accept React 19 at their installed version — **except `next-themes`**, which had to be bumped.

> ⚠️ **Audit lesson:** the first pass checked each package's *latest* peer range instead of its *installed* one, which wrongly cleared `next-themes@0.3.0`. `pnpm install` caught it. For later phases, always read peer ranges off the installed version.

| Package | Installed | React peer range | Verdict |
|---|---|---|---|
| `@heroui/react` | 2.7.4 | `>=18 \|\| >=19.0.0-rc.0` | ✅ tolerates R19 |
| `framer-motion` | 11.18.2 | `^18.0.0 \|\| ^19.0.0` | ✅ |
| `next-mdx-remote` | 6.0.0 | `>=16` | ✅ |
| `@tsparticles/react` | 3.0.0 | `>=16.8.0` | ✅ |
| `@number-flow/react` | 0.6.0 | `^18 \|\| ^19` | ✅ |
| `remotion` / `@remotion/cli` | 4.0.434 | `>=16.8.0` | ✅ |
| `next-themes` | 0.3.0 | `^16.8 \|\| ^17 \|\| ^18` | ❌ **bumped → 0.4.6** |
| `react-hook-form` | 7.53.0 | `… \|\| ^19` | ✅ |
| `lucide-react` | 0.436.0 | `… \|\| ^19.0.0` | ✅ |
| `@tabler/icons-react` | 3.31.0 | `>= 16` | ✅ |

> Note: `@heroui/react@2.7.4` also requires `framer-motion >=11.5.6` — satisfied (11.18.2).

### Work items — all complete

- [x] Branch `migration/phase-0-react19-next15`
- [x] `react`, `react-dom` → **19.2.8**; `@types/react` → 19.2.18, `@types/react-dom` → 19.2.7
- [x] `next`, `eslint-config-next` → **15.5.25**
- [x] `next-themes` 0.3.0 → **0.4.6** (React 19 peer)
- [x] `next.config.mjs`: `experimental.serverComponentsExternalPackages` → `serverExternalPackages`
- [x] Async `params` (now a Promise) in 3 files:
  - [x] `src/app/posts/[postId]/page.tsx`
  - [x] `src/app/projects/[projectId]/page.tsx`
  - [x] `src/app/api/posts/[postId]/likes/route.ts`
- [x] `tsconfig.json`: `target: ES2017` (added by Next; reformat reverted to keep diff clean)
- [x] `pnpm build` clean — 16/16 static pages
- [x] `pnpm lint` clean — no warnings or errors

### React 19 breaking changes hit (2 categories, 4 files)

| Change | Files | Fix |
|---|---|---|
| `useRef<T>(null)` now returns `RefObject<T \| null>` | `react-glow.tsx`, `hooks/useMousePosition.ts` | widen prop/param type to `RefObject<T \| null>` |
| Global `JSX` namespace removed from `@types/react` | `components/icons/index.tsx` | `import type { JSX } from 'react'` (matches existing `mdx-content.tsx` pattern) |

### Runtime verification — all passed ✅

Served the production build on **port 3100** (port 3000 held by an unrelated stale
`next-server v15.5.12`, ~4 days old — left running, not ours to kill).

- ✅ All **11 posts** → 200
- ✅ Both **projects** → 200
- ✅ `/`, `/posts`, `/projects`, `/contact` → 200
- ✅ Likes API w/ async params → `200 {"globalCount":10,"userCount":0,...}` (DB round-trip works)
- ✅ HeroUI **v2** `data-slot` attributes present in SSR output → v2 renders fine under React 19
- ✅ Server log clean — no hydration errors, no React warnings

> Not yet verified: client-side interactivity of the MDX demos and theme switching.
> Deferred to the Phase 4 visual sweep — but worth a manual click-through before Phase 1.

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

### 2026-09-08 — Phase 0 ✅ COMPLETE
- React 18 → **19.2.8**, Next 14.2.7 → **15.5.25**. Build + lint clean, all routes 200.
- Only 4 files needed source changes for React 19 (2 ref-type, 1 JSX namespace, 3 async-params).
- **Correction to the audit:** `next-themes@0.3.0` does *not* support React 19 — bumped to 0.4.6.
  Root cause: audit read `latest` peer ranges, not installed ones. Fixed method for future phases.
- Discovered a stale unrelated `next-server v15.5.12` squatting port 3000 (~4 days). Used 3100 instead.
- **Next up:** Phase 1 — Tailwind v3 → v4. Highest-risk item is porting the 3 custom plugins
  (`matchUtilities` SVG patterns `bg-grid`/`bg-grid-small`/`bg-dot`, `addVariablesForColors`,
  typography) to CSS-first config, while `heroui()` v2 plugin must keep working alongside Tailwind v4.

### 2026-09-08 — Phase 1 ✅ COMPLETE

**The blocker.** HeroUI **2.7.4 cannot run on Tailwind v4.** Its plugin calls
`addUtilities({':root': …})`, which v4 rejects: *"defines an invalid utility selector"*.
This killed both `npx @tailwindcss/upgrade` and the manual `@config` bridge.

Isolated it with two throwaway configs built via the Tailwind CLI (seconds, not full builds):

| Config | Result |
|---|---|
| project's own plugins only (`addVariablesForColors` + `matchUtilities`) | ✅ builds |
| `heroui()` v2.7.4 only | ❌ invalid utility selector |

**The fix.** `@heroui/theme@2.4.26` (shipped with `@heroui/react@2.8.10`) peers
`tailwindcss: ">=4.0.0"`. Upgrading HeroUI 2.7.4 → 2.8.10 keeps the **v2 component API**
while unlocking Tailwind v4 — so the staged plan survives instead of collapsing into a
big-bang Tailwind + HeroUI v3 migration (D6).

**Config shape at the end of Phase 1** (superseded in 4b — both config files were
deleted and ported to CSS in `globals.css`):
- `hero.ts` (new, repo root) — HeroUI theme, loaded via `@plugin '../../hero.ts'`
- `tailwind.config.ts` — custom plugins only, bridged via `@config '../../tailwind.config.ts'`
- `globals.css` — `@import 'tailwindcss'` + `@plugin` + `@source` + `@custom-variant dark`

**v4 default changes handled:**
- border colour reverted to v3's `gray-200` in a base layer (74 bare `border` usages)
- 56 utility renames across 22 files: `shadow-sm`→`shadow-xs`, `shadow`→`shadow-sm`,
  `rounded`→`rounded-sm`, `rounded-sm`→`rounded-xs`, `outline-none`→`outline-hidden`
- no bare `ring` classes existed (all 5 hits were comments) → no ring-width regression

**Verified in the generated stylesheet, not just the build** (293 KB):
all HeroUI token classes present · 105 `--heroui-*` vars · 206 `.dark` rules · `prose` intact.
Build + lint clean; all 11 posts, both projects, all pages → 200; server log clean.

**Two false positives caught by the scripted rename** (both would have shipped with `sed`):
- `blur = '6px'` → `blur-sm = '6px'` — an identifier, not a class
- `variant='shadow'` → `variant='shadow-sm'` — a HeroUI **prop value**, not a Tailwind class

**Incidental finding:** `bg-grid` / `bg-grid-small` / `bg-dot` are **dead config** — defined in
`tailwind.config.ts` and documented in CLAUDE.md, but used nowhere in `src/`. Left in place;
worth deleting separately.

**Also noted:** `next lint` is deprecated and removed in Next 16 — migrate to the ESLint CLI
before any future Next 16 bump.

**Next up:** Phase 2 — token mapping. Note this phase is only *needed* once HeroUI v3 lands,
since 2.8 still generates the v2 `default-*` ramp. Consider folding Phase 2 into Phase 3.

### 2026-09-08 — Phase 3 (+2) ✅ COMPLETE — `3e3a357`…`dda16e7`
- **3a** install `@heroui/react@3.2.4`, CSS-first setup (`@import '@heroui/styles'`), drop
  `HeroUIProvider` for React Aria's `RouterProvider` + `next-themes` + `Toast.Provider`.
- **3b–3e** component API to compound parts, leaf-first: Button/Tooltip/Alert/Link/Chip →
  removed/renamed (Image, Divider, TimeInput…) → Table/Select/Input/TextArea → Tabs last (D5).
- **3f** colour tokens (Phase 2 folded in): primary→accent, grey ramp → muted/foreground,
  content1-3 → surface ladder, light tints → `-soft`.

### 2026-09-09 — Phase 4 visual sweep, round 1 — `9f9b05a`…`7f3b350`
- **4a** v2 sizing utilities (`rounded-/border-/text-small…`) generated no CSS in v3.
- **4b** root cause of "everything transparent": the `@config` bridge mis-compiles HeroUI's
  `@theme inline` into self-referential vars. Deleted `tailwind.config.ts` + `hero.ts`, ported to CSS.
- **4c–4e** theme switcher pill, tab label wrap, same-hue step indicators, field borders,
  Switch/Checkbox `Control`/`Thumb`/`Indicator` parts.

### 2026-10-21 — Phase 4 round 2: audit + fixes ✅ COMPLETE — `9f028b4`…`beb989c`
Side-by-side audit against `master` (v2 running on a second port), every page and demo, both
themes, 390px; plus a code audit against HeroUI's source. Classes of bug found:

| Commit | Bug class | Lesson |
|---|---|---|
| 4f | Switch/Checkbox still not clickable | The **Field** root is a div; the clickable part is `Switch.Content` / `Checkbox.Content`. tsc can't catch missing compound parts — children are optional. |
| 4f | `--field-border` had no effect | v3 also sets `--field-border-width: 0px`; restore both. |
| 4g | No tooltip could open (14) | v3 tooltip triggers must consume React Aria's `FocusableContext`: RAC `Link`/`Button`, `Tooltip.Trigger`, or `<Focusable>`. A plain `<a>`/`next/link` gets nothing. v3 delay is 1500ms (v2: 0) → `--tooltip-delay`. |
| 4h | `secondary` merged into accent | See D8. |
| 4i | Status meaning lost | Alerts untinted (bg-surface), success/soft buttons → primary, 600+ text shades too light. |
| 4j | Greys invisible / purple text | default-300/400/600 → surface-tertiary; v2 `flat` default → v3 `secondary` (purple fg) instead of `tertiary`. |
| 4k | Chrome | body background/colour (D10), `next/link` lost `inline-flex`, no pending spinner on v3 Button. |
| 5a | Pre-existing (also on master) | Machine-timezone parsing during SSR → hydration error; it masked a theme-dependent `<img src>` mismatch in `TheSvgIcon` (React does not patch attributes). `useIsClient` hook. |
| 5b–5c | Leftovers | `Chip.Label`, no-op classes on Field roots, redundant `dark:` pairs, 8 dead components. |

**`dark:` rule of thumb now:** v3 semantic tokens already switch with the theme. Use `dark:`
only for raw palette colours, images, `prose`, or to pick a *different* token in dark mode.

---

## Reference

- Migration index: https://heroui.com/docs/react/migration
- Styling guide (Phase 2 token map): https://heroui.com/docs/react/migration/styling
- Hooks guide: https://heroui.com/docs/react/migration/hooks
- MCP: `heroui-react` added to local config 2026-09-08 (loads on next restart)
