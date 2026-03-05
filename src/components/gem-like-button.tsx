'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import axios from 'axios'

type GemLikeButtonProps = {
  postId: string
  size?: 'sm' | 'md'
}

type Particle = {
  id: number
  angle: number
  distance: number
  size: number
  hue: number
}

const MAX_CLICKS = 10
const VID_KEY = 'sparkle_vid'

const PRISMATIC_HUES = [280, 260, 310, 200, 330, 240, 290, 180]

const MAX_LABELS = ['Maxed out!', 'Stack overflow!', '409 Conflict', 'Heap full!', 'Overflow!']

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
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = 523.25 // C5
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)

    setTimeout(() => ctx.close(), 200)
  } catch {
    // Web Audio not available
  }
}

function getGemFill(intensity: number): string {
  // Interpolate from pale lavender (hsl 270 60% 85%) to vivid violet (hsl 270 90% 45%)
  const s = 60 + intensity * 30
  const l = 85 - intensity * 40
  return `hsl(270, ${s}%, ${l}%)`
}

function getGemHighlight(intensity: number): string {
  const l = 92 - intensity * 15
  return `hsl(270, 80%, ${l}%)`
}

function getGemShadow(intensity: number): string {
  const l = 70 - intensity * 35
  return `hsl(275, 85%, ${l}%)`
}

function getGemDark(intensity: number): string {
  const l = 55 - intensity * 30
  return `hsl(280, 90%, ${l}%)`
}

export default function GemLikeButton({
  postId,
  size = 'md'
}: GemLikeButtonProps) {
  const [globalCount, setGlobalCount] = useState(0)
  const [userClicks, setUserClicks] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [showMaxLabel, setShowMaxLabel] = useState(false)
  const [maxLabel, setMaxLabel] = useState('')
  const particleId = useRef(0)
  const isMounted = useRef(false)
  const visitorId = useRef('')
  const fingerprint = useRef('')
  const gemControls = useAnimation()

  const baseSize = size === 'sm' ? 36 : 48

  useEffect(() => {
    isMounted.current = true
    visitorId.current = getVisitorId()
    fingerprint.current = generateFingerprint()

    axios
      .get(`/api/posts/${postId}/likes`, {
        params: { vid: visitorId.current, fp: fingerprint.current }
      })
      .then(({ data }) => {
        if (!isMounted.current) return
        setGlobalCount(data.globalCount)
        setUserClicks(data.userCount)
        if (data.visitorId && data.visitorId !== visitorId.current) {
          visitorId.current = data.visitorId
          localStorage.setItem(VID_KEY, data.visitorId)
        }
      })
      .catch(() => {})

    return () => {
      isMounted.current = false
    }
  }, [postId])

  const spawnParticles = useCallback(() => {
    const count = 6 + Math.floor(Math.random() * 3) // 6-8
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6
      newParticles.push({
        id: particleId.current++,
        angle,
        distance: 25 + Math.random() * 30,
        size: 2 + Math.random() * 4,
        hue: PRISMATIC_HUES[i % PRISMATIC_HUES.length]
      })
    }
    setParticles(prev => [...prev, ...newParticles])

    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id))
      setParticles(prev => prev.filter(p => !ids.has(p.id)))
    }, 700)
  }, [])

  const handleClick = useCallback(async () => {
    playClickTone()
    spawnParticles()

    // Spring squash animation
    gemControls.start({
      scale: [1, 0.7, 1.2, 1],
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15,
        duration: 0.5
      }
    })

    if (userClicks >= MAX_CLICKS) {
      setMaxLabel(MAX_LABELS[Math.floor(Math.random() * MAX_LABELS.length)])
      setShowMaxLabel(true)
      setTimeout(() => setShowMaxLabel(false), 1200)
      return
    }

    setUserClicks(prev => prev + 1)
    setGlobalCount(prev => prev + 1)

    try {
      const { data } = await axios.post(`/api/posts/${postId}/likes`, {
        visitorId: visitorId.current,
        fingerprint: fingerprint.current
      })
      if (isMounted.current) {
        setGlobalCount(data.globalCount)
        setUserClicks(data.userCount)
      }
    } catch {}
  }, [postId, userClicks, spawnParticles, gemControls])

  const intensity = userClicks / MAX_CLICKS
  const gemScale = 1 + intensity * 0.12

  const fillColor = getGemFill(intensity)
  const highlightColor = getGemHighlight(intensity)
  const shadowColor = getGemShadow(intensity)
  const darkColor = getGemDark(intensity)

  const glowOpacity = 0.15 + intensity * 0.6
  const glowSpread = 4 + intensity * 18

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        type='button'
        onClick={handleClick}
        aria-label={`Like this post (${userClicks} of ${MAX_CLICKS})`}
        className='relative flex cursor-pointer items-center justify-center'
      >
        <motion.div
          className='relative'
          animate={gemControls}
          whileHover={{ scale: 1.1 }}
          style={{
            width: baseSize * gemScale,
            height: baseSize * gemScale * 1.2,
            filter: `drop-shadow(0 0 ${glowSpread}px rgba(168, 85, 247, ${glowOpacity}))`
          }}
        >
          <svg
            viewBox='0 0 100 120'
            width='100%'
            height='100%'
            xmlns='http://www.w3.org/2000/svg'
          >
            {/* Gem shape: diamond with faceted top */}
            {/* Top triangle (crown) */}
            <polygon
              points='50,0 20,35 80,35'
              fill={highlightColor}
              stroke={darkColor}
              strokeWidth='1.5'
            />
            {/* Top-left facet */}
            <polygon
              points='50,0 20,35 35,35'
              fill={fillColor}
              opacity='0.8'
            />
            {/* Top-right facet */}
            <polygon
              points='50,0 65,35 80,35'
              fill={shadowColor}
              opacity='0.7'
            />
            {/* Center band left */}
            <polygon
              points='20,35 5,50 50,50 35,35'
              fill={fillColor}
            />
            {/* Center band right */}
            <polygon
              points='80,35 95,50 50,50 65,35'
              fill={shadowColor}
            />
            {/* Bottom-left pavilion */}
            <polygon
              points='5,50 50,120 50,50'
              fill={shadowColor}
              opacity='0.85'
            />
            {/* Bottom-right pavilion */}
            <polygon
              points='95,50 50,120 50,50'
              fill={darkColor}
              opacity='0.75'
            />
            {/* Highlight shine */}
            <polygon
              points='50,0 35,35 50,50'
              fill='white'
              opacity={0.15 + intensity * 0.2}
            />
            {/* Outer stroke */}
            <polygon
              points='50,0 20,35 5,50 50,120 95,50 80,35'
              fill='none'
              stroke={darkColor}
              strokeWidth='2'
              strokeLinejoin='round'
            />
          </svg>

          {/* Pulsing ring at high intensity */}
          {intensity > 0.3 && (
            <motion.div
              className='pointer-events-none absolute inset-0'
              animate={{
                scale: [1, 1.4, 1],
                opacity: [intensity * 0.3, 0, intensity * 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <svg
                viewBox='0 0 100 120'
                width='100%'
                height='100%'
                xmlns='http://www.w3.org/2000/svg'
              >
                <polygon
                  points='50,0 20,35 5,50 50,120 95,50 80,35'
                  fill='none'
                  stroke={`hsla(270, 80%, 60%, ${intensity * 0.4})`}
                  strokeWidth='1.5'
                  strokeLinejoin='round'
                />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Prismatic ray particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              className='pointer-events-none absolute'
              style={{
                width: p.size,
                height: p.size * 2.5,
                background: `linear-gradient(to bottom, hsla(${p.hue}, 90%, 70%, 0.9), hsla(${p.hue}, 80%, 50%, 0))`,
                borderRadius: '50%',
                transformOrigin: 'center center',
                rotate: `${(p.angle * 180) / Math.PI + 90}deg`
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 1.5
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Max label */}
        <AnimatePresence>
          {showMaxLabel && (
            <motion.span
              className='pointer-events-none absolute -top-8 whitespace-nowrap text-xs font-semibold text-purple-400'
              initial={{ y: 4, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {maxLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Animated count */}
      <motion.span
        className='text-xs text-default-400'
        key={globalCount}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {globalCount.toLocaleString()}
      </motion.span>
    </div>
  )
}
