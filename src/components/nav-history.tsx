'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PREVIOUS = 'nav:previous'
const CURRENT = 'nav:current'

// Remembers the previous in-app page for this tab, so "back" links can return
// the reader exactly where they were (scroll position included) instead of
// always starting a fresh page.
export default function NavHistory() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const current = sessionStorage.getItem(CURRENT)
      if (current && current !== pathname) {
        sessionStorage.setItem(PREVIOUS, current)
      }
      sessionStorage.setItem(CURRENT, pathname)
    } catch {
      // Storage can be unavailable (private mode); back links fall back to /projects.
    }
  }, [pathname])

  return null
}

export function getPreviousPath(): string | null {
  try {
    return sessionStorage.getItem(PREVIOUS)
  } catch {
    return null
  }
}
