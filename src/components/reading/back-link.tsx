'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { getPreviousPath } from '@/components/nav-history'

// Back to a list (/posts, /projects). If the reader came from that list (or
// the home page), go back in history so they land on the same scroll
// position; otherwise (a shared link, a new tab) open the list.
export function useBackTo(href: string) {
  const router = useRouter()
  return useCallback(() => {
    const previous = getPreviousPath()
    if (previous === href || previous === '/') router.back()
    else router.push(href)
  }, [href, router])
}

export default function BackLink({
  href,
  label,
  className = ''
}: {
  href: string
  label: string
  className?: string
}) {
  const back = useBackTo(href)

  return (
    <Link
      href={href}
      onClick={event => {
        // Let modified clicks (new tab, etc.) behave like a normal link.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return
        event.preventDefault()
        back()
      }}
      className={`text-muted hover:text-foreground focus-visible:outline-accent inline-flex items-center gap-1.5 rounded-md text-sm transition-colors focus-visible:outline-2 ${className}`}
    >
      <span aria-hidden='true'>←</span> {label}
    </Link>
  )
}
