'use client'

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import { ChevronRightIcon, PlayIcon, PauseIcon } from 'lucide-react'
import {
  IconRulerMeasure,
  IconBolt,
  IconTransform,
  IconPlayerPlayFilled
} from '@tabler/icons-react'
import DemoContainer from './demo-container'

const FIRST_LEFT = 20
const FIRST_WIDTH = 60
const LAST_LEFT = 160
const LAST_WIDTH = 100
const DELTA_X = FIRST_LEFT - LAST_LEFT
const SCALE_X = +(FIRST_WIDTH / LAST_WIDTH).toFixed(2)

const ROTATE_OFFSET = 18

function RotatingValue({
  value,
  direction,
  className
}: {
  value: ReactNode
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
    label: 'First',
    letter: 'F',
    description: 'Record the element\'s current position and size before any changes.',
    narration: 'Measuring position with getBoundingClientRect()...',
    icon: IconRulerMeasure,
    boxLeft: FIRST_LEFT,
    boxWidth: FIRST_WIDTH,
    highlight: 'measure' as const,
    properties: {
      x: FIRST_LEFT,
      width: FIRST_WIDTH,
      transform: null as string | null
    }
  },
  {
    label: 'Last',
    letter: 'L',
    description: 'Apply the layout change. The element jumps to its final position instantly.',
    narration: 'DOM updated — element jumped to final position',
    icon: IconBolt,
    boxLeft: LAST_LEFT,
    boxWidth: LAST_WIDTH,
    highlight: 'final' as const,
    properties: {
      x: LAST_LEFT,
      width: LAST_WIDTH,
      transform: null as string | null
    }
  },
  {
    label: 'Invert',
    letter: 'I',
    description: 'Use transforms to make the element look like it\'s still at the starting position.',
    narration: 'Applied inverse transform — visually back at start',
    icon: IconTransform,
    boxLeft: FIRST_LEFT,
    boxWidth: FIRST_WIDTH,
    highlight: 'invert' as const,
    properties: {
      x: LAST_LEFT,
      width: LAST_WIDTH,
      transform: `translateX(${DELTA_X}px) scaleX(${SCALE_X})`
    }
  },
  {
    label: 'Play',
    letter: 'P',
    description: 'Animate the transform back to zero — the element smoothly moves to its final spot.',
    narration: 'Animating transform to zero — smooth GPU-accelerated motion',
    icon: IconPlayerPlayFilled,
    boxLeft: LAST_LEFT,
    boxWidth: LAST_WIDTH,
    highlight: 'animate' as const,
    properties: {
      x: LAST_LEFT,
      width: LAST_WIDTH,
      transform: 'translateX(0px) scaleX(1)'
    }
  }
]

export default function FlipExplainer() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevStepRef = useRef(0)
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

  const scheduleNext = useCallback((currentStep: number) => {
    if (currentStep >= 3) {
      setPlaying(false)
      return
    }
    timerRef.current = setTimeout(() => {
      const next = currentStep + 1
      goTo(next)
      scheduleNext(next)
    }, 1800)
  }, [goTo])

  const handlePlayAll = useCallback(() => {
    goTo(0)
    setPlaying(true)
    timerRef.current = setTimeout(() => {
      scheduleNext(0)
    }, 1800)
  }, [scheduleNext, goTo])

  const handleStepClick = useCallback((i: number) => {
    stopAutoPlay()
    goTo(i)
  }, [stopAutoPlay, goTo])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <DemoContainer title='Step through the FLIP technique'>
      <div className='mb-6 flex flex-col items-center gap-3'>
        <div className='flex items-center gap-3'>
          {steps.map((s, i) => (
            <button
              key={s.letter}
              onClick={() => handleStepClick(i)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                i === step
                  ? 'bg-primary-400 text-white'
                  : i < step
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-default-100 text-default-400'
              }`}
            >
              {s.letter}
            </button>
          ))}
        </div>
        <Button
          size='sm'
          variant='flat'
          color={playing ? 'primary' : 'default'}
          isDisabled={playing}
          startContent={playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          onPress={handlePlayAll}
        >
          {playing ? 'Playing...' : 'Play All'}
        </Button>
      </div>

      <div className='relative h-40 rounded-lg border border-default-200 bg-background overflow-hidden'>
        {/* Position labels above the box */}
        <span
          className='absolute top-2 font-mono text-[11px] text-default-500'
          style={{ left: current.boxLeft }}
        >
          x:{' '}
          <RotatingValue
            value={current.properties.x}
            direction={direction}
          />
        </span>
        <span
          className='absolute top-2 font-mono text-[11px] text-default-500'
          style={{ left: current.boxLeft + current.boxWidth + 8 }}
        >
          w:{' '}
          <RotatingValue
            value={current.properties.width}
            direction={direction}
          />
        </span>

        {/* Start ghost */}
        <div
          className='absolute top-1/2 h-14 -translate-y-1/2 rounded-md border-2 border-dashed border-default-300'
          style={{ left: FIRST_LEFT, width: FIRST_WIDTH }}
        />
        {/* End ghost */}
        <div
          className='absolute top-1/2 h-14 -translate-y-1/2 rounded-md border-2 border-dashed border-default-300'
          style={{ left: LAST_LEFT, width: LAST_WIDTH }}
        />
        {/* Moving box */}
        <motion.div
          className='absolute top-1/2 h-14 -translate-y-1/2 rounded-md bg-primary-400'
          animate={{
            left: current.boxLeft,
            width: current.boxWidth
          }}
          transition={
            current.highlight === 'animate'
              ? { type: 'spring', stiffness: 200, damping: 20 }
              : { duration: 0.01 }
          }
        />
        {/* Labels */}
        <span className='absolute bottom-8 left-6 text-xs text-default-400'>
          Start
        </span>
        <span className='absolute bottom-8 text-xs text-default-400' style={{ left: LAST_LEFT + 15 }}>
          End
        </span>
        {/* Transform value in the box area */}
        <span className='absolute bottom-2 left-3 font-mono text-[11px] text-primary-500'>
          <RotatingValue
            value={
              current.properties.transform
                ? `transform: ${current.properties.transform}`
                : '\u00A0'
            }
            direction={direction}
          />
        </span>
      </div>

      <div className='mt-4 space-y-3'>
        {/* Step label + description */}
        <div className='flex items-start gap-2'>
          <RotatingValue
            value={
              <span className='rounded-md bg-primary-400 px-2 py-0.5 text-xs font-bold text-white'>
                {current.label}
              </span>
            }
            direction={direction}
          />
          <RotatingValue
            value={
              <span className='text-sm text-default-600'>
                {current.description}
              </span>
            }
            direction={direction}
            className='flex-1'
          />
        </div>

        {/* Narration with icon */}
        <div className='flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1.5 dark:bg-primary-950/40'>
          <RotatingValue
            value={<StepIcon size={16} className='shrink-0 text-primary-500' />}
            direction={direction}
          />
          <RotatingValue
            value={
              <span className='text-xs italic text-primary-600 dark:text-primary-400'>
                {current.narration}
              </span>
            }
            direction={direction}
            className='flex-1'
          />
        </div>

        {/* Property values panel */}
        <div className='flex flex-wrap gap-3 rounded-md bg-default-100 px-3 py-2 font-mono text-[11px] text-default-600 dark:bg-default-50'>
          <span>
            <span className='text-default-400'>x:</span>{' '}
            <RotatingValue
              value={`${current.properties.x}px`}
              direction={direction}
              className='text-primary-500'
            />
          </span>
          <span>
            <span className='text-default-400'>width:</span>{' '}
            <RotatingValue
              value={`${current.properties.width}px`}
              direction={direction}
              className='text-primary-500'
            />
          </span>
          <span>
            <span className='text-default-400'>transform:</span>{' '}
            <RotatingValue
              value={
                <span className='text-primary-500'>
                  {current.properties.transform ?? 'none'}
                </span>
              }
              direction={direction}
            />
          </span>
        </div>

        <div className='flex justify-between'>
          <Button
            size='sm'
            variant='flat'
            isDisabled={step === 0}
            onPress={() => handleStepClick(step - 1)}
          >
            Back
          </Button>
          <Button
            size='sm'
            variant='flat'
            endContent={step < 3 ? <ChevronRightIcon size={14} /> : undefined}
            isDisabled={step === 3}
            onPress={() => handleStepClick(step + 1)}
          >
            {step < 3 ? 'Next' : 'Done'}
          </Button>
        </div>
      </div>
    </DemoContainer>
  )
}
