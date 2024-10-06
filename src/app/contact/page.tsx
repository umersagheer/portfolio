import ContactForm from '@/components/contact-form'
import React from 'react'

export default function ContactPage() {
  return (
    <div className='space-y-8'>
      <h2 className='font-sourceCodePro text-2xl font-bold'>
        Let&#39;s talk about your project
      </h2>
      <ContactForm />
    </div>
  )
}
