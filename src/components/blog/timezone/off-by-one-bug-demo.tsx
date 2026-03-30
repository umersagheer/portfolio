'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Select, SelectItem, Alert, TimeInput } from '@heroui/react'
import {
    IconArrowBackUp,
    IconSettings,
    IconShoppingCart
} from '@tabler/icons-react'
import DemoContainer from './demo-container'
import {
    createTimeValue,
    formatHourMinute,
    formatMonthDay,
    getTimeZoneOffsetLabel,
    wallTimeToUTCDate
} from './timezone-utils'

const ZONES = [
    { key: 'Asia/Karachi', label: 'Karachi' },
    { key: 'America/New_York', label: 'New York' },
    { key: 'Asia/Tokyo', label: 'Tokyo' },
    { key: 'Pacific/Auckland', label: 'Auckland' }
]

const BUSINESS_DATE = {
    year: 2026,
    month: 3,
    day: 29
}

const NEXT_BUSINESS_DATE = {
    year: 2026,
    month: 3,
    day: 30
}

function getOrderResult(orderHour: number, zone: string) {
    const localDate = 'March 29'
    const orderUTC = wallTimeToUTCDate(
        { ...BUSINESS_DATE, hour: orderHour },
        zone
    )
    const utcRangeStartDate = wallTimeToUTCDate(
        { ...BUSINESS_DATE, hour: 0 },
        zone
    )
    const utcRangeEndDate = new Date(
        wallTimeToUTCDate({ ...NEXT_BUSINESS_DATE, hour: 0 }, zone).getTime() -
        60_000
    )
    const utcDate = formatMonthDay(orderUTC, 'UTC')
    const crossesDayBoundary = utcDate !== localDate

    return {
        localTime: `${orderHour.toString().padStart(2, '0')}:00`,
        localDate,
        utcTime: formatHourMinute(orderUTC, 'UTC'),
        utcDate,
        crossesDayBoundary,
        utcRangeStart: formatHourMinute(utcRangeStartDate, 'UTC'),
        utcRangeEnd: formatHourMinute(utcRangeEndDate, 'UTC'),
        utcStartDate: formatMonthDay(utcRangeStartDate, 'UTC'),
        utcEndDate: formatMonthDay(utcRangeEndDate, 'UTC'),
        zoneOffset: getTimeZoneOffsetLabel(orderUTC, zone)
    }
}

export default function OffByOneBugDemo() {
    const [zone, setZone] = useState('Asia/Karachi')
    const [withFix, setWithFix] = useState(false)
    const [orderRunId, setOrderRunId] = useState(0)
    const [orderHour, setOrderHour] = useState(1)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const zoneLabel = ZONES.find(z => z.key === zone)?.label ?? zone
    const result = getOrderResult(orderHour, zone)

    const dates = ['March 28', 'March 29', 'March 30']
    const bugTargetDate = result.utcDate
    const fixTargetDate = result.localDate
    const hasOrder = orderRunId > 0

    const resetDemo = () => {
        setOrderRunId(0)
        setWithFix(false)
    }

    return (
        <DemoContainer
            title="The Off-by-One Day Bug"
            description='Place an order — watch it land on the wrong date in reports'
        >
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
                <Select
                    size='sm'
                    label='Your timezone'
                    selectedKeys={new Set([zone])}
                    onSelectionChange={keys => {
                        const val = Array.from(keys)[0]
                        if (val !== undefined) {
                            setZone(String(val))
                            setWithFix(false)
                        }
                    }}
                    className='sm:w-56'
                >
                    {ZONES.map(z => (
                        <SelectItem key={z.key} textValue={z.label}>
                            {z.label}
                        </SelectItem>
                    ))}
                </Select>

                {mounted && (
                    <TimeInput
                        size='sm'
                        label='Order time'
                        granularity='hour'
                        hourCycle={12}
                        value={createTimeValue(orderHour) as any}
                        onChange={(value: any) => {
                            if (value?.hour !== undefined) {
                                setOrderHour(value.hour)
                            }
                            setWithFix(false)
                        }}
                        className='sm:w-36'
                    />
                )}

                {!hasOrder && <Button
                    size='sm'
                    color='primary'
                    variant={hasOrder ? 'flat' : 'solid'}
                    startContent={<IconShoppingCart size={14} />}
                    onPress={() => setOrderRunId(runId => runId + 1)}
                >
                    Place order
                </Button>}
            </div>

            <AnimatePresence mode='wait'>
                {hasOrder && (
                    <motion.div
                        key={orderRunId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Data breakdown */}
                        <div className='mb-4 grid gap-3 rounded-lg bg-default-100 p-4'>
                            <div className='rounded-lg border border-default-200 bg-background px-3 py-2 text-xs text-default-500'>
                                Business date: <span className='font-medium text-foreground'>March 29</span>{' '}
                                in <span className='font-medium text-foreground'>{zoneLabel}</span>{' '}
                                (<span className='font-mono text-foreground'>{result.zoneOffset}</span>)
                            </div>
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
                                {withFix && (
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
                                    {withFix && ' (fixed)'}
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
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition-colors duration-300 ${isWrong
                                                        ? 'bg-danger-100 text-danger-600'
                                                        : 'bg-success-100 text-success-600'
                                                        }`}
                                                >
                                                    <IconShoppingCart size={12} />
                                                    Order
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
                                                    ? `Fixed: Convert "${result.localDate}" in ${zoneLabel} to the UTC range ${result.utcStartDate} ${result.utcRangeStart} → ${result.utcEndDate} ${result.utcRangeEnd} before grouping or filtering.`
                                                    : `Bug: The report groups by UTC date. An order at ${result.localTime} on ${result.localDate} in ${zoneLabel} is stored as ${result.utcDate}, ${result.utcTime} UTC, so it lands on the wrong reporting day.`
                                            }
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}

                        <Button
                            startContent={
                                withFix ? (
                                    <IconArrowBackUp size={14} />
                                ) : (
                                    <IconSettings size={14} />
                                )
                            }
                            variant='flat'
                            color={withFix ? 'success' : 'warning'}
                            onPress={() => setWithFix(f => !f)}
                        >
                            {withFix ? 'Show bug' : 'Apply fix'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </DemoContainer>
    )
}
