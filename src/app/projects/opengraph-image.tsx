import { ogContentType, ogSize, renderOg } from '@/libs/og'

export const alt = 'Projects by Umer Sagheer'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    label: 'Projects',
    title: 'Case studies',
    description:
      'A restaurant system that runs offline, an AI writing coach for 7,000+ people, and two store apps.'
  })
}
