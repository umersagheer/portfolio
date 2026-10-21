# Portfolio Enhancement Plan

> **Living document.** Update the status table and phase log after every phase.
> Started: 2026-10-21 · Base commit: `e034c89` · Live: https://umersagheer.dev

---

## The goal

1. **Projects get their own pages** with quick navigation back, instead of the modal.
2. **A proper About page.** It should show a full-stack engineer who loves design, builds optimised backends, does DevOps and follows best practices. It should read as a person, not a list.
3. **A curated visual identity.** It draws on four inspiration sites and uses the iso-glow style *sparingly*.
4. **Fix what the audit found:** broken production behaviour, performance, accessibility and SEO.

---

## Phase status

| Phase | Scope | Status | Commits |
|---|---|---|---|
| **1** | Fix what's broken (no design decisions) | ⬜ | |
| **2** | Performance & hygiene | ⬜ | |
| **3** | Visual system ("technical drawing") | ⬜ | |
| **4** | Projects as pages (+ Munshi) | ⬜ | |
| **5** | About page (+ iso-glow Fig. 01) | ⬜ | |
| **6** | Home page recomposition | ⬜ | |
| **7** | SEO & sharing | ⬜ | |
| **8** | Delight: ⌘K palette, 404 figure | ⬜ | |

Legend: ⬜ Not started · 📝 Planned (plan approved) · 🔄 In progress · ✅ Done · ⚠️ Blocked

**Why this order:**
- **1–2 first:** they're mechanical, low-risk, and make production correct before anything is redesigned.
- **3 before 4–6:** the new pages are built once, in the new visual language, instead of being restyled later.
- **4 before 5:** the About page links to project pages as proof.
- **5 before 6:** the home hero borrows its voice from the About page.
- **7 after the routes exist:** the sitemap and OG images cover `/about` and the project pages.

---

## How we work each phase

1. **Plan mode.** Explore the code for that phase only, write a concrete plan (files, steps, risks) and raise open questions with AskUserQuestion. You approve the plan before any edit.
2. **Execute** directly on `master`, one commit per sub-item. Commit messages describe the change only, in conventional style (e.g. `fix: render navbar on the server`). They never mention phases, item IDs or this plan, and never carry a Claude co-author trailer. This tracker maps items to commit hashes.
3. **Verify:**
   - `pnpm build` and `pnpm lint`.
   - Browser check in light and dark themes, at desktop and mobile (390px) widths.
   - Compare against the baseline numbers below.
4. **Close out:** update this tracker (status table, phase log with commit hashes, new decisions), and update `CLAUDE.md` where architecture changed. Then start the next phase.

Phases 1 and 2 are small enough to plan in one session if you prefer. Phases 3–6 should each get their own plan.

---

## Key decisions

| # | Decision | Date |
|---|---|---|
| D1 | **Drafts stay reachable by direct URL** (an unlisted preview). This is intentional and not a leak. Never set `dynamicParams = false` on `/posts/[postId]`. Anything that *enumerates* posts (sitemap, RSS, ⌘K, prev/next) must use the filtered `getAllPostMetadata()`. | 2026-10-21 |
| D2 | **Projects move to dedicated pages**; the modal goes. | 2026-10-21 |
| D3 | **Design direction is "the site as a technical drawing":** monochrome hairlines on a flat panel, with *one accent colour only on what is live*. This is iso-glow's rule applied site-wide. | 2026-10-21 |
| D4 | **Exactly two iso-glow figures:** About (Fig. 01, "The whole stack") and 404 (Fig. 404, "Unplugged"). Everywhere else uses the *rule*, not the figures. | 2026-10-21 |
| D5 | **Typography is a serif display face for headings, a clean sans for body, and mono only for labels, dates and `Fig.` captions.** Poppins is dropped. | 2026-10-21 |
| D6 | **The hero status pill reads "Open to roles & freelance".** | 2026-10-21 |
| D7 | **Munshi replaces RFC as a project.** Munshi is the product and company: a family of management systems (restaurant first, grocery coming). RFC is Munshi's *first customer*, not the project. Source: `~/Code/RFC/munshi-site` (marketing site), `~/Code/RFC/rfc-pos` (the POS), live customer page `rfc.hotel.munshi.app`. | 2026-10-21 |
| D8 | **Screenshots never show production data, and device frames are drawn in code.** Munshi uses its demo shots; NourishWise and Meridian use flat Figma frame exports; Engagemo is captured from a local `staging` run seeded with mock data, including every AI output. See [Screenshot strategy](#screenshot-strategy). | 2026-10-22 |

---

## Audit findings

**Method:**
- The live site (umersagheer.dev) was browsed at desktop and mobile widths and in both themes.
- Measurements were taken in the browser.
- A read-only code audit was run, along with a local `pnpm build` on Next 15.5.25.

Each finding is tagged with the phase that fixes it.

### Baseline numbers (for before/after comparison)

```
Route                     First Load JS
/                            247 kB
/contact                     191 kB
/posts                       268 kB
/posts/[postId]              449 kB   ← every post loads all ~40 demos
/projects                    240 kB
/projects/[projectId]        421 kB   ← plain markdown, still loads every demo
Shared by all                103 kB

Home (live)   TTFB 93 ms · FCP 476 ms · LCP 644 ms (avatar) · CLS 0
CSS           466 KB raw / 48 KB gzip (mostly @heroui/styles)
public/       13 MB (post covers 6.9 MB, RFC screenshots 5.1 MB)
Fonts         Poppins 5 files preloaded (unused) + Source Code Pro 1 variable file
```

### Design (from browsing the live site)

| ID | Finding | Phase |
|---|---|---|
| G1 | **Hero is thin:** "Software Engineer" plus one sentence. It doesn't say full-stack, design-minded, backend or DevOps, and has no availability, location, links or CTA. | 6 |
| G2 | **Every heading is bold mono** ("What I worked on…", "What I work with…"), which reads like a template. The inspirations keep mono for metadata only. | 3 |
| G3 | **The blurred blob background (`bbblurry.svg`) feels generic.** The inspirations use flat panels with structural hairlines. | 3 |
| G4 | **Nav is icon-only** (the bookmark icon means "Posts"). The three-way theme switch takes as much space as the nav itself. | 3 |
| G5 | **Project rows show only a logo and a title:** no visual, role, stack or status. | 4 |
| G6 | **The "What I work with" bento has 7 items**, its uneven tile sizes carry no meaning, and it's stale against the real project stacks (missing NestJS, Expo, Supabase, Postgres, Socket.IO, LangChain). | 5, 6 |
| G7 | **No footer:** the page just stops. | 3 |
| G8 | **No About page;** `/about` returns 404. | 5 |
| G9 | **The 404 page is the Next.js default.** | 8 |
| G10 | **Strength to keep: the post page.** The author rail, prev/next, TOC and interactive demos beat all four inspirations, and the layout should be reused for project pages. | 4 |

### Broken or incorrect behaviour

| ID | Finding | Evidence | Phase |
|---|---|---|---|
| B1 | **30 of 46 project screenshots don't exist** (Engagemo, NourishWise, Meridian), so 3 of 4 modals show broken images. | `src/content/projects/index.tsx:235-247,358-371,520-531`; live `/images/postpartum/welcome.png` returns 404 | 1 (hide), 4 (replace) |
| B2 | **Two template project pages are live and indexable:** `/projects/ecommerce-store` (credited to "Hamed Bahram") and `/projects/nextjs-mdx-portfolio`. Both have broken cover images, and nothing links to them. | `src/content/projects/*.mdx` | 1 |
| B3 | **Contact form shows "Thank you" even when sending fails.** `sendEmail` returns `{ error }` and the client never checks it. `reset()` in `finally` wipes the form on error, `result.error.format` is passed uncalled, mail is sent from Resend's sandbox `Acme <onboarding@resend.dev>`, `to` and `cc` are the same address, and the email field is `type='text'`. | `src/libs/actions.ts:13-28`, `src/components/contact-form.tsx:42-55,86` | 1 |
| B4 | **Navbar renders `null` until mounted**, so it isn't in the server HTML (crawlers and no-JS visitors get no nav) and it pops in late. | `src/components/navbar.tsx:17-23` | 1 |
| B5 | **Home and `/posts` sections are rendered at `opacity:0; filter:blur(6px)` until JS runs.** On slow devices the page is blank or blurred; it was still blurred 3 s after load in testing. | `src/components/blur-fade.tsx:63-67` | 1 |
| B6 | **Dates parse as UTC and display in local time**, so `2026-07-19` shows as July 18 west of UTC, and client components hit hydration mismatches. | `src/libs/utils.ts:3-9` | 1 |
| B7 | **NourishWise code link is a placeholder** (`github.com/your-username/postpartum`), and the "Code" chip always shows an "Access Restricted" toast. Some feature icons don't match their text (a Supabase icon on Socket.IO). | `src/content/projects/index.tsx:153,254,396,406`; `src/components/projects.tsx:117-135` | 1 (placeholder), 4 |
| B8 | **Likes API integrity:** it accepts any `postId` (creating DB rows), its 5-like cap is check-then-write without a transaction (races), it runs sequential reads, and it has no rate limit. Validate against *all* posts including drafts (D1). | `src/app/api/posts/[postId]/likes/route.ts:19-25`, `src/libs/likes.ts:69-129` | 1 |
| B9 | **Home and `/projects` render the same full list of 4**, so "All projects" leads to identical content. | `src/components/recent-projects.tsx:12` | 4, 6 |

### Performance

| ID | Finding | Phase |
|---|---|---|
| P1 | **Every post and project page statically imports all ~40 blog demos** into one MDX `components` map (449 kB First Load). The fix is per-post demo maps (frontmatter) or `next/dynamic`, plus a demo-free map for projects. | 2 |
| P2 | **Avatar is oversized and lazy-loaded:** `width={832}` for an 80px box (≈30 KB instead of ≈2 KB). It should be `width/height={80}` plus `priority`. | 2 |
| P3 | **Post cover has no `sizes`**, so it fetches `w=3840` for a ~736px slot. | 2 |
| P4 | **axios ships ≈19 KB gzip** to posts and `/contact` for one `isAxiosError` check that can never match a server-action error. Replace it with `fetch` and drop it. | 2 |
| P5 | **framer-motion loads in the layout chunk on every page** (≈46 KB gzip with tabler). Consider `LazyMotion` / `m.*`. | 2 (optional) |
| P6 | **Project modal code (≈50 KB gzip) loads on `/` and `/projects`** even though the modal starts closed. This disappears with D2. | 4 |
| P7 | **Two like buttons mount per post** (desktop and mobile, CSS hides one), causing double GETs and split state. | 2 |
| P8 | **Poppins: 5 font files are preloaded on every page but never applied.** Body text actually renders in the system sans. | 3 |
| P9 | **Tech icons load from an unpinned third-party branch** (`thesvg@main`) and refetch on theme swap. TheSvgIcon stays the icon standard; pin it to a commit. | 2 |
| P10 | **No `images.formats` (AVIF)** in `next.config.mjs`. | 2 |

### Accessibility

| ID | Finding | Phase |
|---|---|---|
| A1 | **Project cards can't be opened by keyboard** (a plain `div` with `onClick`), and the dialog has no focus trap or focus return. This disappears with D2. | 4 |
| A2 | **Nav links have no accessible name** (icon only), and each is a `<motion.button>` inside a `<Link>`, giving two tab stops per item. | 1 |
| A3 | **No reduced-motion handling** outside the Git demos. Fix with `<MotionConfig reducedMotion='user'>` plus a CSS media query for the marquee and smooth scroll. | 1 |
| A4 | **Home has no `h1`**, `/contact` has only an `h2`, and post and project pages nest a `<main>` inside the layout's `<main>`. | 1 (`main`), 6 (`h1`) |
| A5 | **Redundant or generic alt text:** project logos repeat the visible title, all marquee images say "Project screenshot", and TheSvgIcon falls back to the slug. | 4, 2 |
| A6 | **The post page hides the `<html>` scrollbar** with an inline style. | 3 |

### Hygiene

| ID | Finding | Phase |
|---|---|---|
| H1 | **Unused dependencies:** `@tsparticles/engine`, `/react` and `/slim`. | 2 |
| H2 | **Dev-only packages in `dependencies`:** `remotion`, `@remotion/cli`, `@remotion/google-fonts` (≈100 MB), `prettier`, `prettier-plugin-tailwindcss`, `dotenv`. Remotion should get its own tsconfig, and `metadata.ts` should import `brandDomain` from `@/constants/site-profile`, not `@/remotion/...`. | 2 |
| H3 | **Dead code:** `react-glow.tsx`, `svg-glow-wrapper.tsx` (+ `useMousePosition`), `ui/animated-beam.tsx`, `gradient.tsx` and `grid-patterns.tsx` (imported but never rendered), `icons/glow/*`, `getIcon` and the `icons/index.tsx` map (0 callers), plus the unused `cn` import, an empty fixed `div` in the layout, and `NewsLetterSchema`. | 2 |
| H4 | **Out-of-date tooling and config:** `@types/node ^20` vs engines `24.x`; eslint 8 with the deprecated `next lint` (removed in Next 16); `next.config.mjs` still lists `better-sqlite3`; stale `components.json` and create-next-app `README.md`; `.gitignore` ignores `.github`. | 2 |
| H5 | **Relative imports break the `@/` rule** in `recent-projects`, `recent-posts`, `tech-stack-grid`, `navbar`, `posts-with-search` and `actions`. | 2 |
| H6 | **Research notes tracked inside `src/`** (`src/findings/`) and loose root notes (`plan.md`, `BLOG_ENHANCEMENT_PLAN.md`). Decide where they live. | 2 (ask) |

### SEO & sharing

| ID | Finding | Phase |
|---|---|---|
| S1 | **Every page except posts has the same title** ("Umer Sagheer") **and description** ("Personal Portfolio of Umer Sagheer"), and there's no title template. | 7 |
| S2 | **No `sitemap.ts`, `robots.ts` or RSS feed.** `/sitemap.xml`, `/robots.txt` and `/rss.xml` all return 404. | 7 |
| S3 | **No default OG or Twitter image**, so shares of home, projects and contact have no image, and there's no `twitter.creator`. | 7 |
| S4 | **No JSON-LD:** `Person`/`WebSite` on home, `BlogPosting` on posts. | 7 |

---

## Inspiration: what we take and why

| Site | Take | Why | Leave |
|---|---|---|---|
| [syedsubhan.in](https://www.syedsubhan.in/) | ⌘K command palette; "Available" status pill; a closing CTA with a line of personality | ⌘K suits a developer audience and frees the nav from the theme switch | Three floating controls at once (top pill, bottom dock, search button), anime avatar, Playfair everywhere |
| [imlunahey.com](https://imlunahey.com/) | Mono section numbering (`01 //`); a status card (location, local time, stack); a `~/now` block; a **colophon footer listing the site's data sources and cache times** | The colophon shows backend thinking in a human way: "here's how this page is built and cached" | Full terminal aesthetic, dot-matrix display font, live weather and music widgets |
| [harshitparmar.in](https://www.harshitparmar.in/) | Project card layout (framed screenshot, stack chips, status, "View details →"); project page sections (Overview, Learnings, **Challenges I faced**); tech chips inline in prose; dashed rails | It's the closest match to what we want for projects, and "Challenges" is where engineering judgement shows | Quote footer; project pages with no way back or to the next project |
| [10xshivam.dev](https://10xshivam.dev/) | A one-line role tagline (frontend • backend • devops); playful first-person copy; an **About page with the stack grouped by layer and a journey grouped by year**; local time in the footer | It's friendly and human, which is exactly the tone asked for | Figma-style selection boxes on labels (a second visual language that would fight iso-glow) |

---

## Phases

### Phase 1: Fix what's broken

Production correctness only. No visual redesign.

- **1a. Projects quick fix:**
  - Stop rendering missing screenshots (B1) and remove the placeholder code link (B7).
  - Delete the two template MDX projects (B2); `/projects/[projectId]` then has no pages until Phase 4.
- **1b. Navbar:**
  - Render it on the server and gate only the theme control behind `useIsClient()` (B4).
  - Make each nav item a single `Link` with an `aria-label` (A2).
- **1c. Motion:**
  - Make `BlurFade` visible by default and animate only after mount (B5).
  - Add `MotionConfig reducedMotion='user'` and the reduced-motion CSS (A3).
- **1d. Contact form:**
  - Check the server result, show an error toast, keep the input on failure, and use `type='email'` (B3).
  - Fix the sender address and the `to`/`cc` recipients.
  - ❓ Is a sending domain verified in Resend?
- **1e. `formatDate`:** pass `timeZone: 'UTC'` (B6).
- **1f. Likes API:** validate `postId` against all posts, make the cap an atomic conditional update, and run the reads in parallel (B8).
- **1g. Nested `<main>`:** change the inner one on post and project pages to `<article>`/`<div>` (A4).

**Done when:** no broken images on production, a working nav in the server HTML, a contact form that reports failures honestly, and identical dates in every timezone.

### Phase 2: Performance & hygiene

- **2a. Per-post demo loading (P1).** This is the biggest win: target post First Load well under 300 kB. Project MDX gets a demo-free component map.
- **2b. Images:**
  - Fix the avatar size and add `priority` (P2), and add cover `sizes` (P3).
  - Enable AVIF (P10).
  - Pin TheSvgIcon to a commit and use `alt=''` beside visible labels (P9, A5).
- **2c. Dependencies:**
  - Remove tsparticles and axios (H1, P4).
  - Move remotion, prettier and dotenv to devDependencies, and give remotion its own tsconfig (H2).
  - Bump `@types/node` to 24 and drop `better-sqlite3` from the config (H4).
- **2d. Dead code:** delete the H3 list and fix the relative imports (H5).
- **2e. Like buttons:** mount one like button per post (P7).
- **2f. Optional:** `LazyMotion` (P5); eslint 9 flat config via `@next/codemod next-lint-to-eslint-cli` (H4).
- **2g.** ❓ Where should `src/findings/` and the root notes live (H6)?

**Done when:** the build route table shows smaller First Load JS for posts and projects, and nothing in the H lists remains.

### Phase 3: Visual system ("technical drawing")

Applied to the existing pages without restructuring their content.

- **3a. Tokens:**
  - A flat panel background (drop `bbblurry.svg`), hairline and rail colours, and one accent (brand purple) reserved for live states. These are the active nav item, the status dot, hover and focus, the current TOC item, and lit figure parts.
  - `--secondary` (blue) stays for blog demos only.
- **3b. Type (D5):**
  - A serif display face for headings. ❓ Choose from a specimen page, e.g. Instrument Serif, Newsreader or Fraunces.
  - A sans for body text (e.g. Geist or Inter), and mono (keep Source Code Pro or move to JetBrains Mono) for labels, dates and `Fig.` captions.
  - Drop Poppins (P8).
- **3c. Frame:**
  - Dashed hairline rails around the content column.
  - A shared `SectionHeader`: a mono `01 //` label above a serif title.
- **3d. Nav:**
  - Text labels on the nav items (G4).
  - A compact theme control. ❓ A single icon that cycles light/dark/system, or a compact three-way control? ⌘K also offers it in Phase 8.
- **3e. Footer (G7):**
  - A CTA line, socials, and your local time (PKT).
  - A **colophon**: how this site works. Posts are static MDX, likes are stored in Postgres via Prisma, the contact form sends through Resend, and it's hosted on Vercel.
- **3f.** Apply to home, `/posts`, the post page, and `/contact`. Restore the post page scrollbar (A6).

**Done when:** every existing page uses the new tokens and type in both themes, and the footer is live. Check with screenshots before and after.

### Phase 4: Projects as pages (+ Munshi)

- **4a. Data model.** One MDX file per project with typed frontmatter, validated by Zod. This replaces the split between `index.tsx` and the MDX files, which is how the screenshots and template pages drifted.
  - Fields: `slug`, `title`, `tagline`, `role`, `client`, `period`, `platform` (web, iOS/Android, tablet), `status`, `stack[]` (icon slugs, no JSX), `links` {live, code, appStore, playStore}, `cover`, `screenshots[]` {src, srcDark?, alt, caption, device}, `featured`, `order`.
- **4b. Content:** Munshi (D7), Engagemo, NourishWise and Meridian. The case-study template is Problem → What I built / my role → How it works → Decisions & trade-offs → The hard part → Outcome / what I'd change.
  - Munshi tells the product story: a family of management systems, RFC as the first customer, grocery coming next.
  - ❓ The case-study details need your input; we'll do this teach-then-draft, one project at a time.
- **4c. Screenshot pipeline:** see [Screenshot strategy](#screenshot-strategy). Images live in `public/images/projects/<slug>/`, go through a processing script, and get device frames (phone, tablet, browser).
- **4d. `/projects` list:** server-rendered cards with a framed cover, role, stack chips, a status chip and "View case study →" (G5, B9).
- **4e. `/projects/[slug]`:** reuse the three-column post layout (G10).
  - Sticky left rail: **← All projects**, role, client, period, platform, stack, links, prev/next.
  - Centre: the case study plus a gallery with a lightbox.
  - Right: the TOC.
  - Keyboard: `Esc` goes to `/projects`; `←`/`→` go to prev/next.
  - Scroll position is restored on Back.
  - `generateStaticParams` + `dynamicParams = false` on *projects only* (D1), plus per-project metadata.
- **4f.** Remove the project modal code (`projects.tsx` modal, `screenshot-marquee`, and `morphing-dialog` if no blog demo uses it; check `morphing-dialog-demo`) (P6, A1).
- **4g. Optional:** a view transition that morphs the card cover into the page hero.
- **4h.** Update the Projects Data section of `CLAUDE.md`.

**Done when:** every project has a shareable URL, Back and prev/next work from the keyboard, and the home page no longer bundles any modal code.

### Phase 5: About page (+ iso-glow Fig. 01)

**Core idea: every claim comes with proof.** Each trait is a short story that links to something already shipped.

- **5a. Content interview.** Structured questions plus free text: background, years in the field, current role, what you do off the screen. Then teach-then-draft, section by section.
- **5b. Sections:**
  1. **Opening:** 3–4 human sentences. Direction: *"I build the whole thing: the screen you tap, the API behind it, and the pipeline that ships it."*
  2. **How I work.** Four traits, each with proof:

     | Trait | Proof |
     |---|---|
     | Design and motion | layout-animations post |
     | Backend correctness | timezones and WebSockets posts, Munshi offline-first |
     | Fundamentals | Git series |
     | DevOps | this site's own colophon, Docker, Vercel, CI |

  3. **Now:** what you're building and learning this month.
  4. **Toolbox by layer**, with honest notes ("daily", "comfortable", "learning") instead of a logo wall. This replaces the home bento (G6).
  5. **Journey** grouped by year.
  6. **Off the clock.**
  7. **CTA.**
- **5c. iso-glow Fig. 01, "The whole stack":**
  - The drawing is a phone, laptop and server rack connected by wires.
  - As each "How I work" trait scrolls into view, its layer lights in the brand accent: the screen for design, the rack lights for backend, a pulse travelling down the wire for deploy.
  - It also responds to click and keyboard, and shows a static lit state under reduced motion.
  - It is ported into a React client component (SVG), lazy-loaded so it doesn't touch the home bundle, and coloured only through tokens.
- **5d.** Add About to the nav.

**Done when:** `/about` is live, the figure works in both themes and under reduced motion, and every trait links to real proof.

### Phase 6: Home page recomposition

- **6a. Hero:**
  - An `h1` with your name and a one-line positioning tagline (A4, G1).
  - The status pill "Open to roles & freelance" (D6), with location and local time.
  - Two sentences of intro with inline tech chips, plus primary links.
- **6b. Selected work:** 3 featured project cards linking to their case studies.
- **6c. Interactive explainers:** the posts, presented as the differentiator they are.
- **6d. About teaser** linking to `/about`.
- **6e.** Remove the "What I work with" grid (G6).

**Done when:** within one screen a visitor knows who you are, what you do and whether you're available, and the page leads into work, writing and About.

### Phase 7: SEO & sharing

- **7a.** Title template `%s · Umer Sagheer`, plus per-page titles and descriptions (S1).
- **7b.** `app/sitemap.ts`, `app/robots.ts` and an RSS route, all built from the **filtered** post list (D1) plus projects and static routes (S2).
- **7c.** A default `opengraph-image.tsx` in the new visual language, per-project OG images, and `twitter.creator` (S3).
- **7d.** JSON-LD: `Person` + `WebSite` on home, `BlogPosting` on posts, `CreativeWork` on projects (S4).
- **7e.** ❓ Should draft posts get a `noindex` robots meta? This would keep unlisted previews out of search if a link leaks, and fits D1.

### Phase 8: Delight

- **8a. ⌘K command palette:** pages, posts (filtered), projects, a theme switch, and copy email.
- **8b. 404 with iso-glow Fig. 404, "Unplugged"** (G9): a cable pulled from its socket. Clicking it plugs it back in and sends you home.
- **8c. Optional:** view transitions between list and detail pages for both posts and projects.

---

## Screenshot strategy

These rules apply to every project:
- **No production data** in any shot.
- **4–6 curated shots per project**, each supporting a section of the case study.
- **Device frames are drawn in code** (hairline, theme-aware), never baked into images.
- **Originals stay local; only processed WebP is committed.**

| Project | Source (decided 2026-10-22) | Notes |
|---|---|---|
| **Munshi** | The existing light and dark shots in `~/Code/RFC/munshi-site/public/screens/` (22 files), made by `rfc-pos`'s `bun run demo:refresh` from the seeded "Grill Street" restaurant. | Light and dark pairs swap with the portfolio theme. No action needed from you. |
| **NourishWise, Meridian** | **Flat Figma design-frame exports**: full screen, 9:41 status bar, no device frame, PNG at 3× (4× is fine; the UI is vector). | Long scrolling frames are fine: the phone frame shows a device-height window and you can scroll inside it. Store marketing mockups and photoreal phone exports are *not* used, because their screen content is low resolution and the headlines are baked in. Fix design-file typos before export, e.g. "Over whlemed" on the NourishWise home. |
| **Engagemo** | Captured from a **local run of the `staging` branch with seeded demo data** (see below). | Engagemo is one of the strongest projects: 30–40 institutions onboard. |

### Engagemo demo capture (runs in Phase 4, under its own plan)

**Isolation.** Nothing here touches your work or the client repo.
- **Separate checkout:** a `git worktree` of `staging` outside the main checkout, so your current branch and working tree are untouched.
- **Separate database, no Docker:** a dedicated database on the native Homebrew Postgres 18 and its own DB index on the local Redis, so `db:reset-and-seed` can't wipe local dev data.
- **Local-only `.env`:** built from `.env.example` with local values only. Never staging or production credentials.
- **Nothing committed or pushed to the Engagemo repo.** The demo seed script lives only in the worktree (or here under `assets/`).

**Seed data.** A made-up institution with teachers, students, courses, assignments and essays.
- **Every AI or external output is inserted as mock data:** feedback, scores, reports, OCR text, oral-defense transcripts and evaluations. No calls go out to OpenAI, Gemini, ElevenLabs, GCP Vision, LiveKit, Stripe or S3.

**Shots (about 6)**, covering all four chosen feature areas:
1. Student writing with inline AI feedback
2. Teacher classroom with gradebook or bulk grading
3. Oral defense / speaking review
4. OCR upload result
5. A report view
6. One more from whichever area reads best

**Known gaps.** Live LiveKit sessions can't be captured, so we show the review and results screens instead. S3-hosted previews (OCR photos, audio) need a local stand-in such as MinIO or a seeded local file; we decide in the plan.

**Capture.** A Playwright script against `localhost` at 1440×900 @2x, logging in with the seeded accounts, in light theme (plus dark if the app supports it).

### Where originals go

```
assets/                   ← gitignored, local originals only
  nourishwise/  01.png … 18.png          (exported 2026-10-22)
  meridian/     Welcome Screen.png, 02.png … 09.png   (exported 2026-10-22)
  engagemo/     written by the capture script
```

A processing script (sharp) converts these to WebP, caps them at about 1600px, and writes `public/images/projects/<slug>/<name>.webp`. Only those are committed. Drop every candidate frame in; we choose the final 4–6 together in Phase 4. ❓ **Confirm each client is happy to be featured.**

---

## Open questions (resolve in that phase's plan mode)

| Phase | Question |
|---|---|
| 1 | Is a sending domain verified in Resend, and which address should contact mail go to? |
| 2 | Where should `src/findings/` and the root planning notes live? |
| 3 | Which serif display face (from a specimen)? Single-icon theme toggle or a compact three-way control? |
| 4 | Case-study details per project; your role versus a designer's on the NourishWise/Meridian UI (for the role section); MinIO or local files for Engagemo's S3 previews; client sign-off. |
| 5 | About content interview. |
| 7 | `noindex` for draft posts? |

---

## Phase log

### 2026-10-21: Audit complete, plan written
- Browsed the live site and four inspiration sites; ran the code audit and the build.
- Recorded decisions D1–D8.
- Next: Phase 1 in plan mode.

### 2026-10-22: Screenshot sources settled
- D8 refined: Munshi demo shots; Figma frame exports for the mobile apps; Engagemo captured from a seeded local `staging` run with mock AI output.
- `assets/` is gitignored for local originals.

---

## Reference

- iso-glow skill: `~/.claude/skills/iso-glow/SKILL.md` (hairline isometric figures, one accent on what's live)
- Munshi: `~/Code/RFC/munshi-site` (marketing site, `content/` holds all copy), `~/Code/RFC/rfc-pos` (POS + screenshot pipeline)
- HeroUI v3 migration history: `docs/heroui-v3-migration.md`
