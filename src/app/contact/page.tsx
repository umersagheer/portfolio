import type { Metadata } from 'next'
import ContactForm from '@/components/contact-form'
import React from 'react'

export const metadata: Metadata = {
  title: { absolute: 'Hire a Full-Stack Developer – Contact Umer Sagheer' },
  description:
    'Hiring a full-stack or React Native developer, or building an AI product? Send a message, WhatsApp, or book a 15-minute call.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact' }
}

export default function ContactPage() {
  return (
    <div className='space-y-8'>
      <h1 className='font-display text-4xl leading-tight'>
        Let&#39;s talk about your project
      </h1>
      <ContactForm />
    </div>
  )
}
