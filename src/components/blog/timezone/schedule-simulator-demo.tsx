'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Select, SelectItem } from '@heroui/react'
import DemoContainer from './demo-container'

const ZONES = [
    { key: 'America/New_York', label: 'New York' },
    { key: 'America/Chicago', label: 'Chicago' },
    { key: 'America/Los_Angeles', label: 'Los Angeles' },
    { key: 'Europe/London', label: 'London' }
]

const HOURS = Array.from({ length: 24 }, (_, i) => ({
    key: String(i),
    label: `${i.toString().padStart(2, '0')}:00`
}))

type SimState = 'idle' | 'advancing' | 'done'

function getUTCForWallTime(
    hour: number,
    zone: string,
    isDST: boolean
): string {
    const offsets: Record<string, [number, number]> = {
        'America/New_York': [-5, -4],
        'America/Chicago': [-6, -5],
        'America/Los_Angeles': [-8, -7],
        'Europe/London': [0, 1]
    }
    const [std, dst] = offsets[zone] ?? [0, 0]
    const offset = isDST ? dst : std
    const utcHour = ((hour - offset + 24) % 24).toString().padStart(2, '0')
    return `${utcHour}:00 UTC`
}

export default function ScheduleSimulatorDemo() {
    const [hour, setHour] = useState(9)
    const [zone, setZone] = useState('America/New_York')
    const [simState, setSimState] = useState<SimState>('idle')
    const [simDay, setSimDay] = useState(0)

    const zoneName = ZONES.find(z => z.key === zone)?.label ?? zone

    const winterUTC = getUTCForWallTime(hour, zone, false)
    const summerUTC = getUTCForWallTime(hour, zone, true)
    const utcChanged = winterUTC !== summerUTC

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
                <Select
                    size='sm'
                    label='Time'
                    selectedKeys={[String(hour)]}
                    onSelectionChange={keys => {
                        const val = Array.from(keys)[0]
                        if (val !== undefined) setHour(Number(val))
                        reset()
                    }}
                    className='sm:w-40'
                >
                    {HOURS.map(h => (
                        <SelectItem key={h.key}>{h.label}</SelectItem>
                    ))}
                </Select>
                <Select
                    size='sm'
                    label='Timezone'
                    selectedKeys={[zone]}
                    onSelectionChange={keys => {
                        const val = Array.from(keys)[0]
                        if (val !== undefined) setZone(String(val))
                        reset()
                    }}
                    className='sm:w-48'
                >
                    {ZONES.map(z => (
                        <SelectItem key={z.key}>{z.label}</SelectItem>
                    ))}
                </Select>
            </div>

            <div className='mb-4 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-lg border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-950/20'>
                    <div className='mb-2 flex items-center gap-2'>
                        <span className='text-sm'>❌</span>
                        <span className='text-xs font-medium text-danger-600 dark:text-danger-400'>
                            Stored as UTC at schedule time
                        </span>
                    </div>
                    <div className='space-y-1 font-mono text-xs'>
                        <p className='text-default-500'>
                            stored: <span className='text-danger-600 dark:text-danger-400'>{winterUTC}</span>
                        </p>
                        <AnimatePresence mode='wait'>
                            <motion.p
                                key={`utc-${isDSTActive}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-default-500'
                            >
                                fires at:{' '}
                                <span
                                    className={
                                        isDSTActive && utcChanged
                                            ? 'font-bold text-danger-600 dark:text-danger-400'
                                            : 'text-foreground'
                                    }
                                >
                                    {isDSTActive && utcChanged
                                        ? `${parseInt(winterUTC) > parseInt(summerUTC) ? hour + 1 : hour - 1}:00 local (WRONG!)`
                                        : `${hour.toString().padStart(2, '0')}:00 local ✓`}
                                </span>
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>

                <div className='rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-900 dark:bg-success-950/20'>
                    <div className='mb-2 flex items-center gap-2'>
                        <span className='text-sm'>✅</span>
                        <span className='text-xs font-medium text-success-600 dark:text-success-400'>
                            Stored as wall time + timezone
                        </span>
                    </div>
                    <div className='space-y-1 font-mono text-xs'>
                        <p className='text-default-500'>
                            stored:{' '}
                            <span className='text-success-600 dark:text-success-400'>
                                {hour.toString().padStart(2, '0')}:00 + {zoneName}
                            </span>
                        </p>
                        <p className='text-default-500'>
                            fires at:{' '}
                            <span className='text-foreground'>
                                {hour.toString().padStart(2, '0')}:00 local ✓
                            </span>
                        </p>
                        <AnimatePresence mode='wait'>
                            <motion.p
                                key={`wall-${isDSTActive}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-default-400'
                            >
                                computed UTC:{' '}
                                <span className='text-success-600 dark:text-success-400'>
                                    {isDSTActive ? summerUTC : winterUTC}
                                </span>
                                {isDSTActive && utcChanged && (
                                    <span className='ml-1 text-success-500'>(recalculated)</span>
                                )}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className='mb-3'>
                <div className='mb-2 flex items-center justify-between'>
                    <span className='text-xs text-default-400'>
                        {simState === 'idle'
                            ? 'Press to simulate days passing through DST'
                            : simState === 'advancing'
                                ? 'Advancing through days...'
                                : 'DST transition complete'}
                    </span>
                    <span className='text-xs font-mono text-default-400'>
                        Day {simDay + 1}/{daysBeforeDST + 1}
                    </span>
                </div>

                <div className='flex gap-1'>
                    {Array.from({ length: daysBeforeDST + 1 }, (_, i) => {
                        const isDSTDay = i === dstDay
                        const isPast = i <= simDay
                        return (
                            <motion.div
                                key={i}
                                className={`relative h-8 flex-1 rounded ${isDSTDay && isPast
                                        ? 'bg-warning-200 dark:bg-warning-900'
                                        : isPast
                                            ? i < dstDay
                                                ? 'bg-primary-200 dark:bg-primary-800'
                                                : 'bg-primary-300 dark:bg-primary-700'
                                            : 'bg-default-100 dark:bg-default-200'
                                    }`}
                                animate={
                                    i === simDay
                                        ? { scale: [1, 1.05, 1], transition: { duration: 0.3 } }
                                        : {}
                                }
                            >
                                {isDSTDay && (
                                    <span className='absolute inset-0 flex items-center justify-center text-[9px] font-bold text-warning-700 dark:text-warning-300'>
                                        DST
                                    </span>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            <div className='flex gap-2'>
                <Button
                    size='sm'
                    variant='flat'
                    color='primary'
                    isDisabled={simState === 'advancing'}
                    onPress={simState === 'idle' ? simulate : reset}
                >
                    {simState === 'idle'
                        ? '⏩ Fast Forward'
                        : simState === 'advancing'
                            ? 'Advancing...'
                            : '↺ Reset'}
                </Button>
            </div>
        </DemoContainer>
    )
}
