'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/constants/routes'

// Plain links styled with CSS: no animation library or UI kit in the layout
// bundle. The current page is the one live item, so it gets the accent.
export default function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className='flex items-center'>
      {navLinks.map(({ title, href }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`focus-visible:outline-accent relative block rounded-md px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 sm:px-2.5 ${
                isActive ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {title}
              {isActive && (
                <span
                  aria-hidden='true'
                  className='bg-accent absolute inset-x-2 bottom-1 h-px sm:inset-x-2.5'
                />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
