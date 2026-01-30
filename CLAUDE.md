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
- Includes custom components: `Code` (syntax highlighting via `sugar-high`), `Counter`
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

**UI Framework**: HeroUI (v2.7.4) - fork/successor of NextUI
- Provider: `src/app/nextui-provider.tsx` wraps app with HeroUI + theme support
- Theme switcher: `src/components/theme-switcher.tsx`
- Custom theme colors defined in `tailwind.config.ts` (purple primary, blue secondary)

**Tailwind customizations**:
- Custom utilities: `bg-grid`, `bg-grid-small`, `bg-dot` for SVG background patterns
- Grid patterns component: `src/components/grid-patterns.tsx`
- Typography plugin enabled for MDX content styling

**Fonts**:
- Poppins (400, 600, 700, 800, 900) - Main font
- Source Code Pro (400, 600, 700, 800, 900) - Monospace for code
- Defined in `src/app/layout.tsx` via `next/font/google`

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
