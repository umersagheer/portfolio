# Blog Enhancement Plan — Research, Findings & Roadmap

## Overview

This document covers the complete plan to transform the portfolio blog from a basic MDX setup into a **Josh Comeau-level interactive blog** with:

1. **Redesigned post listing** — Square/vertical cards instead of horizontal list items
2. **Documentation-style MDX layout** — Centered content with a right-side Table of Contents sidebar
3. **Interactive blog components** — Embeddable, interactable demos inside MDX posts
4. **First blog post** — "Layout Animations with Framer Motion" with interactive examples

---

## Part 1: Post Listing Redesign (Square Cards)

### Current State

The current `/posts` page renders posts as simple horizontal list items (`<li>`) with title, summary, and date in a row. No images, no visual weight.

### Proposed Design

Switch to a **grid of square/vertical cards** that show the post's cover image, title, summary snippet, date, and reading time. Think of a blog like Vercel's or Tailwind's blog.

### Implementation

**Changes needed:**

1. **`src/components/posts.tsx`** — Complete redesign:
   - Switch from `<ul>` list to a responsive CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
   - Each card is a vertical block:
     - Cover image at the top (from frontmatter `image` field) — use `next/image` via HeroUI `Image`
     - Title below the image
     - Summary text (truncated to ~2 lines with `line-clamp-2`)
     - Date + estimated reading time at the bottom
     - Subtle hover effect (scale, shadow, or border glow matching our purple theme)
   - Cards link to `/posts/[postId]`

2. **`src/components/posts-with-search.tsx`** — Minor updates:
   - Adjust layout to accommodate grid instead of list
   - Search input spans full width above the grid

3. **`src/components/recent-posts.tsx`** — Update to use the new card style

4. **`src/libs/posts.ts`** — Add a `readingTime` utility:
   - Simple word count / 200 = minutes
   - Return as part of `PostMetadata`

5. **`src/types/index.ts`** — Add `readingTime?: number` to `PostMetadata`

6. **Frontmatter** — Ensure all posts have `image` field pointing to a valid cover image

### Design Details

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│                  │  │                  │  │                  │
│   Cover Image    │  │   Cover Image    │  │   Cover Image    │
│   (aspect 16:10) │  │                  │  │                  │
│                  │  │                  │  │                  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Title            │  │ Title            │  │ Title            │
│ Summary snippet  │  │ Summary snippet  │  │ Summary snippet  │
│ Date · 5 min     │  │ Date · 3 min     │  │ Date · 8 min     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

- Border: `border border-default-200 dark:border-default-100`
- Hover: subtle scale (`hover:scale-[1.02]`) + shadow or border color change to primary
- Border radius: `rounded-xl`
- Background: slightly elevated surface (`bg-default-50 dark:bg-default-50`)
- Transition: `transition-all duration-300`

---

## Part 2: Documentation-Style MDX Layout with Table of Contents

### Current State

The MDX post page (`src/app/posts/[postId]/page.tsx`) renders content in a single column with basic prose styling. No table of contents, no heading navigation.

### Proposed Design

A **two-column layout** inspired by HeroUI docs:
- **Left/Center (main content)**: The rendered MDX, max-width ~720px, with `prose` styling
- **Right sidebar (sticky ToC)**: A list of heading links extracted from the MDX content, with the active heading highlighted as the user scrolls

### How the Table of Contents Works

#### Step 1: Extract Headings from MDX Content

We need to parse the raw MDX content string (before rendering) to extract all `## Heading` and `### Subheading` entries. A simple regex approach:

```typescript
// src/libs/toc.ts
export type TocItem = {
  id: string       // slug for anchor link
  text: string     // heading text
  level: number    // 2 for ##, 3 for ###
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    toc.push({ id, text, level })
  }

  return toc
}
```

#### Step 2: Custom Heading Components in MDX

Register custom `h2` and `h3` components in `mdx-content.tsx` that automatically add `id` attributes matching the ToC slugs:

```typescript
function createHeading(level: number) {
  return function Heading({ children }: { children: React.ReactNode }) {
    const text = typeof children === 'string' ? children : ''
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    return <Tag id={id}>{children}</Tag>
  }
}

const components = {
  code: Code,
  h2: createHeading(2),
  h3: createHeading(3),
  Counter,
}
```

#### Step 3: Active Heading Tracking with IntersectionObserver

Create a client component `TableOfContents` that:
- Receives the `TocItem[]` array
- Uses `IntersectionObserver` to watch all heading elements
- Highlights the currently visible heading in the sidebar
- Clicking a ToC item smooth-scrolls to that heading

```typescript
// src/components/table-of-contents.tsx
'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/libs/utils' // or however you do classname merging

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%', threshold: 1.0 }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <nav className="sticky top-24 hidden xl:block">
      <p className="text-sm font-semibold mb-4">On this page</p>
      <ul className="space-y-2 text-sm border-l border-default-200">
        {items.map(item => (
          <li key={item.id} style={{ paddingLeft: (item.level - 2) * 12 }}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block pl-4 py-1 border-l-2 -ml-px transition-colors',
                activeId === item.id
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-default-500 hover:text-foreground'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

#### Step 4: Post Page Layout

Update `src/app/posts/[postId]/page.tsx`:

```tsx
<section className="pb-20">
  {/* Header: back button, image, title, meta */}
  <div className="relative flex gap-10">
    {/* Main content */}
    <main className="prose dark:prose-invert max-w-3xl flex-1">
      <MDXContent source={content} />
    </main>

    {/* Right sidebar ToC */}
    <aside className="hidden xl:block w-64 shrink-0">
      <TableOfContents items={toc} />
    </aside>
  </div>
</section>
```

### Key Behaviors (inspired by HeroUI docs sidebar)

- **Active heading auto-highlights**: As user scrolls, the currently visible heading gets bold + white text (dark mode) or primary color (light mode) + a left border accent
- **Sticky positioning**: The ToC stays fixed as you scroll (`sticky top-24`)
- **Responsive**: ToC only shows on `xl:` breakpoints. On mobile, it's hidden (could optionally add a mobile dropdown)
- **Smooth scroll**: Clicking a link smooth-scrolls to the heading (`scroll-behavior: smooth` or `scrollIntoView({ behavior: 'smooth' })`)
- **Indentation**: `h3` items are indented under their parent `h2`

---

## Part 3: Interactive Blog Components (The Josh Comeau Approach)

### How Josh Comeau Does It

Josh's blog is built with Next.js + MDX. Here's the key insight:

> **MDX = Markdown + JSX. You can embed ANY React component directly in your blog post.**

Josh creates **custom interactive components** for each blog post and registers them in his MDX pipeline. For example:

- **Code Playgrounds**: Editable code blocks with live preview (using Sandpack or custom iframes)
- **Interactive Demos**: React components with sliders, buttons, toggles that let readers experiment
- **Animated Diagrams**: SVG-based visualizations that respond to user input
- **Before/After Comparisons**: Side-by-side views showing the effect of a technique

### What We Already Have

Our setup already supports this pattern! Looking at `mdx-content.tsx`:

```tsx
const components = {
  code: Code,      // Syntax highlighting
  Counter,         // An interactive counter component
}
```

The `Counter` component is already proof that **we can embed interactive React components in MDX**. The pattern is:

1. Create a React component (client component with `'use client'`)
2. Import and add it to the `components` object in `mdx-content.tsx`
3. Use `<ComponentName />` directly in any `.mdx` file

### What We Need to Build for the Layout Animations Post

Here are the **interactive components** I recommend building for the blog post:

#### 1. `<LayoutAnimationDemo />` — The Core Concept

A visual demo showing **what layout animations solve**. Two modes:
- **Without animation**: Click a button, element jumps to new position (jarring)
- **With layout animation**: Same action, but the element smoothly morphs

**Implementation**: Two `<div>` containers. A shared element (e.g., a colored card) moves between them. Toggle between `position: absolute` with coordinates vs. Framer Motion's `layoutId`.

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LayoutAnimationDemo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Without animation */}
        <div className="border rounded-lg p-4 flex-1">
          <p className="text-sm mb-2 font-medium">Without animation</p>
          <div
            className={isExpanded ? 'w-full h-20 bg-primary rounded' : 'w-20 h-20 bg-primary rounded'}
            style={{ transition: 'none' }}
          />
        </div>
        {/* With layout animation */}
        <div className="border rounded-lg p-4 flex-1">
          <p className="text-sm mb-2 font-medium">With layout prop</p>
          <motion.div
            layout
            className="bg-secondary rounded"
            style={{ width: isExpanded ? '100%' : 80, height: 80 }}
          />
        </div>
      </div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Toggle
      </button>
    </div>
  )
}
```

#### 2. `<FlipExplainer />` — What's Under the Hood (FLIP technique)

An animated step-by-step diagram showing the **FLIP** technique:
- **F**irst: Record the element's starting position
- **L**ast: Move it to the end position instantly
- **I**nvert: Apply a transform to make it LOOK like it's still at the start
- **P**lay: Animate the transform back to zero

Each step highlights with a visual and short description. The user clicks through each step.

#### 3. `<LayoutIdDemo />` — Shared Layout Animations

Show how `layoutId` works in Framer Motion. A mini tab interface where clicking different tabs causes a highlight indicator to morph smoothly between them. This is the exact pattern used in your portfolio's `MorphingDialog`.

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const tabs = ['Home', 'About', 'Blog']

export default function LayoutIdDemo() {
  const [active, setActive] = useState('Home')

  return (
    <div className="flex gap-2 p-1 bg-default-100 rounded-lg w-fit">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className="relative px-4 py-2 text-sm rounded-md"
        >
          {active === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  )
}
```

#### 4. `<AnimatePresenceDemo />` — Enter/Exit Animations

Interactive demo showing `AnimatePresence` for mount/unmount animations. A list where items can be added/removed with smooth enter/exit transitions.

#### 5. `<SpringVisualizer />` — Spring Physics Playground

A slider-based playground where users can adjust `stiffness`, `damping`, and `mass` values and see how a spring animation behaves in real-time. Similar to what Josh does with his animation playgrounds.

#### 6. `<MorphingDialogDemo />` — Your Own Project's Example

Reference the actual `MorphingDialog` component from the portfolio and show a simplified version. This connects the blog content to the reader's real-world project (your portfolio itself).

### Registering Components

All interactive components go in `src/components/blog/` and get registered in `mdx-content.tsx`:

```tsx
import LayoutAnimationDemo from '@/components/blog/layout-animation-demo'
import FlipExplainer from '@/components/blog/flip-explainer'
import LayoutIdDemo from '@/components/blog/layout-id-demo'
import AnimatePresenceDemo from '@/components/blog/animate-presence-demo'
import SpringVisualizer from '@/components/blog/spring-visualizer'
import MorphingDialogDemo from '@/components/blog/morphing-dialog-demo'

const components = {
  code: Code,
  h2: createHeading(2),
  h3: createHeading(3),
  Counter,
  LayoutAnimationDemo,
  FlipExplainer,
  LayoutIdDemo,
  AnimatePresenceDemo,
  SpringVisualizer,
  MorphingDialogDemo,
}
```

Then in the MDX file, simply:

```mdx
## What are Layout Animations?

Layout animations solve the problem of animating CSS properties that are
normally impossible to animate smoothly — like `width`, `height`, and position changes.

<LayoutAnimationDemo />

As you can see, the left box jumps abruptly while the right box morphs smoothly...
```

### Technical Considerations

1. **All interactive components must be client components** (`'use client'`). MDX itself renders on the server via `next-mdx-remote/rsc`, but it can embed client components seamlessly.

2. **Keep components self-contained**: Each demo should include its own state, styles, and logic. Don't rely on external state management.

3. **Wrap demos in a styled container**: Create a reusable `<DemoContainer>` component with a consistent border, background, and padding — so all interactive demos look cohesive within the blog post.

4. **Framer Motion is already installed** (`framer-motion: ^11.3.31`) — no new dependencies needed for the animation demos.

5. **Consider a `<CodeBlock>` upgrade**: For showing code alongside demos (like Josh's "Code Playground"), we could use [Sandpack](https://sandpack.codesandbox.io/) or a simpler approach with a tabbed code/preview panel. **Suggestion**: Start simple with static code blocks + separate interactive demo. Add live code editing later as a v2 enhancement.

---

## Part 4: Blog Post Content — "Understanding Layout Animations"

### Proposed Outline

```
# Understanding Layout Animations with Framer Motion

## Introduction
- The problem: Some CSS properties can't be animated smoothly
- width, height, and position changes cause layout recalculations
- What if we could animate these smoothly?

## The Problem Visualized
<LayoutAnimationDemo />
- Left: No animation — element jumps when layout changes
- Right: With Framer Motion's `layout` prop — smooth morphing

## What's Actually Happening? The FLIP Technique
<FlipExplainer />
- First, Last, Invert, Play
- Step-by-step visual walkthrough
- Browser does layout → we reverse it with transforms → animate transforms
- Transforms ARE animatable (GPU-accelerated)

## Enter Framer Motion's `layout` Prop
- One prop to rule them all
- Under the hood, Framer Motion does FLIP for you automatically
- Code example showing how simple it is

## Shared Layout Animations with `layoutId`
<LayoutIdDemo />
- The magic of `layoutId` — elements morph between different components
- Tab indicators, navigation highlights, card expansions
- How it matches elements across the React tree

## AnimatePresence: Animating Mount & Unmount
<AnimatePresenceDemo />
- The challenge: React removes elements immediately from DOM
- AnimatePresence wraps children and delays removal
- exit animations become possible

## Spring Physics: Why Animations Feel Natural
<SpringVisualizer />
- Framer Motion uses spring physics by default
- Stiffness, damping, and mass
- Play with the values and see the difference
- Why springs > duration-based easing for UI

## Real-World Example: The Morphing Dialog
<MorphingDialogDemo />
- This portfolio uses a MorphingDialog for project cards
- It's a shared layout animation between a card and a dialog
- Walk through the simplified implementation

## Conclusion
- Layout animations make your UI feel alive
- Framer Motion abstracts the complexity
- Start with `layout` prop, graduate to `layoutId`
- Further reading and resources
```

### Writing Style Guidelines

- **Conversational and warm** — like explaining to a friend
- **Show, don't tell** — every concept gets an interactive demo BEFORE the explanation
- **Progressive disclosure** — start simple, build complexity
- **"Aha!" moments** — structure so readers have discoveries
- **Short paragraphs** — 2-3 sentences max
- **Code snippets are minimal** — only show what's needed, not full files

---

## Part 5: Implementation Roadmap

### Phase 1: Infrastructure (Do First)

1. Add heading utilities (`src/libs/toc.ts`)
2. Create `TableOfContents` component
3. Update `mdx-content.tsx` with heading components
4. Update post page layout to two-column
5. Add `readingTime` to post metadata

### Phase 2: Post Listing Redesign

6. Redesign `posts.tsx` to grid cards
7. Update `posts-with-search.tsx` layout
8. Update `recent-posts.tsx` to match
9. Ensure all posts have cover images

### Phase 3: Interactive Components

10. Create `src/components/blog/` directory
11. Build `DemoContainer` wrapper component
12. Build `LayoutAnimationDemo`
13. Build `FlipExplainer`
14. Build `LayoutIdDemo`
15. Build `AnimatePresenceDemo`
16. Build `SpringVisualizer`
17. Build `MorphingDialogDemo`
18. Register all in `mdx-content.tsx`

### Phase 4: Write the Blog Post

19. Create `src/content/posts/layout-animations.mdx`
20. Write content following the outline above
21. Add cover image for the post
22. Test all interactive components within the post

### Phase 5: Polish

23. Test responsive behavior (mobile, tablet, desktop)
24. Ensure dark/light mode works for all demos
25. Performance audit (lazy load heavy components if needed)
26. Verify build succeeds (`pnpm build`)

---

## Dependencies & Packages

**Already installed (no changes needed):**
- `framer-motion` — For all animation demos
- `next-mdx-remote` — MDX rendering
- `sugar-high` — Syntax highlighting
- `@heroui/react` — UI components
- `@tailwindcss/typography` — Prose styling
- `lucide-react` — Icons

**Optional additions (future enhancements):**
- `@codesandbox/sandpack-react` — For live code playgrounds (v2)
- `rehype-slug` / `rehype-autolink-headings` — For automatic heading IDs via rehype plugins (alternative to custom components — but custom approach is simpler and has no extra deps)

---

## Key Decisions & Recommendations

### 1. Start Simple, Iterate

Don't try to build a Sandpack code playground on day 1. Josh's interactive components are React components with state — that's it. No live code editing needed. A slider that changes a spring value is just `useState` + `<input type="range" />`.

### 2. Custom Heading Components > Rehype Plugins

Using custom `h2`/`h3` components in the MDX `components` object is simpler than configuring rehype plugins and doesn't require changing the Next.js MDX pipeline. It's also more flexible.

### 3. IntersectionObserver > Scroll Event Listeners

For the ToC active heading tracking, `IntersectionObserver` is more performant and doesn't require throttling/debouncing. The `rootMargin: '0% 0% -80% 0%'` trick means a heading becomes "active" when it's in the top 20% of the viewport.

### 4. Component Organization

Put all blog-specific interactive components in `src/components/blog/`. This keeps them separate from the site's UI components and makes it clear they're for MDX embedding.

### 5. Consistent Demo Styling

Create a `<DemoContainer>` with consistent styling:
```tsx
export function DemoContainer({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="my-8 rounded-xl border border-default-200 bg-default-50 p-6">
      {title && <p className="mb-4 text-sm font-medium text-default-500">{title}</p>}
      {children}
    </div>
  )
}
```

This gives every interactive demo a consistent "sandbox" appearance — clearly separated from the prose text, similar to Josh's approach.

---

## Summary

The transformation involves three layers:

| Layer | What | Effort |
|-------|------|--------|
| **Post Listing** | Horizontal list → Square card grid | Small |
| **MDX Layout** | Single column → Content + ToC sidebar | Medium |
| **Interactive Components** | Static text → Embedded React demos | Medium-Large |
| **Blog Content** | Write the layout animations post | Large (content creation) |

The technical foundation is already solid. We have MDX, Framer Motion, and HeroUI. The main work is building the interactive components and writing quality content. The architectural changes (ToC, card grid) are straightforward.
