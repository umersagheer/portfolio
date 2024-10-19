'use server'

import { z } from 'zod'
import { ContactFormSchema } from './schemas'
import ContactFormEmail from '../../emails/contact-form-email'
import { Resend } from 'resend'

const resend = new Resend('re_NFfQQgbp_MUsoJ7nNrVhfzy9qGYT1znwz')
type ContactFormInputs = z.infer<typeof ContactFormSchema>

export async function sendEmail(formData: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(formData)
  if (result.error) return { error: result.error.format }

  const { email, message, name } = formData
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['mhadisb1212@gmail.com'],
    cc: ['umersagheer0075@gmail.com'],
    subject: 'Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    react: ContactFormEmail({ name, email, message })
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}
