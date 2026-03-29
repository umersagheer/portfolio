'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import DemoContainer from './demo-container'

type Format = 'iso' | 'dateOnly' | 'noZ' | 'offset' | 'spaced'

const FORMATS: {
    key: Format
    label: string
    raw: string
    segments: { text: string; color: string; label: string }[]
    parsedAs: string
    safe: boolean
    note: string
}[] = [
        {
            key: 'iso',
            label: 'ISO 8601 (UTC)',
            raw: '2026-03-29T14:30:00.000Z',
            segments: [
                { text: '2026', color: 'text-primary-500', label: 'Year' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '03', color: 'text-secondary-500', label: 'Month' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '29', color: 'text-warning-500', label: 'Day' },
                { text: 'T', color: 'text-default-300', label: 'Separator' },
                { text: '14', color: 'text-success-500', label: 'Hours (24h)' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '30', color: 'text-success-500', label: 'Minutes' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Seconds' },
                { text: '.', color: 'text-default-400', label: '' },
                { text: '000', color: 'text-default-400', label: 'Milliseconds' },
                { text: 'Z', color: 'text-danger-500', label: 'UTC (Zulu)' }
            ],
            parsedAs: 'UTC',
            safe: true,
            note: 'The Z means "Zulu time" = UTC. This is what .toISOString() returns and what JSON.stringify uses.'
        },
        {
            key: 'dateOnly',
            label: 'Date only',
            raw: '2026-03-29',
            segments: [
                { text: '2026', color: 'text-primary-500', label: 'Year' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '03', color: 'text-secondary-500', label: 'Month' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '29', color: 'text-warning-500', label: 'Day' }
            ],
            parsedAs: 'UTC (per spec)',
            safe: true,
            note: 'ECMAScript spec says date-only strings are treated as UTC. Safe to use when you only care about the date.'
        },
        {
            key: 'noZ',
            label: 'No Z (trap!)',
            raw: '2026-03-29T00:00:00',
            segments: [
                { text: '2026', color: 'text-primary-500', label: 'Year' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '03', color: 'text-secondary-500', label: 'Month' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '29', color: 'text-warning-500', label: 'Day' },
                { text: 'T', color: 'text-default-300', label: 'Separator' },
                { text: '00', color: 'text-success-500', label: 'Hours' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Minutes' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Seconds' },
                { text: '  ', color: '', label: '' },
                { text: '← no Z!', color: 'text-danger-500', label: 'Missing timezone' }
            ],
            parsedAs: 'LOCAL TIME',
            safe: false,
            note: 'Without Z or an offset, JS treats this as local time. For someone in PKT (UTC+5), midnight local = March 28 19:00 UTC — the previous day!'
        },
        {
            key: 'offset',
            label: 'With offset',
            raw: '2026-03-29T00:00:00+05:00',
            segments: [
                { text: '2026', color: 'text-primary-500', label: 'Year' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '03', color: 'text-secondary-500', label: 'Month' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '29', color: 'text-warning-500', label: 'Day' },
                { text: 'T', color: 'text-default-300', label: 'Separator' },
                { text: '00', color: 'text-success-500', label: 'Hours' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Minutes' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Seconds' },
                { text: '+05:00', color: 'text-danger-500', label: 'UTC+5 offset' }
            ],
            parsedAs: 'UTC (via offset)',
            safe: true,
            note: 'The +05:00 tells JS exactly how to convert to UTC. Midnight in PKT = March 28 19:00 UTC. Explicit and unambiguous.'
        },
        {
            key: 'spaced',
            label: 'Space separator',
            raw: '2026-03-29 00:00:00',
            segments: [
                { text: '2026', color: 'text-primary-500', label: 'Year' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '03', color: 'text-secondary-500', label: 'Month' },
                { text: '-', color: 'text-default-400', label: '' },
                { text: '29', color: 'text-warning-500', label: 'Day' },
                { text: ' ', color: 'text-default-300', label: 'Space (not T)' },
                { text: '00', color: 'text-success-500', label: 'Hours' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Minutes' },
                { text: ':', color: 'text-default-400', label: '' },
                { text: '00', color: 'text-success-500', label: 'Seconds' }
            ],
            parsedAs: 'Varies by browser',
            safe: false,
            note: 'Space instead of T is not part of ISO 8601. Behavior varies across browsers and Node versions. Avoid this format.'
        }
    ]

export default function ISOStringAnatomy() {
    const [active, setActive] = useState<Format>('iso')
    const [hovered, setHovered] = useState<number | null>(null)

    const format = FORMATS.find(f => f.key === active)!

    return (
        <DemoContainer
            title='Anatomy of a Date String'
            description='Hover or tap each part to see what it means — then switch formats to spot the trap'
        >
            <div className='mb-4 flex flex-wrap gap-2'>
                {FORMATS.map(f => (
                    <Button
                        key={f.key}
                        size='sm'
                        variant={active === f.key ? 'solid' : 'flat'}
                        color={
                            active === f.key
                                ? f.safe
                                    ? 'success'
                                    : 'danger'
                                : 'default'
                        }
                        onPress={() => {
                            setActive(f.key)
                            setHovered(null)
                        }}
                        className='text-xs'
                    >
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* The string with hoverable segments */}
            <div className='mb-4 overflow-x-auto rounded-lg bg-default-100 p-4'>
                <div className='flex flex-wrap items-baseline font-mono text-lg font-bold sm:text-xl'>
                    {format.segments.map((seg, i) => {
                        const hasLabel = seg.label !== ''
                        return (
                            <motion.span
                                key={`${active}-${i}`}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={`relative cursor-default ${seg.color} ${hovered === i ? 'scale-110' : ''
                                    } transition-transform`}
                                onMouseEnter={() => hasLabel && setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() =>
                                    hasLabel && setHovered(hovered === i ? null : i)
                                }
                            >
                                {seg.text}
                                {hovered === i && hasLabel && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='absolute -top-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] font-medium text-background'
                                    >
                                        {seg.label}
                                    </motion.span>
                                )}
                            </motion.span>
                        )
                    })}
                </div>
            </div>

            {/* Info bar */}
            <div className='grid gap-2 rounded-lg border border-default-200 p-3'>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-500'>Parsed as</span>
                    <span
                        className={`font-mono font-bold ${format.safe ? 'text-success-600' : 'text-danger-600'
                            }`}
                    >
                        {format.parsedAs}
                    </span>
                </div>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-500'>Safe to use?</span>
                    <span
                        className={`font-bold ${format.safe ? 'text-success-600' : 'text-danger-600'
                            }`}
                    >
                        {format.safe ? '✅ Yes' : '❌ No'}
                    </span>
                </div>
                <p className='mt-1 text-xs text-default-500'>{format.note}</p>
            </div>
        </DemoContainer>
    )
}
