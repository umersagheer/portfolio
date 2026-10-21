// Frontmatter dates are date-only strings ('2026-07-19'), which parse as UTC
// midnight. Formatting in UTC keeps the same calendar day for every reader
// (and identical server/client output, so no hydration mismatch).
export default function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
