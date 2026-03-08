import { z } from 'zod'
import { brandDomain, getBlogPostUrl } from '../../shared/brand'

export const layoutAnimationsPromoSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  author: z.string(),
  ctaLabel: z.string(),
  url: z.string(),
  outroMessage: z.string(),
})

export type LayoutAnimationsPromoProps = z.infer<
  typeof layoutAnimationsPromoSchema
>

export const defaultLayoutAnimationsPromoProps = {
  title: 'Layout Animations',
  subtitle: 'From Browser Internals to Framer Motion',
  author: 'by Umer Sagheer',
  ctaLabel: 'Read the full post',
  url: getBlogPostUrl('layout-animations'),
  outroMessage:
    'This is where the full write-up lives — open it to explore the complete article and interactive demos.',
} satisfies LayoutAnimationsPromoProps

export const layoutAnimationsCoverContent = {
  title: 'Understanding\nLayout Animations',
  subtitle: defaultLayoutAnimationsPromoProps.subtitle,
  footerDomain: brandDomain,
} as const

export const layoutAnimationsPreviewContent = {
  sectionTitle: 'Posts',
  searchLabel: 'Search by title...',
  coverImage: 'images/posts/layout-animations-cover.png',
  cardTitle:
    'Understanding Layout Animations: From Browser Internals to Framer Motion',
  cardSummary:
    'A deep dive into why animating layout properties is expensive, how the FLIP technique solves it, and how Framer Motion makes it effortless.',
  publishedAt: 'March 1, 2026',
  readingTime: '10 min read',
  footerDomain: brandDomain,
  sceneTitle: 'See the Full Post',
  sceneMessage:
    'Open the article on the portfolio to read the full breakdown and explore the interactive demos.',
} as const

export const sceneDurations = {
  intro: 126,
  problem: 112,
  flip: 112,
  layoutId: 96,
  spring: 96,
  morphing: 112,
  postPreview: 114,
  outro: 138,
} as const

const totalSceneDuration = Object.values(sceneDurations).reduce(
  (total, duration) => total + duration,
  0
)

export const layoutAnimationsComposition = {
  id: 'LayoutAnimationsPromo',
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: totalSceneDuration,
} as const
