'use client'

import Image from 'next/image'
import { useMemo } from 'react'

type Screenshot = {
  src: string
  wide: boolean
}

type ScreenshotMarqueeProps = {
  screenshots: Screenshot[]
  variant?: 'vertical' | '3d'
  columns?: number
  speed?: number
  className?: string
}

export default function ScreenshotMarquee({
  screenshots,
  variant = 'vertical',
  columns = 2,
  speed = 25,
  className
}: ScreenshotMarqueeProps) {
  const gridItems = useMemo(() => {
    return [...screenshots, ...screenshots]
  }, [screenshots])

  if (screenshots.length === 0) return null

  return (
    <div
      className={
        className ??
        'group relative flex h-80 w-full items-center justify-center overflow-hidden'
      }
      style={variant === '3d' ? { perspective: '300px' } : undefined}
    >
      <div
        style={
          variant === '3d'
            ? {
                transform:
                  'translateX(0px) translateY(0px) translateZ(-50px) rotateX(15deg) rotateY(-8deg) rotateZ(18deg)'
              }
            : undefined
        }
      >
        <div
          className='animate-marquee-scroll-vertical group-hover:[animation-play-state:paused]'
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridAutoFlow: 'dense',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '32rem',
            animationDuration: `${speed}s`
          }}
        >
          {gridItems.map((item, i) => (
            <div
              key={i}
              style={
                item.wide
                  ? { gridColumn: `span ${columns}` }
                  : undefined
              }
            >
              <Image
                src={item.src}
                alt='Project screenshot'
                width={item.wide ? 400 : 200}
                height={item.wide ? 267 : 300}
                loading='lazy'
                className='h-auto w-full rounded-xl object-contain'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient fades on all 4 edges */}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-content1' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-content1' />
      <div className='pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-content1' />
      <div className='pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-content1' />
    </div>
  )
}
