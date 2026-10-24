import type { Metadata } from 'next'
import Link from 'next/link'

import BookCall from '@/components/about/book-call'
import GithubActivity from '@/components/about/github-activity'
import Journey from '@/components/about/journey/journey'
import SectionHeader from '@/components/section-header'
import { siteProfile } from '@/constants/site-profile'

export const metadata: Metadata = {
  title: 'About · Umer Sagheer',
  description:
    'A full-stack engineer who learned the fundamentals before AI and now builds AI into real products, from the first tap to the database and out to the stores.'
}

// Each trait links to proof already on the site.
const TRAITS = [
  {
    title: 'I ship whole products',
    body: 'The screen, the API, the database and the deploy. Munshi runs a restaurant end to end, and I’m the only engineer behind it.',
    links: [{ label: 'The Munshi case study', href: '/projects/munshi' }]
  },
  {
    title: 'I make AI earn its place',
    body: 'Models make things up, so I check their output against real data before anyone sees it. That’s how Engagemo stopped telling students off for mistakes they had already fixed.',
    links: [
      { label: 'The guardrail story', href: '/projects/engagemo#the-hard-part' }
    ]
  },
  {
    title: 'I care about the screen you touch',
    body: 'Motion that explains what changed, layouts that don’t jump, and apps that feel at home on both stores.',
    links: [
      { label: 'How layout animations work', href: '/posts/layout-animations' }
    ]
  },
  {
    title: 'Fundamentals first',
    body: 'I’d rather understand a tool than memorise it, and I write it down so others can too.',
    links: [
      { label: 'Git, under the hood', href: '/posts/git-internals' },
      {
        label: 'The timezone bug that lost five orders',
        href: '/posts/timezones'
      }
    ]
  }
]

const JOURNEY = [
  {
    year: '2021',
    text: 'Started a BS in Computer Science at Government College University, Lahore.'
  },
  {
    year: '2022',
    text: 'First job, at TechGoat IT Solutions, while still studying: REST APIs for logistics, education and booking platforms, a logistics dashboard built on heavy reporting queries, and a PHP backend moved to Node.js.'
  },
  {
    year: '2024',
    text: 'A contract at Rhodium Tech: Adopt 2 Educate, a platform that connects donors to students, on NestJS, React and React Native.'
  },
  {
    year: '2025',
    text: 'Joined Softaims as a full-stack engineer. Led Engagemo, shipped NourishWise to both stores, started Munshi, and graduated.'
  },
  {
    year: '2026',
    text: 'Shipped Meridian Profits to both stores, started on NestJS microservices that talk to industrial sensors, and kept growing Munshi.'
  }
]

const NOW = [
  {
    label: 'Building',
    text: 'Munshi’s next product, grocery management, and NestJS microservices that read industrial sensors over OPC UA.'
  },
  {
    label: 'Learning',
    text: 'Agent workflows and how to evaluate them, event streaming, and reading query plans properly.'
  }
]

const linkClass =
  'hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1 rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

const whatsappHref = `https://wa.me/${siteProfile.whatsapp.number}?text=${encodeURIComponent('Hi Umer, I found your portfolio and wanted to talk about a project.')}`

export default function AboutPage() {
  return (
    <div className='space-y-16'>
      <div className='space-y-4'>
        <h1 className='font-display text-4xl leading-tight'>About</h1>
        <p className='max-w-2xl text-lg leading-relaxed'>
          I’m Umer, a full-stack engineer in Lahore. I learned to build software
          the slow way, from documentation and Stack Overflow threads, before AI
          could write a line of it. That habit of understanding how things work
          underneath is what I lean on now that I build AI into products.
        </p>
        <p className='text-muted max-w-2xl leading-relaxed'>
          For four years I’ve taken products from the first tap to the database
          and out to the stores: a restaurant system that keeps taking orders
          when the internet drops, an AI writing coach used by 30 to 40
          institutions, and two apps on the App Store and Google Play.
        </p>
      </div>

      <section data-section>
        <SectionHeader index='01' label='How I work' title='What I bring' />
        <ul className='grid gap-x-10 gap-y-8 sm:grid-cols-2'>
          {TRAITS.map(trait => (
            <li key={trait.title} className='space-y-2'>
              <h3 className='font-medium'>{trait.title}</h3>
              <p className='text-muted text-sm leading-relaxed'>{trait.body}</p>
              <p className='flex flex-col items-start gap-1'>
                {trait.links.map(link => (
                  <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label} <span aria-hidden='true'>→</span>
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section data-section>
        <SectionHeader
          index='02'
          label='How I build'
          title='From a tap to a reply'
        />
        <p className='text-muted mb-6 max-w-2xl leading-relaxed'>
          Every product I build follows this path. The tools change with the
          problem; the thinking doesn’t.
        </p>
        {/* Figures may break out of the text column on wide screens; text never does. */}
        <div className='min-[1100px]:relative min-[1100px]:left-1/2 min-[1100px]:w-[1040px] min-[1100px]:-translate-x-1/2'>
          <Journey />
        </div>
      </section>

      <section data-section>
        <SectionHeader index='03' label='Journey' title='How I got here' />
        <ol className='border-hair border-t'>
          {JOURNEY.map(step => (
            <li
              key={step.year}
              className='border-hair grid grid-cols-[4.5rem_1fr] gap-4 border-b py-4'
            >
              <span className='font-sourceCodePro text-muted text-sm'>
                {step.year}
              </span>
              <p className='text-sm leading-relaxed'>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-section>
        <SectionHeader index='04' label='Now' title='What I’m on these days' />
        <dl className='space-y-4'>
          {NOW.map(item => (
            <div key={item.label} className='grid grid-cols-[4.5rem_1fr] gap-4'>
              <dt className='font-sourceCodePro text-muted text-sm'>
                {item.label}
              </dt>
              <dd className='text-sm leading-relaxed'>{item.text}</dd>
            </div>
          ))}
        </dl>
        {siteProfile.showGithubActivity && <GithubActivity />}
      </section>

      <section data-section>
        <SectionHeader
          index='05'
          label='Off the clock'
          title='Away from the screen'
        />
        <p className='max-w-2xl leading-relaxed'>
          Off the clock, I’m usually out finding a new food spot in Lahore, or
          playing table tennis or badminton. I’ll happily take a recommendation
          for either.
        </p>
      </section>

      <section data-section>
        <SectionHeader index='06' label='Contact' title='Let’s talk' />
        <p className='text-muted mb-6 max-w-2xl leading-relaxed'>
          Open to full-time roles and freelance work.
        </p>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='border-hair space-y-3 rounded-xl border p-5'>
            <h3 className='font-medium'>Hiring?</h3>
            <p className='text-muted text-sm leading-relaxed'>
              Here’s my CV and the quickest ways to reach me.
            </p>
            <div className='flex flex-col items-start gap-1.5'>
              <a href={siteProfile.cv} download className={linkClass}>
                Download my CV <span aria-hidden='true'>↓</span>
              </a>
              <a
                href={siteProfile.socials.linkedin.url}
                target='_blank'
                rel='noopener noreferrer'
                className={linkClass}
              >
                LinkedIn <span aria-hidden='true'>↗</span>
              </a>
              <a href={`mailto:${siteProfile.email}`} className={linkClass}>
                {siteProfile.email}
              </a>
            </div>
          </div>
          <div className='border-hair space-y-3 rounded-xl border p-5'>
            <h3 className='font-medium'>Building something?</h3>
            <p className='text-muted text-sm leading-relaxed'>
              Tell me about the problem you’re solving.
            </p>
            <div className='flex flex-col items-start gap-1.5'>
              <Link href='/contact' className={linkClass}>
                Send a message <span aria-hidden='true'>→</span>
              </Link>
              <a
                href={whatsappHref}
                target='_blank'
                rel='noopener noreferrer'
                className={linkClass}
              >
                WhatsApp {siteProfile.whatsapp.label}{' '}
                <span aria-hidden='true'>↗</span>
              </a>
              {siteProfile.booking && (
                <BookCall href={siteProfile.booking} className={linkClass} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
