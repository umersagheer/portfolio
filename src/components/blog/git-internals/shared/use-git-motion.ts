'use client'

import { useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'

/**
 * Motion presets shared by every Git-internals component, in one place so the
 * post's "respect prefers-reduced-motion, never autoplay" rule is enforced
 * centrally rather than re-decided per component.
 *
 * These are deliberately *unhurried* — this is a teaching tool, so objects
 * appear slowly enough that the reader can follow "blob → tree → commit →
 * pointer moved" instead of everything snapping into place at once. When the
 * user prefers reduced motion, every transition collapses to instant.
 */
export function useGitMotion() {
  const reduce = useReducedMotion()

  const instant: Transition = { duration: 0 }

  /** A soft, slow spring for pointers/tags sliding to a new commit. */
  const spring: Transition = reduce
    ? instant
    : { type: 'spring', stiffness: 140, damping: 22, mass: 1 }

  /** A gentle tween for hashes/labels swapping in place. */
  const swap: Transition = reduce ? instant : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }

  /** A slow draw for edges / new objects appearing. */
  const draw: Transition = reduce ? instant : { duration: 0.9, ease: [0.4, 0, 0.2, 1] }

  return {
    reduce: Boolean(reduce),
    spring,
    swap,
    draw,
    /**
     * Enter/exit for a node easing into existence — slow spring so a freshly
     * created blob/tree/commit doesn't just pop; the reader watches it arrive.
     */
    nodeAppear: {
      initial: reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 },
      transition: reduce ? instant : { type: 'spring', stiffness: 160, damping: 20, mass: 1 }
    },
    /**
     * A slow, gentle emphasis pulse for a just-created object. It breathes for a
     * beat and a half so the eye lands on it before it calms — the "hold" that
     * lets the reader process what Git just did. No-op under reduced motion.
     */
    hold: reduce
      ? {}
      : {
          animate: { scale: [1, 1.06, 1] },
          transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1], times: [0, 0.4, 1] }
        },
    /** Enter/exit for a small caption/badge fading in, unhurried. */
    fade: {
      initial: reduce ? { opacity: 1 } : { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      exit: reduce ? { opacity: 0 } : { opacity: 0, y: -6 },
      transition: swap
    }
  }
}
