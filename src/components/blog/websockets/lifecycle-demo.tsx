'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import {
  IconLoader,
  IconCircleCheck,
  IconCircleMinus,
  IconCircleX
} from '@tabler/icons-react'
import { AnimatedBeam } from '@/components/ui/beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import DemoContainer from './demo-container'
import IconCard from './icon-card'

const STATES = [
  {
    name: 'CONNECTING',
    code: 0,
    color: 'warning',
    icon: IconLoader,
    description: 'Connection is being established.',
    trigger: 'new WebSocket(url) called',
    event: '—'
  },
  {
    name: 'OPEN',
    code: 1,
    color: 'success',
    icon: IconCircleCheck,
    description: 'Connection is open, ready to communicate.',
    trigger: 'Handshake completed',
    event: 'onopen'
  },
  {
    name: 'CLOSING',
    code: 2,
    color: 'warning',
    icon: IconCircleMinus,
    description: 'Connection is going through the closing handshake.',
    trigger: 'close() called or server closing',
    event: 'onclose (pending)'
  },
  {
    name: 'CLOSED',
    code: 3,
    color: 'default',
    icon: IconCircleX,
    description: 'Connection has been closed or could not be opened.',
    trigger: 'Close handshake completed or error',
    event: 'onclose'
  }
] as const

const stateColors: Record<string, string> = {
  warning: 'bg-warning-400',
  success: 'bg-success-400',
  default: 'bg-default-400'
}

const stateTextColors: Record<string, string> = {
  warning: 'text-warning-600 dark:text-warning-400',
  success: 'text-success-600 dark:text-success-400',
  default: 'text-default-500'
}

export default function LifecycleDemo() {
  const [activeState, setActiveState] = useState(1) // Start at OPEN
  const [pingPongActive, setPingPongActive] = useState(true)
  const [ghostMode, setGhostMode] = useState(false)
  const [pongCount, setPongCount] = useState(0)
  const [status, setStatus] = useState('Heartbeat active')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ghostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const serverPingRef = useRef<HTMLDivElement>(null)
  const clientPongRef = useRef<HTMLDivElement>(null)

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (ghostTimerRef.current) {
      clearTimeout(ghostTimerRef.current)
      ghostTimerRef.current = null
    }
  }, [])

  const handleKillClient = useCallback(() => {
    setGhostMode(true)
    setPingPongActive(false)
    setStatus('No PONG received... detecting ghost connection')

    ghostTimerRef.current = setTimeout(() => {
      setActiveState(2)
      setStatus('Server closing dead connection...')

      ghostTimerRef.current = setTimeout(() => {
        setActiveState(3)
        setStatus('Connection closed (ghost detected)')
      }, 1500)
    }, 2500)
  }, [])

  const handleReset = useCallback(() => {
    cleanup()
    setGhostMode(false)
    setPingPongActive(true)
    setPongCount(0)
    setActiveState(1)
    setStatus('Heartbeat active')
  }, [cleanup])

  useEffect(() => {
    if (activeState === 1 && pingPongActive && !ghostMode) {
      timerRef.current = setInterval(() => {
        setPongCount(c => c + 1)
      }, 2500)
    }
    return cleanup
  }, [activeState, pingPongActive, ghostMode, cleanup])

  return (
    <DemoContainer
      title='WebSocket Connection Lifecycle'
      description='Click a state to explore. Watch ping-pong heartbeats keep the connection alive.'
    >
      {/* State machine timeline */}
      <div className='mb-6 flex items-center justify-between overflow-x-auto px-2'>
        {STATES.map((s, i) => {
          const Icon = s.icon
          const isActive = activeState === i
          return (
            <div key={s.name} className='flex items-center'>
              <button
                onClick={() => {
                  if (!ghostMode) {
                    cleanup()
                    setActiveState(i)
                    setPingPongActive(i === 1)
                    setStatus(
                      i === 1 ? 'Heartbeat active' : `State: ${s.name}`
                    )
                  }
                }}
                className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 transition-all sm:px-3 ${
                  isActive
                    ? 'scale-105'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? stateColors[s.color]
                      : 'bg-default-200 dark:bg-default-700'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-white' : 'text-default-500'}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isActive
                      ? stateTextColors[s.color]
                      : 'text-default-400'
                  }`}
                >
                  {s.name}
                </span>
                <span className='font-mono text-[10px] text-default-400'>
                  ({s.code})
                </span>
              </button>
              {i < 3 && (
                <div
                  className={`mx-1 h-px w-4 sm:w-8 ${
                    i < activeState
                      ? 'bg-primary-300'
                      : 'bg-default-200 dark:bg-default-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* State info */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeState}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className='mb-4 rounded-md bg-default-100 px-4 py-3 dark:bg-default-50'
        >
          <div className='flex flex-wrap gap-x-6 gap-y-1 text-xs'>
            <span className='text-default-500'>
              <span className='text-default-400'>Trigger:</span>{' '}
              {STATES[activeState].trigger}
            </span>
            <span className='text-default-500'>
              <span className='text-default-400'>Event:</span>{' '}
              <span className='font-mono text-primary-500'>
                {STATES[activeState].event}
              </span>
            </span>
          </div>
          <p className='mt-1 text-xs text-default-500'>
            {STATES[activeState].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Ping-pong visualization (only when OPEN) */}
      <motion.div
        initial={false}
        animate={{
          height: activeState === 1 ? 'auto' : 0,
          opacity: activeState === 1 ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='overflow-hidden'
      >
        <div
          ref={containerRef}
          className='relative mb-4 flex items-center justify-between rounded-lg border border-default-100 bg-background px-10 py-8'
        >
          <DotPattern
            width={16}
            height={16}
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <IconCard ref={serverPingRef} label='Server'>
            <IconCircleCheck size={28} />
          </IconCard>

          <div className='flex flex-col items-center gap-1'>
            <span
              className={`text-xs font-medium ${
                ghostMode
                  ? 'text-danger-500'
                  : 'text-success-600 dark:text-success-400'
              }`}
            >
              {status}
            </span>
            {!ghostMode && (
              <span className='font-mono text-[10px] text-default-400'>
                pong count: {pongCount}
              </span>
            )}
          </div>

          <IconCard
            ref={clientPongRef}
            label='Client'
            className={ghostMode ? 'opacity-30' : ''}
          >
            <IconLoader size={28} />
          </IconCard>

          {/* PING: server → client */}
          {pingPongActive && (
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={serverPingRef}
              toRef={clientPongRef}
              startYOffset={-6}
              endYOffset={-6}
              curvature={-15}
              duration={2}
              gradientStartColor='#f59e0b'
              gradientStopColor='#22c55e'
            />
          )}

          {/* PONG: client → server */}
          {pingPongActive && !ghostMode && (
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={clientPongRef}
              toRef={serverPingRef}
              startYOffset={6}
              endYOffset={6}
              curvature={15}
              duration={2}
              delay={0.8}
              gradientStartColor='#22c55e'
              gradientStopColor='#f59e0b'
              reverse
            />
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className='flex justify-center gap-3'>
        {activeState === 1 && !ghostMode && (
          <Button
            size='sm'
            variant='flat'
            color='danger'
            onPress={handleKillClient}
          >
            Kill Client
          </Button>
        )}
        {(ghostMode || activeState === 3) && (
          <Button size='sm' variant='flat' color='primary' onPress={handleReset}>
            Reset
          </Button>
        )}
      </div>
    </DemoContainer>
  )
}
