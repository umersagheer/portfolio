'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema } from '@/libs/schemas'
import ContactFormEmail from '../../emails/contact-form-email'

const resend = new Resend(process.env.RESEND_API_KEY)

// Sender and recipients come from env so a verified domain or extra
// recipients is a config change. Without a verified domain Resend only
// accepts its test sender, which can only deliver to the account owner.
const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL ?? 'Portfolio contact <onboarding@resend.dev>'
const CONTACT_TO = (process.env.CONTACT_TO_EMAIL ?? 'mhadisb1212@gmail.com')
  .split(',')
  .map(address => address.trim())
  .filter(Boolean)

type ContactFormInputs = z.infer<typeof ContactFormSchema>

export type SendEmailResult = { ok: true } | { ok: false; error: string }

export async function sendEmail(
  formData: ContactFormInputs
): Promise<SendEmailResult> {
  const result = ContactFormSchema.safeParse(formData)
  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0]?.message ?? 'Invalid form data'
    }
  }

  const { email, message, name } = result.data

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: ContactFormEmail({ name, email, message })
    })

    if (error) {
      console.error('[sendEmail]', error)
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (error) {
    console.error('[sendEmail]', error)
    return { ok: false, error: 'Failed to send message' }
  }
}
