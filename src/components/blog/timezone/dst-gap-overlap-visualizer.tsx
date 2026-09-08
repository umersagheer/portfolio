'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tabs } from '@heroui/react'
import { IconPlayerPlay } from '@tabler/icons-react'
import DemoContainer from './demo-container'
import AnimatedTime from './animated-time'

type Transition = 'spring' | 'fall'

const SPRING_SEQUENCE = [
  { wall: '1:57 AM', utc: '06:57', label: 'EST', exists: true },
  { wall: '1:58 AM', utc: '06:58', label: 'EST', exists: true },
  { wall: '1:59 AM', utc: '06:59', label: 'EST', exists: true },
  {
    wall: '2:00 AM',
    utc: '—',
    label: 'GAP',
    exists: false,
    skip: true,
    note: 'Clock jumps forward.'
  },
  { wall: '3:00 AM', utc: '07:00', label: 'EDT', exists: true, jumped: true },
  { wall: '3:01 AM', utc: '07:01', label: 'EDT', exists: true }
]

const FALL_SEQUENCE = [
  { wall: '1:58 AM', utc: '05:58', label: 'EDT', exists: true, first: true },
  { wall: '1:59 AM', utc: '05:59', label: 'EDT', exists: true, first: true },
  {
    wall: '2:00 AM',
    utc: '—',
    label: 'REWIND',
    exists: false,
    skip: true,
    note: 'Clock rewinds.'
  },
  { wall: '1:00 AM', utc: '06:00', label: 'EST', exists: true, second: true },
  { wall: '1:30 AM', utc: '06:30', label: 'EST', exists: true, second: true },
  { wall: '1:59 AM', utc: '06:59', label: 'EST', exists: true, second: true },
  { wall: '2:00 AM', utc: '07:00', label: 'EST', exists: true }
]

function parseTimeString(
  time: string
): { hours: number; minutes: number; ampm?: string; suffix?: string } | null {
  const match12 = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match12)
    return {
      hours: Number(match12[1]),
      minutes: Number(match12[2]),
      ampm: match12[3]
    }
  const match24 = time.match(/^(\d{2}):(\d{2})(?:\s+(.+))?$/)
  if (match24)
    return {
      hours: Number(match24[1]),
      minutes: Number(match24[2]),
      suffix: match24[3]
    }
  return null
}

function TimeDisplay({ value, size = 'lg' }: { value: string; size?: string }) {
  const parsed = parseTimeString(value)

  if (!parsed) {
    return (
      <AnimatePresence mode='wait'>
        <motion.span
          key={value}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`inline-block font-mono font-bold tabular-nums ${
            size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
          }`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    )
  }

  return (
    <AnimatedTime
      hours={parsed.hours}
      minutes={parsed.minutes}
      ampm={parsed.ampm}
      suffix={parsed.suffix ? ` ${parsed.suffix}` : undefined}
      padHours={!parsed.ampm}
      className={`inline-block font-mono font-bold ${
        size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
      }`}
    />
  )
}

function ClockDisplay({
  time,
  label,
  isGap,
  isJumped,
  isSecond,
  className
}: {
  time: string
  label: string
  isGap?: boolean
  isJumped?: boolean
  isSecond?: boolean
  className?: string
}) {
  const borderColor = isGap
    ? 'border-danger'
    : isJumped
      ? 'border-warning'
      : isSecond
        ? 'border-accent'
        : 'border-border'

  const bgColor = isGap
    ? 'bg-danger-soft'
    : isJumped
      ? 'bg-warning-soft'
      : isSecond
        ? 'bg-accent-soft'
        : 'bg-background'

  return (
    <div
      className={`flex flex-col items-center rounded-lg border p-3 ${borderColor} ${bgColor} ${className ?? ''}`}
    >
      <TimeDisplay value={time} />
      <span
        className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          isGap
            ? 'bg-danger-soft text-danger'
            : isSecond
              ? 'bg-accent-soft text-accent'
              : 'bg-surface-secondary text-muted'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default function DSTGapOverlapVisualizer() {
  const [transition, setTransition] = useState<Transition>('spring')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sequence = transition === 'spring' ? SPRING_SEQUENCE : FALL_SEQUENCE
  const current = sequence[step]

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setPlaying(false)
  }, [])

  const play = useCallback(() => {
    stop()
    setStep(0)
    setPlaying(true)
    let s = 0
    const advance = () => {
      s++
      if (s >= sequence.length) {
        setPlaying(false)
        return
      }
      setStep(s)
      const delay = sequence[s].skip ? 1500 : 900
      timerRef.current = setTimeout(advance, delay)
    }
    timerRef.current = setTimeout(advance, 900)
  }, [sequence, stop])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    stop()
    setStep(0)
  }, [transition, stop])

  return (
    <DemoContainer
      title='DST Transitions Visualized'
      description='Watch the wall clock jump (spring) or rewind (fall) while UTC ticks steadily'
    >
      <Tabs
        variant='primary'
        selectedKey={transition}
        onSelectionChange={key => setTransition(key as Transition)}
        className='mb-4'
      >
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id='spring'>
              Spring Forward (Gap)
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id='fall'>
              Fall Back (Overlap)
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className='mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8'>
        <div className='flex flex-col items-center'>
          <span className='text-muted mb-2 text-xs font-medium'>
            Wall Clock (New York)
          </span>
          <ClockDisplay
            time={current.wall}
            label={current.label}
            isGap={current.skip}
            isJumped={'jumped' in current && current.jumped}
            isSecond={'second' in current && current.second}
          />
        </div>

        <div className='flex flex-col items-center'>
          <span className='text-muted mb-2 text-xs font-medium'>UTC Clock</span>
          <ClockDisplay
            time={current.utc === '—' ? '—' : `${current.utc} UTC`}
            label='UTC'
            className='opacity-80'
          />
        </div>
      </div>

      <div className='mb-4 min-h-[44px]'>
        <AnimatePresence mode='wait'>
          {current.skip && 'note' in current ? (
            <motion.div
              key={`note-${step}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-lg p-3 text-center text-sm font-medium ${
                transition === 'spring'
                  ? 'bg-danger-soft text-danger'
                  : 'bg-accent-soft text-accent'
              }`}
            >
              {current.note}{' '}
              {transition === 'spring'
                ? '2:00–2:59 AM never existed. The gap.'
                : '1:00–1:59 AM happens again. The overlap.'}
            </motion.div>
          ) : (
            <motion.div
              key='spacer'
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className='mb-4 flex items-center gap-1'>
        {sequence.map((s, i) => (
          <button
            key={i}
            type='button'
            aria-label={`Jump to ${s.wall} (${s.label})`}
            aria-pressed={i === step}
            title={`${s.wall} (${s.label})`}
            onClick={() => {
              stop()
              setStep(i)
            }}
            className='focus-visible:ring-accent flex flex-1 items-center rounded-lg py-2 focus-visible:ring-2 focus-visible:outline-hidden'
          >
            <span
              className={`h-2 w-full rounded-full transition-colors ${
                i === step
                  ? s.skip
                    ? 'bg-danger'
                    : 'bg-accent'
                  : i < step
                    ? 'bg-accent-soft'
                    : 'bg-surface-tertiary'
              }`}
            />
          </button>
        ))}
      </div>

      <div className='flex items-center justify-between'>
        <Button
          size='sm'
          variant='secondary'
          isDisabled={step === 0}
          onPress={() => {
            stop()
            setStep(s => Math.max(0, s - 1))
          }}
        >
          Back
        </Button>
        <Button
          variant='secondary'
          size='sm'
          isDisabled={playing}
          onPress={play}
        >
          <IconPlayerPlay size={14} />
          {playing ? 'Playing...' : 'Play'}
        </Button>
        <Button
          size='sm'
          variant='secondary'
          isDisabled={step === sequence.length - 1}
          onPress={() => {
            stop()
            setStep(s => Math.min(sequence.length - 1, s + 1))
          }}
        >
          Next
        </Button>
      </div>

      <div className='border-border mt-4 rounded-lg border p-3'>
        <p className='text-muted text-xs'>
          {transition === 'spring' ? (
            <>
              On <strong>March 8, 2026</strong> at 2:00 AM, New York clocks jump
              to 3:00 AM. The hour 2:00–2:59 AM is a{' '}
              <strong className='text-danger'>gap</strong> — it never happens.
              UTC doesn&apos;t skip: 06:59 → 07:00 is just one minute.
            </>
          ) : (
            <>
              On <strong>November 1, 2026</strong> at 2:00 AM, New York clocks
              rewind to 1:00 AM. The hour 1:00–1:59 AM is an{' '}
              <strong className='text-accent'>overlap</strong> — it happens
              twice. First in EDT (UTC-4), then in EST (UTC-5).
            </>
          )}
        </p>
      </div>
    </DemoContainer>
  )
}
