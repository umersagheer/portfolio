'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DemoContainer from './demo-container'

const tabs = ['Home', 'About', 'Blog', 'Contact']

export default function LayoutIdDemo() {
  const [active, setActive] = useState('Home')

  return (
    <DemoContainer title='Click the tabs — watch the indicator morph'>
      <div className='flex gap-1 rounded-lg bg-default-100 p-1 w-fit'>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className='relative rounded-md px-4 py-2 text-sm transition-colors'
          >
            {active === tab && (
              <motion.div
                layoutId='blog-tab-indicator'
                className='absolute inset-0 rounded-md bg-default-foreground/10 dark:bg-default-foreground/15'
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                active === tab
                  ? 'font-medium text-foreground'
                  : 'text-default-500'
              }`}
            >
              {tab}
            </span>
          </button>
        ))}
      </div>

      <p className='mt-4 text-sm text-default-500'>
        Active tab: <span className='font-medium text-foreground'>{active}</span>
        {' — '}the indicator smoothly transitions using{' '}
        <code className='rounded bg-default-200 px-1.5 py-0.5 text-xs'>layoutId</code>
      </p>
    </DemoContainer>
  )
}
