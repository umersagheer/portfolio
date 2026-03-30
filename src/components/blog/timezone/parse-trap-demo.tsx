'use client'

import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Alert } from '@heroui/react'
import DemoContainer from './demo-container'
import {
    formatMonthDay,
    getTimeZoneOffsetLabel,
    wallTimeToUTCDate
} from './timezone-utils'

const PRESETS = [
    { label: "'2026-03-29'", value: '2026-03-29' },
    { label: "'2026-03-29T00:00:00'", value: '2026-03-29T00:00:00' },
    { label: "'2026-03-29T00:00:00Z'", value: '2026-03-29T00:00:00Z' },
    { label: "'2026-03-29 00:00:00'", value: '2026-03-29 00:00:00' },
    { label: "'2026-03-29T00:00:00+05:00'", value: '2026-03-29T00:00:00+05:00' }
]

function parseAndAnalyze(input: string) {
    try {
        const d = new Date(input)
        if (isNaN(d.getTime())) return null

        const isoString = d.toISOString()
        const utcDate = isoString.split('T')[0]
        const inputDate = input.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ''
        const hasExplicitTimezone = /[Zz]|[+-]\d{2}:\d{2}$/.test(input)
        const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input)
        const parsedAsUTC = isDateOnly || hasExplicitTimezone
        const dateShifted = utcDate !== inputDate

        return {
            isoString,
            utcHours: d.getUTCHours(),
            utcDate,
            localString: d.toString(),
            parsedAsUTC,
            dateShifted,
            isDateOnly,
            hasExplicitTimezone
        }
    } catch {
        return null
    }
}

function parseNaiveDateTimeParts(input: string) {
    const match = input.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:T| )(\d{2}):(\d{2})(?::(\d{2}))?$/
    )

    if (!match) {
        return null
    }

    const [, year, month, day, hour, minute, second] = match

    return {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second ?? '0')
    }
}

const EXAMPLE_ZONES = [
    { zone: 'UTC', label: 'UTC machine' },
    { zone: 'Asia/Karachi', label: 'UTC+5 machine' },
    { zone: 'America/New_York', label: 'UTC-4 machine' }
]

export default function ParseTrapDemo() {
    const [input, setInput] = useState("'2026-03-29T00:00:00'")
    const [activePreset, setActivePreset] = useState(1)
    const inputId = useId()

    const cleanInput = input.replace(/^['"]|['"]$/g, '')
    const result = parseAndAnalyze(cleanInput)
    const machineZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const parsedParts = parseNaiveDateTimeParts(cleanInput)

    const handlePreset = (index: number) => {
        setActivePreset(index)
        setInput(PRESETS[index].label)
    }

    const isLocalTimeFormat =
        !!result && !result.parsedAsUTC && !result.isDateOnly
    const isNonStandardFormat = cleanInput.includes(' ') && !cleanInput.includes('T')

    const simulatedExamples =
        isLocalTimeFormat && parsedParts
            ? EXAMPLE_ZONES.map(example => {
                const simulatedDate = wallTimeToUTCDate(parsedParts, example.zone)
                const simulatedISO = simulatedDate.toISOString()
                const simulatedUTCDate = simulatedISO.split('T')[0]
                const inputDate = cleanInput.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ''

                return {
                    ...example,
                    offset: getTimeZoneOffsetLabel(simulatedDate, example.zone),
                    isoString: simulatedISO,
                    shifted: simulatedUTCDate !== inputDate,
                    utcDate: formatMonthDay(simulatedDate, 'UTC')
                }
            })
            : []

    return (
        <DemoContainer
            title='The Date Parsing Trap'
            description='Click a format or type your own — see how JavaScript interprets it'
        >
            <div className='mb-4 flex flex-wrap gap-2'>
                {PRESETS.map((preset, i) => (
                    <Button
                        key={preset.value}
                        size='sm'
                        variant={activePreset === i ? 'solid' : 'flat'}
                        color={activePreset === i ? 'primary' : 'default'}
                        className='font-mono text-xs'
                        onPress={() => handlePreset(i)}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>

            <div className='mb-4'>
                <label htmlFor={inputId} className='mb-2 block text-xs font-medium text-default-500'>
                    Date string to parse
                </label>
                <input
                    id={inputId}
                    type='text'
                    value={input}
                    onChange={e => {
                        setInput(e.target.value)
                        setActivePreset(-1)
                    }}
                    className='w-full rounded-lg border border-default-200 bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary-400'
                    placeholder="Try: '2026-03-29T00:00:00'"
                />
            </div>

            <AnimatePresence mode='wait'>
                {result ? (
                    <motion.div
                        key={cleanInput}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className='space-y-3'
                    >
                        <div className='grid gap-2 rounded-lg bg-default-100 p-4'>
                            <Row label='Input' value={`new Date(${input})`} mono />
                            <Row label='Your machine' value={machineZone} />
                            <Row
                                label='.toISOString()'
                                value={result.isoString}
                                mono
                                highlight={isLocalTimeFormat ? 'danger' : 'success'}
                            />
                            <Row
                                label='UTC date'
                                value={result.utcDate}
                                highlight={result.dateShifted ? 'danger' : 'success'}
                            />
                            <Row
                                label='UTC hours'
                                value={String(result.utcHours)}
                                highlight={result.utcHours !== 0 ? 'warning' : 'success'}
                            />
                            <Row
                                label='Parsed as'
                                value={
                                    result.isDateOnly
                                        ? 'UTC (date-only → spec says UTC)'
                                        : result.hasExplicitTimezone
                                            ? 'UTC (explicit Z or offset)'
                                            : 'Machine local time (no Z, no offset)'
                                }
                                highlight={result.parsedAsUTC ? 'success' : 'danger'}
                            />
                        </div>

                        {isLocalTimeFormat && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <Alert
                                    color='danger'
                                    title={
                                        isNonStandardFormat
                                            ? 'This format is not ISO 8601 and is machine-dependent'
                                            : 'This format depends on the machine timezone'
                                    }
                                    description={
                                        isNonStandardFormat
                                            ? `Some engines reject "${cleanInput}", others accept it as local time. If it is accepted, the UTC result depends on where the code runs.`
                                            : `Without a Z or offset, JavaScript interprets "${cleanInput}" as local time. On your machine it becomes ${result.isoString}, but a machine in another timezone can produce a different UTC timestamp.`
                                    }
                                />
                            </motion.div>
                        )}

                        {simulatedExamples.length > 0 && (
                            <div className='rounded-lg border border-default-200 p-3'>
                                <p className='text-xs font-medium text-default-500'>
                                    Same string, different machines
                                </p>
                                <div className='mt-3 space-y-2'>
                                    {simulatedExamples.map(example => (
                                        <div
                                            key={example.zone}
                                            className='flex flex-col gap-1 rounded-lg bg-default-100 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between'
                                        >
                                            <div>
                                                <p className='font-medium text-foreground'>
                                                    {example.label}{' '}
                                                    <span className='font-mono text-default-500'>
                                                        ({example.offset})
                                                    </span>
                                                </p>
                                                <p className='text-default-500'>
                                                    Parses to UTC day {example.utcDate}
                                                    {example.shifted ? ' ← day shifted' : ''}
                                                </p>
                                            </div>
                                            <code className='font-mono text-[11px] text-primary-600'>
                                                {example.isoString}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.isDateOnly && (
                            <Alert
                                color='success'
                                description='Date-only strings are parsed as UTC per the ECMAScript spec. This is safe.'
                            />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='rounded-lg bg-default-100 p-4 text-center text-sm text-default-400'
                    >
                        Invalid date string — try a different format
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='mt-4 rounded-lg border border-default-200 p-3'>
                <p className='text-xs font-medium text-default-500'>
                    The ECMAScript Rule
                </p>
                <div className='mt-2 space-y-1 text-xs text-default-400'>
                    <p>
                        <span className='font-mono text-success-500'>YYYY-MM-DD</span>{' '}
                        (date-only) → parsed as <strong>UTC</strong>
                    </p>
                    <p>
                        <span className='font-mono text-danger-500'>
                            YYYY-MM-DDTHH:mm:ss
                        </span>{' '}
                        (no Z/offset) → parsed as <strong>local time on the parsing machine</strong>
                    </p>
                    <p>
                        <span className='font-mono text-success-500'>
                            YYYY-MM-DDTHH:mm:ssZ
                        </span>{' '}
                        (with Z or offset) → parsed as <strong>UTC</strong>
                    </p>
                </div>
            </div>
        </DemoContainer>
    )
}

function Row({
    label,
    value,
    mono,
    highlight
}: {
    label: string
    value: string
    mono?: boolean
    highlight?: 'success' | 'danger' | 'warning'
}) {
    const colorMap = {
        success: 'text-success-600',
        danger: 'text-danger-600',
        warning: 'text-warning-600'
    }

    return (
        <div className='flex items-baseline justify-between gap-4'>
            <span className='shrink-0 text-xs text-default-400'>{label}</span>
            <span
                className={`text-right text-xs ${mono ? 'font-mono' : ''} ${highlight ? colorMap[highlight] : 'text-foreground'}`}
            >
                {value}
            </span>
        </div>
    )
}
