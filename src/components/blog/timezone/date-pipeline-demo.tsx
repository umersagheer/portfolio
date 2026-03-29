'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tabs, Tab } from '@heroui/react'
import { AnimatedBeam } from '@/components/ui/beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import DemoContainer from './demo-container'

type Timezone = 'Asia/Karachi' | 'America/New_York' | 'Europe/London'

const TIMEZONE_OPTIONS: { key: Timezone; label: string; offset: string }[] = [
    { key: 'Asia/Karachi', label: 'Karachi (PKT)', offset: '+05:00' },
    { key: 'America/New_York', label: 'New York (EDT)', offset: '-04:00' },
    { key: 'Europe/London', label: 'London (BST)', offset: '+01:00' }
]

function getStagesForTimezone(tz: Timezone) {
    const now = new Date('2026-03-29T14:30:00.000Z')
    const offsetMap: Record<Timezone, number> = {
        'Asia/Karachi': 5,
        'America/New_York': -4,
        'Europe/London': 1
    }
    const offset = offsetMap[tz]
    const localHour = ((now.getUTCHours() + offset + 24) % 24)
        .toString()
        .padStart(2, '0')
    const localMin = now.getUTCMinutes().toString().padStart(2, '0')
    const tzAbbr =
        tz === 'Asia/Karachi'
            ? 'PKT'
            : tz === 'America/New_York'
                ? 'EDT'
                : 'BST'
    const tzOffset =
        TIMEZONE_OPTIONS.find(o => o.key === tz)?.offset ?? '+00:00'

    return [
        {
            label: 'User Input',
            icon: '🧑',
            value: `${localHour}:${localMin}`,
            detail: `User types "${localHour}:${localMin}" (${tzAbbr})`
        },
        {
            label: 'new Date()',
            icon: '⚙️',
            value: now.toISOString(),
            detail: `Browser creates Date internally as UTC milliseconds`
        },
        {
            label: 'JSON.stringify',
            icon: '📡',
            value: `"2026-03-29T14:30:00.000Z"`,
            detail: 'Date.toJSON() always sends UTC with Z suffix'
        },
        {
            label: 'PostgreSQL',
            icon: '🗄️',
            value: '2026-03-29 14:30:00',
            detail: `Stored as timestamp — bare UTC value (no offset kept)`
        },
        {
            label: 'Prisma Read',
            icon: '🔄',
            value: now.toISOString(),
            detail: 'Prisma reads back and creates JS Date (UTC)'
        },
        {
            label: 'Frontend',
            icon: '🖥️',
            value: `${localHour}:${localMin} ${tzAbbr}`,
            detail: `Intl.DateTimeFormat converts UTC → ${tzAbbr} for display`
        }
    ]
}

function StageNode({
    innerRef,
    icon,
    label,
    isActive
}: {
    innerRef: React.RefObject<HTMLDivElement | null>
    icon: string
    label: string
    isActive: boolean
}) {
    return (
        <div className='flex flex-col items-center gap-1'>
            <div
                ref={innerRef as React.RefObject<HTMLDivElement>}
                className={`z-10 flex size-10 items-center justify-center rounded-lg border text-base transition-colors sm:size-12 ${isActive
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-default-200 bg-background'
                    }`}
            >
                {icon}
            </div>
            <span className='w-14 text-center text-[9px] font-medium text-default-500 sm:w-16 sm:text-[10px]'>
                {label}
            </span>
        </div>
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
                size='sm'
                variant='bordered'
                selectedKey={timezone}
                onSelectionChange={key => {
                    setTimezone(key as Timezone)
                }}
                className='mb-4'
            >
                {TIMEZONE_OPTIONS.map(tz => (
                    <Tab key={tz.key} title={tz.label} />
                ))}
            </Tabs>

            <div
                ref={containerRef}
                className='relative mb-4 overflow-x-auto rounded-lg border border-default-100 bg-background p-4 sm:p-6'
            >
                <DotPattern
                    glow
                    width={20}
                    height={20}
                    className='opacity-40'
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 10%, black 90%, transparent), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'source-in'
                    }}
                />
                <div className='relative z-10 flex items-center justify-between gap-1 sm:gap-2'>
                    {stages.map((stage, i) => (
                        <StageNode
                            key={stage.label}
                            innerRef={refs[i]}
                            icon={stage.icon}
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
                        gradientStartColor={
                            i === activeStage ? '#7c3aed' : 'var(--color-default-300)'
                        }
                        gradientStopColor={
                            i === activeStage ? '#3b82f6' : 'var(--color-default-300)'
                        }
                        pathOpacity={i === activeStage ? 0.4 : 0.15}
                        pathWidth={i === activeStage ? 2 : 1}
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
                    className='rounded-lg bg-default-100 p-4'
                >
                    <div className='mb-1 flex items-center gap-2'>
                        <span className='text-base'>{stages[activeStage].icon}</span>
                        <span className='text-sm font-medium text-foreground'>
                            {stages[activeStage].label}
                        </span>
                    </div>
                    <p className='mb-2 text-xs text-default-400'>
                        {stages[activeStage].detail}
                    </p>
                    <code className='block rounded-md bg-background px-3 py-2 font-mono text-xs text-primary-600'>
                        {stages[activeStage].value}
                    </code>
                </motion.div>
            </AnimatePresence>

            <div className='mt-4 flex items-center justify-between'>
                <div className='flex gap-1.5'>
                    {stages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                stopAutoPlay()
                                setActiveStage(i)
                            }}
                            className='flex size-8 items-center justify-center'
                        >
                            <motion.div
                                animate={{
                                    scale: i === activeStage ? 1.3 : 1
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={`rounded-full transition-colors ${i === activeStage
                                    ? 'size-4 bg-primary-500'
                                    : 'size-3 bg-default-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <Button
                    size='sm'
                    variant='flat'
                    isDisabled={playing}
                    onPress={playThrough}
                >
                    {playing ? 'Playing...' : 'Play Through'}
                </Button>
            </div>
        </DemoContainer>
    )
}
