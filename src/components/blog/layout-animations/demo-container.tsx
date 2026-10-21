'use client'

import { MotionConfig } from 'framer-motion'

type DemoContainerProps = {
  children: React.ReactNode
  title?: string
}

// These demos only play when clicked and the motion is the lesson, so they
// opt out of the site-wide reduced-motion setting in providers.tsx.
export default function DemoContainer({ children, title }: DemoContainerProps) {
  return (
    <div className='not-prose border-border bg-surface my-8 rounded-xl border p-6'>
      {title && <p className='text-muted mb-4 text-sm font-medium'>{title}</p>}
      <MotionConfig reducedMotion='never'>{children}</MotionConfig>
    </div>
  )
}
