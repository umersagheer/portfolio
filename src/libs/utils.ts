import { techIcons } from '@/components/icons'

export default function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function getIcon(name: string) {
  return techIcons[name] || null
}
