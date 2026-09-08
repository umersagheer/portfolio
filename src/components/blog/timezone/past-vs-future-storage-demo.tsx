'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import { Button } from '@heroui/react'
import { IconCircleCheck, IconSnowflake, IconSun } from '@tabler/icons-react'
import DemoContainer from './demo-container'

const TIMEZONES_DISPLAY = [
  { zone: 'America/New_York', label: 'New York', offset: -4 },
  { zone: 'Asia/Karachi', label: 'Karachi', offset: 5 },
  { zone: 'Europe/London', label: 'London', offset: 1 }
]

function formatInZone(utcHour: number, offset: number) {
  const local = ((utcHour + offset + 24) % 24).toString().padStart(2, '0')
  return `${local}:30`
}

export default function PastVsFutureStorageDemo() {
  const [dstToggle, setDstToggle] = useState(false)

  const pastUTC = '14:30 UTC'
  const pastDate = 'March 29, 2026'

  const futureWallTime = '09:00'
  const futureZone = 'America/New_York'
  const winterUTC = '14:00 UTC'
  const summerUTC = '13:00 UTC'

  return (
    <DemoContainer
      title='Past vs Future: Two Different Storage Rules'
      description='Why the rules change depending on whether the event already happened'
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Past Event Panel */}
        <div className='border-accent bg-accent-soft rounded-lg border p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <span className='bg-accent-soft text-accent rounded-full px-2 py-0.5 text-xs font-bold'>
              PAST
            </span>
            <span className='text-muted text-xs'>
              Recording &amp; Reporting
            </span>
          </div>

          <div className='mb-3'>
            <p className='text-muted text-xs'>What happened:</p>
            <p className='text-foreground text-sm font-medium'>
              Order placed on {pastDate}
            </p>
          </div>

          <div className='bg-accent-soft mb-3 rounded-md p-2'>
            <p className='text-accent text-[10px] font-medium'>Stored in DB</p>
            <p className='text-accent font-mono text-sm font-bold'>
              2026-03-29T{pastUTC.replace(' UTC', ':00Z')}
            </p>
          </div>

          <p className='text-muted mb-2 text-[10px] font-medium'>
            Same moment, different readings:
          </p>
          <div className='space-y-1'>
            {TIMEZONES_DISPLAY.map(tz => (
              <div
                key={tz.zone}
                className='flex items-center justify-between text-xs'
              >
                <span className='text-muted'>{tz.label}</span>
                <span className='text-foreground font-mono font-medium'>
                  {formatInZone(14, tz.offset)}
                </span>
              </div>
            ))}
          </div>

          <div className='border-accent bg-accent-soft mt-3 rounded-md border p-2'>
            <div className='text-accent flex items-start gap-2 text-[10px]'>
              <IconCircleCheck size={14} className='mt-0.5 shrink-0' />
              <p>
                UTC is perfect for past events. The moment is fixed and only the
                display changes.
              </p>
            </div>
          </div>
        </div>

        {/* Future Event Panel */}
        <div className='border-success bg-success-soft rounded-lg border p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <span className='bg-success-soft text-success rounded-full px-2 py-0.5 text-xs font-bold'>
              FUTURE
            </span>
            <span className='text-muted text-xs'>Scheduling</span>
          </div>

          <div className='mb-3'>
            <p className='text-muted text-xs'>What the user wants:</p>
            <p className='text-foreground text-sm font-medium'>
              Daily standup at 9:00 AM in New York
            </p>
          </div>

          <div className='bg-success-soft mb-3 rounded-md p-2'>
            <p className='text-success text-[10px] font-medium'>Stored in DB</p>
            <p className='text-success font-mono text-sm font-bold'>
              wall_time: {futureWallTime} + tz: {futureZone}
            </p>
          </div>

          <div className='mb-2 flex items-center gap-2'>
            <p className='text-muted text-[10px] font-medium'>
              UTC equivalent:
            </p>
            <Button
              size='sm'
              variant='secondary'
              className='h-6 min-w-0 px-2 text-[10px]'
              onPress={() => setDstToggle(t => !t)}
            >
              {dstToggle ? <IconSun size={12} /> : <IconSnowflake size={12} />}
              {dstToggle ? 'Summer (EDT)' : 'Winter (EST)'}
            </Button>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={String(dstToggle)}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2 }}
              className='space-y-1'
            >
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted'>Wall time</span>
                <span className='text-foreground font-mono font-medium'>
                  09:00 AM
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted'>Offset</span>
                <span className='text-foreground font-mono font-medium'>
                  {dstToggle ? 'UTC-4 (EDT)' : 'UTC-5 (EST)'}
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted'>Conversion</span>
                <span className='text-muted font-mono'>
                  {dstToggle
                    ? '09:00 + 4h (EDT) = 13:00 UTC'
                    : '09:00 + 5h (EST) = 14:00 UTC'}
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted'>Computed UTC</span>
                <span
                  className={`font-mono font-bold ${
                    dstToggle ? 'text-warning' : 'text-foreground'
                  }`}
                >
                  <NumberFlow
                    value={dstToggle ? 13 : 14}
                    format={{ minimumIntegerDigits: 2 }}
                    suffix=':00 UTC'
                    transformTiming={{ duration: 400, easing: 'ease-out' }}
                    spinTiming={{ duration: 400, easing: 'ease-out' }}
                  />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className='border-success bg-success-soft mt-3 rounded-md border p-2'>
            <div className='text-success flex items-start gap-2 text-[10px]'>
              <IconCircleCheck size={14} className='mt-0.5 shrink-0' />
              <p>
                Wall time stays 9:00 AM. The UTC equivalent shifts when DST
                changes and is computed at fire time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}
