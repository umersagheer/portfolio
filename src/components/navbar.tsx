import Link from 'next/link'
import NavLinks from '@/components/nav-links'
import SearchTrigger from '@/components/search/search-trigger'
import ThemeToggle from '@/components/theme-toggle'
import { siteProfile } from '@/constants/site-profile'

// Sticky top bar. Opaque background rather than backdrop-filter: blur repaints
// on every scroll frame, and the bar reads cleaner solid.
export function Navbar() {
  return (
    <header className='border-hair bg-background sticky top-0 z-40 border-b'>
      <div className='container flex h-14 max-w-3xl items-center justify-between'>
        <Link
          href='/'
          aria-label={`${siteProfile.name}, home`}
          className='font-display hover:text-accent focus-visible:outline-accent rounded-md text-lg transition-colors focus-visible:outline-2'
        >
          <span className='sm:hidden'>{siteProfile.name.split(' ')[0]}</span>
          <span className='hidden sm:inline'>{siteProfile.name}</span>
        </Link>
        <nav aria-label='Main' className='flex items-center'>
          <NavLinks />
          <SearchTrigger />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
