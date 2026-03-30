'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tab, Tabs } from '@heroui/react'
import { IconInfoCircle, IconPlus, IconX } from '@tabler/icons-react'
import DemoContainer from './demo-container'

const fruits = [
  'Apple',
  'Orange',
  'Grape',
  'Strawberry',
  'Kiwi',
  'Peach',
  'Blueberry'
]

let nextId = 0

function getInitialItems() {
  return [
    { id: nextId++, label: fruits[0] },
    { id: nextId++, label: fruits[1] },
    { id: nextId++, label: fruits[2] }
  ]
}

export default function AnimatePresenceDemo() {
  const [withPresence, setWithPresence] = useState(true)
  const [items, setItems] =
    useState<{ id: number; label: string }[]>(getInitialItems)

  function toggle(value: boolean) {
    setWithPresence(value)
    setItems(getInitialItems())
  }

  function addItem() {
    const label = fruits[Math.floor(Math.random() * fruits.length)]
    setItems(prev => [...prev, { id: nextId++, label }])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const itemRow = (item: { id: number; label: string }) => (
    <div className='flex items-center justify-between rounded-lg border border-default-200 bg-background px-4 py-2'>
      <span className='text-sm'>{item.label}</span>
      <button
        onClick={() => removeItem(item.id)}
        className='rounded-full p-1 text-default-400 transition-colors hover:bg-danger-100 hover:text-danger-500'
      >
        <IconX size={14} />
      </button>
    </div>
  )

  return (
    <DemoContainer title='Add and remove items — watch the enter/exit animations'>
      <Tabs
        size='sm'
        variant='bordered'
        radius='sm'
        selectedKey={withPresence ? 'with' : 'without'}
        onSelectionChange={key => toggle(key === 'with')}
        classNames={{ tabList: 'mb-4' }}
      >
        <Tab key='without' title='Without AnimatePresence' />
        <Tab key='with' title='With AnimatePresence' />
      </Tabs>

      <div className='space-y-2'>
        {withPresence ? (
          <AnimatePresence mode='popLayout'>
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className='flex items-center justify-between rounded-lg border border-default-200 bg-background px-4 py-2'
              >
                <span className='text-sm'>{item.label}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className='rounded-full p-1 text-default-400 transition-colors hover:bg-danger-100 hover:text-danger-500'
                >
                  <IconX size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          items.map(item => <div key={item.id}>{itemRow(item)}</div>)
        )}
      </div>

      <p className='mt-3 flex items-start gap-1.5 text-xs italic text-default-400'>
        <IconInfoCircle size={14} className='mt-0.5 shrink-0' />
        {withPresence
          ? 'AnimatePresence delays unmounting until the exit animation completes, letting elements animate out gracefully.'
          : 'Items vanish instantly — React removes them from the DOM before any exit animation can play.'}
      </p>

      <div className='mt-4 flex justify-center'>
        <Button
          size='sm'
          variant='flat'
          startContent={<IconPlus size={14} />}
          onPress={addItem}
        >
          Add item
        </Button>
      </div>
    </DemoContainer>
  )
}
