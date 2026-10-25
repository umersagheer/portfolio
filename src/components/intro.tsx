import Link from 'next/link'
import BookCall from '@/components/about/book-call'
import LocalTime from '@/components/local-time'
import TimeAhead from '@/components/time-ahead'
import { siteProfile } from '@/constants/site-profile'

// Who, what stack, and whether I'm available, within the first screen. The
// booking button is the one filled action on the page.
export default function Intro() {
  return (
    <div className='flex flex-col items-start pb-14'>
      <h1 className='font-display text-4xl leading-tight sm:text-5xl'>
        {siteProfile.name}
      </h1>
      <p className='text-muted mt-2 leading-snug'>
        Full-stack engineer ·{' '}
        <span className='text-foreground'>React, Node.js/NestJS, Expo</span> · I
        build AI into real products.
      </p>

      {/* Availability, then my time and how far it is from the reader's: the
          overlap question answered the way Slack does, with a clock. */}
      <p className='font-sourceCodePro text-muted mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
        <span className='relative flex size-2' aria-hidden='true'>
          <span className='bg-accent absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping' />
          <span className='bg-accent relative inline-flex size-2 rounded-full' />
        </span>
        <span className='text-foreground'>Available now</span>
        <span aria-hidden='true'>·</span>
        <span>remote · full-time or freelance</span>
        <span aria-hidden='true'>·</span>
        <span>
          <LocalTime /> in Lahore
          <TimeAhead prefix=', ' />
        </span>
      </p>

      <p className='mt-5 max-w-2xl leading-relaxed'>
        I’ve spent four years shipping web and mobile products, from the first
        tap to the database. Right now that’s Munshi, a restaurant system I run
        solo, and AI features used by more than 7,000 people.
      </p>

      <div className='mt-6 flex flex-wrap items-center gap-x-4 gap-y-3'>
        <BookCall
          href={siteProfile.booking.intro}
          label='Book a 15-min call'
          className='cta-primary'
        />
        <a href='#work' className='cta-outline'>
          See my work <span aria-hidden='true'>↓</span>
        </a>
        <Link
          href='/about'
          className='text-muted hover:text-accent focus-visible:outline-accent rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
        >
          About me <span aria-hidden='true'>→</span>
        </Link>
      </div>
    </div>
  )
}
