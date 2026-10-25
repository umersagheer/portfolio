import { z } from 'zod'

export const ContactIntents = ['project', 'hiring'] as const

export const ContactFormSchema = z.object({
  // Tags the email subject so hiring and project mail are easy to tell apart.
  intent: z.enum(ContactIntents),
  name: z
    .string()
    .min(1, { message: 'Name is mandatory' })
    .min(2, { message: 'Name is too short' }),
  email: z
    .string()
    .min(1, { message: 'Email is mandatory' })
    .email('Invalid email'),
  message: z.string().min(1, { message: 'Message is mandatory' })
})
