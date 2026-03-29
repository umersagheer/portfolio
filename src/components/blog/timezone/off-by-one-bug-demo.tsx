'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Select, SelectItem } from '@heroui/react'
import DemoContainer from './demo-container'

const ZONES = [
    { key: 'Asia/Karachi', label: 'Karachi (UTC+5)', offset: 5 },
    { key: 'America/New_York', label: 'New York (UTC-4)', offset: -4 },
    { key: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', offset: 9 },
    { key: 'Pacific/Auckland', label: 'Auckland (UTC+12)', offset: 12 }
]

function getOrderResult(orderHour: number, offset: number, withFix: boolean) {
    const utcHour = ((orderHour - offset + 24) % 24)
    const localDate = 'March 29'
    const utcDate = utcHour < orderHour && offset > 0
        ? 'March 28'
        : utcHour > orderHour && offset < 0
            ? 'March 30'
            : 'March 29'

    const reportDate = withFix ? localDate : utcDate
    const isWrongDay = reportDate !== localDate

    return {
        localTime: `${orderHour.toString().padStart(2, '0')}:00`,
        localDate,
        utcTime: `${utcHour.toString().padStart(2, '0')}:00`,
        utcDate,
        reportDate,
        isWrongDay
    }
}

export default function OffByOneBugDemo() {
    const [zone, setZone] = useState('Asia/Karachi')
    const [withFix, setWithFix] = useState(false)
    const [ordered, setOrdered] = useState(false)

    const offset = ZONES.find(z => z.key === zone)?.offset ?? 5
    const orderHour = 1
    const result = getOrderResult(orderHour, offset, withFix)

    return (
        <DemoContainer
            title="The Off-by-One Day Bug"
            description='Place an order at 1 AM — watch it land on the wrong date in reports'
        >
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
                <Select
                    size='sm'
                    label='Your timezone'
                    selectedKeys={[zone]}
                    onSelectionChange={keys => {
                        const val = Array.from(keys)[0]
                        if (val !== undefined) {
                            setZone(String(val))
                            setOrdered(false)
                        }
                    }}
                    className='sm:w-56'
                >
                    {ZONES.map(z => (
                        <SelectItem key={z.key}>{z.label}</SelectItem>
                    ))}
                </Select>

                <Button
                    size='sm'
                    color='primary'
                    variant={ordered ? 'flat' : 'solid'}
                    onPress={() => setOrdered(true)}
                    isDisabled={ordered}
                >
                    🛒 Place order at 1:00 AM
                </Button>
            </div>

            <AnimatePresence mode='wait'>
                {ordered && (
                    <motion.div
                        key={`${zone}-${withFix}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className='mb-4 grid gap-3 rounded-lg bg-default-100 p-4 dark:bg-default-50'>
                            <div className='flex items-baseline justify-between text-xs'>
                                <span className='text-default-400'>Customer&apos;s clock</span>
                                <span className='font-mono text-foreground'>
                                    {result.localDate}, {result.localTime}
                                </span>
                            </div>
                            <div className='flex items-baseline justify-between text-xs'>
                                <span className='text-default-400'>Stored in DB (UTC)</span>
                                <span className='font-mono text-foreground'>
                                    {result.utcDate}, {result.utcTime} UTC
                                </span>
                            </div>
                            <div className='flex items-baseline justify-between text-xs'>
                                <span className='text-default-400'>
                                    {withFix ? 'Report groups by' : 'Report groups by'}
                                </span>
                                <span
                                    className={`font-mono font-bold ${result.isWrongDay && !withFix
                                            ? 'text-danger-600 dark:text-danger-400'
                                            : 'text-success-600 dark:text-success-400'
                                        }`}
                                >
                                    {withFix ? result.localDate : result.reportDate}
                                    {result.isWrongDay && !withFix && ' ← WRONG DAY!'}
                                    {withFix && ' ✓'}
                                </span>
                            </div>
                        </div>

                        <div className='mb-4 overflow-hidden rounded-lg border border-default-200'>
                            <div className='grid grid-cols-3 bg-default-100 text-center text-[10px] font-medium text-default-500 dark:bg-default-50'>
                                <div className='border-r border-default-200 p-2'>March 28</div>
                                <div className='border-r border-default-200 p-2'>March 29</div>
                                <div className='p-2'>March 30</div>
                            </div>
                            <div className='grid grid-cols-3 text-center'>
                                {['March 28', 'March 29', 'March 30'].map(date => {
                                    const isTarget = withFix
                                        ? date === result.localDate
                                        : date === result.reportDate
                                    return (
                                        <div
                                            key={date}
                                            className={`border-r border-default-200 p-3 last:border-r-0 ${isTarget
                                                    ? result.isWrongDay && !withFix
                                                        ? 'bg-danger-50 dark:bg-danger-950/20'
                                                        : 'bg-success-50 dark:bg-success-950/20'
                                                    : ''
                                                }`}
                                        >
                                            {isTarget && (
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={`inline-block rounded-full px-2 py-1 text-[10px] font-medium ${result.isWrongDay && !withFix
                                                            ? 'bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-400'
                                                            : 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400'
                                                        }`}
                                                >
                                                    🛒 Order
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {result.isWrongDay && (
                            <div
                                className={`mb-4 rounded-lg p-3 text-xs ${withFix
                                        ? 'border border-success-200 bg-success-50 text-success-700 dark:border-success-900 dark:bg-success-950/30 dark:text-success-400'
                                        : 'border border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-900 dark:bg-danger-950/30 dark:text-danger-400'
                                    }`}
                            >
                                {withFix ? (
                                    <>
                                        <strong>✅ Fixed:</strong> The report uses{' '}
                                        <code>getBusinessDayRange(&quot;2026-03-29&quot;, &quot;{zone}&quot;)</code>{' '}
                                        to convert March 29 local → UTC boundaries before grouping.
                                    </>
                                ) : (
                                    <>
                                        <strong>❌ Bug:</strong> The report groups by UTC date. The
                                        order was placed at 1 AM local time ({result.localDate}), but
                                        in UTC it&apos;s {result.utcTime} on {result.utcDate}.
                                        The operations manager counting by local date sees a different
                                        total than the report.
                                    </>
                                )}
                            </div>
                        )}

                        <Button
                            size='sm'
                            variant='flat'
                            color={withFix ? 'success' : 'warning'}
                            onPress={() => setWithFix(f => !f)}
                        >
                            {withFix ? '↩ Show bug' : '🔧 Apply fix'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </DemoContainer>
    )
}
