'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import DemoContainer from './demo-container'

const springTransition = { type: 'spring', stiffness: 350, damping: 30 }

export default function MorphingDialogDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <DemoContainer title='Click the card to see it morph into a dialog'>
      <div className='flex justify-center'>
        {!isOpen && (
          <motion.div
            layoutId='morphing-demo-card'
            onClick={() => setIsOpen(true)}
            className='border-border bg-background w-64 cursor-pointer overflow-hidden border p-4 shadow-xs transition-shadow hover:shadow-md'
            style={{ borderRadius: 12 }}
            transition={springTransition}
          >
            <motion.div
              layout='preserve-aspect'
              layoutId='morphing-demo-image'
              className='from-accent to-accent mb-3 h-32 bg-gradient-to-br'
              style={{ borderRadius: 8 }}
              transition={springTransition}
            />
            <motion.h3
              layout='position'
              layoutId='morphing-demo-title'
              className='text-sm font-semibold'
              transition={springTransition}
            >
              Project Card
            </motion.h3>
            <motion.p
              layout='position'
              layoutId='morphing-demo-subtitle'
              className='text-muted text-xs'
              transition={springTransition}
            >
              Click to expand
            </motion.p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm'
            />
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
              <motion.div
                ref={contentRef}
                layoutId='morphing-demo-card'
                className='border-border bg-background relative w-full max-w-md overflow-hidden border p-6 shadow-xl'
                style={{ borderRadius: 12 }}
                transition={springTransition}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className='text-muted hover:bg-surface-secondary hover:text-foreground absolute top-3 right-3 rounded-full p-1.5 transition-colors'
                >
                  <IconX size={16} />
                </button>
                <motion.div
                  layout='preserve-aspect'
                  layoutId='morphing-demo-image'
                  className='from-accent to-accent mb-4 h-48 bg-gradient-to-br'
                  style={{ borderRadius: 8 }}
                  transition={springTransition}
                />
                <motion.h3
                  layout='position'
                  layoutId='morphing-demo-title'
                  className='text-lg font-semibold'
                  transition={springTransition}
                >
                  Project Card
                </motion.h3>
                <motion.p
                  layout='position'
                  layoutId='morphing-demo-subtitle'
                  className='text-muted text-sm'
                  transition={springTransition}
                >
                  Click to expand
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.15 }}
                  className='mt-4'
                >
                  <p className='text-foreground text-sm'>
                    This is the expanded dialog content. The card morphed into
                    this dialog using{' '}
                    <code className='bg-surface-tertiary rounded-sm px-1.5 py-0.5 text-xs'>
                      layoutId
                    </code>{' '}
                    — the same technique used in this portfolio&apos;s project
                    cards.
                  </p>
                  <p className='text-foreground mt-2 text-sm'>
                    The image, title, and subtitle all share layout IDs between
                    the card and dialog states, creating a seamless morphing
                    transition.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </DemoContainer>
  )
}
