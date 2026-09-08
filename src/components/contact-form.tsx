'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ContactFormSchema } from '@/libs/schemas'
import {
  Card,
  Input,
  Button,
  Textarea,
  Link,
  Separator,
  toast
} from '@heroui/react'
import { z } from 'zod'
import { sendEmail } from '@/libs/actions'
import { handleApiError } from '@/libs/handle-api-error'
import { MessageCircleHeartIcon } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof ContactFormSchema>) => {
    try {
      setLoading(true)
      await sendEmail(data)
      toast('Thank you for your message!', {
        description: 'I will be in touch with you soon.',
        variant: 'success'
      })
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center'>
      <Card className='max-w-2xl grow'>
        <Card.Content className='grid grid-cols-1 items-center justify-center gap-3 md:grid-cols-2'>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                label='Name'
                type='text'
                size='sm'
                {...field}
                isInvalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                label='Email'
                type='text'
                size='sm'
                {...field}
                isInvalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <Textarea
                minRows={1}
                maxRows={4}
                label='Message'
                type='text'
                size='sm'
                {...field}
                isInvalid={Boolean(errors.message)}
                errorMessage={errors.message?.message}
                className='md:col-span-2'
              />
            )}
          />
        </Card.Content>
        <Card.Footer className='flex flex-col gap-3'>
          <Button
            variant='secondary'
            type='submit'
            fullWidth
            isPending={loading}
          >
            Send
          </Button>

          <div className='flex w-full items-center justify-center gap-3'>
            <Separator className='w-1/3' />
            <p>OR</p>
            <Separator className='w-1/3' />
          </div>

          <Button
            className='bg-success text-success-foreground'
            variant='primary'
            fullWidth
            onPress={() => window.open('https://wa.me/+923018155698', '_blank')}
          >
            Whatsapp
            <MessageCircleHeartIcon size={16} />
          </Button>
          <p className='text-small justify-start'>
            By submitting this form, I agree to the{' '}
            <Link href='' className='text-sm font-medium hover:underline'>
              privacy policy
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </form>
  )
}
