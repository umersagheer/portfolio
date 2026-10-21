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
import IconCard from '@/components/blog/shared/icon-card'
import { AnimatedBeam } from '@/components/ui/beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import DemoContainer from './demo-container'
import {
  WEBSOCKET_NODE_ICON_SIZE,
  WebSocketClientIcon,
  WebSocketServerIcon
} from './diagram-icons'

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
  warning: 'bg-warning',
  success: 'bg-success',
  default: 'bg-border-tertiary'
}

const stateTextColors: Record<string, string> = {
  warning: 'text-warning-soft-foreground',
  success: 'text-success-soft-foreground',
  default: 'text-muted'
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
                    setStatus(i === 1 ? 'Heartbeat active' : `State: ${s.name}`)
                  }
                }}
                className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 transition-all sm:px-3 ${
                  isActive ? 'scale-105' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full transition-colors ${
                    isActive ? stateColors[s.color] : 'bg-border-secondary'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-white' : 'text-muted'}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isActive ? stateTextColors[s.color] : 'text-muted'
                  }`}
                >
                  {s.name}
                </span>
                <span className='text-muted font-mono text-[10px]'>
                  ({s.code})
                </span>
              </button>
              {i < 3 && (
                <div
                  className={`mx-1 h-px w-4 sm:w-8 ${
                    i < activeState ? 'bg-accent' : 'bg-border-secondary'
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
          className='bg-surface-secondary dark:bg-surface mb-4 rounded-md px-4 py-3'
        >
          <div className='flex flex-wrap gap-x-6 gap-y-1 text-xs'>
            <span className='text-muted'>
              <span className='text-muted'>Trigger:</span>{' '}
              {STATES[activeState].trigger}
            </span>
            <span className='text-muted'>
              <span className='text-muted'>Event:</span>{' '}
              <span className='text-accent font-mono'>
                {STATES[activeState].event}
              </span>
            </span>
          </div>
          <p className='text-muted mt-1 text-xs'>
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
          className='border-separator bg-background relative mb-4 flex items-center justify-between rounded-lg border px-10 py-8'
        >
          <DotPattern
            glow
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
            <WebSocketServerIcon size={WEBSOCKET_NODE_ICON_SIZE} />
          </IconCard>

          <div className='flex flex-col items-center gap-1'>
            <span
              className={`text-xs font-medium ${
                ghostMode ? 'text-danger' : 'text-success-soft-foreground'
              }`}
            >
              {status}
            </span>
            {!ghostMode && (
              <span className='text-muted font-mono text-[10px]'>
                pong count: {pongCount}
              </span>
            )}
          </div>

          <IconCard
            ref={clientPongRef}
            label='Client'
            className={ghostMode ? 'opacity-30' : ''}
          >
            <WebSocketClientIcon size={WEBSOCKET_NODE_ICON_SIZE} />
          </IconCard>

          {/* PING: server → client */}
          {pingPongActive && (
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={serverPingRef}
              toRef={clientPongRef}
              mode='loop'
              startYOffset={-6}
              endYOffset={-6}
              curvature={-15}
              duration={0.85}
              repeatDelay={1.65}
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
              mode='loop'
              startYOffset={6}
              endYOffset={6}
              curvature={15}
              duration={0.85}
              repeatDelay={1.65}
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
          <Button variant='danger-soft' size='sm' onPress={handleKillClient}>
            Kill Client
          </Button>
        )}
        {(ghostMode || activeState === 3) && (
          <Button variant='secondary' size='sm' onPress={handleReset}>
            Reset
          </Button>
        )}
      </div>
    </DemoContainer>
  )
}
