'use client'

import { forwardRef } from 'react'
import { cn } from '@heroui/react'
import { GitBranchIcon } from 'lucide-react'

import { REF_STYLES } from './palette'

type RefTagProps = {
  /** The ref name — a branch like `main`, or `HEAD`. */
  name: string
  variant: 'branch' | 'head'
  /** Only meaningful for HEAD: renders the detached-warning styling. */
  detached?: boolean
  className?: string
}

/**
 * A branch or HEAD pointer, drawn as a small sticky-note pill. Branches are
 * success-tinted; HEAD is a primary outline. Detached HEAD switches to the
 * warning styling to signal "this points straight at a commit, not a branch."
 * `forwardRef` so edges can connect a tag to the commit it points at.
 */
const RefTag = forwardRef<HTMLDivElement, RefTagProps>(
  ({ name, variant, detached = false, className }, ref) => {
    const isHead = variant === 'head'
    const style = isHead && detached ? REF_STYLES.detached : REF_STYLES[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-sourceCodePro text-xs font-semibold shadow-sm',
          isHead ? 'border-dashed' : '',
          style,
          className
        )}
      >
        {!isHead && <GitBranchIcon size={11} aria-hidden />}
        <span>{isHead ? 'HEAD' : name}</span>
        {isHead && detached && (
          <span className='text-[10px] font-normal opacity-80'>(detached)</span>
        )}
      </div>
    )
  }
)

RefTag.displayName = 'RefTag'

export default RefTag
