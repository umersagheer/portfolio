import { brandDomain, siteProfile } from '../../constants/site-profile'

export { brandDomain }

export const brandSocials = {
  x: siteProfile.socials.x,
  github: siteProfile.socials.github,
} as const

export const getBlogPostUrl = (slug: string) => `${brandDomain}/posts/${slug}`
