import FooterCta from '@/components/footer-cta'
import LocalTime from '@/components/local-time'
import ReachOut from '@/components/reach-out'
import { siteProfile } from '@/constants/site-profile'

const socials = [
  siteProfile.socials.github,
  siteProfile.socials.x,
  siteProfile.socials.linkedin
]

// How the site itself is built: a small, honest look under the hood.
const colophon = [
  ['pages', 'static MDX, prerendered'],
  ['likes', 'Postgres via Prisma, capped per reader'],
  ['contact', 'server action → Resend'],
  ['hosting', 'Vercel · Node 24']
] as const

export function Footer() {
  return (
    <footer className='container max-w-3xl pb-10'>
      <div className='border-hair space-y-10 border-t pt-12'>
        <FooterCta>
          <div data-section className='space-y-4'>
            <p className='section-label font-sourceCodePro text-muted text-xs tracking-wide'>
              Contact
            </p>
            <p className='font-display text-4xl leading-tight'>
              Let&apos;s build something.
            </p>
            <ReachOut />
          </div>
        </FooterCta>

        <div className='grid gap-8 sm:grid-cols-2'>
          <div className='space-y-3'>
            <p className='font-sourceCodePro text-muted text-xs tracking-wide'>
              Elsewhere
            </p>
            <ul className='flex flex-wrap gap-x-4 gap-y-1 text-sm'>
              {socials.map(social => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted hover:text-accent transition-colors'
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
            <p className='font-sourceCodePro text-xs'>
              Pakistan · <LocalTime /> PKT
            </p>
          </div>

          <div className='space-y-3'>
            <p className='font-sourceCodePro text-muted text-xs tracking-wide'>
              How this site works
            </p>
            <dl className='font-sourceCodePro grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-xs'>
              {colophon.map(([part, how]) => (
                <div key={part} className='contents'>
                  <dt>{part}</dt>
                  <dd className='text-muted'>{how}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className='font-sourceCodePro text-muted flex flex-wrap justify-between gap-2 text-xs'>
          <span>© 2026 {siteProfile.name}</span>
          <span>Built with Next.js &amp; HeroUI</span>
        </p>
      </div>
    </footer>
  )
}
