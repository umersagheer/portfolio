import { z } from 'zod'

export const ContactFormSchema = z.object({
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

export const NewsLetterSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is mandatory' })
    .email('Invalid email')
})
