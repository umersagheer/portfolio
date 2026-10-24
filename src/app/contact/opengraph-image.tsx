import { ogContentType, ogSize, renderOg } from '@/libs/og'

export const alt = 'Contact Umer Sagheer'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    label: 'Contact',
    title: 'Let’s talk',
    description:
      'Open to roles and freelance work. Tell me about the problem you’re solving.'
  })
}
