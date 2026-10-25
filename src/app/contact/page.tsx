import type { Metadata } from 'next'
import ContactDoors from '@/components/contact/contact-doors'
import ContactForm from '@/components/contact-form'
import { siteProfile } from '@/constants/site-profile'

export const metadata: Metadata = {
  title: { absolute: 'Hire a Full-Stack Developer – Contact Umer Sagheer' },
  description:
    'Hiring a full-stack or React Native developer, or building an AI product? Book a 15-minute call, WhatsApp, or send a message. Replies within a day.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact' }
}

export default function ContactPage() {
  return (
    <div className='space-y-12'>
      <header className='space-y-3'>
        <h1 className='font-display text-4xl leading-tight'>Let’s talk</h1>
        <p className='text-muted max-w-2xl leading-relaxed'>
          Open to full-time roles and freelance work, remote.{' '}
          {siteProfile.replyTime}
        </p>
      </header>

      <ContactDoors />

      <section
        id='message'
        aria-labelledby='message-heading'
        className='scroll-mt-24 space-y-5'
      >
        <h2 id='message-heading' className='font-display text-2xl'>
          Or write to me
        </h2>
        <ContactForm />
      </section>
    </div>
  )
}
