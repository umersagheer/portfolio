'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBackToProjects } from '@/components/projects/back-link'

type KeyboardNavProps = {
  previousHref: string | null
  nextHref: string | null
}

// Esc goes back to the list; arrow keys step through projects. Ignored while
// typing, with modifier keys, or while the screenshot lightbox is open (Esc
// closes the lightbox first).
export default function KeyboardNav({
  previousHref,
  nextHref
}: KeyboardNavProps) {
  const router = useRouter()
  const back = useBackToProjects()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]'))
        return
      if (document.querySelector('dialog[open]')) return

      if (event.key === 'Escape') back()
      else if (event.key === 'ArrowLeft' && previousHref)
        router.push(previousHref)
      else if (event.key === 'ArrowRight' && nextHref) router.push(nextHref)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [back, nextHref, previousHref, router])

  return null
}
