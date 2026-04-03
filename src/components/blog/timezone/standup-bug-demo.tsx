'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Alert } from '@heroui/react'
import {
    IconCircleCheck,
    IconCircleX,
    IconRefresh,
    IconSnowflake,
    IconSun
} from '@tabler/icons-react'
import DemoContainer from './demo-container'
import AnimatedTime from './animated-time'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

type Strategy = 'utc' | 'wall'

function getMeetingTime(
    day: number,
    strategy: Strategy,
    dstActive: boolean
): { hour: number; minute: number; ampm: string; broken: boolean } {
    if (strategy === 'wall') {
        return { hour: 9, minute: 0, ampm: 'AM', broken: false }
    }
    if (dstActive) {
        return { hour: 10, minute: 0, ampm: 'AM', broken: true }
    }
    return { hour: 9, minute: 0, ampm: 'AM', broken: false }
}

export default function StandupBugDemo() {
    const [strategy, setStrategy] = useState<Strategy>('utc')
    const [dstActive, setDstActive] = useState(false)
    const [animating, setAnimating] = useState(false)

    const toggleDST = () => {
        setAnimating(true)
        setTimeout(() => {
            setDstActive(d => !d)
            setAnimating(false)
        }, 400)
    }

    return (
        <DemoContainer
            title='The Daily Standup Bug'
            description='A 9 AM meeting stored as UTC breaks when DST changes'
        >
            <div className='mb-4 flex flex-wrap gap-2'>
                <Button
                    size='sm'
                    variant={strategy === 'utc' ? 'solid' : 'flat'}
                    color={strategy === 'utc' ? 'danger' : 'default'}
                    startContent={<IconCircleX size={14} />}
                    onPress={() => setStrategy('utc')}
                >
                    Stored as UTC
                </Button>
                <Button
                    size='sm'
                    variant={strategy === 'wall' ? 'solid' : 'flat'}
                    color={strategy === 'wall' ? 'success' : 'default'}
                    startContent={<IconCircleCheck size={14} />}
                    onPress={() => setStrategy('wall')}
                >
                    Stored as wall time + tz
                </Button>
            </div>

            <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${dstActive
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-default-100 text-default-500'
                            }`}
                    >
                        {dstActive ? <IconSun size={12} /> : <IconSnowflake size={12} />}
                        {dstActive ? 'EDT (Summer)' : 'EST (Winter)'}
                    </span>
                    <span className='text-xs text-default-400'>
                        {dstActive ? 'UTC-4' : 'UTC-5'}
                    </span>
                </div>
                <Button
                    size='sm'
                    variant='flat'
                    startContent={<IconRefresh size={14} />}
                    onPress={toggleDST}
                    isDisabled={animating}
                >
                    {dstActive ? 'Revert to Winter' : 'Spring Forward'}
                </Button>
            </div>

            <div className='mb-3 grid grid-cols-5 gap-2'>
                {DAYS.map((day, i) => {
                    const { hour, minute, ampm, broken } = getMeetingTime(i, strategy, dstActive)
                    return (
                        <div
                            key={day}
                            className={`rounded-lg border p-2 text-center transition-colors ${broken
                                ? 'border-danger-300 bg-danger-50'
                                : 'border-default-200 bg-background'
                                }`}
                        >
                            <span className='block text-[10px] font-medium text-default-400'>
                                {day}
                            </span>
                            <AnimatedTime
                                hours={hour}
                                minutes={minute}
                                ampm={ampm}
                                padHours={false}
                                className={`mt-1 block font-mono text-xs font-bold ${broken
                                    ? 'text-danger-600'
                                    : 'text-foreground'
                                    }`}
                            />
                        </div>
                    )
                })}
            </div>

            <div className='grid gap-2 rounded-lg bg-default-100 p-3'>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>Strategy</span>
                    <span
                        className={`font-medium ${strategy === 'utc'
                            ? 'text-danger-500'
                            : 'text-success-500'
                            }`}
                    >
                        {strategy === 'utc' ? 'Fixed 14:00 UTC' : '09:00 + America/New_York'}
                    </span>
                </div>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>Current offset</span>
                    <span className='font-mono text-foreground'>
                        {dstActive ? 'UTC-4 (EDT)' : 'UTC-5 (EST)'}
                    </span>
                </div>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>Conversion</span>
                    <span
                        className={`font-mono ${strategy === 'utc' && dstActive
                            ? 'text-danger-600'
                            : 'text-default-500'
                            }`}
                    >
                        {strategy === 'utc'
                            ? `14:00 UTC − ${dstActive ? '4h (EDT)' : '5h (EST)'} = ${dstActive ? '10:00 AM' : '9:00 AM'}`
                            : `09:00 wall → recompute: 09:00 + ${dstActive ? '4h (EDT)' : '5h (EST)'} = ${dstActive ? '13:00' : '14:00'} UTC`}
                    </span>
                </div>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>Meeting fires at</span>
                    <span
                        className={`font-mono font-bold ${strategy === 'utc' && dstActive
                            ? 'text-danger-600'
                            : 'text-success-600'
                            }`}
                    >
                        {strategy === 'utc' && dstActive
                            ? '10:00 AM local (WRONG!)'
                            : '9:00 AM local'}
                    </span>
                </div>
            </div>

            {strategy === 'utc' && dstActive && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className='mt-3'
                >
                    <Alert
                        color='danger'
                        description={`The meeting was stored as 14:00 UTC during winter (when EST is UTC-5, so 14:00 UTC = 9 AM). After spring forward, EDT is UTC-4, so 14:00 UTC = 10:00 AM. The team shows up an hour late.`}
                    />
                </motion.div>
            )}
        </DemoContainer>
    )
}
