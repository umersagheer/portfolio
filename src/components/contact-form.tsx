'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ContactFormSchema } from '@/libs/schemas'
import {
  Card,
  CardBody,
  Input,
  Button,
  CardFooter,
  Textarea,
  Link
} from '@nextui-org/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { sendEmail } from '@/libs/actions'
import { handleApiError } from '@/libs/handle-api-error'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const {
    control,
    formState: { errors, isSubmitting },
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
      toast.success("Thanks! I'll be in touch.")
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
        <CardBody className='grid grid-cols-1 items-center justify-center gap-3 md:grid-cols-2'>
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
        </CardBody>
        <CardFooter className='flex flex-col gap-3'>
          <Button
            color='primary'
            variant='flat'
            type='submit'
            fullWidth
            isLoading={loading}
          >
            Send
          </Button>
          <p className='justify-start text-small'>
            By submitting this form, I agree to the{' '}
            <Link underline='hover' href='' className='font-medium' size='sm'>
              privacy policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}
