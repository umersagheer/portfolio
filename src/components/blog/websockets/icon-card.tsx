'use client'

import { forwardRef } from 'react'
import { cn } from '@heroui/react'

type IconCardProps = {
  children: React.ReactNode
  className?: string
  label?: string
}

const IconCard = forwardRef<HTMLDivElement, IconCardProps>(
  ({ children, className, label }, ref) => {
    return (
      <div className='flex flex-col items-center gap-1.5'>
        <div
          ref={ref}
          className={cn(
            'z-10 flex size-12 items-center justify-center rounded-xl border border-default-200 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-md',
            className
          )}
        >
          <div className='size-7 text-default-600 [&>svg]:size-full'>
            {children}
          </div>
        </div>
        {label && (
          <span className='text-[10px] font-medium text-default-500'>
            {label}
          </span>
        )}
      </div>
    )
  }
)

IconCard.displayName = 'IconCard'

export default IconCard
