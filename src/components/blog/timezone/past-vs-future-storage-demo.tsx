'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
                <div className='rounded-lg border border-primary-400 bg-primary-100 p-4'>
                    <div className='mb-3 flex items-center gap-2'>
                        <span className='rounded-full bg-primary-200 px-2 py-0.5 text-xs font-bold text-primary-800'>
                            PAST
                        </span>
                        <span className='text-xs text-default-500'>
                            Recording &amp; Reporting
                        </span>
                    </div>

                    <div className='mb-3'>
                        <p className='text-xs text-default-500'>What happened:</p>
                        <p className='text-sm font-medium text-foreground'>
                            Order placed on {pastDate}
                        </p>
                    </div>

                    <div className='mb-3 rounded-md bg-primary-200 p-2'>
                        <p className='text-[10px] font-medium text-primary-700'>
                            Stored in DB
                        </p>
                        <p className='font-mono text-sm font-bold text-primary-800'>
                            2026-03-29T{pastUTC.replace(' UTC', ':00Z')}
                        </p>
                    </div>

                    <p className='mb-2 text-[10px] font-medium text-default-500'>
                        Same moment, different readings:
                    </p>
                    <div className='space-y-1'>
                        {TIMEZONES_DISPLAY.map(tz => (
                            <div
                                key={tz.zone}
                                className='flex items-center justify-between text-xs'
                            >
                                <span className='text-default-500'>{tz.label}</span>
                                <span className='font-mono font-medium text-foreground'>
                                    {formatInZone(14, tz.offset)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className='mt-3 rounded-md border border-primary-300 bg-primary-50 p-2'>
                        <div className='flex items-start gap-2 text-[10px] text-primary-700'>
                            <IconCircleCheck size={14} className='mt-0.5 shrink-0' />
                            <p>
                                UTC is perfect for past events. The moment is fixed
                                and only the display changes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Future Event Panel */}
                <div className='rounded-lg border border-success-400 bg-success-100 p-4'>
                    <div className='mb-3 flex items-center gap-2'>
                        <span className='rounded-full bg-success-200 px-2 py-0.5 text-xs font-bold text-success-800'>
                            FUTURE
                        </span>
                        <span className='text-xs text-default-500'>Scheduling</span>
                    </div>

                    <div className='mb-3'>
                        <p className='text-xs text-default-500'>What the user wants:</p>
                        <p className='text-sm font-medium text-foreground'>
                            Daily standup at 9:00 AM in New York
                        </p>
                    </div>

                    <div className='mb-3 rounded-md bg-success-200 p-2'>
                        <p className='text-[10px] font-medium text-success-700'>
                            Stored in DB
                        </p>
                        <p className='font-mono text-sm font-bold text-success-800'>
                            wall_time: {futureWallTime} + tz: {futureZone}
                        </p>
                    </div>

                    <div className='mb-2 flex items-center gap-2'>
                        <p className='text-[10px] font-medium text-default-500'>
                            UTC equivalent:
                        </p>
                        <Button
                            size='sm'
                            variant='flat'
                            className='h-6 min-w-0 px-2 text-[10px]'
                            startContent={
                                dstToggle ? (
                                    <IconSun size={12} />
                                ) : (
                                    <IconSnowflake size={12} />
                                )
                            }
                            onPress={() => setDstToggle(t => !t)}
                        >
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
                                <span className='text-default-500'>Wall time</span>
                                <span className='font-mono font-medium text-foreground'>09:00 AM</span>
                            </div>
                            <div className='flex items-center justify-between text-xs'>
                                <span className='text-default-500'>Offset</span>
                                <span className='font-mono font-medium text-foreground'>
                                    {dstToggle ? 'UTC-4 (EDT)' : 'UTC-5 (EST)'}
                                </span>
                            </div>
                            <div className='flex items-center justify-between text-xs'>
                                <span className='text-default-500'>Computed UTC</span>
                                <span
                                    className={`font-mono font-bold ${dstToggle
                                        ? 'text-warning-600'
                                        : 'text-foreground'
                                        }`}
                                >
                                    {dstToggle ? summerUTC : winterUTC}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className='mt-3 rounded-md border border-success-300 bg-success-50 p-2'>
                        <div className='flex items-start gap-2 text-[10px] text-success-700'>
                            <IconCircleCheck size={14} className='mt-0.5 shrink-0' />
                            <p>
                                Wall time stays 9:00 AM. The UTC equivalent shifts
                                when DST changes and is computed at fire time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DemoContainer>
    )
}
