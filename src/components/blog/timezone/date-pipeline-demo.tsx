'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tabs } from '@heroui/react'
import {
  IconApi,
  IconDatabase,
  IconDeviceDesktop,
  IconServer,
  IconSettings,
  IconUser,
  type TablerIcon
} from '@tabler/icons-react'
import IconCard from '@/components/blog/shared/icon-card'
import { AnimatedBeam } from '@/components/ui/beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import DemoContainer from './demo-container'
import {
  getTimeZoneOffsetLabel,
  getTimeZoneShortName,
  getTimeZoneOffsetMinutes
} from './timezone-utils'

type Timezone = 'Asia/Karachi' | 'America/New_York' | 'Europe/London'

const TIMEZONE_OPTIONS: { key: Timezone; label: string }[] = [
  { key: 'Asia/Karachi', label: 'Karachi' },
  { key: 'America/New_York', label: 'New York' },
  { key: 'Europe/London', label: 'London' }
]

function getStagesForTimezone(tz: Timezone) {
  const now = new Date('2026-03-29T14:30:00.000Z')
  const offsetMinutes = getTimeZoneOffsetMinutes(now, tz)
  const offsetHours = offsetMinutes / 60
  const localHour =
    (now.getUTCHours() * 60 + now.getUTCMinutes() + offsetMinutes + 1440) % 1440
  const localHourStr = Math.floor(localHour / 60)
    .toString()
    .padStart(2, '0')
  const localMinStr = (localHour % 60).toString().padStart(2, '0')
  const tzAbbr = getTimeZoneShortName(now, tz)
  const tzOffset = getTimeZoneOffsetLabel(now, tz)
  const utcHour = now.getUTCHours().toString().padStart(2, '0')
  const utcMin = now.getUTCMinutes().toString().padStart(2, '0')
  const sign = offsetHours >= 0 ? '−' : '+'
  const absOffset = Math.abs(offsetHours)
  const offsetStr = Number.isInteger(absOffset)
    ? `${absOffset}h`
    : `${absOffset}h`

  return [
    {
      label: 'User Input',
      icon: IconUser,
      value: `${localHourStr}:${localMinStr}`,
      detail: `User types "${localHourStr}:${localMinStr}" (${tzAbbr}, ${tzOffset})`
    },
    {
      label: 'new Date()',
      icon: IconSettings,
      value: now.toISOString(),
      detail: `${localHourStr}:${localMinStr} ${tzAbbr} ${sign} ${offsetStr} = ${utcHour}:${utcMin} UTC`
    },
    {
      label: 'JSON.stringify',
      icon: IconApi,
      value: `"2026-03-29T14:30:00.000Z"`,
      detail: 'Date.toJSON() always sends UTC with Z suffix'
    },
    {
      label: 'PostgreSQL',
      icon: IconDatabase,
      value: '2026-03-29 14:30:00',
      detail: `Stored as timestamp — bare UTC value (no offset kept)`
    },
    {
      label: 'Prisma Read',
      icon: IconServer,
      value: now.toISOString(),
      detail: 'Prisma reads back and creates JS Date (UTC)'
    },
    {
      label: 'Frontend',
      icon: IconDeviceDesktop,
      value: `${localHourStr}:${localMinStr} ${tzAbbr}`,
      detail: `Intl.DateTimeFormat converts ${utcHour}:${utcMin} UTC → ${localHourStr}:${localMinStr} ${tzAbbr} for display`
    }
  ]
}

function StageNode({
  innerRef,
  Icon,
  label,
  isActive
}: {
  innerRef: React.RefObject<HTMLDivElement | null>
  Icon: TablerIcon
  label: string
  isActive: boolean
}) {
  return (
    <IconCard
      ref={innerRef as React.RefObject<HTMLDivElement>}
      label={label}
      className={
        isActive
          ? 'border-accent/35 from-accent/20 shadow-accent/20 bg-gradient-to-b to-transparent shadow-md'
          : undefined
      }
      iconClassName={isActive ? 'text-accent' : undefined}
    >
      <Icon stroke={1.8} />
    </IconCard>
  )
}

export default function DatePipelineDemo() {
  const [timezone, setTimezone] = useState<Timezone>('Asia/Karachi')
  const [activeStage, setActiveStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ]

  const stages = getStagesForTimezone(timezone)
  const activeStageData = stages[activeStage]
  const ActiveStageIcon = activeStageData.icon

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setPlaying(false)
  }, [])

  const playThrough = useCallback(() => {
    setPlaying(true)
    setActiveStage(0)
    let step = 0
    const advance = () => {
      step++
      if (step >= 6) {
        setPlaying(false)
        return
      }
      setActiveStage(step)
      timerRef.current = setTimeout(advance, 1200)
    }
    timerRef.current = setTimeout(advance, 1200)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    stopAutoPlay()
    setActiveStage(0)
  }, [timezone, stopAutoPlay])

  return (
    <DemoContainer
      title='The Date Pipeline'
      description='Follow a timestamp from user input to database and back — toggle timezones to see how the same moment transforms'
    >
      <Tabs
        variant='primary'
        selectedKey={timezone}
        onSelectionChange={key => {
          setTimezone(key as Timezone)
        }}
        className='mb-4'
      >
        <Tabs.ListContainer>
          <Tabs.List>
            {TIMEZONE_OPTIONS.map(tz => (
              <Tabs.Tab key={tz.key} id={tz.key}>
                {tz.label}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div
        ref={containerRef}
        className='border-separator bg-background relative mb-4 overflow-x-auto rounded-lg border p-4 sm:p-6'
      >
        <DotPattern
          glow
          width={20}
          height={20}
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}
        />
        <div className='relative z-10 flex items-center justify-between gap-1 sm:gap-2'>
          {stages.map((stage, i) => (
            <StageNode
              key={stage.label}
              innerRef={refs[i]}
              Icon={stage.icon}
              label={stage.label}
              isActive={i === activeStage}
            />
          ))}
        </div>

        {refs.slice(0, -1).map((fromRef, i) => (
          <AnimatedBeam
            key={`beam-${i}-${timezone}`}
            containerRef={containerRef}
            fromRef={fromRef}
            toRef={refs[i + 1]}
            mode='pulse'
            duration={1.2}
            triggerKey={activeStage === i ? `${i}-active` : `${i}-idle`}
            gradientStartColor={i === activeStage ? '#a855f7' : 'var(--border)'}
            gradientStopColor={i === activeStage ? '#c084fc' : 'var(--border)'}
            pathOpacity={i === activeStage ? 0.28 : 0.12}
            pathWidth={i === activeStage ? 1.5 : 1}
          />
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={`${timezone}-${activeStage}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          aria-live='polite'
          className='bg-surface-secondary rounded-lg p-4'
        >
          <div className='mb-1 flex items-center gap-2'>
            <ActiveStageIcon size={18} className='text-muted' />
            <span className='text-foreground text-sm font-medium'>
              {activeStageData.label}
            </span>
          </div>
          <p className='text-muted mb-2 text-xs'>{activeStageData.detail}</p>
          <code className='bg-background text-accent block rounded-md px-3 py-2 font-mono text-xs'>
            {activeStageData.value}
          </code>
        </motion.div>
      </AnimatePresence>

      <div className='mt-4 flex items-center justify-between'>
        <div className='flex gap-1.5'>
          {stages.map((_, i) => (
            <button
              key={i}
              type='button'
              aria-label={`Show step ${i + 1}: ${stages[i].label}`}
              aria-pressed={i === activeStage}
              title={`Step ${i + 1}: ${stages[i].label}`}
              onClick={() => {
                stopAutoPlay()
                setActiveStage(i)
              }}
              className='focus-visible:ring-accent flex size-10 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-hidden'
            >
              <motion.div
                animate={{
                  scale: i === activeStage ? 1.3 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                  i === activeStage
                    ? 'bg-accent text-accent-foreground size-6'
                    : 'bg-border-secondary text-foreground size-5'
                }`}
              >
                {i + 1}
              </motion.div>
            </button>
          ))}
        </div>
        <Button
          size='sm'
          variant='tertiary'
          isDisabled={playing}
          onPress={playThrough}
        >
          {playing ? 'Playing...' : 'Play Through'}
        </Button>
      </div>
    </DemoContainer>
  )
}
