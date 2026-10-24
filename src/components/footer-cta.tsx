'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Pages that already end with their own way to get in touch.
const HAS_OWN_CTA = ['/about', '/contact']

// The footer's call to action, left out where the page has just asked.
export default function FooterCta({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (HAS_OWN_CTA.includes(pathname)) return null
  return <>{children}</>
}
