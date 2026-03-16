'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import axios from 'axios'

type GemLikeButtonProps = {
  postId: string
  size?: 'sm' | 'md'
}

type ParticleKind = 'shard' | 'spark'

type Particle = {
  id: number
  kind: ParticleKind
  angle: number
  distance: number
  size: number
  hue: number
  delay: number
  rotation: number
}

type LikesPayload = {
  globalCount: number
  userCount: number
  visitorId: string
}

const MAX_CLICKS = 10
const VID_KEY = 'sparkle_vid'

const CRYSTAL_HUES = [272, 286, 254, 198, 304, 214]
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

function hsla(hue: number, saturation: number, lightness: number, alpha = 1) {
  return `hsla(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%, ${alpha})`
}

function getParticlePath(kind: ParticleKind) {
  if (kind === 'spark') {
    return 'M12 1 L14.8 9.2 L23 12 L14.8 14.8 L12 23 L9.2 14.8 L1 12 L9.2 9.2 Z'
  }

  return 'M12 1 L18 9 L12 23 L6 9 Z'
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
  const [hovered, setHovered] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const particleId = useRef(0)
  const isMounted = useRef(false)
  const visitorId = useRef('')
  const fingerprint = useRef('')
  const timeouts = useRef<number[]>([])
  const crystalControls = useAnimation()
  const svgId = useId().replace(/:/g, '')

  const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = window.setTimeout(() => {
      timeouts.current = timeouts.current.filter(value => value !== timeout)
      callback()
    }, delay)

    timeouts.current.push(timeout)
  }, [])

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
    try {
      const { data } = await axios.get<LikesPayload>(`/api/posts/${postId}/likes`, {
        params: { vid: visitorId.current, fp: fingerprint.current }
      })

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

  const spawnParticles = useCallback((energy: number) => {
    const count = 5 + Math.round(energy * 4) + Math.floor(Math.random() * 2)
    const newParticles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      newParticles.push({
        id: particleId.current++,
        kind: Math.random() > 0.45 ? 'shard' : 'spark',
        angle,
        distance: 24 + energy * 20 + Math.random() * 18,
        size: 10 + Math.random() * 6 + energy * 5,
        hue: CRYSTAL_HUES[i % CRYSTAL_HUES.length],
        delay: Math.random() * 0.08,
        rotation: Math.random() * 160 - 80
      })
    }

    setParticles(prev => [...prev, ...newParticles])

    scheduleTimeout(() => {
      const ids = new Set(newParticles.map(particle => particle.id))
      setParticles(prev => prev.filter(particle => !ids.has(particle.id)))
    }, 900)
  }, [scheduleTimeout])

  const handleClick = useCallback(async () => {
    const nextIntensity = Math.min(userClicks + 1, MAX_CLICKS) / MAX_CLICKS

    playClickTone()
    spawnParticles(nextIntensity)
    setBurstKey(prev => prev + 1)

    void crystalControls.start({
      scale: [1, 0.88, 1.05, 1],
      rotate: [0, -3, 1.5, 0],
      y: [0, 4, -2, 0],
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.22, 0.7, 1]
      }
    })

    if (userClicks >= MAX_CLICKS) {
      setMaxLabel(MAX_LABELS[Math.floor(Math.random() * MAX_LABELS.length)])
      setShowMaxLabel(true)
      scheduleTimeout(() => setShowMaxLabel(false), 1200)
      return
    }

    setUserClicks(prev => prev + 1)
    setGlobalCount(prev => prev + 1)

    try {
      const { data } = await axios.post<LikesPayload>(`/api/posts/${postId}/likes`, {
        visitorId: visitorId.current,
        fingerprint: fingerprint.current
      })

      applyLikesData(data)
    } catch (error) {
      console.error('Failed to increment like-button state', error)
      if (isMounted.current) {
        void loadLikes()
      }
    }
  }, [
    applyLikesData,
    crystalControls,
    loadLikes,
    postId,
    scheduleTimeout,
    spawnParticles,
    userClicks
  ])

  const intensity = userClicks / MAX_CLICKS
  const accentStrength = Math.max(0, intensity - 0.45) / 0.55

  const baseWidth = size === 'sm' ? 42 : 58
  const crystalWidth = baseWidth + intensity * (size === 'sm' ? 6 : 10)
  const crystalHeight = crystalWidth * 1.2

  const topY = 12 - intensity * 5
  const shoulderY = 34 - intensity * 3
  const leftShoulderX = 34 - intensity * 5
  const rightShoulderX = 120 - leftShoulderX
  const leftEdgeX = 22 - intensity * 7
  const rightEdgeX = 120 - leftEdgeX
  const beltY = 58 + intensity * 3
  const beltInset = 12 - intensity * 2
  const coreTopY = shoulderY + 11 + intensity * 2
  const coreBottomY = 78 + intensity * 8
  const baseY = 112 + intensity * 10

  const outerPath = `M60 ${topY} L${leftShoulderX} ${shoulderY} L${leftEdgeX} ${beltY} L60 ${baseY} L${rightEdgeX} ${beltY} L${rightShoulderX} ${shoulderY} Z`
  const capPath = `M60 ${topY} L${leftShoulderX} ${shoulderY} L60 ${coreTopY} L${rightShoulderX} ${shoulderY} Z`
  const leftFacetPath = `M${leftShoulderX} ${shoulderY} L${leftEdgeX} ${beltY} L${60 - beltInset} ${beltY} L60 ${coreTopY} Z`
  const rightFacetPath = `M${rightShoulderX} ${shoulderY} L${rightEdgeX} ${beltY} L${60 + beltInset} ${beltY} L60 ${coreTopY} Z`
  const corePath = `M60 ${coreTopY} L${60 - beltInset} ${beltY} L60 ${coreBottomY} L${60 + beltInset} ${beltY} Z`
  const leftBasePath = `M${leftEdgeX} ${beltY} L60 ${baseY} L60 ${coreBottomY} L${60 - beltInset} ${beltY} Z`
  const rightBasePath = `M${rightEdgeX} ${beltY} L60 ${baseY} L60 ${coreBottomY} L${60 + beltInset} ${beltY} Z`
  const highlightPath = `M64 ${topY + 9} L79 ${shoulderY + 4} L66 ${beltY - 4} L61 ${beltY - 18} Z`
  const accentPath = `M${60 - beltInset + 2} ${beltY + 2} L60 ${coreBottomY - 8} L${60 + beltInset - 2} ${beltY + 2}`

  const shellTop = hsla(256, 12 + intensity * 20, 9 + intensity * 8)
  const shellMid = hsla(264, 18 + intensity * 38, 11 + intensity * 12)
  const shellBottom = hsla(278, 22 + intensity * 42, 15 + intensity * 16)
  const capStart = hsla(280, 14 + intensity * 54, 18 + intensity * 18)
  const capEnd = hsla(254, 10 + intensity * 28, 11 + intensity * 12)
  const leftFacetFill = hsla(282, 18 + intensity * 60, 14 + intensity * 24, 0.96)
  const rightFacetFill = hsla(250, 14 + intensity * 46, 13 + intensity * 18, 0.96)
  const coreStart = hsla(276, 24 + intensity * 62, 18 + intensity * 24)
  const coreMid = hsla(286, 18 + intensity * 56, 15 + intensity * 20)
  const coreEnd = hsla(
    198 + accentStrength * 16,
    18 + accentStrength * 74,
    16 + intensity * 26
  )
  const leftBaseFill = hsla(274, 18 + intensity * 58, 11 + intensity * 16, 0.96)
  const rightBaseFill = hsla(248, 14 + intensity * 40, 10 + intensity * 12, 0.98)
  const outlineColor = hsla(228 + intensity * 26, 16 + intensity * 46, 32 + intensity * 38, 0.92)
  const seamColor = hsla(220 + accentStrength * 12, 24 + intensity * 36, 62 + intensity * 16, 0.28 + intensity * 0.24)
  const countColor = hsla(236 + intensity * 14, 14 + intensity * 24, 66 + intensity * 14, 0.92)
  const persistentGlowOpacity = intensity === 0 ? 0 : 0.08 + intensity * 0.22
  const auraStroke = hsla(278, 88, 64, 0.36 + intensity * 0.28)
  const auraAccent = hsla(196, 92, 70, 0.18 + accentStrength * 0.36)

  const shellGradientId = `${svgId}-shell-gradient`
  const capGradientId = `${svgId}-cap-gradient`
  const coreGradientId = `${svgId}-core-gradient`
  const innerGlowId = `${svgId}-inner-glow`
  const highlightGradientId = `${svgId}-highlight-gradient`
  const edgeGradientId = `${svgId}-edge-gradient`
  const ambientGradientId = `${svgId}-ambient-gradient`
  const glowFilterId = `${svgId}-glow-filter`

  return (
    <div className='flex flex-col items-center gap-2'>
      <motion.button
        type='button'
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        aria-label={`Like this post (${userClicks} of ${MAX_CLICKS})`}
        aria-pressed={userClicks > 0}
        className='relative flex cursor-pointer items-center justify-center rounded-full'
      >
        <motion.div
          className='relative'
          animate={crystalControls}
          whileHover={{
            scale: 1.04,
            rotate: -0.8 - intensity,
            y: -2
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{
            width: crystalWidth,
            height: crystalHeight
          }}
        >
          <AnimatePresence initial={false}>
            {burstKey > 0 && (
              <motion.svg
                key={burstKey}
                className='pointer-events-none absolute -inset-[20%]'
                viewBox='0 0 120 140'
                fill='none'
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.82, 1.08, 1.2]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <path
                  d={outerPath}
                  stroke={auraStroke}
                  strokeWidth='5'
                  strokeLinejoin='round'
                  strokeLinecap='round'
                  style={{ filter: 'blur(10px)' }}
                />
                <path
                  d={outerPath}
                  stroke={auraAccent}
                  strokeWidth='2'
                  strokeLinejoin='round'
                  strokeLinecap='round'
                />
              </motion.svg>
            )}
          </AnimatePresence>

          <motion.svg
            viewBox='0 0 120 140'
            width='100%'
            height='100%'
            initial={false}
            animate={{
              filter: `saturate(${0.9 + intensity * 0.4}) brightness(${0.94 + intensity * 0.18})`
            }}
            transition={{ duration: 0.25 }}
          >
            <defs>
              <linearGradient id={shellGradientId} x1='50%' y1='0%' x2='50%' y2='100%'>
                <stop offset='0%' stopColor={shellTop} />
                <stop offset='55%' stopColor={shellMid} />
                <stop offset='100%' stopColor={shellBottom} />
              </linearGradient>
              <linearGradient id={capGradientId} x1='20%' y1='12%' x2='80%' y2='100%'>
                <stop offset='0%' stopColor={capStart} />
                <stop offset='100%' stopColor={capEnd} />
              </linearGradient>
              <linearGradient id={coreGradientId} x1='25%' y1='10%' x2='82%' y2='100%'>
                <stop offset='0%' stopColor={coreStart} />
                <stop offset='58%' stopColor={coreMid} />
                <stop offset='100%' stopColor={coreEnd} />
              </linearGradient>
              <radialGradient id={innerGlowId} cx='50%' cy='40%' r='60%'>
                <stop offset='0%' stopColor={hsla(282, 96, 80, 0.48 + intensity * 0.12)} />
                <stop offset='65%' stopColor={hsla(196, 98, 72, accentStrength * 0.35)} />
                <stop offset='100%' stopColor={hsla(280, 100, 50, 0)} />
              </radialGradient>
              <radialGradient id={ambientGradientId} cx='50%' cy='46%' r='52%'>
                <stop offset='0%' stopColor={hsla(278, 96, 66, persistentGlowOpacity)} />
                <stop
                  offset='72%'
                  stopColor={hsla(198, 100, 68, accentStrength * 0.24)}
                />
                <stop offset='100%' stopColor={hsla(280, 100, 50, 0)} />
              </radialGradient>
              <linearGradient
                id={highlightGradientId}
                x1='45%'
                y1='0%'
                x2='70%'
                y2='100%'
              >
                <stop offset='0%' stopColor={hsla(0, 0, 100, 0)} />
                <stop offset='42%' stopColor={hsla(0, 0, 100, 0.78)} />
                <stop offset='100%' stopColor={hsla(0, 0, 100, 0)} />
              </linearGradient>
              <linearGradient id={edgeGradientId} x1='18%' y1='0%' x2='80%' y2='100%'>
                <stop offset='0%' stopColor={hsla(214, 42, 74, 0.5 + intensity * 0.14)} />
                <stop offset='55%' stopColor={outlineColor} />
                <stop offset='100%' stopColor={hsla(192, 88, 72, accentStrength * 0.65)} />
              </linearGradient>
              <filter
                id={glowFilterId}
                x='-60%'
                y='-60%'
                width='220%'
                height='220%'
              >
                <feGaussianBlur stdDeviation='8' />
              </filter>
            </defs>

            <path
              d={outerPath}
              fill={`url(#${ambientGradientId})`}
              filter={`url(#${glowFilterId})`}
              opacity={persistentGlowOpacity}
            />

            <path
              d={outerPath}
              fill={`url(#${shellGradientId})`}
              stroke={outlineColor}
              strokeWidth='1.4'
              strokeLinejoin='round'
            />
            <path d={capPath} fill={`url(#${capGradientId})`} opacity='0.94' />
            <path d={leftFacetPath} fill={leftFacetFill} />
            <path d={rightFacetPath} fill={rightFacetFill} />
            <path d={corePath} fill={`url(#${coreGradientId})`} />
            <path d={corePath} fill={`url(#${innerGlowId})`} opacity={0.16 + intensity * 0.34} />
            <path d={leftBasePath} fill={leftBaseFill} />
            <path d={rightBasePath} fill={rightBaseFill} />

            <motion.path
              d={highlightPath}
              fill={`url(#${highlightGradientId})`}
              initial={false}
              animate={
                hovered
                  ? {
                      opacity: [0, 0.62, 0],
                      x: [-10, 2, 12]
                    }
                  : {
                      opacity: 0.12 + intensity * 0.18,
                      x: -4
                    }
              }
              transition={
                hovered
                  ? {
                      duration: 0.85,
                      ease: 'easeInOut'
                    }
                  : {
                      duration: 0.2
                    }
              }
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center'
              }}
            />

            <path
              d={accentPath}
              fill='none'
              stroke={hsla(196, 94, 72, accentStrength * 0.8)}
              strokeWidth='1.35'
              strokeLinejoin='round'
              strokeLinecap='round'
            />
            <path
              d={`M${leftShoulderX} ${shoulderY} L60 ${coreBottomY}`}
              fill='none'
              stroke={seamColor}
              strokeWidth='1'
            />
            <path
              d={`M${rightShoulderX} ${shoulderY} L60 ${coreBottomY}`}
              fill='none'
              stroke={seamColor}
              strokeWidth='1'
            />
            <path
              d={`M60 ${coreTopY} L60 ${baseY}`}
              fill='none'
              stroke={hsla(0, 0, 100, 0.06 + intensity * 0.16)}
              strokeWidth='1'
            />

            <path
              d={outerPath}
              fill='none'
              stroke={`url(#${edgeGradientId})`}
              strokeWidth='2'
              strokeLinejoin='round'
            />
          </motion.svg>
        </motion.div>

        <AnimatePresence>
          {particles.map(particle => (
            <motion.svg
              key={particle.id}
              className='pointer-events-none absolute left-1/2 top-1/2 overflow-visible'
              viewBox='0 0 24 24'
              style={{
                width: particle.size,
                height: particle.size
              }}
              initial={{
                x: -particle.size / 2,
                y: -particle.size / 2,
                opacity: 0,
                scale: 0.2,
                rotate: particle.rotation - 18
              }}
              animate={{
                x: -particle.size / 2 + Math.cos(particle.angle) * particle.distance,
                y: -particle.size / 2 + Math.sin(particle.angle) * particle.distance,
                opacity: [0, 1, 0],
                scale: [0.2, 1, 0.55],
                rotate: particle.rotation
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{
                duration: 0.7,
                delay: particle.delay,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <path
                d={getParticlePath(particle.kind)}
                fill={hsla(particle.hue, 92, 74, 0.96)}
                stroke={hsla(0, 0, 100, 0.42)}
                strokeWidth='1'
                strokeLinejoin='round'
              />
            </motion.svg>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showMaxLabel && (
            <motion.span
              className='pointer-events-none absolute -top-11 backdrop-blur px-1.5 py-1 text-tiny text-primary-800 font-sourceCodePro w-full min-w-32'
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

      <motion.span
        className='text-[11px] font-medium tracking-[0.24em]'
        style={{ color: countColor }}
        key={globalCount}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        {globalCount.toLocaleString()}
      </motion.span>
    </div>
  )
}
