import Link from 'next/link'
import BookCall from '@/components/about/book-call'
import { siteProfile, whatsappHref } from '@/constants/site-profile'

// The one way to get in touch, the same on every page: a call you can book
// now, WhatsApp as the fallback, and the full list on /contact.
export default function ReachOut() {
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <BookCall
          href={siteProfile.booking.intro}
          label='Book a 15-min call'
          className='cta-primary'
        />
        <a
          href={whatsappHref()}
          target='_blank'
          rel='noopener noreferrer'
          className='cta-outline'
        >
          WhatsApp <span aria-hidden='true'>↗</span>
        </a>
      </div>
      <p className='text-muted text-sm'>
        {siteProfile.replyTime}{' '}
        <Link
          href='/contact'
          className='text-foreground hover:text-accent font-medium whitespace-nowrap transition-colors'
        >
          More ways to reach me →
        </Link>
      </p>
    </div>
  )
}
