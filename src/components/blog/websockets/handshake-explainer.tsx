'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import { ChevronRightIcon, PlayIcon, PauseIcon } from 'lucide-react'
import {
  IconSend,
  IconArrowBackUp,
  IconCircleCheck
} from '@tabler/icons-react'
import { AnimatedBeam } from '@/components/ui/beam'
import DemoContainer from './demo-container'
import IconCard from './icon-card'

const ROTATE_OFFSET = 18

function RotatingValue({
  value,
  direction,
  className
}: {
  value: React.ReactNode
  direction: number
  className?: string
}) {
  return (
    <span className={`inline-flex overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={String(value)}
          initial={{ y: direction * ROTATE_OFFSET, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction * -ROTATE_OFFSET, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className='inline-block'
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const steps = [
  {
    label: 'Client Request',
    icon: IconSend,
    beamDirection: 'right' as const,
    highlight: 'Upgrade: websocket',
    code: `GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13`,
    annotations: [
      { header: 'Upgrade: websocket', note: 'Asks to switch protocol' },
      { header: 'Sec-WebSocket-Key', note: 'Random token for verification' },
      { header: 'Sec-WebSocket-Version: 13', note: 'Protocol version (RFC 6455)' }
    ]
  },
  {
    label: 'Server Response',
    icon: IconArrowBackUp,
    beamDirection: 'left' as const,
    highlight: '101 Switching Protocols',
    code: `HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`,
    annotations: [
      { header: '101 Switching Protocols', note: 'Server agrees to upgrade' },
      {
        header: 'Sec-WebSocket-Accept',
        note: 'SHA-1(Key + magic GUID), base64'
      }
    ]
  },
  {
    label: 'Tunnel Established',
    icon: IconCircleCheck,
    beamDirection: 'both' as const,
    highlight: '',
    code: '',
    annotations: []
  }
]

export default function HandshakeExplainer() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevStepRef = useRef(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<HTMLDivElement>(null)
  const serverRef = useRef<HTMLDivElement>(null)

  const current = steps[step]
  const StepIcon = current.icon

  const goTo = useCallback((next: number) => {
    setDirection(next > prevStepRef.current ? 1 : -1)
    prevStepRef.current = next
    setStep(next)
  }, [])

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setPlaying(false)
  }, [])

  const scheduleNext = useCallback(
    (currentStep: number) => {
      if (currentStep >= 2) {
        setPlaying(false)
        return
      }
      timerRef.current = setTimeout(() => {
        const next = currentStep + 1
        goTo(next)
        scheduleNext(next)
      }, 2200)
    },
    [goTo]
  )

  const handlePlayAll = useCallback(() => {
    goTo(0)
    setPlaying(true)
    timerRef.current = setTimeout(() => {
      scheduleNext(0)
    }, 2200)
  }, [scheduleNext, goTo])

  const handleStepClick = useCallback(
    (i: number) => {
      stopAutoPlay()
      goTo(i)
    },
    [stopAutoPlay, goTo]
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <DemoContainer title='Step through the WebSocket handshake'>
      {/* Step indicators */}
      <div className='mb-5 flex flex-col items-center gap-3'>
        <div className='flex items-center gap-3'>
          {steps.map((s, i) => (
            <button
              key={s.label}
              onClick={() => handleStepClick(i)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                i === step
                  ? 'bg-primary-400 text-white'
                  : i < step
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-default-100 text-default-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <Button
          size='sm'
          variant='flat'
          color={playing ? 'primary' : 'default'}
          isDisabled={playing}
          startContent={
            playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />
          }
          onPress={handlePlayAll}
        >
          {playing ? 'Playing...' : 'Play All'}
        </Button>
      </div>

      {/* Client → Server diagram */}
      <div
        ref={containerRef}
        className='relative mb-5 flex items-center justify-between rounded-lg border border-default-200 bg-background px-8 py-6'
      >
        <IconCard ref={clientRef} label='Client'>
          <IconSend size={28} />
        </IconCard>

        <div className='flex flex-col items-center'>
          <RotatingValue
            value={
              <span className='rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300'>
                {current.label}
              </span>
            }
            direction={direction}
          />
        </div>

        <IconCard ref={serverRef} label='Server'>
          <IconCircleCheck size={28} />
        </IconCard>

        {/* Beam animations based on step */}
        {current.beamDirection === 'right' && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={clientRef}
            toRef={serverRef}
            duration={2}
            gradientStartColor='#7c3aed'
            gradientStopColor='#3b82f6'
          />
        )}
        {current.beamDirection === 'left' && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={serverRef}
            toRef={clientRef}
            duration={2}
            gradientStartColor='#22c55e'
            gradientStopColor='#3b82f6'
          />
        )}
        {current.beamDirection === 'both' && (
          <>
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={clientRef}
              toRef={serverRef}
              startYOffset={-6}
              endYOffset={-6}
              curvature={-15}
              duration={2.5}
              gradientStartColor='#7c3aed'
              gradientStopColor='#3b82f6'
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={serverRef}
              toRef={clientRef}
              startYOffset={6}
              endYOffset={6}
              curvature={15}
              duration={2.5}
              gradientStartColor='#22c55e'
              gradientStopColor='#3b82f6'
              reverse
            />
          </>
        )}
      </div>

      {/* Code block or success state */}
      <AnimatePresence mode='wait'>
        {step < 2 ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className='overflow-x-auto rounded-md bg-default-100 p-3 font-mono text-xs leading-relaxed dark:bg-default-50'>
              {current.code.split('\n').map((line, i) => {
                const isHighlighted = current.annotations.some(
                  a =>
                    line.includes(a.header.split(':')[0]) ||
                    line.includes(a.header)
                )
                return (
                  <div
                    key={i}
                    className={
                      isHighlighted
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-default-600 dark:text-default-400'
                    }
                  >
                    {line}
                  </div>
                )
              })}
            </div>

            {/* Annotations */}
            <div className='mt-3 space-y-1.5'>
              {current.annotations.map(a => (
                <div
                  key={a.header}
                  className='flex items-start gap-2 text-xs'
                >
                  <span className='shrink-0 font-mono text-primary-500'>
                    {a.header.length > 30
                      ? a.header.slice(0, 28) + '...'
                      : a.header}
                  </span>
                  <span className='text-default-400'>→ {a.note}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key='established'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex flex-col items-center gap-2 rounded-md bg-success-50 py-6 dark:bg-success-950/30'
          >
            <IconCircleCheck
              size={32}
              className='text-success-500'
            />
            <span className='text-sm font-medium text-success-700 dark:text-success-400'>
              Tunnel Established — Full-Duplex Active
            </span>
            <span className='text-xs text-success-600/70 dark:text-success-500/70'>
              HTTP has been upgraded. Both sides can send data freely.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className='mt-4 flex items-center justify-between'>
        <Button
          size='sm'
          variant='flat'
          isDisabled={step === 0}
          onPress={() => handleStepClick(step - 1)}
        >
          Back
        </Button>
        <div className='flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1.5 dark:bg-primary-950/40'>
          <RotatingValue
            value={<StepIcon size={16} className='shrink-0 text-primary-500' />}
            direction={direction}
          />
          <RotatingValue
            value={
              <span className='text-xs italic text-primary-600 dark:text-primary-400'>
                {step === 0
                  ? 'Client sends HTTP Upgrade request...'
                  : step === 1
                    ? 'Server responds with 101...'
                    : 'WebSocket connection is live!'}
              </span>
            }
            direction={direction}
            className='flex-1'
          />
        </div>
        <Button
          size='sm'
          variant='flat'
          endContent={step < 2 ? <ChevronRightIcon size={14} /> : undefined}
          isDisabled={step === 2}
          onPress={() => handleStepClick(step + 1)}
        >
          {step < 2 ? 'Next' : 'Done'}
        </Button>
      </div>
    </DemoContainer>
  )
}
