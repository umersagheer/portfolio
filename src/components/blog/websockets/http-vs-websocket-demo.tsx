'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tabs, Tab } from '@heroui/react'
import { AnimatedBeam } from '@/components/ui/beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import DemoContainer from './demo-container'
import {
  WEBSOCKET_NODE_ICON_SIZE,
  WebSocketClientIcon,
  WebSocketServerIcon
} from './diagram-icons'
import IconCard from './icon-card'

type Protocol = 'http' | 'websocket'

export default function HttpVsWebSocketDemo() {
  const [protocol, setProtocol] = useState<Protocol>('http')

  return (
    <DemoContainer title='HTTP vs WebSocket'>
      <Tabs
        size='sm'
        variant='bordered'
        selectedKey={protocol}
        onSelectionChange={key => setProtocol(key as Protocol)}
        className='mb-4'
      >
        <Tab key='http' title='HTTP' />
        <Tab key='websocket' title='WebSocket' />
      </Tabs>

      <AnimatePresence mode='wait'>
        {protocol === 'http' ? (
          <motion.div
            key='http'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HttpMode />
          </motion.div>
        ) : (
          <motion.div
            key='ws'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WebSocketMode />
          </motion.div>
        )}
      </AnimatePresence>
    </DemoContainer>
  )
}

function HttpMode() {
  const [requestCount, setRequestCount] = useState(0)
  const [sending, setSending] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'request' | 'response'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<HTMLDivElement>(null)
  const serverRef = useRef<HTMLDivElement>(null)

  const sendRequest = useCallback(() => {
    if (sending) return
    setSending(true)
    setPhase('request')

    timerRef.current = setTimeout(() => {
      setPhase('response')
      timerRef.current = setTimeout(() => {
        setPhase('idle')
        setSending(false)
        setRequestCount(c => c + 1)
      }, 1500)
    }, 1500)
  }, [sending])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className='relative flex items-center justify-between rounded-lg border border-default-100 bg-background px-8 py-8 sm:px-12'
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
        <IconCard ref={clientRef} label='Client'>
          <WebSocketClientIcon size={WEBSOCKET_NODE_ICON_SIZE} />
        </IconCard>

        <div className='flex flex-col items-center gap-1'>
          <AnimatePresence mode='wait'>
            <motion.span
              key={phase}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                phase === 'idle'
                  ? 'bg-default-100 text-default-500'
                  : phase === 'request'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300'
              }`}
            >
              {phase === 'idle'
                ? 'Connection Closed'
                : phase === 'request'
                  ? 'Sending Request...'
                  : 'Receiving Response...'}
            </motion.span>
          </AnimatePresence>
        </div>

        <IconCard ref={serverRef} label='Server'>
          <WebSocketServerIcon size={WEBSOCKET_NODE_ICON_SIZE} />
        </IconCard>

        {/* Request beam: client → server */}
        {phase === 'request' && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={clientRef}
            toRef={serverRef}
            mode='pulse'
            duration={1.5}
            gradientStartColor='#7c3aed'
            gradientStopColor='#3b82f6'
          />
        )}

        {/* Response beam: server → client */}
        {phase === 'response' && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={serverRef}
            toRef={clientRef}
            mode='pulse'
            duration={1.5}
            gradientStartColor='#22c55e'
            gradientStopColor='#3b82f6'
            reverse
          />
        )}
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <span className='font-mono text-xs text-default-400'>
          {requestCount} request{requestCount !== 1 ? 's' : ''} = {requestCount}{' '}
          connection{requestCount !== 1 ? 's' : ''} opened & closed
        </span>
        <Button
          size='sm'
          variant='flat'
          color='primary'
          isDisabled={sending}
          onPress={sendRequest}
        >
          Send Request
        </Button>
      </div>
    </>
  )
}

function WebSocketMode() {
  const [connected, setConnected] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [handshaking, setHandshaking] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<HTMLDivElement>(null)
  const serverRef = useRef<HTMLDivElement>(null)

  const connect = useCallback(() => {
    if (connected || handshaking) return
    setHandshaking(true)

    timerRef.current = setTimeout(() => {
      setHandshaking(false)
      setConnected(true)
    }, 2000)
  }, [connected, handshaking])

  const sendMessage = useCallback(() => {
    if (!connected) return
    setMessageCount(c => c + 1)
  }, [connected])

  const disconnect = useCallback(() => {
    setConnected(false)
    setHandshaking(false)
    setMessageCount(0)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className='relative flex items-center justify-between rounded-lg border border-default-200 bg-background px-8 py-8 sm:px-12'
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
        <IconCard ref={clientRef} label='Client'>
          <WebSocketClientIcon size={WEBSOCKET_NODE_ICON_SIZE} />
        </IconCard>

        <div className='flex flex-col items-center gap-1'>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
              connected
                ? 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300'
                : handshaking
                  ? 'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300'
                  : 'bg-default-100 text-default-500'
            }`}
          >
            {connected
              ? 'Tunnel Active'
              : handshaking
                ? 'Handshaking...'
                : 'Disconnected'}
          </span>
        </div>

        <IconCard ref={serverRef} label='Server'>
          <WebSocketServerIcon size={WEBSOCKET_NODE_ICON_SIZE} />
        </IconCard>

        {/* Handshake beams */}
        {handshaking && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={clientRef}
            toRef={serverRef}
            mode='pulse'
            duration={2}
            gradientStartColor='#f59e0b'
            gradientStopColor='#7c3aed'
          />
        )}

        {/* Persistent bidirectional tunnel */}
        {connected && (
          <>
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={clientRef}
              toRef={serverRef}
              mode='pulse'
              triggerKey={messageCount === 0 ? undefined : messageCount}
              animateOnMount={false}
              startYOffset={-6}
              endYOffset={-6}
              curvature={-15}
              duration={1.1}
              gradientStartColor='#7c3aed'
              gradientStopColor='#3b82f6'
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={serverRef}
              toRef={clientRef}
              mode='pulse'
              triggerKey={messageCount === 0 ? undefined : messageCount}
              animateOnMount={false}
              startYOffset={6}
              endYOffset={6}
              curvature={15}
              delay={0.35}
              duration={1.1}
              gradientStartColor='#22c55e'
              gradientStopColor='#3b82f6'
              reverse
            />
          </>
        )}
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <span className='font-mono text-xs text-default-400'>
          {messageCount} message{messageCount !== 1 ? 's' : ''}, 1 connection
        </span>
        <div className='flex gap-2'>
          {!connected && !handshaking && (
            <Button size='sm' variant='flat' color='success' onPress={connect}>
              Connect
            </Button>
          )}
          {connected && (
            <>
              <Button
                size='sm'
                variant='flat'
                color='primary'
                onPress={sendMessage}
              >
                Send Message
              </Button>
              <Button
                size='sm'
                variant='flat'
                color='danger'
                onPress={disconnect}
              >
                Disconnect
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
