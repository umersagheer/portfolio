'use client'

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useId
} from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variant
} from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import { useClickOutside } from '@/hooks/useClickOutside'

// --- Context ---

type MorphingDialogContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  uniqueId: string
}

const MorphingDialogContext =
  React.createContext<MorphingDialogContextType | null>(null)

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext)
  if (!context) {
    throw new Error(
      'useMorphingDialog must be used within a MorphingDialog'
    )
  }
  return context
}

// --- Root ---

const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 30
}

type MorphingDialogProps = {
  children: React.ReactNode
  transition?: Transition
}

function MorphingDialog({ children, transition }: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId }),
    [isOpen, uniqueId]
  )

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      {children}
    </MorphingDialogContext.Provider>
  )
}

// --- Trigger ---

type MorphingDialogTriggerProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogTrigger({
  children,
  className,
  style
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-${uniqueId}`}
      onClick={() => setIsOpen(!isOpen)}
      className={className}
      style={style}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  )
}

// --- Container (Portal) ---

type MorphingDialogContainerProps = {
  children: React.ReactNode
}

function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, uniqueId } = useMorphingDialog()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        const ctx = document.querySelector(
          `[data-dialog-id="${uniqueId}"]`
        )
        if (ctx) {
          ctx.dispatchEvent(new CustomEvent('morphing-dialog-close'))
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, uniqueId])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm'
          />
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// --- Content ---

type MorphingDialogContentProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingDialogContent({
  children,
  className,
  style
}: MorphingDialogContentProps) {
  const { setIsOpen, uniqueId } = useMorphingDialog()
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setIsOpen(false))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = () => setIsOpen(false)
    el.addEventListener('morphing-dialog-close', handler)
    return () => el.removeEventListener('morphing-dialog-close', handler)
  }, [setIsOpen])

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={className}
      style={style}
      transition={defaultTransition}
      role='dialog'
      aria-modal='true'
      data-dialog-id={uniqueId}
    >
      {children}
    </motion.div>
  )
}

// --- Title ---

type MorphingDialogTitleProps = {
  children: React.ReactNode
  className?: string
}

function MorphingDialogTitle({
  children,
  className
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-title-${uniqueId}`}
      className={className}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  )
}

// --- Subtitle ---

type MorphingDialogSubtitleProps = {
  children: React.ReactNode
  className?: string
}

function MorphingDialogSubtitle({
  children,
  className
}: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-subtitle-${uniqueId}`}
      className={className}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  )
}

// --- Image ---

type MorphingDialogImageProps = {
  children: React.ReactNode
  className?: string
}

function MorphingDialogImage({
  children,
  className
}: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`dialog-image-${uniqueId}`}
      className={className}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  )
}

// --- Description (non-shared, fade in only) ---

type MorphingDialogDescriptionProps = {
  children: React.ReactNode
  className?: string
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

const defaultDescriptionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 }
}

function MorphingDialogDescription({
  children,
  className,
  variants = defaultDescriptionVariants
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      variants={variants}
      className={className}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ delay: 0.15, duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

// --- Close ---

type MorphingDialogCloseProps = {
  children?: React.ReactNode
  className?: string
}

function MorphingDialogClose({
  children,
  className
}: MorphingDialogCloseProps) {
  const { setIsOpen } = useMorphingDialog()

  return (
    <motion.button
      onClick={() => setIsOpen(false)}
      type='button'
      aria-label='Close dialog'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.15 }}
      className={
        className ||
        'absolute right-3 top-3 z-10 rounded-full p-1.5 text-default-500 transition-colors hover:bg-content2 hover:text-default-700'
      }
    >
      {children || <IconX className='size-5' />}
    </motion.button>
  )
}

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogImage,
  MorphingDialogDescription,
  MorphingDialogClose,
  useMorphingDialog
}
