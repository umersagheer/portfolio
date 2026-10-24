import NextImage from 'next/image'
import Link from 'next/link'
import BookCall from '@/components/about/book-call'
import LocalTime from '@/components/local-time'
import { siteProfile } from '@/constants/site-profile'

const primary =
  'border-hair hover:border-accent hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2'
const secondary =
  'text-muted hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

// Who, what, and whether I'm available, within the first screen.
export default function Intro() {
  return (
    <div className='flex flex-col items-start pb-14'>
      <div className='flex items-center gap-4'>
        <div className='size-20 shrink-0 overflow-hidden rounded-xl'>
          {/* Above the fold and the page's LCP element: sized to its 80px box
              and fetched eagerly. */}
          <NextImage
            src={siteProfile.avatar}
            alt={siteProfile.name}
            width={80}
            height={80}
            priority
            className='size-20 grayscale transition-transform duration-300 hover:scale-110'
          />
        </div>
        <div>
          <h1 className='font-display text-4xl leading-tight sm:text-5xl'>
            {siteProfile.name}
          </h1>
          <p className='text-muted leading-snug'>{siteProfile.role}</p>
        </div>
      </div>

      <p className='border-hair font-sourceCodePro text-muted mt-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border px-3 py-1 text-xs'>
        <span className='relative flex size-2' aria-hidden='true'>
          <span className='bg-accent absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping' />
          <span className='bg-accent relative inline-flex size-2 rounded-full' />
        </span>
        <span className='text-foreground'>{siteProfile.status}</span>
        {/* Location is left out on phones so the pill stays on one line. */}
        <span aria-hidden='true' className='hidden sm:inline'>
          ·
        </span>
        <span className='hidden sm:inline'>{siteProfile.location}</span>
        <span aria-hidden='true'>·</span>
        <span>
          <LocalTime /> PKT
        </span>
      </p>

      <p className='mt-5 max-w-2xl leading-relaxed'>
        I’ve spent four years shipping web and mobile products, from the first
        tap to the database. Right now that’s Munshi, a restaurant system I run
        solo, and AI features used by more than 7,000 people.
      </p>

      <div className='mt-6 flex flex-wrap items-center gap-x-4 gap-y-3'>
        <a href='#work' className={primary}>
          See my work <span aria-hidden='true'>↓</span>
        </a>
        <BookCall
          href={siteProfile.booking.intro}
          label='Book a 15-minute intro'
          className={primary}
        />
        <Link href='/about' className={secondary}>
          About me <span aria-hidden='true'>→</span>
        </Link>
      </div>
    </div>
  )
}
