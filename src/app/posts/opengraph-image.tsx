import { ogContentType, ogSize, renderOg } from '@/libs/og'

export const alt = 'Writing by Umer Sagheer'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    label: 'Writing',
    title: 'Interactive deep dives',
    description:
      'Git, WebSockets, timezones and layout animations, with demos you can play with.'
  })
}
