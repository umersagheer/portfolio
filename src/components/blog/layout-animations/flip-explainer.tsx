'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { ChevronRightIcon, PlayIcon } from 'lucide-react'
import DemoContainer from './demo-container'

const steps = [
  {
    label: 'First',
    letter: 'F',
    description: 'Record the element\'s current position and size before any changes.',
    narration: '📏 Measuring position with getBoundingClientRect()...',
    boxLeft: 20,
    boxWidth: 60,
    highlight: 'measure'
  },
  {
    label: 'Last',
    letter: 'L',
    description: 'Apply the layout change. The element jumps to its final position instantly.',
    narration: '⚡ DOM updated — element jumped to final position',
    boxLeft: 160,
    boxWidth: 100,
    highlight: 'final'
  },
  {
    label: 'Invert',
    letter: 'I',
    description: 'Use transforms to make the element look like it\'s still at the starting position.',
    narration: '🔄 Applied inverse transform — visually back at start',
    boxLeft: 20,
    boxWidth: 60,
    highlight: 'invert'
  },
  {
    label: 'Play',
    letter: 'P',
    description: 'Animate the transform back to zero — the element smoothly moves to its final spot.',
    narration: '🎬 Animating transform to zero — smooth GPU-accelerated motion',
    boxLeft: 160,
    boxWidth: 100,
    highlight: 'animate'
  }
]

export default function FlipExplainer() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const current = steps[step]

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
      setStep(next)
      scheduleNext(next)
    }, 1800)
  }, [])

  const handlePlayAll = useCallback(() => {
    setStep(0)
    setPlaying(true)
    timerRef.current = setTimeout(() => {
      scheduleNext(0)
    }, 1800)
  }, [scheduleNext])

  const handleStepClick = useCallback((i: number) => {
    stopAutoPlay()
    setStep(i)
  }, [stopAutoPlay])

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
          startContent={!playing ? <PlayIcon size={14} /> : undefined}
          onPress={handlePlayAll}
        >
          {playing ? '⏸ Playing...' : '▶ Play All'}
        </Button>
      </div>

      <div className='relative h-28 rounded-lg border border-default-200 bg-background overflow-hidden'>
        {/* Start ghost */}
        <div
          className='absolute top-1/2 h-14 -translate-y-1/2 rounded-md border-2 border-dashed border-default-300'
          style={{ left: 20, width: 60 }}
        />
        {/* End ghost */}
        <div
          className='absolute top-1/2 h-14 -translate-y-1/2 rounded-md border-2 border-dashed border-default-300'
          style={{ left: 160, width: 100 }}
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
        <span className='absolute bottom-2 left-6 text-xs text-default-400'>
          Start
        </span>
        <span className='absolute bottom-2 text-xs text-default-400' style={{ left: 175 }}>
          End
        </span>
      </div>

      <div className='mt-4 space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='rounded-md bg-primary-400 px-2 py-0.5 text-xs font-bold text-white'>
            {current.label}
          </span>
          <p className='text-sm text-default-600'>{current.description}</p>
        </div>
        <p className='rounded-md bg-primary-50 px-3 py-1.5 text-xs italic text-primary-600'>
          {current.narration}
        </p>

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
