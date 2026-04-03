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
            className={`flex flex-col items-center rounded-lg border p-3 ${isUTC
                ? 'border-primary-300 bg-primary-50'
                : 'border-default-200 bg-background'
                }`}
        >
            <span className='text-[10px] font-medium text-default-400'>{city}</span>
            <AnimatedTime
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                className='mt-1 font-mono text-lg font-bold text-foreground sm:text-xl'
            />
            <span className='mt-0.5 text-[10px] text-default-400'>{date}</span>
            <span
                className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${isUTC
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-default-100 text-default-500'
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
                {liveNow && TIMEZONES.map(tz => (
                    <ClockCard
                        key={tz.zone}
                        zone={tz.zone}
                        city={tz.city}
                        now={liveNow}
                        isUTC={tz.zone === 'UTC'}
                    />
                ))}
            </div>

            <div className='mt-4 rounded-lg bg-default-100 p-3'>
                <p className='text-xs text-default-400'>
                    <span className='font-medium text-default-500'>Under the hood:</span>{' '}
                    All clocks share the same{' '}
                    <code className='text-primary-500'>Date</code> object (
                    <code className='font-mono text-[10px] text-primary-500'>
                        {liveNow?.toISOString() ?? ''}
                    </code>
                    ). Each card formats that same instant through{' '}
                    <code className='text-primary-500'>Intl.DateTimeFormat</code>
                    {' '}with a different <code className='text-primary-500'>timeZone</code>{' '}
                    option, so the browser does the conversion without extra date libraries.
                </p>
            </div>
        </DemoContainer>
    )
}
