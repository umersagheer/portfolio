'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import { Button, Select, TimeField, Label, ListBox } from '@heroui/react'
import {
  IconCircleCheck,
  IconCircleX,
  IconPlayerPlay,
  IconRefresh
} from '@tabler/icons-react'
import DemoContainer from './demo-container'
import { createTimeValue } from './timezone-utils'

const ZONES = [
  { key: 'America/New_York', label: 'New York' },
  { key: 'America/Chicago', label: 'Chicago' },
  { key: 'America/Los_Angeles', label: 'Los Angeles' },
  { key: 'Europe/London', label: 'London' }
]

type SimState = 'idle' | 'advancing' | 'done'

type UTCResult = {
  label: string
  utcHour: number
  offset: number
  abbr: string
}

function getUTCForWallTime(
  hour: number,
  zone: string,
  isDST: boolean
): UTCResult {
  const offsets: Record<string, [number, number]> = {
    'America/New_York': [-5, -4],
    'America/Chicago': [-6, -5],
    'America/Los_Angeles': [-8, -7],
    'Europe/London': [0, 1]
  }
  const abbrs: Record<string, [string, string]> = {
    'America/New_York': ['EST', 'EDT'],
    'America/Chicago': ['CST', 'CDT'],
    'America/Los_Angeles': ['PST', 'PDT'],
    'Europe/London': ['GMT', 'BST']
  }
  const [std, dst] = offsets[zone] ?? [0, 0]
  const offset = isDST ? dst : std
  const [stdAbbr, dstAbbr] = abbrs[zone] ?? ['STD', 'DST']
  const abbr = isDST ? dstAbbr : stdAbbr
  const utcHour = (hour - offset + 24) % 24
  const utcHourStr = utcHour.toString().padStart(2, '0')
  return { label: `${utcHourStr}:00 UTC`, utcHour, offset, abbr }
}

export default function ScheduleSimulatorDemo() {
  const [hour, setHour] = useState(9)
  const [zone, setZone] = useState('America/New_York')
  const [simState, setSimState] = useState<SimState>('idle')
  const [simDay, setSimDay] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const zoneName = ZONES.find(z => z.key === zone)?.label ?? zone

  const winter = getUTCForWallTime(hour, zone, false)
  const summer = getUTCForWallTime(hour, zone, true)
  const utcChanged = winter.utcHour !== summer.utcHour

  const daysBeforeDST = 5
  const dstDay = 3

  const simulate = useCallback(() => {
    setSimState('advancing')
    setSimDay(0)
    let d = 0
    const advance = () => {
      d++
      setSimDay(d)
      if (d >= daysBeforeDST) {
        setSimState('done')
        return
      }
      setTimeout(advance, 800)
    }
    setTimeout(advance, 800)
  }, [])

  const reset = useCallback(() => {
    setSimState('idle')
    setSimDay(0)
  }, [])

  const isDSTActive = simDay >= dstDay

  return (
    <DemoContainer
      title='Schedule Simulator'
      description='Schedule an event, then fast-forward through a DST transition to see what breaks'
    >
      <div className='mb-4 flex flex-col gap-3 sm:flex-row'>
        {mounted && (
          <TimeField
            granularity='hour'
            hourCycle={12}
            value={createTimeValue(hour) as any}
            onChange={(value: any) => {
              if (value?.hour !== undefined) setHour(value.hour)
              reset()
            }}
            className='sm:w-40'
          >
            <Label>Time</Label>
            <TimeField.Group>
              <TimeField.Input>
                {segment => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>
        )}
        <Select
          value={zone}
          onChange={val => {
            if (val !== undefined && val !== null) setZone(String(val))
            reset()
          }}
          className='sm:w-48'
        >
          <Label>Timezone</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {ZONES.map(z => (
                <ListBox.Item key={z.key} id={z.key}>
                  {z.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className='mb-4 grid gap-3 sm:grid-cols-2'>
        <div className='border-danger-200 bg-danger-50 rounded-lg border p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <IconCircleX size={16} className='text-danger-500' />
            <span className='text-danger-600 text-xs font-medium'>
              Stored as UTC at schedule time
            </span>
          </div>
          <div className='space-y-1 font-mono text-xs'>
            <p className='text-default-500'>
              stored: <span className='text-danger-600'>{winter.label}</span>
              <span className='text-default-400 ml-1'>
                (during {winter.abbr})
              </span>
            </p>
            <AnimatePresence mode='wait'>
              <motion.div
                key={`utc-${isDSTActive}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='space-y-1'
              >
                {isDSTActive && utcChanged && (
                  <p className='text-danger-600'>
                    {winter.label} {summer.offset < 0 ? '+' : '−'}{' '}
                    {Math.abs(summer.offset)}h ({summer.abbr}) ={' '}
                    {((winter.utcHour + summer.offset + 24) % 24)
                      .toString()
                      .padStart(2, '0')}
                    :00 local
                  </p>
                )}
                <p className='text-default-500'>
                  fires at:{' '}
                  <span
                    className={
                      isDSTActive && utcChanged
                        ? 'text-danger-600 font-bold'
                        : 'text-foreground'
                    }
                  >
                    {isDSTActive && utcChanged
                      ? `${((winter.utcHour + summer.offset + 24) % 24).toString().padStart(2, '0')}:00 local (WRONG!)`
                      : `${hour.toString().padStart(2, '0')}:00 local`}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className='border-success-200 bg-success-50 rounded-lg border p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <IconCircleCheck size={16} className='text-success-500' />
            <span className='text-success-600 text-xs font-medium'>
              Stored as wall time + timezone
            </span>
          </div>
          <div className='space-y-1 font-mono text-xs'>
            <p className='text-default-500'>
              stored:{' '}
              <span className='text-success-600'>
                {hour.toString().padStart(2, '0')}:00 + {zoneName}
              </span>
            </p>
            <p className='text-default-500'>
              fires at:{' '}
              <span className='text-foreground'>
                {hour.toString().padStart(2, '0')}:00 local
              </span>
            </p>
            <AnimatePresence mode='wait'>
              <motion.div
                key={`wall-${isDSTActive}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-default-400 space-y-1'
              >
                {(() => {
                  const active = isDSTActive ? summer : winter
                  const sign = active.offset < 0 ? '+' : '−'
                  return (
                    <p>
                      {hour.toString().padStart(2, '0')}:00 {sign}{' '}
                      {Math.abs(active.offset)}h ({active.abbr}) ={' '}
                      <span className='text-success-600'>{active.label}</span>
                      {isDSTActive && utcChanged && (
                        <span className='text-success-500 ml-1'>
                          (recalculated)
                        </span>
                      )}
                    </p>
                  )
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className='mb-3'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-default-400 text-xs'>
            {simState === 'idle'
              ? 'Press to simulate days passing through DST'
              : simState === 'advancing'
                ? 'Advancing through days...'
                : 'DST transition complete'}
          </span>
          <span className='text-default-400 font-mono text-xs'>
            Day{' '}
            <NumberFlow
              value={simDay + 1}
              transformTiming={{ duration: 300, easing: 'ease-out' }}
              spinTiming={{ duration: 300, easing: 'ease-out' }}
            />
            /{daysBeforeDST + 1}
          </span>
        </div>

        <div className='flex gap-1'>
          {(['Mon', 'Tue', 'Wed', 'DST', 'Fri', 'Sat'] as const).map(
            (dayLabel, i) => {
              const isDSTDay = i === dstDay
              const isPast = i <= simDay
              return (
                <motion.div
                  key={i}
                  className={`relative flex h-10 flex-1 flex-col items-center justify-center rounded ${
                    isDSTDay && isPast
                      ? 'bg-warning-200'
                      : isPast
                        ? i < dstDay
                          ? 'bg-primary-200'
                          : 'bg-primary-300'
                        : 'bg-default-100'
                  }`}
                  animate={
                    i === simDay
                      ? { scale: [1, 1.05, 1], transition: { duration: 0.3 } }
                      : {}
                  }
                >
                  <span
                    className={`text-[9px] font-bold ${
                      isDSTDay
                        ? 'text-warning-700'
                        : isPast
                          ? 'text-primary-700'
                          : 'text-default-400'
                    }`}
                  >
                    {dayLabel}
                  </span>
                </motion.div>
              )
            }
          )}
        </div>
      </div>

      <div className='flex gap-2'>
        <Button
          variant='secondary'
          size='sm'
          isDisabled={simState === 'advancing'}
          onPress={simState === 'idle' ? simulate : reset}
        >
          {' '}
          simState === 'idle' ? ( <IconPlayerPlay size={14} />
          ) : (
          <IconRefresh size={14} />)
          {simState === 'idle'
            ? 'Fast Forward'
            : simState === 'advancing'
              ? 'Advancing...'
              : 'Reset'}
        </Button>
      </div>
    </DemoContainer>
  )
}
