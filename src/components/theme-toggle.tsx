'use client'

import { useTheme } from 'next-themes'
import { useIsClient } from '@/hooks/useIsClient'

// One button: light <-> dark. First visits follow the OS (next-themes'
// `system` default). The icon swaps in CSS via the `dark` class, so the
// server HTML is always right and nothing flips after hydration.
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isClient = useIsClient()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type='button'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label='Toggle dark mode'
      aria-pressed={isClient ? isDark : undefined}
      className='border-hair text-muted hover:text-foreground focus-visible:outline-accent ml-1 grid size-8 cursor-pointer place-items-center rounded-lg border transition-colors focus-visible:outline-2'
    >
      {/* Light theme: offer the moon */}
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-4 dark:hidden'
      >
        <path d='M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z' />
      </svg>
      {/* Dark theme: offer the sun */}
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        className='hidden size-4 dark:block'
      >
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
      </svg>
    </button>
  )
}
