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
- Add new MDX components to the `components` object in this file

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
- Sends to: mhadisb1212@gmail.com (cc: umersagheer0075@gmail.com)
- Requires `RESEND_API_KEY` environment variable

### Styling & Theming

**UI Framework**: HeroUI v3 (`@heroui/react` + `@heroui/styles` 3.2.4) on Tailwind CSS v4 and React Aria. Migration history and decisions: `docs/heroui-v3-migration.md`.
- No HeroUI provider in v3. `src/app/providers.tsx` wraps the app with React Aria's `RouterProvider` (client-side routing for RAC links), `next-themes`, and `Toast.Provider`
- Theme switcher: the `Tabs` in `src/components/navbar.tsx`
- CSS-first config, no `tailwind.config.ts`: everything lives in `src/app/globals.css` (`@import 'tailwindcss'` then `@import '@heroui/styles'`, typography plugin, font utilities, theme overrides)
- Brand colours are overrides in `globals.css`: `--accent` (purple), `--secondary` (blue; a custom token, v3 has none), and v2's `--background` (#fff / #000)

**HeroUI v3 gotchas (each one shipped a bug during the migration)**:
- Compound parts are required even though TypeScript won't complain: `Switch`/`Checkbox` need `.Content > .Control > .Thumb/.Indicator`; `Tabs.Tab` needs `Tabs.Indicator`
- Tooltip triggers must be React Aria focusables (RAC `Link`/`Button`, `Tooltip.Trigger`, or wrap in `<Focusable>`); a plain `<a>` or `next/link` never opens the tooltip
- Extra Button colours are modifier classes in `globals.css` (`button--success`, `button--success-soft`, `button--warning-soft`, `button--brand-secondary`); don't use `bg-*` on a Button, it kills the hover state
- Semantic tokens (`accent`, `surface`, `muted`, `*-soft`, `*-soft-foreground`) already switch with the theme. Only use `dark:` for raw palette colours, images, `prose`, or to pick a different token in dark mode
- Render browser-only values (local timezone, resolved theme) behind `useIsClient()` from `src/hooks/useIsClient.ts` to avoid hydration mismatches

**Fonts**:
- Poppins (400, 600, 700, 800, 900) and Source Code Pro (400, 600, 700, 800, 900) via `next/font/google` in `src/app/layout.tsx`, exposed as CSS variables
- Applied with the `font-poppins` / `font-sourceCodePro` utilities defined in `globals.css`

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
- Define component in `src/components/`
- Import and add to `components` object in `src/components/mdx-content.tsx`
- Component becomes available in all MDX files
