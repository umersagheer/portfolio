/**
 * The shared visual language for every Git-internals component.
 *
 * One place to tweak how a blob / tree / commit / ref looks, so the whole post
 * reads as a single coherent teaching tool. Components import these class
 * bundles instead of hardcoding colors, which keeps blobs blue and trees purple
 * *everywhere* in the post.
 *
 * Tokens map to the app's semantic Tailwind palette:
 *   blob   → secondary (blue)
 *   tree   → primary   (purple)
 *   commit → default, with a primary ring when it's the HEAD commit
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

/** Resting styles per object type. State overlays (new/orphaned/head) apply on top. */
export const OBJECT_STYLES: Record<GitObjectType, ObjectStyle> = {
  blob: {
    container: 'border-secondary-200 bg-secondary-50 dark:border-secondary-800',
    badge: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50',
    accent: 'text-secondary-600'
  },
  tree: {
    container: 'border-primary-200 bg-primary-50 dark:border-primary-800',
    badge: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50',
    accent: 'text-primary-600'
  },
  commit: {
    container: 'border-default-200 bg-default-100 dark:border-default-100',
    badge: 'bg-default-200 text-default-700 dark:bg-default-200',
    accent: 'text-foreground'
  }
}

/** State overlays layered on top of the resting object style. */
export const STATE_STYLES: Record<GitNodeState, string> = {
  normal: '',
  /** Freshly created object — purple glow to draw the eye on first appearance. */
  new: 'ring-2 ring-primary-400/60 shadow-lg shadow-primary-500/20',
  /** Unreferenced / orphaned — dashed + dimmed, teeing up reflog recovery. */
  orphaned: 'border-dashed opacity-45 saturate-50',
  /** The commit HEAD currently points at — purple ring, always the focal point. */
  head: 'ring-2 ring-primary-500'
}

/** Branch / HEAD sticky-note pills. */
export const REF_STYLES = {
  branch:
    'border-success-300 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/40 dark:text-success-300',
  head: 'border-primary-400 bg-background text-primary-600 dark:border-primary-500',
  detached: 'border-warning-400 bg-warning-50 text-warning-700 dark:bg-warning-900/40'
}

/**
 * Edges connecting nodes (always drawn child → parent by the caller).
 * The `--heroui-*` vars hold HSL channels, so they must be wrapped in hsl().
 */
export const EDGE = {
  stroke: 'hsl(var(--heroui-default-400))',
  strokeNew: 'hsl(var(--heroui-primary))',
  strokeOrphaned: 'hsl(var(--heroui-default-300))'
}

/** Human-readable labels for the type badge. */
export const OBJECT_LABELS: Record<GitObjectType, string> = {
  blob: 'blob',
  tree: 'tree',
  commit: 'commit'
}
