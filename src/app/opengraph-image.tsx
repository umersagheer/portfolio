import { siteProfile } from '@/constants/site-profile'
import { ogContentType, ogSize, renderOg } from '@/libs/og'

export const alt = `${siteProfile.name}: ${siteProfile.role}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    title: siteProfile.name,
    description: siteProfile.role,
    status: `${siteProfile.status} · ${siteProfile.location}`
  })
}
