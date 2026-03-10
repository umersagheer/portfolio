import { brandDomain } from '@/remotion/shared/brand'

const fallbackSiteUrl = `https://${brandDomain}`

function normalizeSiteUrl(siteUrl: string) {
  if (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')) {
    return siteUrl
  }

  return `https://${siteUrl}`
}

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    fallbackSiteUrl

  return new URL(normalizeSiteUrl(siteUrl))
}

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString()
}
