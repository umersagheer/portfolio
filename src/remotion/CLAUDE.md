# Remotion blog promo conventions

This Remotion setup is only for creating blog promo videos and blog cover stills for this portfolio.

## Folder structure

- `src/remotion/shared/`
  - reusable brand primitives shared across every blog promo
  - examples: `theme.ts`, `brand.ts`, `components/Background.tsx`, `components/SceneTitle.tsx`, `components/BrandUnderline.tsx`, `components/SceneFade.tsx`, `stills/BlogCoverStill.tsx`
- `src/remotion/blogs/<slug>/`
  - everything specific to one blog promo
  - expected pieces:
    - `config.ts`
    - `<BlogName>Promo.tsx`
    - `<BlogName>Cover.tsx`
    - `scenes/`
    - optional `components/` for blog-specific visual atoms

## Required deliverables for a new blog promo

Every new blog promo should include both of these:

1. A vertical promo composition
   - default format: `1080x1920`
   - default fps: `30`
   - use `Series` + shared `SceneFade` for scene pacing
   - avoid `@remotion/transitions` here unless Studio reliability is re-verified
2. A blog cover still
   - keep using the shared `src/remotion/shared/stills/BlogCoverStill.tsx` pattern as the baseline
   - create a blog-specific cover component like `LayoutAnimationsCover.tsx` when the blog needs a more custom still
   - still format: `1280x720`

## Narrative defaults

Future blog promos should follow this structure by default unless the blog strongly needs a different flow:

1. **Branded intro hero**
   - start with the clean intro treatment: title, subtitle, white underline, and blog-relevant visual motifs
   - do not put the recreated post-page browser preview in the intro by default
2. **Core explanation scenes**
   - use the middle scenes for the actual concepts, demos, and motion ideas from the post
3. **Pre-outro post preview**
   - add a recreated browser/post-page preview scene right before the final CTA outro
   - this preview should represent where the full article lives on the portfolio
4. **Final polished outro**
   - keep the sleek CTA outro language as the finishing beat
   - use messaging changes before visual redesigns

## Visual identity rules

These are the default visual rules for all future blog promos:

- Use the shared radial-glow + grid background identity from `shared/components/Background.tsx` and `shared/components/BrandBackdrop.tsx`
- Use the white gradient underline from `shared/components/BrandUnderline.tsx` for scene headings and related accent lines
- Keep typography consistent with the shared Remotion theme and fonts
- Use the canonical site domain from `shared/brand.ts` instead of hardcoding `.dev` / `.com` values in multiple files
- Outro styling should stay sleek, dark, and premium; if copy changes, prefer messaging changes over visual redesigns

## Storytelling rules

A promo should reflect the actual blog, not generic motion graphics.

- Pull motifs from the blog's real content, demos, or components
- If the blog contains interactive demos, represent those demos visually in the promo scenes
- If a site or post preview is shown, recreate it as a Remotion-safe browser/frame mockup rather than using a live iframe
- Keep scenes focused and readable; extending duration a bit is fine when it improves clarity

## Config expectations

Each blog `config.ts` should be the source of truth for:

- title
- subtitle
- author line
- CTA label
- URL
- outro/supporting copy
- scene durations
- any blog-specific preview or cover content

## Validation workflow

After changing a promo, run:

```bash
pnpm lint
pnpm build
pnpm remotion:render
pnpm exec remotion studio src/remotion/index.ts --port 3002
```

If you start Studio for a smoke test, make sure it boots cleanly and then stop it after verifying the page loads.
