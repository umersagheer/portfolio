import ContactForm from '@/components/contact-form'
import React from 'react'

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
