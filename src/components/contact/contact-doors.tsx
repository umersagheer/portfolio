import BookCall from '@/components/about/book-call'
import CvPreview from '@/components/about/cv-preview'
import { siteProfile, whatsappHref } from '@/constants/site-profile'

const linkClass =
  'hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

// Every way to reach me, split by why you're here. The only place on the site
// that lists them all; other pages end with the single call to action.
export default function ContactDoors() {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <div className='border-hair space-y-3 rounded-xl border p-5'>
        <h2 className='font-medium'>Hiring?</h2>
        <p className='text-muted text-sm leading-relaxed'>
          Here’s my CV and the quickest ways to reach me.
        </p>
        <div className='flex flex-col items-start gap-1.5'>
          <CvPreview href={siteProfile.cv} className={linkClass} />
          <BookCall
            href={siteProfile.booking.intro}
            label='Book a 15-minute intro'
            className={linkClass}
          />
          <a
            href={siteProfile.socials.linkedin.url}
            target='_blank'
            rel='noopener noreferrer'
            className={linkClass}
          >
            LinkedIn <span aria-hidden='true'>↗</span>
          </a>
          <a
            href={siteProfile.socials.github.url}
            target='_blank'
            rel='noopener noreferrer'
            className={linkClass}
          >
            GitHub <span aria-hidden='true'>↗</span>
          </a>
          <a href={`mailto:${siteProfile.email}`} className={linkClass}>
            {siteProfile.email}
          </a>
        </div>
      </div>
      <div className='border-hair space-y-3 rounded-xl border p-5'>
        <h2 className='font-medium'>Building something?</h2>
        <p className='text-muted text-sm leading-relaxed'>
          Tell me about the problem you’re solving.
        </p>
        <div className='flex flex-col items-start gap-1.5'>
          <a href='#message' className={linkClass}>
            Send a message <span aria-hidden='true'>↓</span>
          </a>
          <a
            href={whatsappHref(
              'Hi Umer, I found your portfolio and wanted to talk about a project.'
            )}
            target='_blank'
            rel='noopener noreferrer'
            className={linkClass}
          >
            WhatsApp {siteProfile.whatsapp.label}{' '}
            <span aria-hidden='true'>↗</span>
          </a>
          <BookCall
            href={siteProfile.booking.project}
            label='Book a 30-minute project call'
            className={linkClass}
          />
        </div>
      </div>
    </div>
  )
}
