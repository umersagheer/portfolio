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
        <div className='border-border bg-background rounded-lg border p-4'>
          <p className='text-danger mb-2 text-xs font-semibold tracking-wider uppercase'>
            Raw String
          </p>
          <div className='bg-surface-secondary text-foreground dark:bg-surface rounded-md p-3 font-mono text-sm'>
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
          <p className='text-muted mt-2 text-[11px]'>
            Just text. Server has no idea what to do with it.
          </p>
        </div>

        {/* Structured Envelope */}
        <div className='border-accent bg-background dark:border-accent rounded-lg border p-4'>
          <p className='text-accent mb-2 text-xs font-semibold tracking-wider uppercase'>
            Envelope
          </p>
          <div className='bg-surface-secondary dark:bg-surface overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed'>
            <span className='text-muted'>{'{'}</span>
            <br />
            <EnvelopeLine label='type' annotation='routes to handler'>
              &quot;<span className='text-accent'>{messageType}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='id' annotation='enables acks'>
              &quot;<span className='text-secondary'>{envelope.id}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='timestamp' annotation='ordering'>
              &quot;
              <span className='text-muted'>{envelope.timestamp}</span>
              &quot;
            </EnvelopeLine>
            <EnvelopeLine label='payload' annotation='your data'>
              {'{ '}
              <span className='text-success-soft-foreground dark:text-success'>
                &quot;text&quot;
              </span>
              :{' '}
              <AnimatePresence mode='wait'>
                <motion.span
                  key={message}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-success-soft-foreground dark:text-success'
                >
                  &quot;{message || '...'}&quot;
                </motion.span>
              </AnimatePresence>
              {' }'}
            </EnvelopeLine>
            <EnvelopeLine label='metadata' annotation='context' isLast>
              {'{ "userId": "usr_a1b2c3", "room": "general" }'}
            </EnvelopeLine>
            <span className='text-muted'>{'}'}</span>
          </div>
          <p className='text-muted mt-2 text-[11px]'>
            Self-describing. Server knows exactly how to route it.
          </p>
        </div>
      </div>

      {/* Size comparison */}
      <div className='bg-surface-secondary dark:bg-surface mt-4 flex items-center justify-center gap-6 rounded-md px-4 py-2.5 text-[11px]'>
        <span className='text-muted'>
          HTTP request:{' '}
          <span className='text-danger font-semibold'>~800 bytes</span> headers
          per message
        </span>
        <span className='text-muted'>vs</span>
        <span className='text-muted'>
          WS envelope:{' '}
          <span className='text-accent font-semibold'>~120 bytes</span> total
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
      <span className='text-muted ml-4 shrink-0'>&quot;{label}&quot;: </span>
      <span className='text-foreground dark:text-muted'>
        {children}
        {!isLast && ','}
      </span>
      <span className='text-muted ml-2 hidden text-[10px] italic sm:inline'>
        {'// '}
        {annotation}
      </span>
    </div>
  )
}
