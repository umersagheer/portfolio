export const brandDomain = 'umersagheer.dev'

export const brandSocials = {
  x: {
    label: '@umersagheer_dev',
    url: 'https://x.com/umersagheer_dev',
  },
  github: {
    label: 'umersagheer',
    url: 'https://github.com/umersagheer',
  },
} as const

export const getBlogPostUrl = (slug: string) => `${brandDomain}/posts/${slug}`
