'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import axios from 'axios'

// TODO: Set to false to reconnect to real API
const MOCK_API = true

type SleekLikeButtonProps = {
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

// HeroUI-consistent colors
const BG = 'hsl(var(--heroui-content1))'
const BORDER = 'hsl(var(--heroui-default-200))'
const ICON_COLOR = 'hsl(var(--heroui-default-500))'
const ICON_MUTED = 'hsl(var(--heroui-default-300))'

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
  md: { button: 44, radius: 19 },
  sm: { button: 34, radius: 14 }
} as const

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

// Lordicon-style rounded arrow with platform dash (24x24 viewBox)
// Rounded chevron head, fat rounded shaft, rounded platform line
function UpgradeArrow({ color }: { color: string }) {
  return (
    <>
      {/* Chevron head — rounded with arcs */}
      <path
        d='M12 4.5 C12 4.5 12 4.5 12 4.5 L5.5 11.5 C4.8 12.2 5.3 13.5 6.3 13.5 L8.5 13.5 C9.05 13.5 9.5 13.95 9.5 14.5 L9.5 17 C9.5 17.55 9.95 18 10.5 18 L13.5 18 C14.05 18 14.5 17.55 14.5 17 L14.5 14.5 C14.5 13.95 14.95 13.5 15.5 13.5 L17.7 13.5 C18.7 13.5 19.2 12.2 18.5 11.5 L12 4.5 Z'
        fill={color}
      />
      {/* Platform dash */}
      <rect
        x={7}
        y={20}
        width={10}
        height={2}
        rx={1}
        fill={color}
      />
    </>
  )
}

export default function SleekLikeButton({
  postId,
  size = 'md'
}: SleekLikeButtonProps) {
  const [globalCount, setGlobalCount] = useState(0)
  const [userClicks, setUserClicks] = useState(0)
  const [showMaxLabel, setShowMaxLabel] = useState(false)
  const [maxLabel, setMaxLabel] = useState('')
  const [arrowPhase, setArrowPhase] = useState<
    'idle' | 'exiting' | 'entered'
  >('idle')

  const isMounted = useRef(false)
  const visitorId = useRef('')
  const fingerprint = useRef('')
  const timeouts = useRef<number[]>([])
  const prevUserClicks = useRef(0)

  const buttonControls = useAnimation()
  const arrowControls = useAnimation()
  const countControls = useAnimation()

  const s = SIZES[size]
  const cx = s.button / 2
  const cy = s.button / 2
  const completed = userClicks >= MAX_CLICKS

  // Scale 24x24 icon to fit inside circle
  const iconScale = (s.radius * 1.2) / 24
  const iconOffset = cx - 12 * iconScale

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

  // Returning visitor already at max — skip straight to muted state
  useEffect(() => {
    if (userClicks >= MAX_CLICKS && prevUserClicks.current === 0) {
      setArrowPhase('entered')
    }
    prevUserClicks.current = userClicks
  }, [userClicks])

  // 5th click: fly off then enter from bottom
  useEffect(() => {
    if (
      userClicks >= MAX_CLICKS &&
      prevUserClicks.current < MAX_CLICKS &&
      prevUserClicks.current > 0 &&
      arrowPhase === 'idle'
    ) {
      setArrowPhase('exiting')
      scheduleTimeout(() => setArrowPhase('entered'), 350)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClicks, scheduleTimeout])

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

    // Springy upward bounce for clicks 1-4
    if (userClicks + 1 < MAX_CLICKS) {
      void arrowControls.start({
        y: [0, -5, 1, 0],
        transition: { type: 'spring', stiffness: 600, damping: 12 }
      })
    }

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
    arrowControls,
    buttonControls,
    countControls,
    loadLikes,
    postId,
    scheduleTimeout,
    userClicks
  ])

  const iconColor = completed ? ICON_MUTED : ICON_COLOR

  return (
    <div className='flex flex-col items-center gap-2'>
      <motion.button
        type='button'
        role='button'
        onClick={handleClick}
        aria-label={`Like this post (${userClicks} of ${MAX_CLICKS})`}
        aria-pressed={userClicks > 0}
        animate={buttonControls}
        whileHover={!completed ? { scale: 1.08 } : undefined}
        whileTap={!completed ? { scale: 0.9 } : undefined}
        className='relative flex cursor-pointer items-center justify-center'
        style={{
          opacity: completed ? 0.65 : 1,
          cursor: completed ? 'not-allowed' : 'pointer'
        }}
      >
        <svg
          viewBox={`0 0 ${s.button} ${s.button}`}
          width={s.button}
          height={s.button}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <clipPath id={`clip-${size}`}>
              <circle cx={cx} cy={cy} r={s.radius} />
            </clipPath>
          </defs>

          {/* Background circle */}
          <circle
            cx={cx}
            cy={cy}
            r={s.radius + 1.5}
            fill={BG}
            stroke={BORDER}
            strokeWidth={1}
          />

          {/* Arrow — clipped to circle */}
          <g clipPath={`url(#clip-${size})`}>
            <AnimatePresence mode='wait'>
              {arrowPhase === 'exiting' ? (
                <motion.g
                  key='exit'
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -(s.button * 0.7), opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 1, 1] }}
                >
                  <g
                    transform={`translate(${iconOffset}, ${iconOffset}) scale(${iconScale})`}
                  >
                    <UpgradeArrow color={ICON_COLOR} />
                  </g>
                </motion.g>
              ) : arrowPhase === 'entered' ? (
                <motion.g
                  key='enter'
                  initial={{ y: s.button * 0.7, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 18
                  }}
                >
                  <g
                    transform={`translate(${iconOffset}, ${iconOffset}) scale(${iconScale})`}
                  >
                    <UpgradeArrow color={ICON_MUTED} />
                  </g>
                </motion.g>
              ) : (
                <motion.g key='idle' animate={arrowControls}>
                  <g
                    transform={`translate(${iconOffset}, ${iconOffset}) scale(${iconScale})`}
                  >
                    <UpgradeArrow color={iconColor} />
                  </g>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        </svg>

        {/* Max-label overlay */}
        <AnimatePresence>
          {showMaxLabel && (
            <motion.span
              className='pointer-events-none absolute -top-9 w-full min-w-32 px-1.5 py-1 text-center font-sourceCodePro text-tiny text-warning backdrop-blur'
              initial={{ y: 6, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              {maxLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Global count */}
      <motion.span
        className='text-[11px] font-medium tracking-[0.24em] text-default-400'
        animate={countControls}
      >
        {globalCount.toLocaleString()}
      </motion.span>
    </div>
  )
}
