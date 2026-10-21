'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Tooltip } from '@heroui/react'
import { Focusable } from 'react-aria-components'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import DemoContainer from './demo-container'

type Format = 'iso' | 'dateOnly' | 'noZ' | 'offset' | 'spaced'

const FORMATS: {
  key: Format
  label: string
  raw: string
  segments: { text: string; color: string; label: string }[]
  parsedAs: string
  safe: boolean
  note: string
}[] = [
  {
    key: 'iso',
    label: 'ISO 8601 (UTC)',
    raw: '2026-03-29T14:30:00.000Z',
    segments: [
      { text: '2026', color: 'text-accent', label: 'Year' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '03', color: 'text-accent', label: 'Month' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '29', color: 'text-warning', label: 'Day' },
      { text: 'T', color: 'text-muted', label: 'Separator' },
      { text: '14', color: 'text-success', label: 'Hours (24h)' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '30', color: 'text-success', label: 'Minutes' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Seconds' },
      { text: '.', color: 'text-muted', label: '' },
      { text: '000', color: 'text-muted', label: 'Milliseconds' },
      { text: 'Z', color: 'text-danger', label: 'UTC (Zulu)' }
    ],
    parsedAs: 'UTC',
    safe: true,
    note: 'The Z means "Zulu time" = UTC. This is what .toISOString() returns and what JSON.stringify uses.'
  },
  {
    key: 'dateOnly',
    label: 'Date only',
    raw: '2026-03-29',
    segments: [
      { text: '2026', color: 'text-accent', label: 'Year' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '03', color: 'text-accent', label: 'Month' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '29', color: 'text-warning', label: 'Day' }
    ],
    parsedAs: 'UTC (per spec)',
    safe: true,
    note: 'ECMAScript spec says date-only strings are treated as UTC. Safe to use when you only care about the date.'
  },
  {
    key: 'noZ',
    label: 'No Z (trap!)',
    raw: '2026-03-29T00:00:00',
    segments: [
      { text: '2026', color: 'text-accent', label: 'Year' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '03', color: 'text-accent', label: 'Month' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '29', color: 'text-warning', label: 'Day' },
      { text: 'T', color: 'text-muted', label: 'Separator' },
      { text: '00', color: 'text-success', label: 'Hours' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Minutes' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Seconds' },
      { text: '  ', color: '', label: '' },
      { text: '← no Z!', color: 'text-danger', label: 'Missing timezone' }
    ],
    parsedAs: 'LOCAL TIME',
    safe: false,
    note: 'Without Z or an offset, JS treats this as local time. For someone in PKT (UTC+5), midnight local = March 28 19:00 UTC — the previous day!'
  },
  {
    key: 'offset',
    label: 'With offset',
    raw: '2026-03-29T00:00:00+05:00',
    segments: [
      { text: '2026', color: 'text-accent', label: 'Year' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '03', color: 'text-accent', label: 'Month' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '29', color: 'text-warning', label: 'Day' },
      { text: 'T', color: 'text-muted', label: 'Separator' },
      { text: '00', color: 'text-success', label: 'Hours' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Minutes' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Seconds' },
      { text: '+05:00', color: 'text-danger', label: 'UTC+5 offset' }
    ],
    parsedAs: 'UTC (via offset)',
    safe: true,
    note: 'The +05:00 tells JS exactly how to convert to UTC. Midnight in PKT = March 28 19:00 UTC. Explicit and unambiguous.'
  },
  {
    key: 'spaced',
    label: 'Space separator',
    raw: '2026-03-29 00:00:00',
    segments: [
      { text: '2026', color: 'text-accent', label: 'Year' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '03', color: 'text-accent', label: 'Month' },
      { text: '-', color: 'text-muted', label: '' },
      { text: '29', color: 'text-warning', label: 'Day' },
      { text: ' ', color: 'text-muted', label: 'Space (not T)' },
      { text: '00', color: 'text-success', label: 'Hours' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Minutes' },
      { text: ':', color: 'text-muted', label: '' },
      { text: '00', color: 'text-success', label: 'Seconds' }
    ],
    parsedAs: 'Varies by browser',
    safe: false,
    note: 'Space instead of T is not part of ISO 8601. Behavior varies across browsers and Node versions. Avoid this format.'
  }
]

export default function ISOStringAnatomy() {
  const [active, setActive] = useState<Format>('iso')
  const [selectedSegment, setSelectedSegment] = useState(0)

  const format = FORMATS.find(f => f.key === active)!
  const highlightedSegment =
    format.segments[selectedSegment] ?? format.segments.find(seg => seg.label)

  return (
    <DemoContainer
      title='Anatomy of a Date String'
      description='Select each labeled part to inspect it — then switch formats to spot the trap'
    >
      <div className='mb-4 flex flex-wrap gap-2'>
        {FORMATS.map(f => (
          <Button
            key={f.key}
            size='sm'
            variant={
              active === f.key ? (f.safe ? 'primary' : 'danger') : 'tertiary'
            }
            onPress={() => {
              setActive(f.key)
              setSelectedSegment(
                Math.max(
                  0,
                  f.segments.findIndex(segment => segment.label)
                )
              )
            }}
            className='text-xs'
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* The string with hoverable segments */}
      <div className='bg-surface-secondary mb-4 overflow-x-auto rounded-lg p-4'>
        <div className='flex flex-wrap items-baseline font-mono text-lg font-bold sm:text-xl'>
          {format.segments.map((seg, i) => {
            const hasLabel = seg.label !== ''

            if (!hasLabel) {
              return (
                <motion.span
                  key={`${active}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`whitespace-pre ${seg.color}`}
                >
                  {seg.text}
                </motion.span>
              )
            }

            return (
              <Tooltip key={`${active}-${i}`}>
                {/* Focusable wires the tooltip to the button; v3 tooltips do
                    not open from a plain element. */}
                <Focusable>
                  <motion.button
                    type='button'
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    aria-label={seg.label}
                    aria-pressed={selectedSegment === i}
                    className={`font-inherit relative rounded-sm bg-transparent p-0 whitespace-pre ${seg.color} ${
                      selectedSegment === i
                        ? 'ring-accent ring-offset-surface-secondary scale-110 ring-2 ring-offset-2'
                        : ''
                    } transition-transform focus-visible:outline-none`}
                    onMouseEnter={() => setSelectedSegment(i)}
                    onFocus={() => setSelectedSegment(i)}
                    onClick={() => setSelectedSegment(i)}
                  >
                    {seg.text}
                  </motion.button>
                </Focusable>

                <Tooltip.Content>{seg.label}</Tooltip.Content>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {/* Info bar */}
      <div className='border-border grid gap-2 rounded-lg border p-3'>
        <div className='flex items-baseline justify-between text-xs'>
          <span className='text-muted'>Parsed as</span>
          <span
            className={`font-mono font-bold ${
              format.safe ? 'text-success' : 'text-danger'
            }`}
          >
            {format.parsedAs}
          </span>
        </div>
        <div className='flex items-baseline justify-between text-xs'>
          <span className='text-muted'>Safe to use?</span>
          <span
            className={`font-bold ${
              format.safe ? 'text-success' : 'text-danger'
            }`}
          >
            <span className='inline-flex items-center gap-1'>
              {format.safe ? (
                <IconCircleCheck size={14} />
              ) : (
                <IconCircleX size={14} />
              )}
              {format.safe ? 'Yes' : 'No'}
            </span>
          </span>
        </div>
        <p className='text-muted mt-1 text-xs'>
          {highlightedSegment?.label
            ? `${highlightedSegment.label}: ${format.note}`
            : format.note}
        </p>
      </div>
    </DemoContainer>
  )
}
