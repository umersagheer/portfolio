'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs } from '@heroui/react'
import DemoContainer from './demo-container'

export default function LayoutAnimationDemo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <DemoContainer title='Toggle between states to see the difference'>
      <div className='mb-4 flex justify-center'>
        <Tabs
          variant='primary'
          selectedKey={isExpanded ? 'expanded' : 'normal'}
          onSelectionChange={key => setIsExpanded(key === 'expanded')}
        >
          <Tabs.ListContainer>
            <Tabs.List>
              <Tabs.Tab id='normal'>
                Normal
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='expanded'>
                Expanded
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='border-default-200 space-y-3 rounded-lg border p-4'>
          <p className='text-default-600 text-sm font-semibold'>
            Without animation
          </p>
          <div className='flex h-24 items-end'>
            <div
              className='bg-danger-400 rounded-lg'
              style={{
                width: isExpanded ? '100%' : 60,
                height: isExpanded ? '100%' : 60
              }}
            />
          </div>
        </div>

        <div className='border-default-200 space-y-3 rounded-lg border p-4'>
          <p className='text-default-600 text-sm font-semibold'>
            With{' '}
            <code className='bg-default-200 rounded-sm px-1.5 py-0.5 text-xs'>
              layout
            </code>{' '}
            prop
          </p>
          <div className='flex h-24 items-end'>
            <motion.div
              layout
              className='bg-primary-400 rounded-lg'
              style={{
                width: isExpanded ? '100%' : 60,
                height: isExpanded ? '100%' : 60
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}
