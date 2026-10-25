# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Next.js 14, featuring a blog (posts) and project showcase with MDX content. The site includes a contact form with email functionality via Resend, theme switching (light/dark mode), and animated UI components.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Rebuild project screenshots (WebP + src/content/projects/screens.json)
pnpm screens
```

## Key Architecture

### Content Management System

**MDX-based content** stored in `src/content/`:
- `posts/` - Blog posts as `.mdx` files with frontmatter (title, summary, publishedAt, author, image)
- `projects/` - One `.mdx` per project (case study), with validated frontmatter (see Projects Data)

**Content utilities** in `src/libs/`:
- `posts.ts` - Functions: `getPostById()`, `getPosts()`, sorted by publishedAt descending
- `projects.ts` - Functions: `getProjects()` (sorted by `order`), `getProjectBySlug()`, `getAdjacentProjects()`
- Both use `gray-matter` for frontmatter parsing and `fs` for file reading

**MDX rendering**:
- `src/components/mdx-content.tsx` - Uses `next-mdx-remote/rsc` for server-side MDX rendering
- Includes custom components: `Code` (syntax highlighting via `sugar-high`) plus the interactive blog demos in `src/components/blog/`
- Blog demos are registered in `src/components/blog/mdx-demos.tsx` (a `'use client'` module of `next/dynamic` imports, one chunk per post via `webpackChunkName`) and imported into the `components` object. Never import a demo statically into `mdx-content.tsx`: `/posts/[postId]` is one route, so a static import ships that demo to every post, and `dynamic()` called from the server component does not split client components

### Projects Data

Each project is ONE file: `src/content/projects/<slug>.mdx`.

**Frontmatter** is validated by a Zod schema in `src/libs/projects.ts`; an invalid field fails the build and names the file. Fields:
- Required: `title`, `tagline`, `logo`, `order`, `status`, `platform`
- Optional: `client`, `role`, `period`, `screensNote`, `featured`, `cover` (the `screens[].file` shown on the project's card; defaults to the first screen)
- Lists: `links[] {label, href}`, `stack[] {name, icon?}`, `screens[] {file, alt, caption?}`
- `code`: `private` or a repo URL

`stack[].icon` is a slug on the pinned icon CDN (`TheSvgIcon`); omit it when the CDN lacks one. Order `stack` core-first: the first five show on the case study, the rest sit behind "+N more".

**The MDX body** is the case study. Its `##` headings become the page's "On this page" anchors.

**Screenshots** are generated, never hand-placed:
1. Originals live outside git: `assets/<slug>/` (gitignored), or Munshi's repo via `MUNSHI_SCREENS_DIR`.
2. `scripts/project-screens.config.mjs` lists, per project, `{ file, device: phone|tablet|desktop, from, fromDark? }`.
3. `pnpm screens` writes WebP to `public/images/projects/<slug>/` (phones: a screen-height crop plus a `-full` for the lightbox; `-dark` twins swap with the theme) and the size manifest `src/content/projects/screens.json`.
4. Commit the WebP files and the manifest.

A `screens[].file` that isn't in the manifest fails the build, so a missing image can't ship.

**Pages:**
- `/projects` renders `ProjectCard`s; the home page renders `ProjectRows`.
- `/projects/[slug]` and `/posts/[postId]` share one reading layout (`src/components/reading/`): a left rail for context (`ProjectRail` with facts and stack; `AuthorSidebar` on posts), `SideNav` on the right (the contents list lit by scroll position, prev/next, shortcut hint), `Pager` cards at the end, and the CSS-only `ScrollProgress`. Both open label → title → summary → details → media.
- `BackLink` returns to the list with `router.back()` when the reader came from it (scroll restored), using `nav-history.tsx`. `KeyboardNav` maps Esc to back and ←/→ to previous/next; it ignores keys while a control or a `<dialog>` has focus, so post demos keep their arrow keys.
- No framer-motion on project pages (`TableOfContents` uses none, so it works on both).

### Routing Structure

- `/` - Home page with intro, project rows, recent posts, tech stack grid
- `/posts` - All blog posts with search functionality
- `/posts/[postId]` - Individual post page (dynamic route, postId = filename without .mdx)
- `/projects` - Project cards
- `/projects/[slug]` - Case study (slug = filename without .mdx; statically generated, `dynamicParams = false`)
- `/contact` - Every way to reach me (Hiring / Building lists) above the contact form. The only page with the full list; every other page ends with `ReachOut` (`src/components/reach-out.tsx`: book a 15-min call + WhatsApp + reply time), shown via the footer (`footer-cta.tsx` skips /contact)

### Server Actions

`src/libs/actions.ts`:
- `sendEmail()` - Server action for contact form using Resend API
- Validates input with Zod schema from `src/libs/schemas.ts`; `intent` (`project` | `hiring`) tags the subject `[Project]` / `[Hiring]`
- Returns `{ ok: true } | { ok: false, error }`; the form shows an error toast and keeps the input on failure
- Sender/recipients come from `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` (defaults: Resend's test sender → mhadisb1212@gmail.com); `replyTo` is the visitor's email
- Requires `RESEND_API_KEY` environment variable

### Styling & Theming

**UI Framework**: HeroUI v3 (`@heroui/react` + `@heroui/styles` 3.2.4) on Tailwind CSS v4 and React Aria. Migration history and decisions: `docs/heroui-v3-migration.md`.
- No HeroUI provider in v3. `src/app/providers.tsx` wraps the app with React Aria's `RouterProvider` (client-side routing for RAC links), `next-themes`, and `Toast.Provider`
- Layout chrome: sticky top bar `src/components/navbar.tsx` (server) with `nav-links.tsx` and `theme-toggle.tsx` (one light/dark button; icons swap via `dark:` classes, no hydration flip), and `src/components/footer.tsx` (CTA, socials, `local-time.tsx`, a "how this site works" colophon). Keep the layout free of framer-motion and HeroUI: they're page-level
- CSS-first config, no `tailwind.config.ts`: everything lives in `src/app/globals.css` (`@import 'tailwindcss'` then `@import '@heroui/styles'`, typography plugin, font utilities, theme overrides)
- Brand colours are overrides in `globals.css`: `--accent` (purple), `--secondary` (blue; a custom token, v3 has none), and v2's `--background` (#fff / #000)

**HeroUI v3 gotchas (each one shipped a bug during the migration)**:
- Compound parts are required even though TypeScript won't complain: `Switch`/`Checkbox` need `.Content > .Control > .Thumb/.Indicator`; `Tabs.Tab` needs `Tabs.Indicator`
- Tooltip triggers must be React Aria focusables (RAC `Link`/`Button`, `Tooltip.Trigger`, or wrap in `<Focusable>`); a plain `<a>` or `next/link` never opens the tooltip
- Extra Button colours are modifier classes in `globals.css` (`button--success`, `button--success-soft`, `button--warning-soft`, `button--brand-secondary`); don't use `bg-*` on a Button, it kills the hover state
- Semantic tokens (`accent`, `surface`, `muted`, `*-soft`, `*-soft-foreground`) already switch with the theme. Only use `dark:` for raw palette colours, images, `prose`, or to pick a different token in dark mode
- Render browser-only values (local timezone, resolved theme) behind `useIsClient()` from `src/hooks/useIsClient.ts` to avoid hydration mismatches

**Fonts** (two files total):
- Headings: Fraunces 500, self-hosted at `src/fonts/fraunces-opsz-500.woff2` (with its OFL licence) via `next/font/local`. It has the full optical-size axis, so each heading size gets its own drawing. Use the `font-display` utility
- Body: the system sans (HeroUI's `--font-sans`). No download
- Mono: Source Code Pro (variable) via `next/font/google`, `font-sourceCodePro` utility, for metadata only: dates, read times, labels, the colophon, code and demos

**Visual system** (see `docs/portfolio-enhancement-plan.md`):
- Monochrome structure on a flat background. Dividers are `border-hair` (a theme-aware hairline token). No decorative frames or background images
- Calls to action are links styled `.cta-primary` (the one filled, monochrome main action per view) or `.cta-outline`; a HeroUI Button that is the main action uses `button--inverse`
- The accent is only for live states: the current nav item, the label of the section being read, hover, focus and the TOC's current item
- Section headings: `src/components/section-header.tsx` (`01 · Work` mono label over a serif title). Put `data-section` on the section wrapper and `live-sections.tsx` (mounted in the layout) lights its `.section-label` while it's under the reading line
- framer-motion's reduced-motion config is page-level: wrap framer-using UI in `src/components/reduced-motion.tsx` (post pages and the project list already are)

### Path Aliases

TypeScript configured with `@/*` alias mapping to `src/*`. Always use `@/` imports instead of relative paths:
- `import { Navbar } from '@/components/navbar'` ✓
- `import { Navbar } from '../components/navbar'` ✗

### Code Style

Prettier configuration (`.prettierrc`):
- No semicolons
- Single quotes (including JSX)
- Arrow function parens: avoid
- Tab width: 2
- No trailing commas
- Uses `prettier-plugin-tailwindcss` for class sorting

Match this style when writing new code.

## Environment Variables

Required for production:
- `RESEND_API_KEY` - For contact form email functionality

Optional:
- `CONTACT_FROM_EMAIL` - Contact form sender, e.g. `Umer Sagheer <contact@umersagheer.dev>` (needs the domain verified in Resend; defaults to the Resend test sender, which only delivers to the account owner)
- `CONTACT_TO_EMAIL` - Comma-separated recipients (defaults to mhadisb1212@gmail.com)

## Common Patterns

**Adding a new blog post**:
1. Create `src/content/posts/your-post-slug.mdx`
2. Add frontmatter: `title`, `summary`, `publishedAt` (YYYY-MM-DD), `author`, `image`
3. Post automatically appears on `/posts` (sorted by date)

**Adding a new project**:
1. Put screenshot originals in `assets/<slug>/` and list them in `scripts/project-screens.config.mjs`; run `pnpm screens`
2. Create `src/content/projects/<slug>.mdx` with the frontmatter above (and a logo in `public/images/projects/`)
3. `pnpm build` validates it; the project appears on `/projects`, the home page and at `/projects/<slug>`

**Adding MDX components**:
- Define component in `src/components/` (blog demos in `src/components/blog/<series>/`)
- Blog demo: add `export const X = dynamic(() => import(/* webpackChunkName: "demos-<post>" */ '...'))` to `src/components/blog/mdx-demos.tsx`, then import it into the `components` object in `src/components/mdx-content.tsx`. Demos used by the same post share a chunk name
- Small static (non-demo) components can be imported directly into `mdx-content.tsx`
- Component becomes available in all MDX files
