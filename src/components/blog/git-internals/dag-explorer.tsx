'use client'

import { useReducer, useRef } from 'react'
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
import RefTag from './shared/ref-tag'
import Edge from './shared/edge'
import { hashKey, shortHash } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

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
  const { nodeAppear, fade, hold, spring } = useGitMotion()

  const containerRef = useRef<HTMLDivElement | null>(null)
  // One ref per commit node so edges can measure child → parent.
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const laneCount = Math.max(1, ...Object.values(dag.commits).map(c => c.lane + 1))
  const rowCount = dag.order.length
  const width = laneCount * LANE_W
  const height = rowCount * ROW_H

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

        {/* The graph */}
        <div className='overflow-auto rounded-xl bg-default-100 p-4 shadow-sm'>
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
                  observeKey={`${dag.order.length}-${hash}-${parent}`}
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

              return (
                <motion.div
                  key={hash}
                  layout
                  {...nodeAppear}
                  {...(isFresh(hash) ? hold : {})}
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
