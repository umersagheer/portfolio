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
```

## Key Architecture

### Content Management System

**MDX-based content** stored in `src/content/`:
- `posts/` - Blog posts as `.mdx` files with frontmatter (title, summary, publishedAt, author, image)
- `projects/` - Project pages as `.mdx` files with same frontmatter structure

**Content utilities** in `src/libs/`:
- `posts.ts` - Functions: `getPostById()`, `getPosts()`, sorted by publishedAt descending
- `projects.ts` - Functions: `getProjectById()`, `getProjects()`, sorted by publishedAt descending
- Both use `gray-matter` for frontmatter parsing and `fs` for file reading

**MDX rendering**:
- `src/components/mdx-content.tsx` - Uses `next-mdx-remote/rsc` for server-side MDX rendering
- Includes custom components: `Code` (syntax highlighting via `sugar-high`) plus the interactive blog demos in `src/components/blog/`
- Blog demos are registered in `src/components/blog/mdx-demos.tsx` (a `'use client'` module of `next/dynamic` imports, one chunk per post via `webpackChunkName`) and imported into the `components` object. Never import a demo statically into `mdx-content.tsx`: `/posts/[postId]` is one route, so a static import ships that demo to every post, and `dynamic()` called from the server component does not split client components

### Projects Data

Projects are defined in TWO places:
1. **Structured data**: `src/content/projects/index.tsx` - Array with detailed project info (features, tech stack, images, links)
2. **MDX content**: `src/content/projects/*.mdx` - Long-form project descriptions

When adding projects, update BOTH locations to maintain consistency.

### Routing Structure

- `/` - Home page with intro, recent projects, tech stack grid
- `/posts` - All blog posts with search functionality
- `/posts/[postId]` - Individual post page (dynamic route, postId = filename without .mdx)
- `/projects` - All projects listing
- `/projects/[projectId]` - Individual project page (dynamic route, projectId = filename without .mdx)
- `/contact` - Contact form page

### Server Actions

`src/libs/actions.ts`:
- `sendEmail()` - Server action for contact form using Resend API
- Validates input with Zod schema from `src/libs/schemas.ts`
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
1. Create `src/content/projects/your-project-slug.mdx` with frontmatter
2. Add project data to `src/content/projects/index.tsx` array
3. Project appears on `/projects` and homepage

**Adding MDX components**:
- Define component in `src/components/` (blog demos in `src/components/blog/<series>/`)
- Blog demo: add `export const X = dynamic(() => import(/* webpackChunkName: "demos-<post>" */ '...'))` to `src/components/blog/mdx-demos.tsx`, then import it into the `components` object in `src/components/mdx-content.tsx`. Demos used by the same post share a chunk name
- Small static (non-demo) components can be imported directly into `mdx-content.tsx`
- Component becomes available in all MDX files
