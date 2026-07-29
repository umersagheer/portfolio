'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@heroui/react'
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  RotateCcwIcon,
  TerminalIcon
} from 'lucide-react'

// One job: reader clicks `git init`, the .git tree reveals — collapsed to the
// root so the "two halves + scratchpad" shape reads at a glance. objects/ and
// refs/ expand on demand for the curious; everything is one calm color, and the
// role annotations (← the stuff / the pointers) are baked in, not hidden.

type Half = 'stuff' | 'pointer' | 'scratch' | 'plumbing'

type Node = {
  id: string
  label: string
  kind: 'folder' | 'file'
  half: Half
  role?: string // the "← the stuff" annotation
  note?: string // the trailing "— every file…" gloss
  children?: Node[]
}

const TREE: Node[] = [
  {
    id: 'objects',
    label: 'objects/',
    kind: 'folder',
    half: 'stuff',
    role: 'the stuff',
    note: "every file & commit you've saved",
    children: [
      {
        id: 'obj-6f',
        label: '6f/',
        kind: 'folder',
        half: 'stuff',
        note: 'objects sharded by the first 2 hash chars',
        children: [
          {
            id: 'obj-6f-blob',
            label: '2c1a…9e',
            kind: 'file',
            half: 'stuff',
            note: 'one object, named by its hash'
          }
        ]
      }
    ]
  },
  {
    id: 'refs',
    label: 'refs/',
    kind: 'folder',
    half: 'pointer',
    role: 'the pointers',
    note: 'names that point at commits',
    children: [
      {
        id: 'refs-heads',
        label: 'heads/',
        kind: 'folder',
        half: 'pointer',
        note: 'your branches — one tiny file each',
        children: [
          {
            id: 'refs-heads-main',
            label: 'main',
            kind: 'file',
            half: 'pointer',
            note: 'holds a single commit hash'
          }
        ]
      },
      { id: 'refs-tags', label: 'tags/', kind: 'folder', half: 'pointer' },
      { id: 'refs-remotes', label: 'remotes/', kind: 'folder', half: 'pointer' }
    ]
  },
  {
    id: 'head',
    label: 'HEAD',
    kind: 'file',
    half: 'pointer',
    role: 'the pointer',
    note: "which branch you're on right now"
  },
  {
    id: 'index',
    label: 'index',
    kind: 'file',
    half: 'scratch',
    role: 'a scratchpad',
    note: 'what your next commit will contain'
  },
  {
    id: 'plumbing',
    label: 'config, hooks/, description, …',
    kind: 'file',
    half: 'plumbing',
    role: 'plumbing',
    note: 'safe to ignore today'
  }
]

const HALF_DOT: Record<Half, string> = {
  stuff: 'bg-primary',
  pointer: 'bg-secondary',
  scratch: 'bg-warning',
  plumbing: 'bg-default-400'
}

type Row = { node: Node; depth: number }

function flatten(nodes: Node[], expanded: Set<string>, depth = 0): Row[] {
  return nodes.flatMap(node => {
    const row: Row = { node, depth }
    if (node.kind === 'folder' && node.children && expanded.has(node.id)) {
      return [row, ...flatten(node.children, expanded, depth + 1)]
    }
    return [row]
  })
}

export default function GitInitTerminal() {
  const [ran, setRan] = useState(false)
  // once the initial `git init` reveal has staggered in, later expands should be
  // instant + synchronized — no per-row delay leaking into interactions.
  const [revealed, setRevealed] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function run() {
    setRan(true)
    // let the entrance stagger play out once, then mark reveal complete
    setTimeout(() => setRevealed(true), 600)
  }

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function reset() {
    setRan(false)
    setRevealed(false)
    setExpanded(new Set())
  }

  const rows = flatten(TREE, expanded)

  return (
    <div className='my-8 overflow-hidden rounded-xl border border-default-200 bg-default-50 font-mono text-sm dark:border-default-100'>
      {/* terminal title bar */}
      <div className='flex items-center gap-2 border-b border-default-200 bg-default-100/60 px-4 py-2 dark:border-default-100'>
        <TerminalIcon size={14} className='text-default-500' />
        <span className='text-xs text-default-500'>your-project — zsh</span>
        {ran && (
          <button
            type='button'
            onClick={reset}
            className='ml-auto flex items-center gap-1 text-xs text-default-500 transition-colors hover:text-foreground'
          >
            <RotateCcwIcon size={12} /> run again
          </button>
        )}
      </div>

      <div className='p-4'>
        {/* the command line */}
        <button
          type='button'
          onClick={run}
          disabled={ran}
          className={cn(
            'group flex w-full items-center gap-2 rounded-md px-1 py-1 text-left transition-colors',
            !ran && 'hover:bg-white/[0.03]'
          )}
        >
          <span className='select-none text-success'>$</span>
          <span className='text-foreground'>git init</span>
          {!ran && (
            <span className='ml-2 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors group-hover:bg-primary/20'>
              click to run ▸
            </span>
          )}
          {!ran && (
            <span className='ml-0.5 inline-block h-4 w-2 animate-pulse bg-default-400' />
          )}
        </button>

        <AnimatePresence>
          {ran && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className='overflow-hidden'
            >
              <p className='mb-3 mt-1 pl-3 text-xs text-default-500'>
                Initialized empty Git repository in{' '}
                <span className='text-default-600'>./.git/</span>
              </p>

              <div className='space-y-0.5'>
                <div className='px-1 py-1 text-default-500'>.git/</div>

                {rows.map(({ node, depth }, i) => {
                  const isFolder =
                    node.kind === 'folder' && !!node.children?.length
                  const isOpen = expanded.has(node.id)
                  const isDeep = depth > 0 // children are dimmer — the optional layer
                  // the two rows that DEFINE the halves carry the headline
                  const isHeadline = node.id === 'objects' || node.id === 'refs'

                  return (
                    <motion.div
                      key={node.id}
                      layout
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        // stagger only the first reveal; expands are instant so
                        // layout (FLIP) can move insert + push-down on one clock
                        layout: { type: 'spring', stiffness: 700, damping: 44 },
                        opacity: {
                          duration: 0.2,
                          delay: revealed ? 0 : 0.15 + i * 0.05
                        },
                        x: {
                          duration: 0.2,
                          delay: revealed ? 0 : 0.15 + i * 0.05
                        }
                      }}
                      className='flex items-center gap-2 rounded-md py-1 transition-colors hover:bg-white/[0.02]'
                      style={{ paddingLeft: `${8 + depth * 22}px` }}
                    >
                      {/* expand caret (folders with children only) */}
                      {isFolder ? (
                        <button
                          type='button'
                          onClick={() => toggle(node.id)}
                          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${node.label}`}
                          className='text-default-500 transition-colors hover:text-foreground'
                        >
                          <ChevronRightIcon
                            size={13}
                            className={cn(
                              'transition-transform',
                              isOpen && 'rotate-90'
                            )}
                          />
                        </button>
                      ) : (
                        <span className='w-[13px]' />
                      )}

                      {/* half dot — the only color, tying each row to its half */}
                      <span
                        className={cn(
                          'h-1.5 w-1.5 shrink-0 rounded-full',
                          HALF_DOT[node.half],
                          isDeep && 'opacity-50'
                        )}
                      />

                      {/* icon */}
                      {node.kind === 'folder' ? (
                        isOpen ? (
                          <FolderOpenIcon
                            size={14}
                            className='shrink-0 text-default-500'
                          />
                        ) : (
                          <FolderIcon
                            size={14}
                            className='shrink-0 text-default-500'
                          />
                        )
                      ) : (
                        <FileIcon
                          size={14}
                          className='shrink-0 text-default-400'
                        />
                      )}

                      {/* name — loudest signal; the two half-defining rows are
                          slightly heavier so the split reads before anything else */}
                      <span
                        className={cn(
                          'shrink-0',
                          isDeep
                            ? 'text-default-500'
                            : isHeadline
                              ? 'font-medium text-foreground'
                              : 'text-foreground'
                        )}
                      >
                        {node.label}
                      </span>

                      {/* role — the teaching payload; bright on the headline rows,
                          quieter on the footnote rows (index / plumbing) */}
                      {node.role && (
                        <span
                          className={cn(
                            'ml-2 hidden shrink-0 sm:inline',
                            isHeadline ? 'text-default-500' : 'text-default-400'
                          )}
                        >
                          ←{' '}
                          <span
                            className={cn(
                              isHeadline
                                ? 'font-medium text-foreground/90'
                                : 'text-default-500'
                            )}
                          >
                            {node.role}
                          </span>
                        </span>
                      )}

                      {/* trailing gloss — quietest, optional detail */}
                      {node.note && (
                        <span className='ml-2 truncate text-xs text-default-400/80'>
                          — {node.note}
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              <p className='mt-4 border-t border-default-200 pt-3 text-xs text-default-500 dark:border-default-100'>
                <span className='inline-flex items-center gap-1.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary' /> the
                  stuff
                </span>
                <span className='mx-3 inline-flex items-center gap-1.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-secondary' /> the
                  pointers
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-warning' />{' '}
                  scratchpad
                </span>
                <span className='ml-3 text-default-400'>
                  · expand <span className='text-default-500'>objects/</span> and{' '}
                  <span className='text-default-500'>refs/</span> to look deeper
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
