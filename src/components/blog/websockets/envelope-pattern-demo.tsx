'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Select, SelectItem } from '@heroui/react'
import DemoContainer from './demo-container'

const MESSAGE_TYPES = [
  { key: 'chat:message', label: 'chat:message' },
  { key: 'typing:start', label: 'typing:start' },
  { key: 'user:join', label: 'user:join' }
]

function generateId() {
  return 'msg_' + Math.random().toString(36).slice(2, 8)
}

export default function EnvelopePatternDemo() {
  const [message, setMessage] = useState('Hello team!')
  const [messageType, setMessageType] = useState('chat:message')
  const [msgId] = useState(generateId)

  const envelope = {
    type: messageType,
    id: msgId,
    timestamp: new Date().toISOString().slice(0, 19) + 'Z',
    payload: {
      text: message || '...'
    },
    metadata: {
      userId: 'usr_a1b2c3',
      room: 'general'
    }
  }

  return (
    <DemoContainer
      title='The Envelope Pattern'
      description='Type a message and pick a type to see raw string vs structured envelope'
    >
      <div className='mb-4 flex flex-col gap-3 sm:flex-row'>
        <Input
          size='sm'
          variant='bordered'
          label='Message'
          value={message}
          onValueChange={setMessage}
          className='flex-1'
        />
        <Select
          size='sm'
          variant='bordered'
          label='Type'
          selectedKeys={[messageType]}
          onSelectionChange={keys => {
            const val = Array.from(keys)[0]
            if (val) setMessageType(String(val))
          }}
          className='sm:w-44'
        >
          {MESSAGE_TYPES.map(t => (
            <SelectItem key={t.key}>{t.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Raw String */}
        <div className='rounded-lg border border-default-200 bg-background p-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-danger-400'>
            Raw String
          </p>
          <div className='rounded-md bg-default-100 p-3 font-mono text-sm text-default-600 dark:bg-default-50'>
            <AnimatePresence mode='wait'>
              <motion.span
                key={message}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                &quot;{message || '...'}&quot;
              </motion.span>
            </AnimatePresence>
          </div>
          <p className='mt-2 text-[11px] text-default-400'>
            Just text. Server has no idea what to do with it.
          </p>
        </div>

        {/* Structured Envelope */}
        <div className='rounded-lg border border-primary-200 bg-background p-4 dark:border-primary-800'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-primary-500'>
            Envelope
          </p>
          <div className='overflow-x-auto rounded-md bg-default-100 p-3 font-mono text-xs leading-relaxed dark:bg-default-50'>
            <span className='text-default-500'>{'{'}</span>
            <br />
            <EnvelopeLine
              label='type'
              annotation='routes to handler'
            >
              &quot;<span className='text-primary-500'>{messageType}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='id' annotation='enables acks'>
              &quot;<span className='text-secondary-500'>{msgId}</span>&quot;
            </EnvelopeLine>
            <EnvelopeLine
              label='timestamp'
              annotation='ordering'
            >
              &quot;
              <span className='text-default-500'>
                {envelope.timestamp}
              </span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine
              label='payload'
              annotation='your data'
            >
              {'{ '}
              <span className='text-success-600 dark:text-success-400'>
                &quot;text&quot;
              </span>
              :{' '}
              <AnimatePresence mode='wait'>
                <motion.span
                  key={message}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-success-600 dark:text-success-400'
                >
                  &quot;{message || '...'}&quot;
                </motion.span>
              </AnimatePresence>
              {' }'}
            </EnvelopeLine>
            <EnvelopeLine
              label='metadata'
              annotation='context'
              isLast
            >
              {'{ "userId": "usr_a1b2c3", "room": "general" }'}
            </EnvelopeLine>
            <span className='text-default-500'>{'}'}</span>
          </div>
          <p className='mt-2 text-[11px] text-default-400'>
            Self-describing. Server knows exactly how to route it.
          </p>
        </div>
      </div>

      {/* Size comparison */}
      <div className='mt-4 flex items-center justify-center gap-6 rounded-md bg-default-100 px-4 py-2.5 text-[11px] dark:bg-default-50'>
        <span className='text-default-500'>
          HTTP request:{' '}
          <span className='font-semibold text-danger-500'>~800 bytes</span>{' '}
          headers per message
        </span>
        <span className='text-default-300'>vs</span>
        <span className='text-default-500'>
          WS envelope:{' '}
          <span className='font-semibold text-primary-500'>~120 bytes</span>{' '}
          total
        </span>
      </div>
    </DemoContainer>
  )
}

function EnvelopeLine({
  label,
  annotation,
  children,
  isLast
}: {
  label: string
  annotation: string
  children: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div className='group flex items-start'>
      <span className='ml-4 shrink-0 text-default-500'>
        &quot;{label}&quot;:{' '}
      </span>
      <span className='text-default-700 dark:text-default-300'>
        {children}
        {!isLast && ','}
      </span>
      <span className='ml-2 hidden text-[10px] text-default-400 italic sm:inline'>
        {'// '}{annotation}
      </span>
    </div>
  )
}
