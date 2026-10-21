'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ContactFormSchema } from '@/libs/schemas'
import {
  Card,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Button,
  Separator,
  Spinner,
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
              <TextField
                type='text'
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={Boolean(errors.name)}
              >
                <Label>Name</Label>
                <Input ref={field.ref} />
                <FieldError>{errors.name?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                type='text'
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={Boolean(errors.email)}
              >
                <Label>Email</Label>
                <Input ref={field.ref} />
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <TextField
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={Boolean(errors.message)}
                className='md:col-span-2'
              >
                <Label>Message</Label>
                <TextArea ref={field.ref} rows={4} />
                <FieldError>{errors.message?.message}</FieldError>
              </TextField>
            )}
          />
        </Card.Content>
        <Card.Footer className='flex flex-col gap-3'>
          <Button variant='primary' type='submit' fullWidth isPending={loading}>
            {/* v3 Button has no built-in loading spinner (v2's isLoading had one) */}
            {({ isPending }) => (
              <>
                {isPending && <Spinner size='sm' color='current' />}
                Send
              </>
            )}
          </Button>

          <div className='flex w-full items-center justify-center gap-3'>
            <Separator className='w-1/3' />
            <p>OR</p>
            <Separator className='w-1/3' />
          </div>

          <Button
            className='button--success'
            variant='primary'
            fullWidth
            onPress={() => window.open('https://wa.me/+923018155698', '_blank')}
          >
            Whatsapp
            <MessageCircleHeartIcon size={16} />
          </Button>
        </Card.Footer>
      </Card>
    </form>
  )
}
