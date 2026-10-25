'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ContactFormSchema } from '@/libs/schemas'
import {
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Button,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  toast
} from '@heroui/react'
import { z } from 'zod'
import { sendEmail } from '@/libs/actions'

type ContactFormValues = z.infer<typeof ContactFormSchema>

const PLACEHOLDERS: Record<ContactFormValues['intent'], string> = {
  project: 'What are you building, and where are you stuck?',
  hiring: 'The role, the team, and how to get the details.'
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const {
    control,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      intent: 'project',
      name: '',
      email: '',
      message: ''
    }
  })
  const intent = watch('intent')

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true)
    // A thrown error (e.g. the network dropped) is a failure too.
    const result = await sendEmail(data).catch(() => ({ ok: false as const }))
    setLoading(false)

    if (result.ok) {
      toast('Thank you for your message!', {
        description: 'I will be in touch with you soon.',
        variant: 'success'
      })
      reset({ intent: data.intent, name: '', email: '', message: '' })
      return
    }

    // Keep what they typed so they can retry without rewriting it.
    toast("Couldn't send your message", {
      description: 'Please try again, or reach me on WhatsApp.',
      variant: 'danger'
    })
  }

  return (
    // noValidate: Zod is the single validator; type='email' is only there for
    // the right mobile keyboard and autofill.
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2'
    >
      <Controller
        name='intent'
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup
            aria-label='What is this about?'
            selectionMode='single'
            disallowEmptySelection
            selectedKeys={[field.value]}
            onSelectionChange={keys => {
              const [key] = [...keys]
              if (key) field.onChange(key)
            }}
            size='sm'
            className='md:col-span-2'
          >
            <ToggleButton id='project'>I have a project</ToggleButton>
            <ToggleButton id='hiring'>
              <ToggleButtonGroup.Separator />
              I’m hiring
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      />

      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <TextField
            type='text'
            autoComplete='name'
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
            type='email'
            autoComplete='email'
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
            <TextArea
              ref={field.ref}
              rows={5}
              placeholder={PLACEHOLDERS[intent]}
            />
            <FieldError>{errors.message?.message}</FieldError>
          </TextField>
        )}
      />

      <div>
        <Button
          variant='primary'
          className='button--inverse'
          type='submit'
          isPending={loading}
        >
          {/* v3 Button has no built-in loading spinner (v2's isLoading had one) */}
          {({ isPending }) => (
            <>
              {isPending && <Spinner size='sm' color='current' />}
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
