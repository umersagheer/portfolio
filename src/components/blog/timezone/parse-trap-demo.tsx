'use client'

import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Alert } from '@heroui/react'
import DemoContainer from './demo-container'
import {
  formatMonthDay,
  getTimeZoneOffsetLabel,
  wallTimeToUTCDate
} from './timezone-utils'

const PRESETS = [
  { label: "'2026-03-29'", value: '2026-03-29' },
  { label: "'2026-03-29T00:00:00'", value: '2026-03-29T00:00:00' },
  { label: "'2026-03-29T00:00:00Z'", value: '2026-03-29T00:00:00Z' },
  { label: "'2026-03-29 00:00:00'", value: '2026-03-29 00:00:00' },
  { label: "'2026-03-29T00:00:00+05:00'", value: '2026-03-29T00:00:00+05:00' }
]

function parseAndAnalyze(input: string) {
  try {
    const d = new Date(input)
    if (isNaN(d.getTime())) return null

    const isoString = d.toISOString()
    const utcDate = isoString.split('T')[0]
    const inputDate = input.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ''
    const hasExplicitTimezone = /[Zz]|[+-]\d{2}:\d{2}$/.test(input)
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input)
    const parsedAsUTC = isDateOnly || hasExplicitTimezone
    const dateShifted = utcDate !== inputDate

    return {
      isoString,
      utcHours: d.getUTCHours(),
      utcDate,
      localString: d.toString(),
      parsedAsUTC,
      dateShifted,
      isDateOnly,
      hasExplicitTimezone
    }
  } catch {
    return null
  }
}

function parseNaiveDateTimeParts(input: string) {
  const match = input.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T| )(\d{2}):(\d{2})(?::(\d{2}))?$/
  )

  if (!match) {
    return null
  }

  const [, year, month, day, hour, minute, second] = match

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second ?? '0')
  }
}

const EXAMPLE_ZONES = [
  { zone: 'UTC', label: 'UTC machine' },
  { zone: 'Asia/Karachi', label: 'UTC+5 machine' },
  { zone: 'America/New_York', label: 'UTC-4 machine' }
]

export default function ParseTrapDemo() {
  const [input, setInput] = useState("'2026-03-29T00:00:00'")
  const [activePreset, setActivePreset] = useState(1)
  const inputId = useId()

  const cleanInput = input.replace(/^['"]|['"]$/g, '')
  const result = parseAndAnalyze(cleanInput)
  const machineZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const parsedParts = parseNaiveDateTimeParts(cleanInput)

  const handlePreset = (index: number) => {
    setActivePreset(index)
    setInput(PRESETS[index].label)
  }

  const isLocalTimeFormat =
    !!result && !result.parsedAsUTC && !result.isDateOnly
  const isNonStandardFormat =
    cleanInput.includes(' ') && !cleanInput.includes('T')

  const simulatedExamples =
    isLocalTimeFormat && parsedParts
      ? EXAMPLE_ZONES.map(example => {
          const simulatedDate = wallTimeToUTCDate(parsedParts, example.zone)
          const simulatedISO = simulatedDate.toISOString()
          const simulatedUTCDate = simulatedISO.split('T')[0]
          const inputDate = cleanInput.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ''

          return {
            ...example,
            offset: getTimeZoneOffsetLabel(simulatedDate, example.zone),
            isoString: simulatedISO,
            shifted: simulatedUTCDate !== inputDate,
            utcDate: formatMonthDay(simulatedDate, 'UTC')
          }
        })
      : []

  return (
    <DemoContainer
      title='The Date Parsing Trap'
      description='Click a format or type your own — see how JavaScript interprets it'
    >
      <div className='mb-4 flex flex-wrap gap-2'>
        {PRESETS.map((preset, i) => (
          <Button
            variant={activePreset === i ? 'primary' : 'tertiary'}
            key={preset.value}
            size='sm'
            className='font-mono text-xs'
            onPress={() => handlePreset(i)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className='mb-4'>
        <label
          htmlFor={inputId}
          className='text-muted mb-2 block text-xs font-medium'
        >
          Date string to parse
        </label>
        <input
          id={inputId}
          type='text'
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setActivePreset(-1)
          }}
          className='border-border bg-background text-foreground focus:border-accent w-full rounded-lg border px-3 py-2 font-mono text-sm outline-hidden'
          placeholder="Try: '2026-03-29T00:00:00'"
        />
      </div>

      <AnimatePresence mode='wait'>
        {result ? (
          <motion.div
            key={cleanInput}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className='space-y-3'
          >
            <div className='bg-surface-secondary grid gap-2 rounded-lg p-4'>
              <Row label='Input' value={`new Date(${input})`} mono />
              <Row label='Your machine' value={machineZone} />
              <Row
                label='.toISOString()'
                value={result.isoString}
                mono
                highlight={isLocalTimeFormat ? 'danger' : 'success'}
              />
              <Row
                label='UTC date'
                value={result.utcDate}
                highlight={result.dateShifted ? 'danger' : 'success'}
              />
              <Row
                label='UTC hours'
                value={String(result.utcHours)}
                highlight={result.utcHours !== 0 ? 'warning' : 'success'}
              />
              <Row
                label='Parsed as'
                value={
                  result.isDateOnly
                    ? 'UTC (date-only → spec says UTC)'
                    : result.hasExplicitTimezone
                      ? 'UTC (explicit Z or offset)'
                      : 'Machine local time (no Z, no offset)'
                }
                highlight={result.parsedAsUTC ? 'success' : 'danger'}
              />
            </div>

            {isLocalTimeFormat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Alert status='danger'>
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>
                      {isNonStandardFormat
                        ? 'This format is not ISO 8601 and is machine-dependent'
                        : 'This format depends on the machine timezone'}
                    </Alert.Title>
                    <Alert.Description>
                      {isNonStandardFormat
                        ? `Some engines reject "${cleanInput}", others accept it as local time. If it is accepted, the UTC result depends on where the code runs.`
                        : `Without a Z or offset, JavaScript interprets "${cleanInput}" as local time. On your machine it becomes ${result.isoString}, but a machine in another timezone can produce a different UTC timestamp.`}
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              </motion.div>
            )}

            {simulatedExamples.length > 0 && (
              <div className='border-border rounded-lg border p-3'>
                <p className='text-muted text-xs font-medium'>
                  Same string, different machines
                </p>
                <div className='mt-3 space-y-2'>
                  {simulatedExamples.map(example => (
                    <div
                      key={example.zone}
                      className='bg-surface-secondary flex flex-col gap-1 rounded-lg px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between'
                    >
                      <div>
                        <p className='text-foreground font-medium'>
                          {example.label}{' '}
                          <span className='text-muted font-mono'>
                            ({example.offset})
                          </span>
                        </p>
                        <p className='text-muted'>
                          Parses to UTC day {example.utcDate}
                          {example.shifted ? ' ← day shifted' : ''}
                        </p>
                      </div>
                      <code className='text-accent font-mono text-[11px]'>
                        {example.isoString}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.isDateOnly && (
              <Alert status='success'>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    Date-only strings are parsed as UTC per the ECMAScript spec.
                    This is safe.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-surface-secondary text-muted rounded-lg p-4 text-center text-sm'
          >
            Invalid date string — try a different format
          </motion.div>
        )}
      </AnimatePresence>

      <div className='border-border mt-4 rounded-lg border p-3'>
        <p className='text-muted text-xs font-medium'>The ECMAScript Rule</p>
        <div className='text-muted mt-2 space-y-1 text-xs'>
          <p>
            <span className='text-success font-mono'>YYYY-MM-DD</span>{' '}
            (date-only) → parsed as <strong>UTC</strong>
          </p>
          <p>
            <span className='text-danger font-mono'>YYYY-MM-DDTHH:mm:ss</span>{' '}
            (no Z/offset) → parsed as{' '}
            <strong>local time on the parsing machine</strong>
          </p>
          <p>
            <span className='text-success font-mono'>YYYY-MM-DDTHH:mm:ssZ</span>{' '}
            (with Z or offset) → parsed as <strong>UTC</strong>
          </p>
        </div>
      </div>
    </DemoContainer>
  )
}

function Row({
  label,
  value,
  mono,
  highlight
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: 'success' | 'danger' | 'warning'
}) {
  const colorMap = {
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning'
  }

  return (
    <div className='flex items-baseline justify-between gap-4'>
      <span className='text-muted shrink-0 text-xs'>{label}</span>
      <span
        className={`text-right text-xs ${mono ? 'font-mono' : ''} ${highlight ? colorMap[highlight] : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  )
}
