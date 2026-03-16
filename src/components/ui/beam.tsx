'use client'

import { cn } from '@heroui/react'
import { motion } from 'framer-motion'
import { RefObject, useEffect, useId, useRef, useState } from 'react'

type AnimatedBeamMode = 'loop' | 'pulse'

type GradientCoordinates = {
  x1: string
  x2: string
  y1: string
  y2: string
}

const BEAM_DURATION_SCALE = 3.2

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  repeatDelay?: number
  mode?: AnimatedBeamMode
  triggerKey?: string | number
  animateOnMount?: boolean
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

const FORWARD_GRADIENT = {
  start: {
    x1: '-30%',
    x2: '-20%',
    y1: '0%',
    y2: '0%'
  },
  end: {
    x1: '120%',
    x2: '130%',
    y1: '0%',
    y2: '0%'
  }
} satisfies Record<'start' | 'end', GradientCoordinates>

const REVERSE_GRADIENT = {
  start: {
    x1: '130%',
    x2: '120%',
    y1: '0%',
    y2: '0%'
  },
  end: {
    x1: '-20%',
    x2: '-30%',
    y1: '0%',
    y2: '0%'
  }
} satisfies Record<'start' | 'end', GradientCoordinates>

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  repeatDelay = 0,
  mode = 'loop',
  triggerKey,
  animateOnMount = true,
  pathColor = 'gray',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#ffaa40',
  gradientStopColor = '#9c40ff',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0
}) => {
  const id = useId()
  const previousModeRef = useRef(mode)
  const previousAnimateOnMountRef = useRef(animateOnMount)
  const previousTriggerKeyRef = useRef(triggerKey)
  const [pathD, setPathD] = useState('')
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  const [pulseVersion, setPulseVersion] = useState(() =>
    mode === 'pulse' && animateOnMount ? 0 : -1
  )

  const gradientCoordinates = reverse ? REVERSE_GRADIENT : FORWARD_GRADIENT
  const isPulseMode = mode === 'pulse'
  const shouldAnimatePulse = isPulseMode && pulseVersion >= 0

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset
        const startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset
        const endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset
        const endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset

        const controlY = startY - curvature
        const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
        setPathD(d)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    updatePath()

    return () => {
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset
  ])

  useEffect(() => {
    if (
      previousModeRef.current === mode &&
      previousAnimateOnMountRef.current === animateOnMount
    ) {
      return
    }

    previousModeRef.current = mode
    previousAnimateOnMountRef.current = animateOnMount
    previousTriggerKeyRef.current = triggerKey
    setPulseVersion(mode === 'pulse' && animateOnMount ? 0 : -1)
  }, [mode, animateOnMount, triggerKey])

  useEffect(() => {
    if (!isPulseMode) return
    if (triggerKey === undefined) {
      previousTriggerKeyRef.current = triggerKey
      return
    }
    if (previousTriggerKeyRef.current === triggerKey) return

    previousTriggerKeyRef.current = triggerKey
    setPulseVersion(current => current + 1)
  }, [isPulseMode, triggerKey])

  return (
    <svg
      fill='none'
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns='http://www.w3.org/2000/svg'
      className={cn(
        'pointer-events-none absolute left-0 top-0 transform-gpu stroke-2',
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap='round'
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity='1'
        strokeLinecap='round'
      />
      <defs>
        {shouldAnimatePulse || !isPulseMode ? (
          <motion.linearGradient
            key={isPulseMode ? `pulse-${pulseVersion}` : 'loop'}
            className='transform-gpu'
            id={id}
            gradientUnits='userSpaceOnUse'
            initial={gradientCoordinates.start}
            animate={gradientCoordinates.end}
            transition={{
              delay,
              duration: duration * BEAM_DURATION_SCALE,
              ease: [0.16, 1, 0.3, 1],
              repeat: isPulseMode ? 0 : Infinity,
              repeatDelay
            }}
          >
            <stop stopColor={gradientStartColor} stopOpacity='0' />
            <stop stopColor={gradientStartColor} />
            <stop offset='32.5%' stopColor={gradientStopColor} />
            <stop offset='100%' stopColor={gradientStopColor} stopOpacity='0' />
          </motion.linearGradient>
        ) : (
          <linearGradient
            id={id}
            gradientUnits='userSpaceOnUse'
            x1={gradientCoordinates.end.x1}
            x2={gradientCoordinates.end.x2}
            y1={gradientCoordinates.end.y1}
            y2={gradientCoordinates.end.y2}
          >
            <stop stopColor={gradientStartColor} stopOpacity='0' />
            <stop stopColor={gradientStartColor} />
            <stop offset='32.5%' stopColor={gradientStopColor} />
            <stop offset='100%' stopColor={gradientStopColor} stopOpacity='0' />
          </linearGradient>
        )}
      </defs>
    </svg>
  )
}
