'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// /contact is the full list of ways to get in touch; everywhere else ends
// with the same single call to action.
const HAS_OWN_CTA = ['/contact']

// The footer's call to action, left out where the page has just asked.
export default function FooterCta({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (HAS_OWN_CTA.includes(pathname)) return null
  return <>{children}</>
}
