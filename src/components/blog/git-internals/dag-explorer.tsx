'use client'

import { useLayoutEffect, useReducer, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@heroui/react'
import {
  GitCommitHorizontalIcon,
  GitBranchIcon,
  GitMergeIcon,
  RotateCcwIcon
} from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import StageDots from './shared/stage-dots'
import RefTag from './shared/ref-tag'
import Edge from './shared/edge'
import { hashKey, hashContent, shortHash } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

// A commit's snapshot, faked deterministically from its hash: a tree naming a
// couple of files, each mapped to a blob. Enough to peek "commit → tree → blobs".
const SNAPSHOT_FILES = ['app.py', 'utils.py', 'README.md']
function snapshotOf(commitHash: string) {
  const files = SNAPSHOT_FILES.map(name => ({
    name,
    blob: hashContent(`${commitHash}:${name}`)
  }))
  const tree = hashContent(files.map(f => `${f.name}:${f.blob}`).join(','))
  return { tree, files }
}

// ────────────────────────────────────────────────────────────────────────────
// The commit graph as Git really keeps it: a set of immutable commit objects,
// each pointing back at its parent(s). Chase those parent pointers and you have
// a directed acyclic graph — arrows always run child → parent, backwards in
// time. A normal commit has one parent; a MERGE commit is the only one with two.
// Branches are just movable names pointing at a commit; HEAD follows a branch.
//
// Adding a commit never rewrites an existing one — new content, new hash, new
// object. This model enforces exactly that.
// ────────────────────────────────────────────────────────────────────────────

type Commit = {
  hash: string
  parents: string[]
  message: string
  /** Which visual column (branch line) this commit sits in. */
  lane: number
}

type Dag = {
  commits: Record<string, Commit>
  /** Creation order → vertical position (newest last). */
  order: string[]
  /** Branch name → the commit it points at. */
  branches: Record<string, string>
  /** Branch name → its visual column, so commits stay in their own lane. */
  branchLane: Record<string, number>
  /** The active branch; HEAD points at it, new commits extend it. */
  head: string
  /** Next lane to hand out when a branch is created. */
  nextLane: number
  /** Monotonic counter so each new commit's content (and hash) is unique. */
  seq: number
  /** Hashes just created, for the draw-in emphasis. */
  fresh: string[]
  lastAction: string
}

const LANE_NAMES = ['main', 'feature', 'hotfix', 'topic']

function makeInitialDag(): Dag {
  const hash = hashKey('root commit 0')
  return {
    commits: { [hash]: { hash, parents: [], message: 'Initial commit', lane: 0 } },
    order: [hash],
    branches: { main: hash },
    branchLane: { main: 0 },
    head: 'main',
    nextLane: 1,
    seq: 1,
    fresh: [],
    lastAction: 'One commit on main. Commit, branch, and merge to grow the graph.'
  }
}

type Action =
  | { type: 'commit' }
  | { type: 'branch' }
  | { type: 'checkout'; name: string }
  | { type: 'merge'; from: string }
  | { type: 'reset' }

/** Branches other than the active one that we could merge in. */
function otherBranches(dag: Dag): string[] {
  return Object.keys(dag.branches).filter(b => b !== dag.head)
}

function reducer(dag: Dag, action: Action): Dag {
  switch (action.type) {
    case 'commit': {
      const tip = dag.branches[dag.head]
      const lane = dag.branchLane[dag.head]
      const message = `Work on ${dag.head} (#${dag.seq})`
      const hash = hashKey(`${tip} ${message} ${dag.seq}`)
      return {
        ...dag,
        commits: {
          ...dag.commits,
          [hash]: { hash, parents: [tip], message, lane }
        },
        order: [...dag.order, hash],
        branches: { ...dag.branches, [dag.head]: hash },
        seq: dag.seq + 1,
        fresh: [hash],
        lastAction: `Committed on ${dag.head}. The new commit points back at its parent ${shortHash(tip)}; ${dag.head} and HEAD moved forward.`
      }
    }

    case 'branch': {
      // New pointer at the current tip, on a fresh lane, and check it out.
      const used = new Set(Object.keys(dag.branches))
      const name = LANE_NAMES.find(n => !used.has(n))
      if (!name) return dag
      const tip = dag.branches[dag.head]
      return {
        ...dag,
        branches: { ...dag.branches, [name]: tip },
        branchLane: { ...dag.branchLane, [name]: dag.nextLane },
        head: name,
        nextLane: dag.nextLane + 1,
        fresh: [],
        lastAction: `Created branch ${name} at ${shortHash(tip)} and checked it out. A branch is just a movable name — no new commit, no new object.`
      }
    }

    case 'checkout': {
      if (!dag.branches[action.name] || action.name === dag.head) return dag
      return {
        ...dag,
        head: action.name,
        fresh: [],
        lastAction: `Checked out ${action.name}. HEAD now follows ${action.name}; new commits will extend it.`
      }
    }

    case 'merge': {
      const from = action.from
      const theirs = dag.branches[from]
      const ours = dag.branches[dag.head]
      if (!theirs || theirs === ours) return dag
      const lane = dag.branchLane[dag.head]
      const message = `Merge ${from} into ${dag.head}`
      const hash = hashKey(`${ours} ${theirs} ${message} ${dag.seq}`)
      return {
        ...dag,
        commits: {
          ...dag.commits,
          // Two parents — ours first, theirs second. This is the ONLY kind of
          // commit with more than one parent.
          [hash]: { hash, parents: [ours, theirs], message, lane }
        },
        order: [...dag.order, hash],
        branches: { ...dag.branches, [dag.head]: hash },
        seq: dag.seq + 1,
        fresh: [hash],
        lastAction: `Merged ${from} into ${dag.head}. The merge commit has TWO parents — ${shortHash(ours)} and ${shortHash(theirs)} — tying the two lines back together.`
      }
    }

    case 'reset':
      return makeInitialDag()

    default:
      return dag
  }
}

// ── layout ───────────────────────────────────────────────────────────────────

const LANE_W = 132 // px per lane column
const ROW_H = 92 // px per commit row

// ────────────────────────────────────────────────────────────────────────────

export default function DagExplorer() {
  const [dag, dispatch] = useReducer(reducer, undefined, makeInitialDag)
  const { nodeAppear, fade, spring } = useGitMotion()

  const containerRef = useRef<HTMLDivElement | null>(null)
  // One ref per commit node so edges can measure child → parent.
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Edges measure real DOM positions via refs. Bump a tick AFTER layout commits
  // (refs now populated) and feed it into each Edge's observeKey, so a freshly
  // added commit's edge re-measures against the real node instead of null.
  const [measureTick, setMeasureTick] = useState(0)
  useLayoutEffect(() => {
    setMeasureTick(t => t + 1)
  }, [dag])

  // Which commit is peeked open (→ its tree → its blobs). One at a time.
  const [openHash, setOpenHash] = useState<string | null>(null)
  const toggleOpen = (hash: string) =>
    setOpenHash(cur => (cur === hash ? null : hash))

  const laneCount = Math.max(1, ...Object.values(dag.commits).map(c => c.lane + 1))
  const rowCount = dag.order.length
  const width = laneCount * LANE_W
  // The graph grows with the number of rows; the +72 gives the last row's
  // branch/HEAD pills (which hang below the node) room so they're never clipped.
  const height = rowCount * ROW_H + 72

  // Row index (vertical position) for each commit, newest at the bottom.
  const rowOf: Record<string, number> = {}
  dag.order.forEach((hash, i) => {
    rowOf[hash] = i
  })

  // Which branch names point at a given commit (to render pills beside it).
  const refsAt: Record<string, string[]> = {}
  for (const [name, hash] of Object.entries(dag.branches)) {
    ;(refsAt[hash] ??= []).push(name)
  }

  const isFresh = (hash: string) => dag.fresh.includes(hash)
  const others = otherBranches(dag)
  const canBranch = Object.keys(dag.branches).length < LANE_NAMES.length

  return (
    <GitDemoContainer
      title='The commit graph'
      description='Every commit records the hash of the commit before it. Follow those parent pointers and the whole history is a graph — one that only ever grows and never loops, a “directed acyclic graph.” Build one here: commit to extend the current line, branch to fork a new one, and merge to tie two lines back together.'
      caption={
        <>
          Arrows point <strong>child → parent</strong> — backwards in time — because a commit
          knows what came <em>before</em> it, not after. A normal commit has exactly one parent;
          a <strong>merge</strong> commit is the only kind with two. Branches are just names that
          point at a commit, and <code>HEAD</code> points at the branch you are on. Nothing here
          is ever edited in place — each action only adds new objects.
        </>
      }
    >
      <div className='flex flex-col gap-4'>
        {/* Controls */}
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            size='sm'
            color='primary'
            radius='sm'
            startContent={<GitCommitHorizontalIcon size={15} />}
            onPress={() => dispatch({ type: 'commit' })}
          >
            Commit
          </Button>
          <Button
            size='sm'
            variant='bordered'
            radius='sm'
            startContent={<GitBranchIcon size={15} />}
            isDisabled={!canBranch}
            onPress={() => dispatch({ type: 'branch' })}
          >
            Branch
          </Button>
          {others.map(name => (
            <Button
              key={`merge-${name}`}
              size='sm'
              variant='bordered'
              radius='sm'
              startContent={<GitMergeIcon size={15} />}
              onPress={() => dispatch({ type: 'merge', from: name })}
            >
              Merge {name}
            </Button>
          ))}
          <button
            type='button'
            onClick={() => dispatch({ type: 'reset' })}
            className='ml-auto inline-flex items-center gap-1 text-[11px] text-default-400 underline-offset-2 hover:text-default-600 hover:underline'
          >
            <RotateCcwIcon size={12} />
            reset
          </button>
        </div>

        {/* Branch switcher (checkout) */}
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-[11px] uppercase tracking-wide text-default-400'>checkout:</span>
          {Object.keys(dag.branches).map(name => {
            const active = name === dag.head
            return (
              <button
                key={name}
                type='button'
                aria-pressed={active}
                onClick={() => dispatch({ type: 'checkout', name })}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-sourceCodePro text-xs font-semibold transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-default-100 text-default-500 hover:text-foreground'
                )}
              >
                <GitBranchIcon size={11} />
                {name}
              </button>
            )
          })}
        </div>

        {/* Graph (what a GUI shows) + refs readout (what Git keeps) side by side */}
        <div className='grid gap-3 lg:grid-cols-[1fr_16rem]'>
          {/* The graph */}
          <div className='relative overflow-hidden rounded-xl border border-default-100 bg-background shadow-sm'>
          <StageDots />
          <div className='relative overflow-auto p-4'>
          <div
            ref={containerRef}
            className='relative mx-auto'
            style={{ width, height, minWidth: '100%' }}
          >
            {/* Edges: child → each parent. Rendered under the nodes. */}
            {dag.order.map(hash =>
              dag.commits[hash].parents.map(parent => (
                <Edge
                  key={`${hash}->${parent}`}
                  containerRef={containerRef}
                  fromRef={{ current: nodeRefs.current[hash] ?? null }}
                  toRef={{ current: nodeRefs.current[parent] ?? null }}
                  variant={isFresh(hash) ? 'new' : 'normal'}
                  observeKey={`${measureTick}-${dag.order.length}-${hash}-${parent}`}
                />
              ))
            )}

            {/* Commit nodes, absolutely placed by (lane, row). */}
            {dag.order.map(hash => {
              const commit = dag.commits[hash]
              const isMerge = commit.parents.length > 1
              const top = rowOf[hash] * ROW_H
              const left = commit.lane * LANE_W
              const pills = refsAt[hash] ?? []
              const headHere = pills.includes(dag.head)

              // ONE entrance animation per node, and no per-render literals: every
              // node uses the same stable `nodeAppear` preset (fixed initial →
              // animate → transition). A "fresh" commit is emphasised with a static
              // ring (state='new'), NOT a keyframe pulse — a keyframe `animate`
              // object rebuilt each render (plus the measureTick re-render) made
              // framer restart the entrance, which read as a fade-out-then-in.

              return (
                <motion.div
                  key={hash}
                  layout
                  initial={nodeAppear.initial}
                  animate={nodeAppear.animate}
                  exit={nodeAppear.exit}
                  transition={nodeAppear.transition}
                  className='absolute'
                  style={{ top, left, width: LANE_W }}
                >
                  <div className='flex flex-col items-start gap-1'>
                    <div
                      ref={el => {
                        nodeRefs.current[hash] = el
                      }}
                      className='inline-block'
                    >
                      <GitObjectNode
                        type='commit'
                        hash={hash}
                        label={isMerge ? `⑃ ${commit.message}` : commit.message}
                        state={isFresh(hash) ? 'new' : headHere ? 'head' : 'normal'}
                        hideBadge
                        compact
                      />
                    </div>
                    {/* Branch / HEAD pills that point at this commit. */}
                    {pills.length > 0 && (
                      <motion.div layout transition={spring} className='flex flex-wrap gap-1'>
                        {pills.map(name => (
                          <RefTag key={name} name={name} variant='branch' />
                        ))}
                        {headHere && <RefTag name='HEAD' variant='head' />}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
          </div>
          </div>

          {/* Whole-.git readout — the FULL recap, both halves at once. The graph
              on the left is what a GUI shows; this is everything Git actually keeps
              under the hood: the OBJECTS (Part 1) and the POINTERS (Part 2). Both
              fill as you drive the graph — closing the loop from the git-init opener. */}
          <div className='rounded-xl bg-default-100 p-4 font-sourceCodePro shadow-sm'>
            <div className='mb-3 text-xs font-medium text-default-500'>
              everything in <span className='text-default-600'>.git/</span>
            </div>

            {/* Half 1 — the object store (Part 1). Each commit shown as a real
                sharded entry, parallel to the refs files below. */}
            <div className='mb-1 flex items-center gap-1.5 text-[11px] text-default-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-primary' />
              objects/ · the stuff
            </div>
            <div className='mb-1 max-h-52 space-y-1 overflow-auto pr-1'>
              <AnimatePresence initial={false}>
                {dag.order.map(hash => {
                  const isMerge = dag.commits[hash].parents.length > 1
                  const open = openHash === hash
                  const { tree, files } = snapshotOf(hash)
                  return (
                    <motion.div
                      key={hash}
                      layout
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={fade.transition}
                    >
                      <button
                        type='button'
                        onClick={() => toggleOpen(hash)}
                        className='flex w-full items-center gap-1 rounded-md bg-background px-2 py-1 text-left shadow-sm transition-colors hover:bg-default-200/40'
                      >
                        <span className='text-default-400'>{open ? '▾' : '▸'}</span>
                        <ShardHash hash={hash} />
                        <span className='ml-auto text-[10px] text-default-400'>
                          commit{isMerge ? ' (merge)' : ''}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            className='overflow-hidden'
                          >
                            <div className='ml-3 mt-1 space-y-1 border-l border-default-200 pl-2 dark:border-default-100'>
                              <div className='flex items-center gap-1 rounded-md bg-background px-2 py-1'>
                                <ShardHash hash={tree} color='text-primary' />
                                <span className='ml-auto text-[10px] text-default-400'>tree</span>
                              </div>
                              {files.map(f => (
                                <div
                                  key={f.name}
                                  className='flex items-center gap-1 rounded-md bg-background px-2 py-1'
                                >
                                  <ShardHash hash={f.blob} color='text-secondary' />
                                  <span className='ml-auto text-[10px] text-default-400'>
                                    blob · {f.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <p className='mb-3 text-[10px] leading-snug text-default-400'>
              Click a commit to see the <span className='text-primary'>tree</span> and{' '}
              <span className='text-secondary'>blobs</span> it wrote — all sit here in{' '}
              <code>objects/</code> too.
            </p>

            {/* Half 2 — the pointers (Part 2) */}
            <div className='mb-1 flex items-center gap-1.5 text-[11px] text-default-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-secondary' />
              refs/ + HEAD · the pointers
            </div>
            <div className='space-y-1.5'>
              {Object.entries(dag.branches).map(([name, hash]) => {
                const isHead = name === dag.head
                return (
                  <div
                    key={name}
                    className='flex items-center gap-1.5 rounded-md bg-background px-2 py-1.5 shadow-sm'
                  >
                    <span className='text-[10px] text-default-400'>heads/</span>
                    <span
                      className={cn(
                        'text-[11px]',
                        isHead ? 'font-semibold text-success' : 'text-default-500'
                      )}
                    >
                      {name}
                    </span>
                    <AnimatePresence mode='wait'>
                      <motion.code
                        key={hash}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={fade.transition}
                        className='ml-auto text-[11px] font-semibold text-foreground'
                      >
                        {shortHash(hash)}
                      </motion.code>
                    </AnimatePresence>
                  </div>
                )
              })}
              <div className='flex items-center gap-1.5 rounded-md bg-background px-2 py-1.5 shadow-sm'>
                <span className='text-[11px] text-default-500'>HEAD</span>
                <AnimatePresence mode='wait'>
                  <motion.code
                    key={dag.head}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade.transition}
                    className='ml-auto text-[10px] text-foreground'
                  >
                    ref: …/{dag.head}
                  </motion.code>
                </AnimatePresence>
              </div>
            </div>

            <p className='mt-3 text-[10px] leading-snug text-default-400'>
              That’s the whole machine: an <span className='text-secondary'>object
              store</span> plus <span className='text-success'>pointers</span> into it.
              Every button only <em>writes an object</em> or <em>moves a pointer</em>.
            </p>
          </div>
        </div>

        {/* Narration */}
        <AnimatePresence mode='wait'>
          <motion.p
            key={dag.lastAction}
            {...fade}
            aria-live='polite'
            className='rounded-lg bg-default-100 px-3 py-2 text-xs leading-5 text-default-600 shadow-sm'
          >
            {dag.lastAction}
          </motion.p>
        </AnimatePresence>
      </div>
    </GitDemoContainer>
  )
}

/**
 * A git object filename: 2-char folder + the remaining hash. Together they ARE
 * the hash — the folder is just sharding, not a directory of files-by-name.
 */
function ShardHash({ hash, color = 'text-foreground' }: { hash: string; color?: string }) {
  return (
    <>
      <span className='text-[10px] text-default-400'>{hash.slice(0, 2)}/</span>
      <span className={cn('text-[11px] font-semibold', color)}>{hash.slice(2, 9)}</span>
    </>
  )
}
