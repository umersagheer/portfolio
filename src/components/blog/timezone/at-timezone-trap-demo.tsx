'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
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
            title="The AT TIME ZONE Trap"
            description="Same timestamp, same SQL keyword — opposite results depending on how you use it"
        >
            <div
                ref={containerRef}
                className='relative mb-4 rounded-lg border border-default-100 bg-background p-6'
            >
                <div className='flex flex-col items-center gap-8'>
                    {/* Source */}
                    <div
                        ref={sourceRef}
                        className='z-10 rounded-lg border border-default-200 bg-default-50 px-4 py-3 text-center dark:bg-default-100'
                    >
                        <p className='text-[10px] text-default-400'>
                            Stored in DB (timestamp without tz)
                        </p>
                        <p className='font-mono text-lg font-bold text-foreground'>
                            12:00:00
                        </p>
                        <p className='text-[10px] text-default-400'>
                            (This is actually noon UTC — a 5 PM PKT order)
                        </p>
                    </div>

                    {/* Two paths */}
                    <div className='z-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center sm:gap-8'>
                        {/* Wrong path */}
                        <motion.button
                            onClick={() => setShowDouble(false)}
                            className={`flex-1 rounded-lg border p-4 text-left transition-colors sm:max-w-xs ${!showDouble
                                    ? 'border-danger-300 bg-danger-50 dark:border-danger-800 dark:bg-danger-950/30'
                                    : 'border-default-200 bg-background opacity-60'
                                }`}
                        >
                            <div className='mb-2 flex items-center gap-2'>
                                <span className='text-sm'>❌</span>
                                <span className='text-xs font-medium text-danger-600 dark:text-danger-400'>
                                    Single AT TIME ZONE
                                </span>
                            </div>
                            <div className='mb-2 overflow-x-auto rounded-md bg-background/60 p-2 font-mono text-[10px] leading-relaxed dark:bg-default-50'>
                                <span className='text-default-600 dark:text-default-400'>
                                    EXTRACT(HOUR FROM
                                </span>
                                <br />
                                <span className='text-default-600 dark:text-default-400'>
                                    {'  '}&quot;createdAt&quot;
                                </span>
                                <br />
                                <span className='text-danger-500'>
                                    {'  '}AT TIME ZONE &apos;Asia/Karachi&apos;
                                </span>
                                <span className='text-default-600 dark:text-default-400'>)</span>
                            </div>
                            <div ref={wrongRef} className='text-center'>
                                <p className='text-[10px] text-default-400'>Result:</p>
                                <p className='font-mono text-xl font-bold text-danger-600 dark:text-danger-400'>
                                    07:00
                                </p>
                                <p className='text-[10px] text-danger-500'>
                                    PostgreSQL assumed 12:00 IS Pakistan time,
                                    <br />
                                    converted to UTC: 12 − 5 = 7
                                </p>
                            </div>
                        </motion.button>

                        {/* Right path */}
                        <motion.button
                            onClick={() => setShowDouble(true)}
                            className={`flex-1 rounded-lg border p-4 text-left transition-colors sm:max-w-xs ${showDouble
                                    ? 'border-success-300 bg-success-50 dark:border-success-800 dark:bg-success-950/30'
                                    : 'border-default-200 bg-background opacity-60'
                                }`}
                        >
                            <div className='mb-2 flex items-center gap-2'>
                                <span className='text-sm'>✅</span>
                                <span className='text-xs font-medium text-success-600 dark:text-success-400'>
                                    Double AT TIME ZONE
                                </span>
                            </div>
                            <div className='mb-2 overflow-x-auto rounded-md bg-background/60 p-2 font-mono text-[10px] leading-relaxed dark:bg-default-50'>
                                <span className='text-default-600 dark:text-default-400'>
                                    EXTRACT(HOUR FROM
                                </span>
                                <br />
                                <span className='text-default-600 dark:text-default-400'>
                                    {'  '}(&quot;createdAt&quot;
                                </span>
                                <br />
                                <span className='text-success-500'>
                                    {'  '}AT TIME ZONE &apos;UTC&apos;)
                                </span>
                                <br />
                                <span className='text-success-500'>
                                    {'  '}AT TIME ZONE &apos;Asia/Karachi&apos;
                                </span>
                                <span className='text-default-600 dark:text-default-400'>)</span>
                            </div>
                            <div ref={rightRef} className='text-center'>
                                <p className='text-[10px] text-default-400'>Result:</p>
                                <p className='font-mono text-xl font-bold text-success-600 dark:text-success-400'>
                                    17:00
                                </p>
                                <p className='text-[10px] text-success-500'>
                                    First labels as UTC → then converts to PKT:
                                    <br />
                                    12 + 5 = 17 (5 PM ✓)
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
            <div className='rounded-lg border border-warning-200 bg-warning-50 p-3 dark:border-warning-900 dark:bg-warning-950/30'>
                <p className='mb-1 text-xs font-medium text-warning-700 dark:text-warning-400'>
                    Real Production Bug
                </p>
                <p className='text-xs text-warning-600 dark:text-warning-500'>
                    In an analytics dashboard, orders placed at 5 PM PKT appeared in the
                    7 AM bucket of the Peak Hours chart. The 10-hour shift (not 5)
                    happened because single{' '}
                    <code className='text-warning-700 dark:text-warning-400'>
                        AT TIME ZONE
                    </code>{' '}
                    on a bare timestamp converts in the <em>wrong direction</em> — it
                    subtracted 5 hours instead of adding them.
                </p>
            </div>
        </DemoContainer>
    )
}
