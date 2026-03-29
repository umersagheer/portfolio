'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DatePicker, Button } from '@heroui/react'
import {
    now as intlNow,
    getLocalTimeZone,
    parseAbsoluteToLocal,
    type ZonedDateTime
} from '@internationalized/date'
import DemoContainer from './demo-container'

const TIMEZONES = [
    { zone: 'UTC', label: 'UTC', city: 'Coordinated Universal Time' },
    { zone: 'America/New_York', label: 'EDT', city: 'New York' },
    { zone: 'Asia/Karachi', label: 'PKT', city: 'Karachi' },
    { zone: 'Europe/London', label: 'BST', city: 'London' },
    { zone: 'Asia/Tokyo', label: 'JST', city: 'Tokyo' }
]

function formatTime(date: Date, zone: string) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date)
}

function formatDate(date: Date, zone: string) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }).format(date)
}

function getOffset(date: Date, zone: string) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'shortOffset'
    })
    const parts = formatter.formatToParts(date)
    const tzPart = parts.find(p => p.type === 'timeZoneName')
    return tzPart?.value ?? ''
}

function ClockCard({
    zone,
    label,
    city,
    now,
    isUTC
}: {
    zone: string
    label: string
    city: string
    now: Date
    isUTC: boolean
}) {
    const time = formatTime(now, zone)
    const date = formatDate(now, zone)
    const offset = getOffset(now, zone)

    return (
        <motion.div
            layout
            className={`flex flex-col items-center rounded-lg border p-3 ${isUTC
                ? 'border-primary-300 bg-primary-50'
                : 'border-default-200 bg-background'
                }`}
        >
            <span className='text-[10px] font-medium text-default-400'>{city}</span>
            <motion.span
                key={time}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className='mt-1 font-mono text-lg font-bold tabular-nums text-foreground sm:text-xl'
            >
                {time}
            </motion.span>
            <span className='mt-0.5 text-[10px] text-default-400'>{date}</span>
            <span
                className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${isUTC
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-default-100 text-default-500'
                    }`}
            >
                {label} ({offset})
            </span>
        </motion.div>
    )
}

export default function TimezoneConverterDemo() {
    const [liveNow, setLiveNow] = useState(new Date())
    const [mode, setMode] = useState<'live' | 'pick'>('live')
    const [picked, setPicked] = useState<ZonedDateTime>(
        intlNow(getLocalTimeZone())
    )

    useEffect(() => {
        if (mode !== 'live') return
        const interval = setInterval(() => setLiveNow(new Date()), 1000)
        return () => clearInterval(interval)
    }, [mode])

    const displayDate = useMemo(
        () => (mode === 'live' ? liveNow : picked.toDate()),
        [mode, liveNow, picked]
    )

    return (
        <DemoContainer
            title='Same Moment, Different Clocks'
            description='All five clocks show the exact same instant — only the reading changes'
        >
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
                <Button
                    size='sm'
                    variant={mode === 'live' ? 'solid' : 'flat'}
                    color='primary'
                    onPress={() => setMode('live')}
                >
                    🕐 Live
                </Button>
                <Button
                    size='sm'
                    variant={mode === 'pick' ? 'solid' : 'flat'}
                    color='primary'
                    onPress={() => {
                        setMode('pick')
                        setPicked(parseAbsoluteToLocal(liveNow.toISOString()))
                    }}
                >
                    📅 Pick a date
                </Button>
                {mode === 'pick' && (
                    <DatePicker
                        size='sm'
                        label='Select date & time'
                        granularity='minute'
                        value={picked as any}
                        onChange={val => {
                            if (val) setPicked(val as unknown as ZonedDateTime)
                        }}
                        className='max-w-xs'
                    />
                )}
            </div>

            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5'>
                {TIMEZONES.map(tz => (
                    <ClockCard
                        key={tz.zone}
                        zone={tz.zone}
                        label={tz.label}
                        city={tz.city}
                        now={displayDate}
                        isUTC={tz.zone === 'UTC'}
                    />
                ))}
            </div>

            <div className='mt-4 rounded-lg bg-default-100 p-3'>
                <p className='text-xs text-default-400'>
                    <span className='font-medium text-default-500'>Under the hood:</span>{' '}
                    {mode === 'live' ? (
                        <>
                            All clocks share the same{' '}
                            <code className='text-primary-500'>Date</code> object (
                            <code className='font-mono text-[10px] text-primary-500'>
                                {liveNow.toISOString()}
                            </code>
                            ). The browser&apos;s{' '}
                            <code className='text-primary-500'>Intl.DateTimeFormat</code>{' '}
                            with a{' '}
                            <code className='text-primary-500'>timeZone</code> option does
                            all the conversion — zero libraries needed.
                        </>
                    ) : (
                        <>
                            The DatePicker uses{' '}
                            <code className='text-primary-500'>@internationalized/date</code>
                            &apos;s <code className='text-primary-500'>ZonedDateTime</code>{' '}
                            type — a timezone-aware date that knows its offset. Calling{' '}
                            <code className='text-primary-500'>.toDate()</code> converts it
                            to a standard <code className='text-primary-500'>Date</code>{' '}
                            object for the clocks.
                        </>
                    )}
                </p>
            </div>
        </DemoContainer>
    )
}
