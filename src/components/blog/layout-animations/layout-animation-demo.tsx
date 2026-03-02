'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import DemoContainer from './demo-container'

export default function LayoutAnimationDemo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <DemoContainer title='Click "Toggle" to see the difference'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-3 rounded-lg border border-default-200 p-4'>
          <p className='text-sm font-semibold text-default-600'>
            Without animation
          </p>
          <div className='flex h-24 items-end'>
            <div
              className='rounded-lg bg-danger-400'
              style={{
                width: isExpanded ? '100%' : 60,
                height: isExpanded ? '100%' : 60
              }}
            />
          </div>
        </div>

        <div className='space-y-3 rounded-lg border border-default-200 p-4'>
          <p className='text-sm font-semibold text-default-600'>
            With <code className='rounded bg-default-200 px-1.5 py-0.5 text-xs'>layout</code> prop
          </p>
          <div className='flex h-24 items-end'>
            <motion.div
              layout
              className='rounded-lg bg-primary-400'
              style={{
                width: isExpanded ? '100%' : 60,
                height: isExpanded ? '100%' : 60
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </div>
        </div>
      </div>

      <div className='mt-4 flex justify-center'>
        <Button
          size='sm'
          variant='flat'
          onPress={() => setIsExpanded(!isExpanded)}
        >
          Toggle
        </Button>
      </div>
    </DemoContainer>
  )
}
