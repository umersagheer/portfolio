'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import DemoContainer from './demo-container'

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
        const inputDate = input.split('T')[0].replace(/'/g, '')
        const hasExplicitTimezone = /[Zz]|[+-]\d{2}:\d{2}$/.test(input)
        const isDateOnly = !input.includes('T') && !input.includes(' ')
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

export default function ParseTrapDemo() {
    const [input, setInput] = useState("'2026-03-29T00:00:00'")
    const [activePreset, setActivePreset] = useState(1)

    const cleanInput = input.replace(/^['"]|['"]$/g, '')
    const result = parseAndAnalyze(cleanInput)

    const handlePreset = (index: number) => {
        setActivePreset(index)
        setInput(PRESETS[index].label)
    }

    const isTrapped =
        result && !result.parsedAsUTC && !result.isDateOnly && result.dateShifted

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
                <input
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
                        <div className='grid gap-2 rounded-lg bg-default-100 p-4 dark:bg-default-50'>
                            <Row label='Input' value={`new Date(${input})`} mono />
                            <Row
                                label='.toISOString()'
                                value={result.isoString}
                                mono
                                highlight={isTrapped ? 'danger' : 'success'}
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
                                            : 'Local time (no Z, no offset → spec says local!)'
                                }
                                highlight={result.parsedAsUTC ? 'success' : 'danger'}
                            />
                        </div>

                        {isTrapped && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className='flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 p-3 dark:border-danger-900 dark:bg-danger-950/30'
                            >
                                <span className='text-lg'>⚠️</span>
                                <div className='text-xs text-danger-700 dark:text-danger-400'>
                                    <p className='font-medium'>
                                        Date shifted to previous day in UTC!
                                    </p>
                                    <p className='mt-1 text-danger-600 dark:text-danger-500'>
                                        Without &quot;Z&quot; or an offset, JavaScript treats this as
                                        local time and subtracts your timezone offset. Midnight local
                                        time becomes the previous day in UTC.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {result.isDateOnly && (
                            <div className='flex items-start gap-2 rounded-lg border border-success-200 bg-success-50 p-3 dark:border-success-900 dark:bg-success-950/30'>
                                <span className='text-lg'>✅</span>
                                <p className='text-xs text-success-700 dark:text-success-400'>
                                    Date-only strings are parsed as UTC per the ECMAScript spec.
                                    This is safe.
                                </p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='rounded-lg bg-default-100 p-4 text-center text-sm text-default-400 dark:bg-default-50'
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
                        (no Z/offset) → parsed as <strong>local time</strong>
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
        success: 'text-success-600 dark:text-success-400',
        danger: 'text-danger-600 dark:text-danger-400',
        warning: 'text-warning-600 dark:text-warning-400'
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
