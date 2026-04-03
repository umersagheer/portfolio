'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import axios from 'axios'

// Real API integration enabled
const MOCK_API = false

type ChevronLikeButtonProps = {
    postId: string
    size?: 'sm' | 'md'
}

type LikesPayload = {
    globalCount: number
    userCount: number
    visitorId: string
}

const MAX_CLICKS = 5
const VID_KEY = 'sparkle_vid'

const MAX_LABELS = [
    'STACK OVERFLOW',
    '429 RATE LIMITED',
    'BUFFER OVERFLOW',
    'QUOTA EXCEEDED',
    'OUT OF MEMORY',
    'CPU 100%',
    'DISK FULL',
    'SIGSEGV',
    'KERNEL PANIC'
]

const SIZES = {
    md: { button: 32, icon: 28 },
    sm: { button: 24, icon: 18 }
} as const

// 6 discrete color/intensity states (0–5 user clicks)
// glowColor: CSS color string, intensity: opacity for ::before/::after
const GLOW_STEPS = [
    { intensity: 0.15 }, // alive but subtle
    { intensity: 0.25 },
    { intensity: 0.35 },
    { intensity: 0.5 },
    { intensity: 0.65 },
    { intensity: 0.85 }
]

function generateFingerprint(): string {
    const raw = [
        navigator.userAgent,
        navigator.language,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen.width,
        screen.height,
        screen.colorDepth
    ].join('|')

    let hash = 0
    for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i)
        hash |= 0
    }

    return Math.abs(hash).toString(36)
}

function getVisitorId(): string {
    if (typeof window === 'undefined') return ''

    let vid = localStorage.getItem(VID_KEY)
    if (!vid) {
        vid = crypto.randomUUID()
        localStorage.setItem(VID_KEY, vid)
    }

    return vid
}

function playClickTone() {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return

    const ctx = new window.AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(392, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.16)

    window.setTimeout(() => {
        void ctx.close().catch(error => {
            console.error('Failed to close like-button audio context', error)
        })
    }, 220)
}

function playMaxTone() {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return

    const ctx = new window.AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(587, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(293, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.16)

    window.setTimeout(() => {
        void ctx.close().catch(error => {
            console.error('Failed to close like-button audio context', error)
        })
    }, 220)
}

// Decomposed Tabler circle-chevrons-up: just the two chevron arrows (no circle)
// Extracted from the combined path, viewBox 0 0 24 24
function ChevronsUp({ color }: { color: string }) {
    return (
        <g>
            {/* Upper chevron */}
            <path
                d='M12.707 7.293a1 1 0 0 0 -1.414 0l-3 3a1 1 0 0 0 0 1.414l.094 .083a1 1 0 0 0 1.32 -.083l2.292 -2.292l2.293 2.292a1 1 0 0 0 1.414 -1.414z'
                fill={color}
            />
            {/* Lower chevron */}
            <path
                d='M12.707 11.293a1 1 0 0 0 -1.414 0l-3 3a1 1 0 0 0 0 1.414l.094 .083a1 1 0 0 0 1.32 -.083l2.292 -2.292l2.293 2.292a1 1 0 0 0 1.414 -1.414z'
                fill={color}
            />
        </g>
    )
}

export default function ChevronLikeButton({
    postId,
    size = 'md'
}: ChevronLikeButtonProps) {
    const [globalCount, setGlobalCount] = useState(0)
    const [userClicks, setUserClicks] = useState(0)
    const [showMaxLabel, setShowMaxLabel] = useState(false)
    const [maxLabel, setMaxLabel] = useState('')

    const isMounted = useRef(false)
    const visitorId = useRef('')
    const fingerprint = useRef('')
    const timeouts = useRef<number[]>([])

    const buttonControls = useAnimation()
    const chevronControls = useAnimation()
    const countControls = useAnimation()

    const s = SIZES[size]
    const glowStep = GLOW_STEPS[Math.min(userClicks, MAX_CLICKS)]

    // Color transitions from default-500 (muted) → primary across 0→5 clicks
    // Cap at MAX_CLICKS so old data (e.g. 10 clicks from previous limit) doesn't break color-mix
    const clampedClicks = Math.min(userClicks, MAX_CLICKS)
    const fillRatio = clampedClicks / MAX_CLICKS
    const glowColor =
        userClicks === 0
            ? 'hsl(var(--heroui-default-500))'
            : `color-mix(in oklch, hsl(var(--heroui-primary)) ${fillRatio * 100}%, hsl(var(--heroui-default-500)))`

    const scheduleTimeout = useCallback(
        (callback: () => void, delay: number) => {
            const timeout = window.setTimeout(() => {
                timeouts.current = timeouts.current.filter(value => value !== timeout)
                callback()
            }, delay)

            timeouts.current.push(timeout)
        },
        []
    )

    const applyLikesData = useCallback((data: LikesPayload) => {
        if (!isMounted.current) return

        setGlobalCount(data.globalCount)
        setUserClicks(data.userCount)

        if (data.visitorId && data.visitorId !== visitorId.current) {
            visitorId.current = data.visitorId
            localStorage.setItem(VID_KEY, data.visitorId)
        }
    }, [])

    const loadLikes = useCallback(async () => {
        if (MOCK_API) return

        try {
            const { data } = await axios.get<LikesPayload>(
                `/api/posts/${postId}/likes`,
                {
                    params: { vid: visitorId.current, fp: fingerprint.current }
                }
            )

            applyLikesData(data)
        } catch (error) {
            console.error('Failed to load like-button state', error)
        }
    }, [applyLikesData, postId])

    useEffect(() => {
        isMounted.current = true
        visitorId.current = getVisitorId()
        fingerprint.current = generateFingerprint()

        void loadLikes()

        return () => {
            isMounted.current = false
            timeouts.current.forEach(timeout => window.clearTimeout(timeout))
            timeouts.current = []
        }
    }, [loadLikes])

    const handleClick = useCallback(async () => {
        if (userClicks >= MAX_CLICKS) {
            playMaxTone()

            void buttonControls.start({
                x: [0, -4, 4, -3, 3, -1, 1, 0],
                transition: { type: 'spring', stiffness: 600, damping: 12 }
            })

            setMaxLabel(MAX_LABELS[Math.floor(Math.random() * MAX_LABELS.length)])
            setShowMaxLabel(true)
            scheduleTimeout(() => setShowMaxLabel(false), 1200)
            return
        }

        playClickTone()

        // Springy upward bounce on every valid click
        void chevronControls.start({
            y: [0, -3, 2, 0],
            transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
        })

        void countControls.start({
            scale: [1, 1.3, 1],
            transition: { duration: 0.3 }
        })

        setUserClicks(prev => prev + 1)
        setGlobalCount(prev => prev + 1)

        if (!MOCK_API) {
            try {
                const { data } = await axios.post<LikesPayload>(
                    `/api/posts/${postId}/likes`,
                    {
                        visitorId: visitorId.current,
                        fingerprint: fingerprint.current
                    }
                )

                applyLikesData(data)
            } catch (error) {
                console.error('Failed to increment like-button state', error)
                if (isMounted.current) {
                    void loadLikes()
                }
            }
        }
    }, [
        applyLikesData,
        buttonControls,
        chevronControls,
        countControls,
        loadLikes,
        postId,
        scheduleTimeout,
        userClicks
    ])

    return (
        <div className='flex items-center gap-2.5'>
            <motion.button
                type='button'
                role='button'
                onClick={handleClick}
                aria-label={`Like this post (${userClicks} of ${MAX_CLICKS})`}
                aria-pressed={userClicks > 0}
                animate={buttonControls}

                className='neon-glow relative flex cursor-pointer items-center justify-center overflow-visible rounded-full'
                style={
                    {
                        width: s.button,
                        height: s.button,
                        background: 'hsl(var(--heroui-content1))',
                        '--glow-color': glowColor,
                        '--glow-intensity': glowStep.intensity
                    } as React.CSSProperties
                }
            >
                {/* Animated chevrons */}
                <motion.svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={s.icon}
                    height={s.icon}
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    animate={chevronControls}
                    style={{ overflow: 'visible' }}
                >
                    <ChevronsUp color={glowColor} />
                </motion.svg>

                {/* Max-label overlay */}
                <AnimatePresence>
                    {showMaxLabel && (
                        <motion.span
                            className='pointer-events-none absolute -top-8 w-full min-w-32 px-1.5 py-1 text-center font-sourceCodePro text-tiny text-default-500'
                            initial={{ y: 6, opacity: 0, scale: 0.92 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 22
                            }}
                        >
                            {maxLabel}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Global count — to the right */}
            <motion.span
                className='ml-2'
                animate={countControls}
            >
                <NumberFlow
                    value={globalCount}
                    locales='en-US'
                    trend={1}
                    className='text-[11px] font-medium tracking-[0.24em] text-default-500'
                    transformTiming={{ duration: 400, easing: 'ease-out' }}
                    spinTiming={{ duration: 400, easing: 'ease-out' }}
                />
            </motion.span>
        </div>
    )
}
