'use client'

import { MotionConfig } from 'framer-motion'

// Readers with Reduce Motion on get no transform/layout animation. Applied
// only around the parts of the site that use framer-motion (post pages, the
// project list), so the shared layout bundle doesn't carry the library.
export default function ReducedMotion({
  children
}: {
  children: React.ReactNode
}) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>
}
