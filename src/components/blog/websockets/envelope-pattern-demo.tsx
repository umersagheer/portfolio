'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextField, Input, Select, Label, ListBox } from '@heroui/react'
import DemoContainer from './demo-container'

const MESSAGE_TYPES = [
  { key: 'chat:message', label: 'chat:message' },
  { key: 'typing:start', label: 'typing:start' },
  { key: 'user:join', label: 'user:join' }
]

const DEMO_MESSAGE_ID = 'msg_demo01'
const DEMO_TIMESTAMP = '2026-03-15T12:34:56Z'

export default function EnvelopePatternDemo() {
  const [message, setMessage] = useState('Hello team!')
  const [messageType, setMessageType] = useState('chat:message')

  const envelope = {
    type: messageType,
    id: DEMO_MESSAGE_ID,
    timestamp: DEMO_TIMESTAMP,
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
        <TextField value={message} onChange={setMessage} className='flex-1'>
          <Label>Message</Label>
          <Input />
        </TextField>
        <Select
          value={messageType}
          onChange={val => {
            if (val) setMessageType(String(val))
          }}
          className='sm:w-44'
        >
          <Label>Type</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {MESSAGE_TYPES.map(t => (
                <ListBox.Item key={t.key} id={t.key}>
                  {t.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Raw String */}
        <div className='border-default-200 bg-background rounded-lg border p-4'>
          <p className='text-danger-400 mb-2 text-xs font-semibold tracking-wider uppercase'>
            Raw String
          </p>
          <div className='bg-default-100 text-default-600 dark:bg-default-50 rounded-md p-3 font-mono text-sm'>
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
          <p className='text-default-400 mt-2 text-[11px]'>
            Just text. Server has no idea what to do with it.
          </p>
        </div>

        {/* Structured Envelope */}
        <div className='border-primary-200 bg-background dark:border-primary-800 rounded-lg border p-4'>
          <p className='text-primary-500 mb-2 text-xs font-semibold tracking-wider uppercase'>
            Envelope
          </p>
          <div className='bg-default-100 dark:bg-default-50 overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed'>
            <span className='text-default-500'>{'{'}</span>
            <br />
            <EnvelopeLine label='type' annotation='routes to handler'>
              &quot;<span className='text-primary-500'>{messageType}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='id' annotation='enables acks'>
              &quot;<span className='text-secondary-500'>{envelope.id}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='timestamp' annotation='ordering'>
              &quot;
              <span className='text-default-500'>{envelope.timestamp}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='payload' annotation='your data'>
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
            <EnvelopeLine label='metadata' annotation='context' isLast>
              {'{ "userId": "usr_a1b2c3", "room": "general" }'}
            </EnvelopeLine>
            <span className='text-default-500'>{'}'}</span>
          </div>
          <p className='text-default-400 mt-2 text-[11px]'>
            Self-describing. Server knows exactly how to route it.
          </p>
        </div>
      </div>

      {/* Size comparison */}
      <div className='bg-default-100 dark:bg-default-50 mt-4 flex items-center justify-center gap-6 rounded-md px-4 py-2.5 text-[11px]'>
        <span className='text-default-500'>
          HTTP request:{' '}
          <span className='text-danger-500 font-semibold'>~800 bytes</span>{' '}
          headers per message
        </span>
        <span className='text-default-300'>vs</span>
        <span className='text-default-500'>
          WS envelope:{' '}
          <span className='text-primary-500 font-semibold'>~120 bytes</span>{' '}
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
      <span className='text-default-500 ml-4 shrink-0'>
        &quot;{label}&quot;:{' '}
      </span>
      <span className='text-default-700 dark:text-default-300'>
        {children}
        {!isLast && ','}
      </span>
      <span className='text-default-400 ml-2 hidden text-[10px] italic sm:inline'>
        {'// '}
        {annotation}
      </span>
    </div>
  )
}
