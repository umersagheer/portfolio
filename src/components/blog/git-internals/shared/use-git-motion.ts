'use client'

import { useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'

/**
 * Motion presets shared by every Git-internals component, in one place so the
 * post's "respect prefers-reduced-motion, never autoplay" rule is enforced
 * centrally rather than re-decided per component.
 *
 * When the user prefers reduced motion, every transition collapses to instant
 * (duration 0) and springs become snaps — the component stays fully usable, it
 * just stops animating. Nothing here ever starts on its own; these describe how
 * *user-triggered* state changes animate.
 */
export function useGitMotion() {
  const reduce = useReducedMotion()

  const instant: Transition = { duration: 0 }

  /** A soft spring for pointers/tags sliding to a new commit. */
  const spring: Transition = reduce
    ? instant
    : { type: 'spring', stiffness: 320, damping: 30 }

  /** A quick tween for hashes/labels swapping in place. */
  const swap: Transition = reduce ? instant : { duration: 0.18, ease: [0.4, 0, 0.2, 1] }

  /** A gentle draw for edges / new objects appearing. */
  const draw: Transition = reduce ? instant : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }

  return {
    reduce: Boolean(reduce),
    spring,
    swap,
    draw,
    /** Enter/exit presets for a node glowing into existence. */
    nodeAppear: {
      initial: reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 },
      animate: { opacity: 1, scale: 1 },
      exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 },
      transition: reduce ? instant : { type: 'spring', stiffness: 400, damping: 28 }
    },
    /** Enter/exit for a small caption/badge fading in. */
    fade: {
      initial: reduce ? { opacity: 1 } : { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      exit: reduce ? { opacity: 0 } : { opacity: 0, y: -4 },
      transition: swap
    }
  }
}
