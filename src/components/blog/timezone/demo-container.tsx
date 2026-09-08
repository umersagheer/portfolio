'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

type DemoContainerProps = {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function DemoContainer({
  children,
  title,
  description
}: DemoContainerProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <motion.section
      layout
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
      style={{ overflow: 'hidden' }}
      className='not-prose border-border bg-surface my-8 rounded-2xl border p-5 shadow-xs sm:p-6'
    >
      {title && (
        <motion.h3
          id={titleId}
          layout='position'
          className='text-foreground mb-2 text-base font-semibold tracking-tight'
        >
          {title}
        </motion.h3>
      )}
      {description && (
        <motion.p
          id={descriptionId}
          layout='position'
          className='text-muted mb-4 max-w-3xl text-sm leading-6'
        >
          {description}
        </motion.p>
      )}
      {!description && title && <div className='mb-3' />}
      <motion.div layout='position'>{children}</motion.div>
    </motion.section>
  )
}
