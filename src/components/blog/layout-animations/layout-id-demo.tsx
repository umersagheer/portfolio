'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tab, Tabs } from '@heroui/react'
import DemoContainer from './demo-container'

const tabs = ['Home', 'About', 'Blog', 'Contact']

export default function LayoutIdDemo() {
  const [active, setActive] = useState('Home')
  const [useLayoutId, setUseLayoutId] = useState(true)

  return (
    <DemoContainer title='Click the tabs — watch the indicator morph'>
      <Tabs
        size='sm'
        variant='bordered'
        radius='sm'
        selectedKey={useLayoutId ? 'with' : 'without'}
        onSelectionChange={key => setUseLayoutId(key === 'with')}
        classNames={{ tabList: 'mb-4' }}
      >
        <Tab key='without' title='Without layoutId' />
        <Tab key='with' title='With layoutId' />
      </Tabs>

      <div className='flex w-fit gap-1 rounded-lg bg-default-100 p-1'>
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
                  className='absolute inset-0 rounded-md bg-default-foreground/10 dark:bg-default-foreground/15'
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : (
                <div className='absolute inset-0 rounded-md bg-default-foreground/10 dark:bg-default-foreground/15' />
              ))}
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
        Active tab:{' '}
        <span className='font-medium text-foreground'>{active}</span>
        {useLayoutId ? (
          <>
            {' — '}the indicator smoothly transitions using{' '}
            <code className='rounded bg-default-200 px-1.5 py-0.5 text-xs'>
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
