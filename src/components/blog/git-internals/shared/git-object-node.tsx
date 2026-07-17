'use client'

import { forwardRef } from 'react'
import { cn } from '@heroui/react'
import { FileIcon, FolderIcon, GitCommitHorizontalIcon } from 'lucide-react'

import {
  OBJECT_STYLES,
  OBJECT_LABELS,
  STATE_STYLES,
  type GitObjectType,
  type GitNodeState
} from './palette'

const GLYPHS = {
  blob: FileIcon,
  tree: FolderIcon,
  commit: GitCommitHorizontalIcon
}

type GitObjectNodeProps = {
  type: GitObjectType
  /** The 7-char hash to show. */
  hash: string
  /** Optional human label (a filename for a blob, a message for a commit). */
  label?: string
  state?: GitNodeState
  /** Hide the "blob"/"tree"/"commit" badge when the context already makes it obvious. */
  hideBadge?: boolean
  /** Tighter padding + smaller footprint, for dense layouts like the pipeline. */
  compact?: boolean
  className?: string
  /** Optional click handler — makes the node a real button when provided. */
  onClick?: () => void
  title?: string
}

/**
 * The atom of the whole post: one blob / tree / commit box, styled from the
 * shared palette so a blob looks the same everywhere. `forwardRef` lets later
 * components hang edges off it (child → parent). Commits render a touch larger;
 * the `head` state adds the purple ring that marks where HEAD points.
 */
const GitObjectNode = forwardRef<HTMLDivElement, GitObjectNodeProps>(
  (
    {
      type,
      hash,
      label,
      state = 'normal',
      hideBadge = false,
      compact = false,
      className,
      onClick,
      title
    },
    ref
  ) => {
    const styles = OBJECT_STYLES[type]
    const Glyph = GLYPHS[type]
    const isCommit = type === 'commit'
    const interactive = Boolean(onClick)

    return (
      <div
        ref={ref}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        title={title}
        onClick={onClick}
        onKeyDown={
          interactive
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick?.()
                }
              }
            : undefined
        }
        className={cn(
          'inline-flex flex-col rounded-lg border transition-shadow',
          compact ? 'gap-0.5 p-1.5' : 'gap-1 rounded-xl p-2.5',
          compact
            ? 'min-w-[5.5rem]'
            : isCommit
              ? 'min-w-[7.5rem]'
              : 'min-w-[6.5rem]',
          styles.container,
          STATE_STYLES[state],
          interactive &&
            'cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className
        )}
      >
        <div className={cn('flex items-center', compact ? 'gap-1' : 'gap-1.5')}>
          <Glyph size={compact ? 12 : 14} className={styles.accent} aria-hidden />
          {!hideBadge && (
            <span
              className={cn(
                'rounded font-semibold uppercase tracking-wide',
                compact ? 'px-1 py-0 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
                styles.badge
              )}
            >
              {OBJECT_LABELS[type]}
            </span>
          )}
        </div>

        <code
          className={cn(
            'font-sourceCodePro font-semibold',
            compact ? 'text-xs' : 'text-sm',
            styles.accent
          )}
        >
          {hash}
        </code>

        {label && (
          <span
            className={cn(
              'truncate text-default-500',
              compact ? 'max-w-[7rem] text-[10px]' : 'max-w-[9rem] text-[11px]'
            )}
            title={label}
          >
            {label}
          </span>
        )}
      </div>
    )
  }
)

GitObjectNode.displayName = 'GitObjectNode'

export default GitObjectNode
