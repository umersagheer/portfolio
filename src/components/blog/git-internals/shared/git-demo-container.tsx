'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

type GitDemoContainerProps = {
  children: React.ReactNode
  title?: string
  description?: string
  /**
   * Optional footnote for the "how real Git differs" accuracy note that most of
   * these demos carry. Rendered small and muted under the interactive area.
   */
  caption?: React.ReactNode
}

/**
 * The shared shell for every Git-internals demo. Deliberately mirrors the proven
 * `blog/timezone/demo-container.tsx` look (not-prose card, subtle border, layout
 * animation) so the Git post sits visually alongside the other posts — with one
 * addition: a `caption` slot for the accuracy footnotes this series leans on.
 */
export default function GitDemoContainer({
  children,
  title,
  description,
  caption
}: GitDemoContainerProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <motion.section
      layout
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
      style={{ overflow: 'hidden' }}
      className='not-prose bg-surface my-8 rounded-2xl p-4 shadow-md sm:p-5'
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

      {caption && (
        <motion.p
          layout='position'
          className='border-separator text-muted mt-4 border-t pt-3 text-xs leading-5'
        >
          {caption}
        </motion.p>
      )}
    </motion.section>
  )
}
