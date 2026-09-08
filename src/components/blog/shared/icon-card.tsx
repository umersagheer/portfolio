'use client'

import { forwardRef } from 'react'
import { cn } from '@heroui/react'

type IconCardProps = {
  children: React.ReactNode
  className?: string
  iconClassName?: string
  label?: string
}

const IconCard = forwardRef<HTMLDivElement, IconCardProps>(
  ({ children, className, iconClassName, label }, ref) => {
    return (
      <div className='flex flex-col items-center gap-1.5'>
        <div
          ref={ref}
          className={cn(
            'border-border z-10 flex size-12 items-center justify-center rounded-xl border bg-gradient-to-b from-white/20 to-transparent backdrop-blur-md',
            className
          )}
        >
          <div
            className={cn(
              'text-foreground size-7 [&>svg]:size-full',
              iconClassName
            )}
          >
            {children}
          </div>
        </div>
        {label && (
          <span className='text-muted text-[10px] font-medium'>{label}</span>
        )}
      </div>
    )
  }
)

IconCard.displayName = 'IconCard'

export default IconCard
