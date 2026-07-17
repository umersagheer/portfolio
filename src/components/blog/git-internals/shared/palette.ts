/**
 * The shared visual language for every Git-internals component.
 *
 * Deliberately a *small, flat* system: only base semantic tokens — gray
 * (`default`), `primary`, `secondary`, plus `success` / `danger` for the two
 * states that need them. No tint/shade ladders (`-400`, `-500`, …), no opacity
 * fills, no hardcoded hex. Base tokens (`primary`, `secondary`, `success`, …)
 * already adapt to light/dark on their own, so we lean on them everywhere.
 *
 *   blob   → secondary   (blue)
 *   tree   → primary     (purple)
 *   commit → default     (gray), with a primary ring when it is HEAD
 *   ref    → success     (branch / HEAD tags)
 *   added / staged → success   |   removed → danger
 */

export type GitObjectType = 'blob' | 'tree' | 'commit'
export type GitNodeState = 'normal' | 'new' | 'orphaned' | 'head'

type ObjectStyle = {
  /** Border + background of the node box in its resting state. */
  container: string
  /** The little type badge ("blob" / "tree" / "commit"). */
  badge: string
  /** Accent text (hash, glyph). */
  accent: string
}

/**
 * Resting styles per object type — base tokens only. Surfaces use the neutral
 * `default-100` gray (reads correctly in both themes); accents use the color's
 * base token. State overlays (new / orphaned / head) apply on top.
 */
export const OBJECT_STYLES: Record<GitObjectType, ObjectStyle> = {
  blob: {
    container: 'border-secondary bg-default-50',
    badge: 'bg-secondary text-secondary-foreground',
    accent: 'text-secondary'
  },
  tree: {
    container: 'border-primary bg-default-50',
    badge: 'bg-primary text-primary-foreground',
    accent: 'text-primary'
  },
  commit: {
    container: 'border-default-300 bg-default-100',
    badge: 'bg-default-200 text-foreground',
    accent: 'text-foreground'
  }
}

/** State overlays layered on top of the resting object style — base tokens only. */
export const STATE_STYLES: Record<GitNodeState, string> = {
  normal: '',
  /** Freshly created object — a primary ring to draw the eye on first appearance. */
  new: 'ring-2 ring-primary',
  /** Unreferenced / orphaned — dashed gray border + muted gray text. */
  orphaned: 'border-dashed border-default-300 text-default-400',
  /** The commit HEAD currently points at — a primary ring, the focal point. */
  head: 'ring-2 ring-primary'
}

/** Branch / HEAD sticky-note pills — success for branches, primary outline for HEAD. */
export const REF_STYLES = {
  branch: 'border-success bg-default-50 text-success',
  head: 'border-primary bg-default-50 text-primary',
  detached: 'border-danger bg-default-50 text-danger'
}

/**
 * Edges connecting nodes (always drawn child → parent by the caller). The
 * `--heroui-*` vars hold HSL channels, so they must be wrapped in hsl(). Base
 * tokens only: neutral gray by default, primary when newly drawn.
 */
export const EDGE = {
  stroke: 'hsl(var(--heroui-default-300))',
  strokeNew: 'hsl(var(--heroui-primary))',
  strokeOrphaned: 'hsl(var(--heroui-default-300))'
}

/** Human-readable labels for the type badge. */
export const OBJECT_LABELS: Record<GitObjectType, string> = {
  blob: 'blob',
  tree: 'tree',
  commit: 'commit'
}
