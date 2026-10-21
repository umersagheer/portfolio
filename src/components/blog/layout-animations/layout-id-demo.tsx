'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs } from '@heroui/react'
import DemoContainer from './demo-container'

const tabs = ['Home', 'About', 'Blog', 'Contact']

export default function LayoutIdDemo() {
  const [active, setActive] = useState('Home')
  const [useLayoutId, setUseLayoutId] = useState(true)

  return (
    <DemoContainer title='Click the tabs — watch the indicator morph'>
      <Tabs
        variant='primary'
        selectedKey={useLayoutId ? 'with' : 'without'}
        onSelectionChange={key => setUseLayoutId(key === 'with')}
        className='mb-4'
      >
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id='without'>
              Without layoutId
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id='with'>
              With layoutId
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className='bg-surface-secondary flex w-fit gap-1 rounded-lg p-1'>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className='relative rounded-md px-4 py-2 text-sm transition-colors'
          >
            {active === tab &&
              (useLayoutId ? (
                <motion.div
                  layoutId='blog-tab-indicator'
                  className='bg-default-foreground/10 dark:bg-default-foreground/15 absolute inset-0 rounded-md'
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : (
                <div className='bg-default-foreground/10 dark:bg-default-foreground/15 absolute inset-0 rounded-md' />
              ))}
            <span
              className={`relative z-10 ${
                active === tab ? 'text-foreground font-medium' : 'text-muted'
              }`}
            >
              {tab}
            </span>
          </button>
        ))}
      </div>

      <p className='text-muted mt-4 text-sm'>
        Active tab:{' '}
        <span className='text-foreground font-medium'>{active}</span>
        {useLayoutId ? (
          <>
            {' — '}the indicator smoothly transitions using{' '}
            <code className='bg-surface-tertiary rounded-sm px-1.5 py-0.5 text-xs'>
              layoutId
            </code>
          </>
        ) : (
          <>{' — '}the indicator just appears with no animation</>
        )}
      </p>
    </DemoContainer>
  )
}
