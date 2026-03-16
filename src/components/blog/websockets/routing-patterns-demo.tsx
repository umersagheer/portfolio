'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, Tab, Button } from '@heroui/react'
import { IconBroadcast, IconMessage } from '@tabler/icons-react'
import { AnimatedBeam } from '@/components/ui/beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import DemoContainer from './demo-container'
import {
  WEBSOCKET_NODE_ICON_SIZE,
  WebSocketPersonIcon,
  WebSocketServerIcon
} from './diagram-icons'
import IconCard from './icon-card'

const CLIENTS = [
  { name: 'Alice', room: 'A' },
  { name: 'Bob', room: 'B' },
  { name: 'Charlie', room: 'A' },
  { name: 'Diana', room: 'B' }
]

type Pattern = 'broadcast' | 'unicast' | 'multicast'

export default function RoutingPatternsDemo() {
  const [pattern, setPattern] = useState<Pattern>('broadcast')
  const [unicastTarget, setUnicastTarget] = useState(0)
  const [multicastRoom, setMulticastRoom] = useState('A')

  const containerRef = useRef<HTMLDivElement>(null)
  const serverRef = useRef<HTMLDivElement>(null)
  const clientRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ]

  const isClientActive = (index: number) => {
    if (pattern === 'broadcast') return true
    if (pattern === 'unicast') return index === unicastTarget
    if (pattern === 'multicast') return CLIENTS[index].room === multicastRoom
    return false
  }

  const label =
    pattern === 'broadcast'
      ? '1 message → 4 deliveries'
      : pattern === 'unicast'
        ? `1 message → ${CLIENTS[unicastTarget].name} only`
        : `1 message → Room ${multicastRoom} members only`

  return (
    <DemoContainer
      title='Message Routing Patterns'
      description='Toggle between patterns to see which clients receive the message'
    >
      <Tabs
        size='sm'
        variant='bordered'
        selectedKey={pattern}
        onSelectionChange={key => setPattern(key as Pattern)}
        className='mb-4'
      >
        <Tab
          key='broadcast'
          title={
            <div className='flex items-center gap-1.5'>
              <IconBroadcast size={14} />
              <span>Broadcast</span>
            </div>
          }
        />
        <Tab
          key='unicast'
          title={
            <div className='flex items-center gap-1.5'>
              <IconMessage size={14} />
              <span>Unicast</span>
            </div>
          }
        />
        <Tab
          key='multicast'
          title={
            <div className='flex items-center gap-1.5'>
              <IconBroadcast size={14} />
              <span>Multicast</span>
            </div>
          }
        />
      </Tabs>

      {/* Controls for unicast/multicast */}
      <AnimatePresence mode='wait'>
        {pattern === 'unicast' && (
          <motion.div
            key='unicast-controls'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='overflow-hidden'
          >
            <div className='mb-4 flex flex-wrap gap-2'>
              {CLIENTS.map((c, i) => (
                <Button
                  key={c.name}
                  size='sm'
                  variant={unicastTarget === i ? 'solid' : 'flat'}
                  color={unicastTarget === i ? 'primary' : 'default'}
                  onPress={() => setUnicastTarget(i)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
        {pattern === 'multicast' && (
          <motion.div
            key='multicast-controls'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='overflow-hidden'
          >
            <div className='mb-4 flex gap-2'>
              <Button
                size='sm'
                variant={multicastRoom === 'A' ? 'solid' : 'flat'}
                color={multicastRoom === 'A' ? 'secondary' : 'default'}
                onPress={() => setMulticastRoom('A')}
              >
                Room A
              </Button>
              <Button
                size='sm'
                variant={multicastRoom === 'B' ? 'solid' : 'flat'}
                color={multicastRoom === 'B' ? 'secondary' : 'default'}
                onPress={() => setMulticastRoom('B')}
              >
                Room B
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagram */}
      <div
        ref={containerRef}
        className='relative flex items-center justify-between rounded-lg border border-default-100 bg-background px-6 py-8 sm:px-10'
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
        {/* Server */}
        <div className='flex flex-col items-center'>
          <IconCard ref={serverRef} label='Server'>
            <WebSocketServerIcon size={WEBSOCKET_NODE_ICON_SIZE} />
          </IconCard>
        </div>

        {/* Clients */}
        <div className='flex flex-col gap-4'>
          {CLIENTS.map((client, i) => {
            const active = isClientActive(i)
            return (
              <motion.div
                key={client.name}
                animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center gap-2'>
                  <IconCard ref={clientRefs[i]}>
                    <WebSocketPersonIcon size={WEBSOCKET_NODE_ICON_SIZE} />
                  </IconCard>
                  <div className='flex flex-col'>
                    <span className='text-xs font-medium text-default-600'>
                      {client.name}
                    </span>
                    {pattern === 'multicast' && (
                      <span
                        className={`text-[10px] ${
                          client.room === multicastRoom
                            ? 'font-semibold text-secondary-500'
                            : 'text-default-400'
                        }`}
                      >
                        Room {client.room}
                      </span>
                    )}
                    {active && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-[10px] text-success-500'
                      >
                        received
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Beams for active clients */}
        {CLIENTS.map((_, i) =>
          isClientActive(i) ? (
            <AnimatedBeam
              key={`beam-${pattern}-${i}-${unicastTarget}-${multicastRoom}`}
              containerRef={containerRef}
              fromRef={serverRef}
              toRef={clientRefs[i]}
              mode='loop'
              duration={1.25}
              repeatDelay={1.2}
              delay={i * 0.15}
              gradientStartColor={
                pattern === 'broadcast'
                  ? '#7c3aed'
                  : pattern === 'unicast'
                    ? '#3b82f6'
                    : '#8b5cf6'
              }
              gradientStopColor={
                pattern === 'broadcast'
                  ? '#3b82f6'
                  : pattern === 'unicast'
                    ? '#22c55e'
                    : '#ec4899'
              }
            />
          ) : null
        )}
      </div>

      {/* Label */}
      <div className='mt-3 flex items-center justify-center'>
        <AnimatePresence mode='wait'>
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className='rounded-full bg-primary-900/40 px-4 py-1.5 text-xs font-medium text-primary-900'
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </DemoContainer>
  )
}
