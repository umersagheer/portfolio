'use client'

import { useEffect, useId, useState, type RefObject } from 'react'
import { motion } from 'framer-motion'

import { useGitMotion } from './use-git-motion'
import { EDGE } from './palette'

type EdgeVariant = 'normal' | 'new' | 'orphaned'

type EdgeProps = {
  containerRef: RefObject<HTMLElement | null>
  /** The child node (edges are drawn child → parent, backwards in time). */
  fromRef: RefObject<HTMLElement | null>
  /** The parent node. */
  toRef: RefObject<HTMLElement | null>
  variant?: EdgeVariant
  /** Curve the line upward by this many px (0 = straight). */
  curvature?: number
  /** Re-measure when this value changes (e.g. a layout/state key). */
  observeKey?: string | number
  className?: string
}

const STROKE: Record<EdgeVariant, string> = {
  normal: EDGE.stroke,
  new: EDGE.strokeNew,
  orphaned: EDGE.strokeOrphaned
}

/**
 * A connector between two Git object nodes, measured relative to a positioned
 * container — the same getBoundingClientRect approach the app's AnimatedBeam
 * uses, kept static and lightweight here. Direction is the caller's contract:
 * always pass the child as `from` and the parent as `to`, so every arrow in the
 * post points child → parent (backwards in time), matching real Git.
 *
 * Draws once on mount / resize; under prefers-reduced-motion the draw-on is
 * skipped and the line simply appears.
 */
export default function Edge({
  containerRef,
  fromRef,
  toRef,
  variant = 'normal',
  curvature = 0,
  observeKey,
  className
}: EdgeProps) {
  const id = useId()
  const { reduce, draw } = useGitMotion()
  const [path, setPath] = useState('')
  const [dims, setDims] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to) return

      const c = container.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()

      setDims({ width: c.width, height: c.height })

      const startX = a.left - c.left + a.width / 2
      const startY = a.top - c.top + a.height / 2
      const endX = b.left - c.left + b.width / 2
      const endY = b.top - c.top + b.height / 2

      const controlY = (startY + endY) / 2 - curvature
      setPath(
        `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
      )
    }

    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    if (fromRef.current) observer.observe(fromRef.current)
    if (toRef.current) observer.observe(toRef.current)
    update()

    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef, curvature, observeKey])

  const stroke = STROKE[variant]
  const markerId = `arrow-${id}`

  return (
    <svg
      fill='none'
      width={dims.width}
      height={dims.height}
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      xmlns='http://www.w3.org/2000/svg'
      className={`pointer-events-none absolute left-0 top-0 ${className ?? ''}`}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth='7'
          markerHeight='7'
          refX='5.5'
          refY='3'
          orient='auto'
          markerUnits='userSpaceOnUse'
        >
          <path d='M0,0 L6,3 L0,6 Z' fill={stroke} />
        </marker>
      </defs>
      <motion.path
        key={`${path}-${variant}`}
        d={path}
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeDasharray={variant === 'orphaned' ? '4 4' : undefined}
        markerEnd={`url(#${markerId})`}
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: variant === 'orphaned' ? 0.5 : 1 }}
        transition={draw}
      />
    </svg>
  )
}
