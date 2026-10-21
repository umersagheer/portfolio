'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DemoContainer from './demo-container'
import AnimatedTime from './animated-time'
import { getTimeZoneOffsetLabel } from './timezone-utils'

const TIMEZONES = [
  { zone: 'UTC', city: 'Coordinated Universal Time' },
  { zone: 'America/New_York', city: 'New York' },
  { zone: 'Asia/Karachi', city: 'Karachi' },
  { zone: 'Europe/London', city: 'London' },
  { zone: 'Asia/Tokyo', city: 'Tokyo' }
]

function getTimeParts(date: Date, zone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date)
  return {
    hours: Number(parts.find(p => p.type === 'hour')?.value ?? 0),
    minutes: Number(parts.find(p => p.type === 'minute')?.value ?? 0),
    seconds: Number(parts.find(p => p.type === 'second')?.value ?? 0)
  }
}

function formatDate(date: Date, zone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function ClockCard({
  zone,
  city,
  now,
  isUTC
}: {
  zone: string
  city: string
  now: Date
  isUTC: boolean
}) {
  const { hours, minutes, seconds } = getTimeParts(now, zone)
  const date = formatDate(now, zone)
  const offset = getTimeZoneOffsetLabel(now, zone)

  return (
    <motion.div
      layout
      className={`flex flex-col items-center rounded-lg border p-3 ${
        isUTC ? 'border-accent bg-accent-soft' : 'border-border bg-background'
      }`}
    >
      <span className='text-muted text-[10px] font-medium'>{city}</span>
      <AnimatedTime
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        className='text-foreground mt-1 font-mono text-lg font-bold sm:text-xl'
      />
      <span className='text-muted mt-0.5 text-[10px]'>{date}</span>
      <span
        className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          isUTC
            ? 'bg-accent-soft text-accent'
            : 'bg-surface-secondary text-muted'
        }`}
      >
        {isUTC ? 'UTC' : offset}
      </span>
    </motion.div>
  )
}

export default function TimezoneConverterDemo() {
  const [liveNow, setLiveNow] = useState<Date | null>(null)

  useEffect(() => {
    setLiveNow(new Date())
    const interval = setInterval(() => setLiveNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DemoContainer
      title='Same Moment, Different Clocks'
      description='All five clocks show the exact same instant — only the reading changes'
    >
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5'>
        {liveNow &&
          TIMEZONES.map(tz => (
            <ClockCard
              key={tz.zone}
              zone={tz.zone}
              city={tz.city}
              now={liveNow}
              isUTC={tz.zone === 'UTC'}
            />
          ))}
      </div>

      <div className='bg-surface-secondary mt-4 rounded-lg p-3'>
        <p className='text-muted text-xs'>
          <span className='text-muted font-medium'>Under the hood:</span> All
          clocks share the same <code className='text-accent'>Date</code> object
          (
          <code className='text-accent font-mono text-[10px]'>
            {liveNow?.toISOString() ?? ''}
          </code>
          ). Each card formats that same instant through{' '}
          <code className='text-accent'>Intl.DateTimeFormat</code> with a
          different <code className='text-accent'>timeZone</code> option, so the
          browser does the conversion without extra date libraries.
        </p>
      </div>
    </DemoContainer>
  )
}
