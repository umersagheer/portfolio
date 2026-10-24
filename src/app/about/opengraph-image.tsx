import { ogContentType, ogSize, renderOg } from '@/libs/og'

export const alt = 'About Umer Sagheer'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    label: 'About',
    title: 'How I build',
    description:
      'Fundamentals from before AI, building AI into real products now.'
  })
}
