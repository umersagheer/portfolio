'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tabs, Tab } from '@heroui/react'
import DemoContainer from './demo-container'

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
        note: '⏩ Clock jumps!'
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
        note: '⏪ Clock rewinds!'
    },
    { wall: '1:00 AM', utc: '06:00', label: 'EST', exists: true, second: true },
    { wall: '1:30 AM', utc: '06:30', label: 'EST', exists: true, second: true },
    { wall: '1:59 AM', utc: '06:59', label: 'EST', exists: true, second: true },
    { wall: '2:00 AM', utc: '07:00', label: 'EST', exists: true }
]

function DigitDisplay({ value, size = 'lg' }: { value: string; size?: string }) {
    return (
        <AnimatePresence mode='wait'>
            <motion.span
                key={value}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className={`inline-block font-mono font-bold tabular-nums ${size === 'lg'
                        ? 'text-2xl sm:text-3xl'
                        : 'text-base sm:text-lg'
                    }`}
            >
                {value}
            </motion.span>
        </AnimatePresence>
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
        ? 'border-danger-300 dark:border-danger-800'
        : isJumped
            ? 'border-warning-300 dark:border-warning-800'
            : isSecond
                ? 'border-secondary-300 dark:border-secondary-800'
                : 'border-default-200'

    const bgColor = isGap
        ? 'bg-danger-50 dark:bg-danger-950/30'
        : isJumped
            ? 'bg-warning-50 dark:bg-warning-950/30'
            : isSecond
                ? 'bg-secondary-50 dark:bg-secondary-950/30'
                : 'bg-background'

    return (
        <div
            className={`flex flex-col items-center rounded-lg border p-3 ${borderColor} ${bgColor} ${className ?? ''}`}
        >
            <DigitDisplay value={time} />
            <span
                className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${isGap
                        ? 'bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-400'
                        : isSecond
                            ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400'
                            : 'bg-default-100 text-default-500'
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
                size='sm'
                variant='bordered'
                selectedKey={transition}
                onSelectionChange={key => setTransition(key as Transition)}
                className='mb-4'
            >
                <Tab key='spring' title='🌸 Spring Forward (Gap)' />
                <Tab key='fall' title='🍂 Fall Back (Overlap)' />
            </Tabs>

            <div className='mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8'>
                <div className='flex flex-col items-center'>
                    <span className='mb-2 text-xs font-medium text-default-400'>
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
                    <span className='mb-2 text-xs font-medium text-default-400'>
                        UTC Clock
                    </span>
                    <ClockDisplay
                        time={current.utc === '—' ? '—' : `${current.utc} UTC`}
                        label='UTC'
                        className='opacity-80'
                    />
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {current.skip && 'note' in current && (
                    <motion.div
                        key={`note-${step}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`mb-4 rounded-lg p-3 text-center text-sm font-medium ${transition === 'spring'
                                ? 'bg-danger-50 text-danger-600 dark:bg-danger-950/30 dark:text-danger-400'
                                : 'bg-secondary-50 text-secondary-600 dark:bg-secondary-950/30 dark:text-secondary-400'
                            }`}
                    >
                        {current.note}{' '}
                        {transition === 'spring'
                            ? '2:00–2:59 AM never existed. The gap.'
                            : '1:00–1:59 AM happens again. The overlap.'}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='mb-4 flex items-center gap-1'>
                {sequence.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            stop()
                            setStep(i)
                        }}
                        className={`h-2 flex-1 rounded-full transition-colors ${i === step
                                ? s.skip
                                    ? 'bg-danger-400'
                                    : 'bg-primary-400'
                                : i < step
                                    ? 'bg-primary-200 dark:bg-primary-800'
                                    : 'bg-default-200 dark:bg-default-300'
                            }`}
                    />
                ))}
            </div>

            <div className='flex items-center justify-between'>
                <Button
                    size='sm'
                    variant='flat'
                    isDisabled={step === 0}
                    onPress={() => {
                        stop()
                        setStep(s => Math.max(0, s - 1))
                    }}
                >
                    Back
                </Button>
                <Button
                    size='sm'
                    variant='flat'
                    color='primary'
                    isDisabled={playing}
                    onPress={play}
                >
                    {playing ? 'Playing...' : '▶ Play'}
                </Button>
                <Button
                    size='sm'
                    variant='flat'
                    isDisabled={step === sequence.length - 1}
                    onPress={() => {
                        stop()
                        setStep(s => Math.min(sequence.length - 1, s + 1))
                    }}
                >
                    Next
                </Button>
            </div>

            <div className='mt-4 rounded-lg border border-default-200 p-3'>
                <p className='text-xs text-default-400'>
                    {transition === 'spring' ? (
                        <>
                            On <strong>March 8, 2026</strong> at 2:00 AM, New York clocks jump
                            to 3:00 AM. The hour 2:00–2:59 AM is a{' '}
                            <strong className='text-danger-500'>gap</strong> — it never
                            happens. UTC doesn&apos;t skip: 06:59 → 07:00 is just one minute.
                        </>
                    ) : (
                        <>
                            On <strong>November 1, 2026</strong> at 2:00 AM, New York clocks
                            rewind to 1:00 AM. The hour 1:00–1:59 AM is an{' '}
                            <strong className='text-secondary-500'>overlap</strong> — it
                            happens twice. First in EDT (UTC-4), then in EST (UTC-5).
                        </>
                    )}
                </p>
            </div>
        </DemoContainer>
    )
}
