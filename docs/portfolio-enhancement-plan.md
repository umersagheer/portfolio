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
| **1** | Fix what's broken (no design decisions) | ✅ | `43126bf`…`35995d3` |
| **2** | Performance & hygiene | ✅ | `d23c9ea`…`016035e` |
| **3** | Visual system | ✅ | `4b48889`…`24b5fb5` |
| **4** | Projects as pages (+ Munshi) | ✅ 4A · 4B · 4C | `f0fca25`…`c0dbcd2` |
| **5** | About page (+ iso-glow Fig. 01) | ✅ | `cea2787`…`3911886` |
| **6** | Home page recomposition | ✅ | `54ae663`…`4a7e52b` |
| **7** | SEO & sharing | ✅ | `213c6f9`…`f7e81f3` |
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
| D3 | **Design direction (revised after seeing the preview):** professional, modern and minimal, readable for laypeople and engineers alike. Monochrome structure on a flat background with whitespace and quiet solid hairlines, **no decorative frames** (dashed rails, crosshairs, brackets and centre-lines were all tried and dropped as too close to the inspirations or too busy). *One accent colour, only on what is live* (iso-glow's rule): the current nav item, the label of the section being read, hover and focus. | 2026-10-22 |
| D4 | **Exactly two iso-glow figures:** About (Fig. 01, "The whole stack") and 404 (Fig. 404, "Unplugged"). Everywhere else uses the *rule*, not the figures. | 2026-10-21 |
| D5 | **Typography:** **Fraunces 500** for headings ("readable and funky"), self-hosted with the full optical-size axis; the **system sans** for body (0 KB); **Source Code Pro** only for metadata. Poppins dropped. Instrument Serif (too condensed) and Newsreader were tried in the preview. | 2026-10-22 |
| D6 | **The hero status pill reads "Open to roles & freelance".** | 2026-10-21 |
| D7 | **Munshi replaces RFC as a project.** Munshi is the product and company: a family of management systems (restaurant first, grocery coming). RFC is Munshi's *first customer*, not the project. Source: `~/Code/RFC/munshi-site` (marketing site), `~/Code/RFC/rfc-pos` (the POS). Live links: `rfc.hotel.munshi.app` (RFC's ordering page) and `business.hotel.munshi.app` (the POS). **`munshi.app` has no DNS yet: add it to `munshi.mdx` once it resolves.** | 2026-10-22 |
| D9 | **Theme control is a single light/dark toggle**; first visits follow the OS. | 2026-10-22 |
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
| [harshitparmar.in](https://www.harshitparmar.in/) | Project card layout (framed screenshot, stack chips, status, "View details →"); project page sections (Overview, Learnings, **Challenges I faced**); tech chips inline in prose | It's the closest match to what we want for projects, and "Challenges" is where engineering judgement shows | Quote footer; project pages with no way back or to the next project |
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

**Deferred from Phase 1:** IP rate limiting on the likes API. The per-visitor cap is now atomic, but visitor IDs are client-generated. A limit needs shared storage or a Vercel WAF rate-limit rule (no code). Revisit if abuse shows up.

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

### Phase 3: Visual system

Applied to the existing pages without restructuring their content. **As shipped** (see the phase log); the original sub-items below are kept for history. Rails were dropped (D3), the font is Fraunces (D5), and the theme control is a single toggle (D9).

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
  - **CSS-only, no framer-motion** (P5, moved here from Phase 2). The nav and `MotionConfig` are what keep framer-motion in the shared layout chunk; a CSS nav removes it from every page. That's a bigger win than retrofitting `LazyMotion` onto a nav about to be rebuilt.
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

**Done in 4B (see the Phase log).** Changes from this plan: a separate clone instead of a worktree, Puppeteer instead of Playwright, and the S3 photo served from a local file through request interception instead of MinIO.

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
| 3 | Which serif display face (from a specimen)? Single-icon theme toggle or a compact three-way control? |
| 4 | Case-study details per project; your role versus a designer's on the NourishWise/Meridian UI (for the role section); client sign-off. |
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

### 2026-10-22: Phase 1 ✅ COMPLETE: `43126bf`…`35995d3`

| Item | Commit | Result |
|---|---|---|
| 1a projects quick fix (B1, B2, B7) | `43126bf` | Template MDX pages deleted (now 404); missing screenshot lists emptied; placeholder code link removed |
| 1b navbar (B4, A2) | `2f9a649` | Nav in server HTML; the theme control shows a same-size placeholder until hydration; each nav item is one `Link` with `aria-label` and `aria-current` |
| 1c motion (B5) | `0ae2a3b` | `BlurFade` replaced by the CSS-only `FadeIn` (opacity and transform, `backwards` fill); the hero is not wrapped; `/posts` has no entrance animation |
| 1c reduced motion (A3) | `55e5eb6` | `MotionConfig reducedMotion='user'` app-wide; layout-animations demos opt out (`'never'`); smooth scroll, fade and marquee are gated in CSS |
| 1d contact form (B3) | `e788c78` | Typed `{ ok }` result; error toast keeps the input; `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` env vars, `replyTo`; `type='email'` plus `noValidate`, so Zod stays the only validator |
| 1e dates (B6) | `d79d7de` | `formatDate` uses `timeZone: 'UTC'` (Los Angeles showed July 18 for 2026-07-19) |
| 1f likes API (B8) | `b36ea20` | 404 for unknown posts (drafts allowed); IDs in headers instead of the query string; `createMany skipDuplicates` plus a capped `updateMany` in one transaction; MDX traced into the function |
| 1g landmarks (A4, partial) | `35995d3` | Inner `<main>` changed to `<article>` |

**Verified** with `pnpm build`, `pnpm lint` (clean), a production server on localhost with a throwaway local Postgres, and an invalid Resend key so no mail could be sent:
- **Server HTML:** the nav is in it, and it has no `filter:blur` / `opacity:0`.
- **Routes:** template project URLs return 404; the draft post still returns 200.
- **Dates:** they match the frontmatter.
- **Keyboard:** one stop per nav item, with a focus ring and tooltip.
- **Contact:** the failure toast appears and the input is kept.
- **Likes:**
  - 10 parallel first clicks give 5, and 10 parallel clicks on an existing visitor stop at 5.
  - Each post's total equals the sum of its visitors' likes.
  - The concurrency test caught a bug in the first version: brand-new visitors bypassed the cap. It was fixed before the commit.

**First Load JS after Phase 1:**

| Route | Before | After |
|---|---|---|
| `/` | 247 kB | 246 kB |
| `/posts` | 268 kB | 228 kB |
| `/contact` | 191 kB | 171 kB |

Post pages are unchanged at 449 kB; that is Phase 2 (P1).

**Not yet verified on production:**
- ~~The contact **success** path~~: verified by the user on 2026-10-22.
- The likes API against Neon after deploy.

### 2026-10-22: Phase 2 ✅ COMPLETE: `d23c9ea`…`016035e`

| Item | Commit | Result |
|---|---|---|
| 2a demos per post (P1) | `d23c9ea` | Demos live in `src/components/blog/mdx-demos.tsx`: a `'use client'` module of `next/dynamic` imports, one `webpackChunkName` per post. **`dynamic()` called from the server `mdx-content.tsx` did *not* split client components** (all posts still loaded 22 identical scripts); moving the calls into a client module did. |
| 2b images (P2, P3, P10) | `09f8ad8` | Avatar 80px plus `priority`, about 30 KB to 1.4 KB (AVIF); `Intro` is a server component. Cover `sizes` gives about 8 KB AVIF at w=828 instead of about 57 KB at w=3840. AVIF enabled. |
| 2b icons (P9, A5) | `389e584` | TheSvgIcon pinned to commit `8d07be9` (immutable for a year); light/dark variants swap via the `dark:` class, with no JS swap, refetch or flash; default `alt=''` |
| 2e single like button (P7) | `ea03308` | One instance, with responsive CSS size and position (pixel-identical to before at 1440 and 390); one GET per view instead of two |
| 2c axios (P4) | `ebdb15f` | `fetch` plus `requestLikes()`; `handle-api-error.ts` and `axios` removed |
| 2c tsparticles (H1) | `24fa6e5` | Three unused packages removed |
| 2d dead code (H3) | `48b0829` | 37 files, 975 lines. Cut the post route from 256 to 206 kB: `formatDate`'s module also imported the whole local icon set, pulling it into client bundles. |
| 2c devDeps (H2, H4) | `89774c1` | Remotion, Prettier and dotenv moved to devDeps; `@types/node` ^24; better-sqlite3 config dropped; `brandDomain` imported from constants |
| 1j / H5 | `b995b12` | **Removing `'use client'` from the Zustand SVG icon cut 51 kB from `/`, `/projects` and `/posts`** (bisected): the directive made the project-data module a client boundary. `FrameDiagram` is now server-only (no client JS). `@/` imports. |
| 2g notes (H6) | `3a503e3` | `docs/notes/` now holds `timezone/*`, `websockets.md`, `plan.md` and `blog-enhancement-plan.md` |
| 2f ESLint 9 (H4) | `016035e` | Flat `eslint.config.mjs` via `FlatCompat` (eslint-config-next 15 ships legacy configs); `pnpm lint` is `eslint .` and clean; it surfaced and fixed 3 alt-text warnings |

**Lessons** (also in `CLAUDE.md`):
- Never import a blog demo statically into `mdx-content.tsx`.
- A `'use client'` on a leaf inside a shared data module can drag the whole module client-side. Check the route table after adding one.

**First Load JS (Next route table):**

| Route | Phase 1 | Phase 2 |
|---|---|---|
| `/` | 246 kB | 195 kB |
| `/posts` | 228 kB | 179 kB |
| `/contact` | 171 kB | 172 kB |
| `/projects` | 240 kB | 189 kB |
| `/posts/[postId]` | 449 kB | 205 kB |

**Per-page JS** (gzip of every script in the HTML, measured on a local production build):

| Page | Before | After | Change |
|---|---|---|---|
| `/` | 324 KB | 278 KB | −14% |
| `/posts` | 333 KB | 289 KB | −13% |
| `/contact` | 357 KB | 312 KB | −12% |
| expo-router post | 491 KB | 292 KB | −40% |
| layout-animations | 491 KB | 290 KB | −41% |
| git-reset-modes | 491 KB | 296 KB | −40% |
| git-internals | 491 KB | 314 KB | −36% |
| websockets | 491 KB | 350 KB | −29% |
| timezones (14 demos) | 491 KB | 388 KB | −21% |

**Verified** with a local production build against a throwaway Postgres DB:
- **Demos:** every demo control hydrated on all six posts (65/65 timezones, 31/31 git-internals, 40/40 layout, 30/30 websockets, 10/10 expo, 7/7 reset), with no console errors; the reset demo was exercised end to end.
- **Icons:** they swap correctly in both themes, and the hidden variant isn't fetched.
- **Like button:** it records and restores likes.

### 2026-10-22: Phase 3 ✅ COMPLETE: `4b48889`…`24b5fb5`

The direction was settled with a local HTML preview first. The user chose Fraunces, the system body font, a single theme toggle, no frame decorations, and live section labels.

| Commit | Result |
|---|---|
| `4b48889` fonts | Fraunces 500 self-hosted (`src/fonts/`, OFL included) via `next/font/local` with the opsz 9–144 axis (34.8 KB; `next/font/google` only allows that axis with the full weight range); Source Code Pro variable; Poppins removed. **Fonts preloaded per page: 6 → 2 (≈61 KB → ≈57 KB).** `font-display` utility and `--hair` / `border-hair` token. |
| `c4d1069` nav | A sticky top bar (opaque, no `backdrop-filter`): serif wordmark ("Umer" on phones), sans text links with an accent active item, and a single theme toggle (`dark:` icon swap, so nothing changes after hydration). No framer-motion, HeroUI Tabs/Tooltip or icon library in the layout. `ui/tabs.tsx` deleted. |
| `8dd288c` footer | CTA, socials, Pakistan local time (client, fills in after hydration), and a "how this site works" colophon |
| `7b82c1a` type + background | `bbblurry.svg` layer removed (one request, no full-screen fixed image); `SectionHeader` (`01 · Work` plus a serif h2) replaces `Heading`; the home name is an `h1` (A4); page titles, post titles and prose h2/h3 in Fraunces; card titles in sans. Also removed a nested `container` on home that put content 16px off the nav's edge. |
| `2b44719` live labels | `live-sections.tsx`: one IntersectionObserver band at 40% of the viewport, plus an end-of-page observer so short last sections (the footer) can go live |
| `57c619d` framer scope | `MotionConfig` moved out of `providers.tsx` into `reduced-motion.tsx`, around post pages and the project list |
| `8ec088e` A6 | Post page scrollbar restored |
| `50ba9e7` docs | `CLAUDE.md`: fonts, layout chrome, visual-system rules |
| `24b5fb5` rows | A hairline outline on project rows (they lost their edge on the flat light background) |

**Per-page JS after Phase 3** (gzip; Phase 2 in brackets):

| Page | Phase 2 | Phase 3 |
|---|---|---|
| `/` | 278 KB | 246 KB |
| `/projects` | 278 KB | 246 KB |
| `/contact` | 312 KB | 282 KB |
| `/posts` | 289 KB | 282 KB |
| Post pages | unchanged | ±3 KB (the new nav, toggle, clock and observer are tiny) |

**Other results:**
- **Layout shift:** CLS is 0 on home and on a post.
- **LCP:** the home LCP is now the serif `h1` (168 ms locally).
- **Overflow:** none at 390px on home, `/posts`, `/projects`, `/contact` or a post.

**Found and recorded:**
- **framer-motion still ships on every page (38 KB gzip)** even though the layout no longer imports it. Webpack grouped `next/link` and `next/image` into the same shared chunk as `projects.tsx` (the modal, which uses framer-motion). Phase 4 removes the modal, the last framer-motion user outside posts, and should drop this chunk from non-post pages. Verify the route table then.
- **Pre-existing:** a WebSockets demo stepper overflows below ~330px width (fine at 390px).

### 2026-10-22: Phase 4A ✅ COMPLETE: `f0fca25`…`768b7c0`

Phase 4 is split into three chunks: 4A (infrastructure and pages, done), 4B (the Engagemo demo capture) and 4C (case-study writing with the user).

| Commit | Result |
|---|---|
| `f0fca25` screens pipeline | `pnpm screens` (sharp) turns `assets/` and Munshi originals into WebP plus the `screens.json` size manifest. Phones get a screen-height crop (780×1688) and a `-full` copy only when the frame is >5% taller; `-dark` twins. 18 screens, 1.8 MB in total (the RFC PNGs they replace were 5.1 MB). Idempotent; clears its output first. |
| `095f4cf` data | `src/content/projects/{munshi,engagemo,nourishwise,meridian}.mdx` with Zod-validated frontmatter; `libs/projects.ts` resolves screens against the manifest and **fails the build on a missing screen** (tested). Old `[projectId]` route and types removed. Munshi's copy is drawn from its own site and repo: offline outbox in IndexedDB with idempotency keys (verified in `rfc-pos`), and RFC stats. |
| `8575dda` pages | `/projects/[slug]` (static, `dynamicParams = false`): server-rendered rail (facts, links, "Private repository", on-this-page, prev/next, keyboard hint), serif header, stack chips, phone apps lead with 3 screens, MDX body, gallery with a native `<dialog>` lightbox (full-height phones load on open), and a pager. `BackLink` + `nav-history.tsx` return to the list's scroll position; `KeyboardNav`: Esc back, ←/→ projects. No framer-motion. |
| `2bcb8a6` cards | `/projects` cards (cover peeking from a stage) and home `ProjectRows` |
| `aba3c7d` stores | Google Play links for NourishWise and Meridian (tracking params stripped); platform iOS · Android |
| `a046a28` cleanup | Modal, morphing dialog, marquee, `index.tsx`, `useClickOutside`, zustand icon, the RFC images and the marquee CSS removed (20 files, −2,137 lines) |
| `768b7c0` docs | `CLAUDE.md`: project content model, `pnpm screens`, adding a project, routes |

**JS after 4A** (gzip; Phase 3 in brackets):

| Page | Phase 3 | 4A |
|---|---|---|
| `/` | 246 KB | 195 KB |
| `/projects` | 246 KB | 192 KB |
| `/contact` | 282 KB | 234 KB |
| `/posts` | 282 KB | 234 KB |
| Project pages | n/a | ≈197 KB |

**framer-motion is now only on post pages** (checked via the `framerAppearId` literal), which resolves the Phase 3 finding.

First Load (Next): `/` 131 kB, `/projects` 112 kB, `/projects/[slug]` 130 kB.

**Verified:**
- **Routes:** 4 project pages return 200; unknown and old slugs return 404.
- **Images and layout:** 0 broken images and CLS 0 on home, `/projects` and every project page; no overflow at 390px.
- **Navigation:** Esc from a project returns to `/projects` at the same scroll position; ←/→ step through projects; a direct visit + Esc opens `/projects`.
- **Lightbox:** opens large; Esc closes it without leaving the page; focus returns to the screenshot.
- **Theme:** Munshi light and dark twins swap with the theme, and the hidden twin is never fetched.

**Notes:**
- Munshi's "dark" ordering screenshot is light by design: that customer page has no dark mode.
- The first request for each image size after a deploy is slow (AVIF encode in the optimizer), then cached.
- Engagemo shows its logo until 4B.
- Role and period are blank on all projects until 4C.

### 2026-10-22: Phase 4B ✅ COMPLETE: `a218adf`

| Commit | Result |
|---|---|
| `a218adf` screens | 7 Engagemo desktop screens (1440×900 WebP, 411 KB in total), in product order: writing (the cover), feedback review, handwriting, Oral Defense, gradebook, rubric drawer, class report. Each has alt text and a caption, plus a `screensNote` saying the school and AI output are made up. The dashboard shot was dropped as the weakest (one stock photo repeated on generic cards). |

**How the screens were made** (nothing left the machine, no production data):
- **Environment:**
  - A fresh clone of the client's `staging` branch in the scratchpad, with its remote removed.
  - A dummy-only `server/.env` (the client repo's real `.env` was never read or used).
  - Homebrew Postgres 18 (`engagemo_demo`) and Redis DB 9. No Docker.
  - Migrations ran on server boot; the repo's offline `seed:subscriptions` and `seed:ai-prompts` also ran.
- **Seed:** a hand-written script for Northwood Academy, a made-up school.
  - People and classes: teacher Amelia Hart, 12 students, 5 classes, a 4-criterion rubric (24 points) and 5 tasks.
  - Submissions in every state: graded (AI and teacher-override grade records), in review with an AI draft, missing, a draft.
  - Features: an OCR upload, two Oral Defense sessions (Pass, and Borderline with an integrity event) and a completed class report.
  - Every AI output was written by hand; essays use public-domain *To Build a Fire* for the analysis task.
- **Capture:** a Puppeteer script at 1440×900 @2x.
  - Student AI feedback (never stored, generated per click) came from a mocked `POST /api/agentFeedbacks/generate`.
  - The OCR photo was a locally rendered handwritten page served through a mocked `GET /api/submissions/:id/photos`.
  - Oral Defense audio was left empty.
- **Gotcha:** in `grade_record`, `total_points` is the rubric maximum and the earned score goes in `ai_raw_score` (null on teacher overrides). The first seed had them swapped, which showed "21/21" in the gradebook.

**Verified:**
- `pnpm lint` and `pnpm build` pass (throwaway local DB, dropped afterwards).
- The page, gallery, lightbox and `/projects` card were checked in light and dark: no console errors or failed requests, CLS 0 and no overflow at 390px.

**Teardown:**
- The clone (including the seed and capture scripts), `engagemo_demo` and Redis DB 9 are deleted.
- `~/Code/softaims/writing-coach` is unchanged: branch, HEAD, status, stash and refs all match the snapshot taken before.
- The original PNGs (all 8, dashboard included) stay in the gitignored `assets/engagemo/`.
- Re-shooting later means rebuilding the demo environment from this description.

### 2026-10-22: Phase 4C ✅ COMPLETE (Phase 4 done): `c3981cd`…`c0dbcd2`

| Commit | Case study | Words | Rail |
|---|---|---|---|
| `c3981cd` | Munshi | ~1,600 | Founder · sole engineer · Own product (RFC is the first customer) · Jul 2025 – present |
| `fb4ad0c` | Engagemo | ~1,100 | Lead engineer · full-stack · Built at Softaims · Jun 2025 – present |
| `27cba0b` | NourishWise | ~750 | Sole mobile engineer · Built at Softaims · Aug – Dec 2025 |
| `c0dbcd2` | Meridian Profits | ~780 | Mobile lead · backend foundation · Built at Softaims · Feb – Apr 2026 |

**The template.** Every study uses the same `##` headings: The problem → My role → How it works → Decisions → The hard part → Outcome so far. Munshi adds "RFC, the first customer". Under the hood:
- *How it works* splits into "What people use" and "Under the hood" (`###`, so they stay out of the TOC).
- Each decision reads "X, because Y, at the cost of Z".
- *The hard part* is one story with named traps and a one-line lesson, plus a short "another one".

**How it was written.** Teach-then-draft:
- Munshi went section by section; the other three were approved as a whole outline.
- Facts came from five read-only research passes on 2026-10-22: local git for rfc-pos, writing-coach and the Mediterranean fork, and `gh api` for the Meridian app and backend and the NourishWise app.
- Every number has a source or the owner's confirmation: RFC stats, 30–40 institutions, 368 activations in two weeks, Engagemo's load-time fix, launch months.

**Credit rules** (also in memory: `case-study-credit-rules`):
- "we" for team work, "I" for the owner's own; teammates by role, never by name.
- No exploitable weakness of a live product, and no client-confidential detail.
- Two claims were corrected: OCR and the Oral Defense core are framed as led, not built; Meridian's engine and LangGraph pipeline are credited to "our backend engineer".

**Verified:** for each page, lint and build passed (throwaway `portfolio_p4c_test`, dropped afterwards); every TOC link matched its heading id; the rail facts rendered; no overflow, CLS 0 and no console errors at 390px (puppeteer-core device emulation).

**Follow-ups:**
- Tailwind Typography adds visible backticks around inline code site-wide (posts too); hide them with `prose-code:before/after:content-none`.
- Munshi runs about double the 600–900-word target. Kept for the flagship; the "What people use" list is the first cut if it needs trimming.
- Add `munshi.app` to Munshi's links once the domain resolves (not yet, 2026-10-22).
- The `Softaims/postpartum-diet-app` repo now returns 404 to the owner's account. A committed Firebase Admin key was reported to the owner for rotation; it is not in the portfolio.

### 2026-10-24: Phase 5 ✅ COMPLETE: `cea2787`…`3911886`

**Fig. 01, "One request, end to end"** (`src/components/about/journey/`). The plan's phone/laptop/rack figure became a journey after three prototype rounds with the owner. Rejected along the way:
- a "stack city" board (too small to read, districts added noise);
- six vertical layers (too tall, and they shaded each other when selected);
- three vertical layers (still a logo wall; "a toolbox, not a story").

**What it is:**
- **Stations on one panorama board:** device, data layer, server, AI pipeline, databases.
- **The wire:** dark, purple-tinted, running in iso steps through every component with rounded bends. One small pulse travels it every 3.8 s.
- **Picking a step** (click, 1–6, ←/→, Esc) lights its station and shows callout chips with real icons (Simple Icons, inlined, no requests), plus a legend and a panel of patterns that link back to the owner's own skills (`react-query-layer`, `zustand-store`, `form-feature`).
- **Deploy** (the server's "↑ deploy" button, step 06, and once on first view): a build pulse rises to an AWS + Railway cloud, a terminal types build ✓ / test ✓ / deploy, and the update comes down through App Store / Google Play to the devices.
- **Built for speed:** drawn on the server at build time (`src/libs/iso.ts`, kernel from iso-figure, MIT). The client controller is about 1.8 kB. It breaks out to 1040 px on wide screens; text stays in the 768 px column. Glow is dark-only. Reduced motion shows the finished state.
- **Labels:** an automated overlap check (puppeteer-core, five widths, every step and the deploy state) passes clean. Phones hide the in-drawing chips; the list names every tool.

**The page** (`src/app/about/page.tsx`):
- **Opening:** fundamentals from before AI, now building AI into products; 4 years, Munshi, Engagemo (7,000+ users, 30–40 institutions), two store apps.
- **01 How I work:** four traits, each linking to proof on the site.
- **02 How I build:** Fig. 01.
- **03 Journey:** 2021 → 2026.
- **04 Now:** Building / Learning, plus a GitHub calendar. Private contributions are on (1,416 in the last year); it is fetched on the server and revalidated daily, with no client JS.
- **05 Off the clock.**
- **06 Contact,** with two paths:
  - *Hiring?* View CV (an in-page `<dialog>` on desktop, the PDF loaded only on open; the native viewer on phones), a 15-min intro, LinkedIn and email.
  - *Building something?* Contact form, WhatsApp (pre-filled message) and a 30-min project call.
  - Cal.com loads only on click (its `embed.js`); otherwise the link opens the booking page.
- **Elsewhere:** About is in the nav. The footer call to action is skipped on /about and /contact.

**Decisions:**
- **Positioning:** "engineer who ships" blended with "pre-AI roots, AI now"; aiming at AI product engineer roles. MERN is the headline stack, framed as a tool rather than an identity.
- **Industrial SCADA work:** a contract for an *unnamed industrial automation client*, never a personal project.
- **"Institutions" (universities), never "schools".**

**Verified:**
- Lint, types and build pass. `/about` First Load JS is 110 kB (shared 104 kB).
- Every internal link and the CV return 200. Both Cal.com modals open the right event.
- There are no errors and no overflow at 1440, 1024 and 390 px in both themes.

**Follow-ups:**
- The CV source is drafted at `assets/cv/umer-sagheer-cv.tex` (gitignored). The owner compiles it in Overleaf, then the PDF replaces `public/umer-sagheer-cv.pdf`. Until then the site serves the old CV.
- `portfolio_p5_test` was dropped at the end of the phase.

### 2026-10-24: Phase 6 ✅ COMPLETE: `54ae663`…`4a7e52b`

| Commit | Result |
|---|---|
| `54ae663` hero | An `h1` with the name (fixes A4) and the tagline "Full-stack engineer building AI into real products." (`siteProfile.role`). The status pill "Open to roles & freelance · Lahore, Pakistan · local time" (D6) has a live dot that pings only without reduced motion, and the location is hidden on phones so it stays on one line. Two sentences of intro, then "See my work ↓" (`#work`), "Book a 15-minute intro" (Cal.com, loaded on click) and "About me →". |
| `f5eb3cf` work | "Selected work": featured projects (Munshi, Engagemo) as `ProjectCard`s with covers, the rest as `ProjectRows`. `ProjectCard` gains `headingLevel` (h3 under a section h2). Posts get the subtitle "Deep dives with demos you can play with." |
| `442b0fe` stack | `stack-glance.tsx`: Client · Data · Server · Database · Cloud along a wire, using the main tools from the About figure's `STEPS` and its inlined icons, plus the GitHub heatmap. "The full picture →" links to /about. **The old "What I work with" bento is removed (G6).** |
| `822dd28` fix | The GitHub calendar fetch gets a 5 s timeout. A build stalled for over 10 minutes on it; GitHub sometimes takes 4 s from here. A slow GitHub now just drops the heatmap. |
| `4a7e52b` copy | Engagemo serves universities: "institutions" replaces "schools" in its tagline and case study. The fictional demo school in the screens note stays. |

**Numbers:** home First Load JS **131 → 113 kB** (the bento's HeroUI `Card` and Tabler icons are gone). Home and /about are prerendered and revalidated daily for the heatmap.

**Verified** at 1440, 1024 and 390 px, light and dark:
- one `h1`, CLS 0, no overflow, no console errors or failed requests;
- the hero's first call to action sits within the first screen (389 px of 900 on desktop, 468 px of 844 on a phone);
- "See my work" lands on the work section;
- four project links render, and the heatmap shows;
- Cal.com makes no request before a click.

### 2026-10-24: Phase 7 ✅ COMPLETE: `213c6f9`…`f7e81f3`

| Commit | Result |
|---|---|
| `213c6f9` titles | Title template `%s · Umer Sagheer` (default: "Umer Sagheer · Full-stack engineer"). A real site description, `openGraph` defaults, `twitter.creator`, canonical URLs on every page, and an RSS `alternate`. Per-page titles and descriptions for /about, /projects, /posts and /contact (S1). **Draft posts get `noindex, follow`** (7e: they stay shareable by link, out of search). |
| `ab0a927` feeds | `sitemap.ts`: 5 pages, 4 projects and the published posts only. `robots.ts`: allow all, disallow `/api/`, link to the sitemap. `rss.xml`: a static RSS 2.0 feed of published posts (S2). |
| `e24e961` fix | Post pages keep `twitter:creator` (their own Twitter metadata had replaced the site default). |
| `e54ca3e` previews | `src/libs/og.tsx` renders 1200×630 previews at build time in the site's style: a dark panel, hairline frame, purple dot, Fraunces title, mono labels. **Home** shows the name, tagline and status pill. **About, Projects, Writing and Contact** each get their own label. **Each project** shows its cover screen (dark variant, converted from WebP by sharp). Posts keep their cover art. Satori can't read woff2, so static TTFs ship in `src/fonts/` (all OFL, licences included): Fraunces at display and text optical sizes, plus Source Code Pro. Images are 32–250 KB (S3). |
| `f7e81f3` data | `json-ld.tsx`: `Person` + `WebSite` on home; `BlogPosting` on published posts; `CreativeWork` on projects. `<` is escaped (S4). |

**Verified:**
- All the new routes are static (○/●) in the build.
- On `pnpm start`, every page has a unique `<title>`, a canonical URL, its own `og:image` and `twitter:creator`; the draft post has `noindex`.
- The sitemap lists 15 URLs with no drafts. The RSS parses, with 6 items. The JSON-LD parses on home, a post and a project.
- I looked at the preview PNGs. The first round had a description running under the Munshi screenshot and a thin display cut at small sizes; both are fixed.

**After deploy:** paste a link into LinkedIn's Post Inspector (linkedin.com/post-inspector) to warm its cache, and submit `/sitemap.xml` in Google Search Console.

---

## Reference

- iso-glow skill: `~/.claude/skills/iso-glow/SKILL.md` (hairline isometric figures, one accent on what's live)
- Munshi: `~/Code/RFC/munshi-site` (marketing site, `content/` holds all copy), `~/Code/RFC/rfc-pos` (POS + screenshot pipeline)
- HeroUI v3 migration history: `docs/heroui-v3-migration.md`
