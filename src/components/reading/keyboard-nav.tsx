'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBackTo } from '@/components/reading/back-link'

type KeyboardNavProps = {
  backHref: string
  previousHref: string | null
  nextHref: string | null
}

// Keys belong to whatever has focus when it's a field or a control: the
// post demos are buttons, tabs and sliders, and pressing an arrow there must
// not leave the page. Links are left out, so the pager link that was just
// followed doesn't swallow the next arrow press.
const OWNS_KEYS =
  'input, textarea, select, button, [contenteditable="true"], [tabindex], [role="slider"], [role="tab"], [role="radio"], [role="listbox"], [role="menu"], [role="grid"]'

// Esc goes back to the list; arrow keys step to the previous / next entry.
// Ignored with modifier keys, while focus is on a control, or while a dialog
// is open (⌘K, the screenshot lightbox: Esc closes those first).
export default function KeyboardNav({
  backHref,
  previousHref,
  nextHref
}: KeyboardNavProps) {
  const router = useRouter()
  const back = useBackTo(backHref)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return
      const target = event.target as HTMLElement | null
      if (target && target !== document.body && target.closest(OWNS_KEYS))
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
