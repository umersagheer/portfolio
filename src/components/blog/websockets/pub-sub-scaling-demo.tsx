'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tabs, Tab } from '@heroui/react'
import {
  IconServer,
  IconUser,
  IconDatabase
} from '@tabler/icons-react'
import { AnimatedBeam } from '@/components/ui/beam'
import DemoContainer from './demo-container'
import IconCard from './icon-card'

type Mode = 'single' | 'no-broker' | 'redis'

export default function PubSubScalingDemo() {
  const [mode, setMode] = useState<Mode>('single')
  const [animating, setAnimating] = useState(false)
  const [animStep, setAnimStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Single server refs
  const singleContainerRef = useRef<HTMLDivElement>(null)
  const singleServerRef = useRef<HTMLDivElement>(null)
  const singleAliceRef = useRef<HTMLDivElement>(null)
  const singleBobRef = useRef<HTMLDivElement>(null)

  // Multi-server refs
  const multiContainerRef = useRef<HTMLDivElement>(null)
  const server1Ref = useRef<HTMLDivElement>(null)
  const server2Ref = useRef<HTMLDivElement>(null)
  const aliceRef = useRef<HTMLDivElement>(null)
  const bobRef = useRef<HTMLDivElement>(null)
  const redisRef = useRef<HTMLDivElement>(null)

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const sendMessage = useCallback(() => {
    if (animating) return
    setAnimating(true)
    setAnimStep(1) // Alice → Server

    if (mode === 'single') {
      timerRef.current = setTimeout(() => {
        setAnimStep(2) // Server → Bob
        timerRef.current = setTimeout(() => {
          setAnimating(false)
          setAnimStep(0)
        }, 2000)
      }, 1500)
    } else if (mode === 'no-broker') {
      timerRef.current = setTimeout(() => {
        setAnimStep(2) // Failed — show X
        timerRef.current = setTimeout(() => {
          setAnimating(false)
          setAnimStep(0)
        }, 2500)
      }, 1500)
    } else {
      // redis mode
      timerRef.current = setTimeout(() => {
        setAnimStep(2) // Server 1 → Redis
        timerRef.current = setTimeout(() => {
          setAnimStep(3) // Redis → Server 2
          timerRef.current = setTimeout(() => {
            setAnimStep(4) // Server 2 → Bob
            timerRef.current = setTimeout(() => {
              setAnimating(false)
              setAnimStep(0)
            }, 2000)
          }, 1200)
        }, 1200)
      }, 1500)
    }
  }, [animating, mode])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  useEffect(() => {
    setAnimating(false)
    setAnimStep(0)
    cleanup()
  }, [mode, cleanup])

  const statusText = () => {
    if (!animating && animStep === 0) {
      if (mode === 'single') return 'Works! But can you scale?'
      if (mode === 'no-broker') return 'Bob is on a different server'
      return 'Ready — press Send Message'
    }
    if (mode === 'single') {
      if (animStep === 1) return 'Alice → Server...'
      return 'Server → Bob ✓'
    }
    if (mode === 'no-broker') {
      if (animStep === 1) return 'Alice → Server 1...'
      return 'Message lost — Bob is on Server 2'
    }
    // redis
    if (animStep === 1) return 'Alice → Server 1...'
    if (animStep === 2) return 'Server 1 → Redis (PUBLISH)...'
    if (animStep === 3) return 'Redis → Server 2 (SUBSCRIBE)...'
    return 'Server 2 → Bob ✓ Delivered via pub/sub!'
  }

  return (
    <DemoContainer
      title='Scaling WebSockets with Pub/Sub'
      description='See why a single server works but horizontal scaling needs a message broker'
    >
      <Tabs
        size='sm'
        variant='bordered'
        selectedKey={mode}
        onSelectionChange={key => setMode(key as Mode)}
        className='mb-4'
      >
        <Tab key='single' title='Single Server' />
        <Tab key='no-broker' title='Multi (No Broker)' />
        <Tab key='redis' title='Multi + Redis' />
      </Tabs>

      <AnimatePresence mode='wait'>
        {/* Single Server */}
        {mode === 'single' && (
          <motion.div
            key='single'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={singleContainerRef}
            className='relative flex items-center justify-between rounded-lg border border-default-200 bg-background px-6 py-8 sm:px-10'
          >
            <IconCard ref={singleAliceRef} label='Alice'>
              <IconUser size={28} />
            </IconCard>

            <IconCard ref={singleServerRef} label='Server'>
              <IconServer size={28} />
            </IconCard>

            <IconCard ref={singleBobRef} label='Bob'>
              <IconUser size={28} />
            </IconCard>

            {/* Alice → Server */}
            {(animStep >= 1 || !animating) && (
              <AnimatedBeam
                containerRef={singleContainerRef}
                fromRef={singleAliceRef}
                toRef={singleServerRef}
                duration={2}
                gradientStartColor='#7c3aed'
                gradientStopColor='#3b82f6'
              />
            )}
            {/* Server → Bob */}
            {(animStep >= 2 || !animating) && (
              <AnimatedBeam
                containerRef={singleContainerRef}
                fromRef={singleServerRef}
                toRef={singleBobRef}
                duration={2}
                gradientStartColor='#3b82f6'
                gradientStopColor='#22c55e'
              />
            )}
          </motion.div>
        )}

        {/* Multi-Server (No Broker or with Redis) */}
        {(mode === 'no-broker' || mode === 'redis') && (
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={multiContainerRef}
            className='relative flex flex-col items-center gap-6 rounded-lg border border-default-200 bg-background px-6 py-8 sm:px-10'
          >
            {/* Top row: Alice — Server1 — [Redis] — Server2 — Bob */}
            <div className='flex w-full items-center justify-between'>
              <IconCard ref={aliceRef} label='Alice'>
                <IconUser size={28} />
              </IconCard>

              <IconCard ref={server1Ref} label='Server 1'>
                <IconServer size={28} />
              </IconCard>

              {mode === 'redis' ? (
                <IconCard
                  ref={redisRef}
                  label='Redis'
                  className='border-danger-300 dark:border-danger-800'
                >
                  <IconDatabase size={28} />
                </IconCard>
              ) : (
                <div className='flex flex-col items-center'>
                  {animStep >= 2 && animating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='flex size-10 items-center justify-center rounded-full bg-danger-100 text-lg font-bold text-danger-500 dark:bg-danger-950'
                    >
                      ✕
                    </motion.div>
                  )}
                  {(!animating || animStep < 2) && (
                    <div className='h-px w-8 bg-default-200' />
                  )}
                </div>
              )}

              <IconCard ref={server2Ref} label='Server 2'>
                <IconServer size={28} />
              </IconCard>

              <IconCard
                ref={bobRef}
                label='Bob'
                className={
                  mode === 'no-broker' && animStep >= 2 && animating
                    ? 'opacity-30'
                    : ''
                }
              >
                <IconUser size={28} />
              </IconCard>
            </div>

            {/* Beams for multi-server modes */}
            {/* Alice → Server 1 */}
            {animStep >= 1 && animating && (
              <AnimatedBeam
                containerRef={multiContainerRef}
                fromRef={aliceRef}
                toRef={server1Ref}
                duration={1.8}
                gradientStartColor='#7c3aed'
                gradientStopColor='#3b82f6'
              />
            )}

            {mode === 'redis' && (
              <>
                {/* Server 1 → Redis */}
                {animStep >= 2 && animating && (
                  <AnimatedBeam
                    containerRef={multiContainerRef}
                    fromRef={server1Ref}
                    toRef={redisRef}
                    duration={1.5}
                    gradientStartColor='#3b82f6'
                    gradientStopColor='#ef4444'
                  />
                )}
                {/* Redis → Server 2 */}
                {animStep >= 3 && animating && (
                  <AnimatedBeam
                    containerRef={multiContainerRef}
                    fromRef={redisRef}
                    toRef={server2Ref}
                    duration={1.5}
                    gradientStartColor='#ef4444'
                    gradientStopColor='#3b82f6'
                  />
                )}
                {/* Server 2 → Bob */}
                {animStep >= 4 && animating && (
                  <AnimatedBeam
                    containerRef={multiContainerRef}
                    fromRef={server2Ref}
                    toRef={bobRef}
                    duration={1.8}
                    gradientStartColor='#3b82f6'
                    gradientStopColor='#22c55e'
                  />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status + Send button */}
      <div className='mt-4 flex flex-col items-center gap-3'>
        <AnimatePresence mode='wait'>
          <motion.span
            key={statusText()}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`text-xs font-medium ${
              mode === 'no-broker' && animStep >= 2
                ? 'text-danger-500'
                : mode === 'redis' && animStep >= 4
                  ? 'text-success-500'
                  : 'text-default-500'
            }`}
          >
            {statusText()}
          </motion.span>
        </AnimatePresence>
        <Button
          size='sm'
          variant='flat'
          color='primary'
          isDisabled={animating}
          onPress={sendMessage}
        >
          Send Message
        </Button>
      </div>
    </DemoContainer>
  )
}
