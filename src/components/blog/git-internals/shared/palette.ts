/**
 * The shared visual language for every Git-internals component.
 *
 * Deliberately a *small, flat* system: only base semantic tokens — gray
 * (`surface` / `muted`), `accent`, `secondary`, plus `success` / `danger` for
 * the two states that need them. No tint/shade ladders (`-400`, `-500`, …), no
 * hardcoded hex. Base tokens (`accent`, `secondary`, `success`, …) already
 * adapt to light/dark on their own, so we lean on them everywhere.
 * (`secondary` is a brand token defined in globals.css — HeroUI v3 has none.)
 *
 *   blob   → secondary   (blue)
 *   tree   → accent      (purple)
 *   commit → surface     (gray), with an accent ring when it is HEAD
 *   ref    → success     (branch / HEAD tags)
 *   added / staged → success   |   removed → danger
 *
 * Borders live at TWO scales, and they are treated differently:
 *   - object *nodes* (blob/tree/commit boxes, ref pills) keep a thin colored
 *     border — that outline IS their identity, so it stays.
 *   - *container surfaces* (panels, zones, shells, cards) carry NO border. They
 *     separate by a one-step background-contrast + a single soft shadow instead.
 * So the tokens below are only ever applied to nodes; surfaces are styled inline.
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
 * `surface-secondary` gray (reads correctly in both themes); accents use the color's
 * base token. State overlays (new / orphaned / head) apply on top.
 */
export const OBJECT_STYLES: Record<GitObjectType, ObjectStyle> = {
  blob: {
    // translucent surface + a faint color tint so backdrop-blur reads as frosted
    // glass over the dotted stage.
    container: 'border-secondary bg-secondary/10',
    badge: 'bg-secondary text-secondary-foreground',
    accent: 'text-secondary'
  },
  tree: {
    container: 'border-accent bg-accent/10',
    badge: 'bg-accent text-accent-foreground',
    accent: 'text-accent'
  },
  commit: {
    container: 'border-border-secondary bg-surface-secondary/60',
    badge: 'bg-surface-tertiary text-foreground',
    accent: 'text-foreground'
  }
}

/**
 * State overlays layered on top of the resting object style — base tokens only.
 * Rings are `ring-1` so they sit gently next to the thin node borders rather
 * than shouting.
 */
export const STATE_STYLES: Record<GitNodeState, string> = {
  normal: '',
  /** Freshly created object — a primary ring to draw the eye on first appearance. */
  new: 'ring-1 ring-accent',
  /** Unreferenced / orphaned — dashed gray border + muted gray text. */
  orphaned: 'border-dashed border-border-secondary text-muted',
  /** The commit HEAD currently points at — a primary ring, the focal point. */
  head: 'ring-1 ring-accent'
}

/** Branch / HEAD sticky-note pills — success for branches, primary outline for HEAD. */
export const REF_STYLES = {
  branch: 'border-success bg-surface text-success',
  head: 'border-accent bg-surface text-accent',
  detached: 'border-danger bg-surface text-danger'
}

/**
 * Edges connecting nodes (always drawn child → parent by the caller). The
 * v3 theme vars hold complete oklch() colours, so they are used directly. Base
 * tokens only: neutral gray by default, primary when newly drawn.
 */
export const EDGE = {
  stroke: 'var(--border)',
  strokeNew: 'var(--accent)',
  strokeOrphaned: 'var(--border)'
}

/** Human-readable labels for the type badge. */
export const OBJECT_LABELS: Record<GitObjectType, string> = {
  blob: 'blob',
  tree: 'tree',
  commit: 'commit'
}
