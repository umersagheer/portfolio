'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Select, SelectItem, Alert, TimeInput } from '@heroui/react'
import { Time } from '@internationalized/date'
import DemoContainer from './demo-container'

const ZONES = [
    { key: 'Asia/Karachi', label: 'Karachi (UTC+5)', offset: 5 },
    { key: 'America/New_York', label: 'New York (UTC-4)', offset: -4 },
    { key: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', offset: 9 },
    { key: 'Pacific/Auckland', label: 'Auckland (UTC+12)', offset: 12 }
]

function getOrderResult(orderHour: number, offset: number) {
    const utcHour = ((orderHour - offset + 24) % 24)
    const localDate = 'March 29'
    const utcDate = utcHour < orderHour && offset > 0
        ? 'March 28'
        : utcHour > orderHour && offset < 0
            ? 'March 30'
            : 'March 29'

    const crossesDayBoundary = utcDate !== localDate

    const utcRangeStart = `${((0 - offset + 24) % 24).toString().padStart(2, '0')}:00`
    const utcRangeEnd = `${((23 - offset + 24) % 24).toString().padStart(2, '0')}:59`
    const utcStartDate = offset > 0 ? 'March 28' : offset < 0 ? 'March 29' : 'March 29'
    const utcEndDate = offset > 0 ? 'March 29' : offset < 0 ? 'March 30' : 'March 29'

    return {
        localTime: `${orderHour.toString().padStart(2, '0')}:00`,
        localDate,
        utcTime: `${utcHour.toString().padStart(2, '0')}:00`,
        utcDate,
        crossesDayBoundary,
        utcRangeStart,
        utcRangeEnd,
        utcStartDate,
        utcEndDate
    }
}

export default function OffByOneBugDemo() {
    const [zone, setZone] = useState('Asia/Karachi')
    const [withFix, setWithFix] = useState(false)
    const [ordered, setOrdered] = useState(false)
    const [orderHour, setOrderHour] = useState(1)

    const offset = ZONES.find(z => z.key === zone)?.offset ?? 5
    const result = getOrderResult(orderHour, offset)

    const dates = ['March 28', 'March 29', 'March 30']
    const bugTargetDate = result.utcDate
    const fixTargetDate = result.localDate

    return (
        <DemoContainer
            title="The Off-by-One Day Bug"
            description='Place an order — watch it land on the wrong date in reports'
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
                            setWithFix(false)
                        }
                    }}
                    className='sm:w-56'
                >
                    {ZONES.map(z => (
                        <SelectItem key={z.key}>{z.label}</SelectItem>
                    ))}
                </Select>

                <TimeInput
                    size='sm'
                    label='Order time'
                    value={new Time(orderHour) as any}
                    onChange={val => {
                        if (val) {
                            setOrderHour(val.hour)
                            setOrdered(false)
                            setWithFix(false)
                        }
                    }}
                    className='sm:w-36'
                    hourCycle={12}
                />

                <Button
                    size='sm'
                    color='primary'
                    variant={ordered ? 'flat' : 'solid'}
                    onPress={() => setOrdered(true)}
                    isDisabled={ordered}
                >
                    🛒 Place order
                </Button>
            </div>

            <AnimatePresence mode='wait'>
                {ordered && (
                    <motion.div
                        key={zone}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Data breakdown */}
                        <div className='mb-4 grid gap-3 rounded-lg bg-default-100 p-4'>
                            <div className='flex items-baseline justify-between text-xs'>
                                <span className='text-default-500'>Customer&apos;s clock</span>
                                <span className='font-mono text-foreground'>
                                    {result.localDate}, {result.localTime}
                                </span>
                            </div>
                            <div className='flex items-baseline justify-between text-xs'>
                                <span className='text-default-500'>Stored in DB (UTC)</span>
                                <span className='font-mono text-foreground'>
                                    {result.utcDate}, {result.utcTime} UTC
                                </span>
                            </div>
                            <AnimatePresence>
                                {withFix && result.crossesDayBoundary && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className='flex items-baseline justify-between text-xs'
                                    >
                                        <span className='text-success-600'>UTC range for {result.localDate}</span>
                                        <span className='font-mono text-success-600'>
                                            {result.utcStartDate} {result.utcRangeStart} → {result.utcEndDate} {result.utcRangeEnd}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className='flex items-baseline justify-between text-xs'>
                                <span className='text-default-500'>
                                    {withFix ? 'Report groups by (fixed)' : 'Report groups by (raw UTC)'}
                                </span>
                                <motion.span
                                    key={String(withFix)}
                                    initial={{ opacity: 0, x: 4 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`font-mono font-bold ${result.crossesDayBoundary && !withFix
                                            ? 'text-danger-600'
                                            : 'text-success-600'
                                        }`}
                                >
                                    {withFix ? fixTargetDate : bugTargetDate}
                                    {result.crossesDayBoundary && !withFix && ' ← WRONG DAY!'}
                                    {withFix && ' ✓'}
                                </motion.span>
                            </div>
                        </div>

                        {/* Calendar grid with animated order chip */}
                        <div className='mb-4 overflow-hidden rounded-lg border border-default-200'>
                            <div className='grid grid-cols-3 bg-default-100 text-center text-[10px] font-medium text-default-500'>
                                {dates.map(d => (
                                    <div key={d} className='border-r border-default-200 p-2 last:border-r-0'>
                                        {d}
                                    </div>
                                ))}
                            </div>
                            <div className='relative grid grid-cols-3 text-center'>
                                {dates.map(date => {
                                    const activeDate = withFix ? fixTargetDate : bugTargetDate
                                    const isTarget = date === activeDate
                                    const isWrong = result.crossesDayBoundary && !withFix
                                    return (
                                        <div
                                            key={date}
                                            className={`flex min-h-[48px] items-center justify-center border-r border-default-200 p-3 last:border-r-0 transition-colors duration-300 ${isTarget
                                                    ? isWrong
                                                        ? 'bg-danger-50'
                                                        : 'bg-success-50'
                                                    : ''
                                                }`}
                                        >
                                            {isTarget && (
                                                <motion.div
                                                    layoutId='order-chip'
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 400,
                                                        damping: 30
                                                    }}
                                                    className={`inline-block rounded-full px-2 py-1 text-[10px] font-medium transition-colors duration-300 ${isWrong
                                                            ? 'bg-danger-100 text-danger-600'
                                                            : 'bg-success-100 text-success-600'
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

                        {/* Contextual alert */}
                        {result.crossesDayBoundary && (
                            <div className='mb-4'>
                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={String(withFix)}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Alert
                                            color={withFix ? 'success' : 'danger'}
                                            description={
                                                withFix
                                                    ? `Fixed: Convert "${result.localDate}" in ${zone} to UTC range (${result.utcStartDate} ${result.utcRangeStart} → ${result.utcEndDate} ${result.utcRangeEnd}) before querying.`
                                                    : `Bug: The report groups by UTC date. Order placed at ${result.localTime} on ${result.localDate} is ${result.utcTime} UTC on ${result.utcDate}. The ops manager's local count won't match the report.`
                                            }
                                        />
                                    </motion.div>
                                </AnimatePresence>
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
