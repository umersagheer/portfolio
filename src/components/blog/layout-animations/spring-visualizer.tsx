'use client'

import { useState, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Button } from '@heroui/react'
import { IconPlayerPlay, IconRefresh } from '@tabler/icons-react'
import DemoContainer from './demo-container'

const presets = [
  { name: 'Bouncy', stiffness: 200, damping: 10, mass: 1 },
  { name: 'Stiff', stiffness: 600, damping: 30, mass: 0.5 },
  { name: 'Gentle', stiffness: 100, damping: 15, mass: 1.5 },
  { name: 'Snappy', stiffness: 400, damping: 25, mass: 0.8 }
]

export default function SpringVisualizer() {
  const [stiffness, setStiffness] = useState(300)
  const [damping, setDamping] = useState(20)
  const [mass, setMass] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const controls = useAnimationControls()
  const isAtEnd = useRef(false)

  async function play() {
    setIsAnimating(true)
    const target = isAtEnd.current ? 16 : 280
    await controls.start({
      x: target,
      transition: { type: 'spring', stiffness, damping, mass }
    })
    isAtEnd.current = !isAtEnd.current
    setIsAnimating(false)
  }

  async function reset() {
    setIsAnimating(true)
    await controls.start({ x: 16, transition: { duration: 0.3 } })
    isAtEnd.current = false
    setIsAnimating(false)
  }

  function applyPreset(preset: typeof presets[number]) {
    setStiffness(preset.stiffness)
    setDamping(preset.damping)
    setMass(preset.mass)
  }

  return (
    <DemoContainer title='Adjust the spring parameters and hit Play'>
      {/* Track */}
      <div className='relative mb-6 h-14 rounded-lg border border-default-200 bg-background'>
        <motion.div
          className='absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-primary-400 shadow-lg'
          initial={{ x: 16 }}
          animate={controls}
        />
      </div>

      {/* Sliders */}
      <div className='space-y-4'>
        <div className='space-y-1'>
          <div className='flex justify-between text-xs'>
            <label className='font-medium text-default-600'>Stiffness</label>
            <span className='font-mono text-default-400'>{stiffness}</span>
          </div>
          <input
            type='range'
            min={10}
            max={1000}
            value={stiffness}
            onChange={e => setStiffness(Number(e.target.value))}
            className='w-full accent-primary-400'
          />
        </div>

        <div className='space-y-1'>
          <div className='flex justify-between text-xs'>
            <label className='font-medium text-default-600'>Damping</label>
            <span className='font-mono text-default-400'>{damping}</span>
          </div>
          <input
            type='range'
            min={1}
            max={100}
            value={damping}
            onChange={e => setDamping(Number(e.target.value))}
            className='w-full accent-primary-400'
          />
        </div>

        <div className='space-y-1'>
          <div className='flex justify-between text-xs'>
            <label className='font-medium text-default-600'>Mass</label>
            <span className='font-mono text-default-400'>{mass.toFixed(1)}</span>
          </div>
          <input
            type='range'
            min={1}
            max={100}
            value={mass * 10}
            onChange={e => setMass(Number(e.target.value) / 10)}
            className='w-full accent-primary-400'
          />
        </div>
      </div>

      {/* Presets */}
      <div className='mt-4 flex flex-wrap gap-2'>
        {presets.map(preset => (
          <Button
            key={preset.name}
            size='sm'
            variant='bordered'
            onPress={() => applyPreset(preset)}
            className='text-xs'
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className='mt-4 flex justify-center gap-2'>
        <Button
          size='sm'
          variant='flat'
          startContent={<IconPlayerPlay size={14} />}
          onPress={play}
          isDisabled={isAnimating}
        >
          Play
        </Button>
        <Button
          size='sm'
          variant='flat'
          startContent={<IconRefresh size={14} />}
          onPress={reset}
          isDisabled={isAnimating}
        >
          Reset
        </Button>
      </div>
    </DemoContainer>
  )
}
