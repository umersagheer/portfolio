'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Alert } from '@heroui/react'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { AnimatedBeam } from '@/components/ui/beam'
import DemoContainer from './demo-container'

export default function ATTimeZoneTrapDemo() {
  const [showDouble, setShowDouble] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLDivElement>(null)
  const wrongRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  return (
    <DemoContainer
      title='The AT TIME ZONE Trap'
      description='Same timestamp, same SQL keyword — opposite results depending on how you use it'
    >
      <div
        ref={containerRef}
        className='border-separator bg-background relative mb-4 rounded-lg border p-6'
      >
        <p className='text-muted mb-4 text-center text-xs font-medium'>
          Select a query path to compare the output.
        </p>
        <div className='flex flex-col items-center gap-8'>
          {/* Source */}
          <div
            ref={sourceRef}
            className='border-border bg-surface z-10 rounded-lg border px-4 py-3 text-center'
          >
            <p className='text-muted text-[10px]'>
              Stored in DB (timestamp without tz)
            </p>
            <p className='text-foreground font-mono text-lg font-bold'>
              12:00:00
            </p>
            <p className='text-muted text-[10px]'>
              (This is actually noon UTC — a 5 PM PKT order)
            </p>
          </div>

          {/* Two paths */}
          <div className='z-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center sm:gap-8'>
            {/* Wrong path */}
            <motion.button
              type='button'
              aria-pressed={!showDouble}
              aria-label='Inspect the incorrect single AT TIME ZONE query'
              onClick={() => setShowDouble(false)}
              className={`focus-visible:ring-danger flex-1 rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none sm:max-w-xs ${
                !showDouble
                  ? 'border-danger bg-danger-soft'
                  : 'border-border bg-background opacity-60'
              }`}
            >
              <div className='mb-2 flex items-center gap-2'>
                <IconCircleX size={16} className='text-danger' />
                <span className='text-danger text-xs font-medium'>
                  Single AT TIME ZONE
                </span>
              </div>
              <div className='bg-background/60 dark:bg-surface mb-2 overflow-x-auto rounded-md p-2 font-mono text-[10px] leading-relaxed'>
                <span className='text-foreground'>EXTRACT(HOUR FROM</span>
                <br />
                <span className='text-foreground'>
                  {'  '}&quot;createdAt&quot;
                </span>
                <br />
                <span className='text-danger'>
                  {'  '}AT TIME ZONE &apos;Asia/Karachi&apos;
                </span>
                <span className='text-foreground'>)</span>
              </div>
              <div ref={wrongRef} className='text-center'>
                <p className='text-muted text-[10px]'>Result:</p>
                <p className='text-danger font-mono text-xl font-bold'>07:00</p>
                <p className='text-danger text-[10px]'>
                  PostgreSQL assumed 12:00 IS Pakistan time,
                  <br />
                  converted to UTC: 12 − 5 = 7
                </p>
              </div>
            </motion.button>

            {/* Right path */}
            <motion.button
              type='button'
              aria-pressed={showDouble}
              aria-label='Inspect the correct double AT TIME ZONE query'
              onClick={() => setShowDouble(true)}
              className={`focus-visible:ring-success flex-1 rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none sm:max-w-xs ${
                showDouble
                  ? 'border-success bg-success-soft'
                  : 'border-border bg-background opacity-60'
              }`}
            >
              <div className='mb-2 flex items-center gap-2'>
                <IconCircleCheck size={16} className='text-success' />
                <span className='text-success text-xs font-medium'>
                  Double AT TIME ZONE
                </span>
              </div>
              <div className='bg-background/60 mb-2 overflow-x-auto rounded-md p-2 font-mono text-[10px] leading-relaxed'>
                <span className='text-foreground'>EXTRACT(HOUR FROM</span>
                <br />
                <span className='text-foreground'>
                  {'  '}(&quot;createdAt&quot;
                </span>
                <br />
                <span className='text-success'>
                  {'  '}AT TIME ZONE &apos;UTC&apos;)
                </span>
                <br />
                <span className='text-success'>
                  {'  '}AT TIME ZONE &apos;Asia/Karachi&apos;
                </span>
                <span className='text-foreground'>)</span>
              </div>
              <div ref={rightRef} className='text-center'>
                <p className='text-muted text-[10px]'>Result:</p>
                <p className='text-success font-mono text-xl font-bold'>
                  17:00
                </p>
                <p className='text-success text-[10px]'>
                  First labels as UTC → then converts to PKT:
                  <br />
                  12 + 5 = 17 (5 PM local)
                </p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Beams from source to each result */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={sourceRef}
          toRef={wrongRef}
          mode='loop'
          duration={2}
          repeatDelay={1}
          curvature={30}
          gradientStartColor={!showDouble ? '#ef4444' : '#d4d4d8'}
          gradientStopColor={!showDouble ? '#f97316' : '#d4d4d8'}
          pathOpacity={!showDouble ? 0.3 : 0.1}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={sourceRef}
          toRef={rightRef}
          mode='loop'
          duration={2}
          repeatDelay={1}
          curvature={-30}
          gradientStartColor={showDouble ? '#22c55e' : '#d4d4d8'}
          gradientStopColor={showDouble ? '#3b82f6' : '#d4d4d8'}
          pathOpacity={showDouble ? 0.3 : 0.1}
        />
      </div>

      {/* War story */}
      <Alert status='warning'>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Real Production Bug</Alert.Title>
          <Alert.Description>
            In an analytics dashboard, orders placed at 5 PM PKT appeared in the
            7 AM bucket of the Peak Hours chart. The 10-hour shift (not 5)
            happened because single AT TIME ZONE on a bare timestamp converts in
            the wrong direction — it subtracted 5 hours instead of adding them.
          </Alert.Description>
        </Alert.Content>
      </Alert>
    </DemoContainer>
  )
}
