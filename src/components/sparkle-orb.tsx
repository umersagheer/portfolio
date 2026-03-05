'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

type SparkleOrbProps = {
  postId: string
  size?: 'sm' | 'md'
}

type Particle = {
  id: number
  angle: number
  distance: number
  size: number
}

const MAX_CLICKS = 10
const VID_KEY = 'sparkle_vid'

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

export default function SparkleOrb({
  postId,
  size = 'md'
}: SparkleOrbProps) {
  const [globalCount, setGlobalCount] = useState(0)
  const [userClicks, setUserClicks] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [showMaxLabel, setShowMaxLabel] = useState(false)
  const particleId = useRef(0)
  const isMounted = useRef(false)
  const visitorId = useRef('')
  const fingerprint = useRef('')

  const baseSize = size === 'sm' ? 32 : 40

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
    const count = 6 + Math.floor(Math.random() * 4)
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      newParticles.push({
        id: particleId.current++,
        angle,
        distance: 20 + Math.random() * 25,
        size: 2 + Math.random() * 3
      })
    }
    setParticles(prev => [...prev, ...newParticles])

    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id))
      setParticles(prev => prev.filter(p => !ids.has(p.id)))
    }, 700)
  }, [])

  const handleClick = useCallback(async () => {
    spawnParticles()

    if (userClicks >= MAX_CLICKS) {
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
  }, [postId, userClicks, spawnParticles])

  const intensity = userClicks / MAX_CLICKS

  const orbSize = baseSize + intensity * 8
  const glowOpacity = 0.15 + intensity * 0.6
  const glowSpread = 4 + intensity * 16
  const boxShadow = [
    `0 0 ${glowSpread}px rgba(168, 85, 247, ${glowOpacity})`,
    intensity > 0.3
      ? `0 0 ${glowSpread * 2}px rgba(139, 92, 246, ${glowOpacity * 0.5})`
      : ''
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        type='button'
        onClick={handleClick}
        aria-label={`Like this post (${userClicks} of ${MAX_CLICKS})`}
        className='relative flex cursor-pointer items-center justify-center'
      >
        <motion.div
          className='relative rounded-full'
          style={{
            width: orbSize,
            height: orbSize,
            background: `radial-gradient(circle at 40% 35%,
              rgba(196, 148, 255, ${0.2 + intensity * 0.5}) 0%,
              rgba(139, 92, 246, ${0.15 + intensity * 0.4}) 40%,
              rgba(88, 28, 135, ${0.1 + intensity * 0.3}) 70%,
              rgba(59, 7, 100, ${0.05 + intensity * 0.15}) 100%)`,
            boxShadow
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            scale: 1,
            filter: `brightness(${1 + intensity * 0.4})`
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div
            className='pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full'
            style={{
              width: orbSize * 0.3,
              height: orbSize * 0.2,
              background: `radial-gradient(ellipse, rgba(255, 255, 255, ${0.15 + intensity * 0.35}) 0%, transparent 70%)`
            }}
          />

          {intensity > 0 && (
            <motion.div
              className='pointer-events-none absolute inset-0 rounded-full'
              style={{
                border: `1px solid rgba(168, 85, 247, ${intensity * 0.3})`
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [intensity * 0.4, 0, intensity * 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </motion.div>

        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              className='pointer-events-none absolute rounded-full bg-purple-400'
              style={{ width: p.size, height: p.size }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showMaxLabel && (
            <motion.span
              className='pointer-events-none absolute -top-8 whitespace-nowrap text-xs font-semibold text-purple-400'
              initial={{ y: 4, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Max!
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <motion.span
        className='text-xs text-default-400'
        key={globalCount}
        initial={{ y: -4, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {globalCount.toLocaleString()}
      </motion.span>
    </div>
  )
}
