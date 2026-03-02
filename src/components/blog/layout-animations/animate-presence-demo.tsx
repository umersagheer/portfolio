'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import { PlusIcon, XIcon } from 'lucide-react'
import DemoContainer from './demo-container'

const fruits = ['🍎 Apple', '🍊 Orange', '🍇 Grape', '🍓 Strawberry', '🥝 Kiwi', '🍑 Peach', '🫐 Blueberry']

let nextId = 0

export default function AnimatePresenceDemo() {
  const [items, setItems] = useState<{ id: number; label: string }[]>([
    { id: nextId++, label: fruits[0] },
    { id: nextId++, label: fruits[1] },
    { id: nextId++, label: fruits[2] }
  ])

  function addItem() {
    const label = fruits[Math.floor(Math.random() * fruits.length)]
    setItems(prev => [...prev, { id: nextId++, label }])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <DemoContainer title='Add and remove items — watch the enter/exit animations'>
      <div className='space-y-2'>
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
                <XIcon size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className='mt-4 flex justify-center'>
        <Button
          size='sm'
          variant='flat'
          startContent={<PlusIcon size={14} />}
          onPress={addItem}
        >
          Add item
        </Button>
      </div>
    </DemoContainer>
  )
}
