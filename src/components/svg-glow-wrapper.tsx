'use client'

import { useRef, useEffect, useState, ReactElement, cloneElement } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'

interface SVGGlowWrapperProps {
  children: ReactElement<React.SVGProps<SVGSVGElement>>
  className?: string
  glowColor?: string
  size?: string | number
}

export function SVGGlowWrapper({
  children,
  className = '',
  glowColor = 'hsl(var(--heroui-primary))',
  size = 96
}: SVGGlowWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { x, y, isInside } = useMousePosition(containerRef)
  const [gradientCenter, setGradientCenter] = useState({ cx: '50%', cy: '50%' })

  // Generate unique ID for this instance
  const gradientId = useRef(`svgGlow-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    if (containerRef.current && isInside) {
      const rect = containerRef.current.getBoundingClientRect()
      const cxPercentage = (x / rect.width) * 100
      const cyPercentage = (y / rect.height) * 100
      setGradientCenter({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`
      })
    }
  }, [x, y, isInside])

  // Clone the SVG and inject the gradient
  const enhancedSVG = cloneElement(children, {
    className: `${children.props.className || ''} transition-all duration-200`,
    style: {
      width: typeof size === 'number' ? `${size}px` : size,
      height: typeof size === 'number' ? `${size}px` : size,
      ...children.props.style,
      stroke: isInside ? `url(#${gradientId.current})` : 'currentColor',
      strokeWidth: isInside ? '2' : '1.5'
    },
    children: (
      <>
        <defs>
          <radialGradient
            id={gradientId.current}
            gradientUnits='userSpaceOnUse'
            r='50%'
            cx={gradientCenter.cx}
            cy={gradientCenter.cy}
          >
            {isInside && <stop offset='0%' stopColor={glowColor} />}
            <stop offset='100%' stopColor='currentColor' stopOpacity='0.5' />
          </radialGradient>
        </defs>
        {children.props.children}
      </>
    )
  })

  return (
    <div ref={containerRef} className={`text-default-500 ${className}`}>
      {enhancedSVG}
    </div>
  )
}
