'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@heroui/react'
import {
  GitCommitHorizontalIcon,
  GitBranchIcon,
  MoveRightIcon,
  RotateCcwIcon
} from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import StageDots from './shared/stage-dots'
import { hashKey, shortHash } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

// ONE job: make the indirection visible. HEAD → a branch → a commit. Checkout
// SWINGS HEAD's arrow between branches and rewrites .git/HEAD's one line; commit
// slides the active branch forward while HEAD stays aimed at it (HEAD follows
// for free). Detached HEAD is only teased in prose — not here.

type BranchName = 'main' | 'feature'

const ROOT = hashKey('head-demo root')

export default function HeadPointer() {
  const [tips, setTips] = useState<Record<BranchName, string>>({
    main: ROOT,
    feature: ROOT
  })
  const [head, setHead] = useState<BranchName>('main')
  const [seq, setSeq] = useState(1)
  const [note, setNote] = useState(
    'HEAD holds "ref: refs/heads/main" — it points at a branch, not a commit. Switch and commit to see the two hops move.'
  )
  const { swap, spring } = useGitMotion()

  function checkout(name: BranchName) {
    if (name === head) return
    setHead(name)
    setNote(
      `Checked out ${name}. The only thing that changed is one line in .git/HEAD → "ref: refs/heads/${name}". No files, no commits touched.`
    )
  }

  function commit() {
    const newHash = hashKey(`${tips[head]} ${head} ${seq}`)
    setTips(t => ({ ...t, [head]: newHash }))
    setSeq(s => s + 1)
    setNote(
      `Committed on ${head}. The branch slid forward to ${shortHash(newHash)} — and HEAD didn't move at all. It still just says "ref: refs/heads/${head}"; the branch did the moving.`
    )
  }

  function reset() {
    setTips({ main: ROOT, feature: ROOT })
    setHead('main')
    setSeq(1)
    setNote(
      'HEAD holds "ref: refs/heads/main" — it points at a branch, not a commit. Switch and commit to see the two hops move.'
    )
  }

  const branches: BranchName[] = ['main', 'feature']

  return (
    <GitDemoContainer
      title='HEAD is a pointer to a pointer'
      description='HEAD does not hold a commit — it holds the name of a branch. Follow the two hops: HEAD → a branch → a commit. Check out a branch to swing HEAD; commit to slide a branch forward while HEAD stays put.'
      caption={
        <>
          <code>.git/HEAD</code> normally holds <code>ref: refs/heads/&lt;name&gt;</code> — a
          reference to a branch, not a commit. Because HEAD points at the branch, committing moves
          the branch and HEAD comes along for free; only <em>checkout</em> rewrites HEAD itself.
        </>
      }
    >
      {/* controls */}
      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={commit}
          className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95'
        >
          <GitCommitHorizontalIcon size={15} /> Commit on {head}
        </button>
        <span className='ml-1 text-[11px] uppercase tracking-wide text-default-400'>
          checkout:
        </span>
        {branches.map(b => (
          <button
            key={b}
            type='button'
            onClick={() => checkout(b)}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-sourceCodePro text-xs font-semibold transition-colors',
              b === head
                ? 'bg-primary text-primary-foreground'
                : 'bg-default-100 text-default-500 hover:text-foreground'
            )}
          >
            <GitBranchIcon size={11} />
            {b}
          </button>
        ))}
        <button
          type='button'
          onClick={reset}
          className='ml-auto inline-flex items-center gap-1 text-[11px] text-default-400 transition-colors hover:text-default-600'
        >
          <RotateCcwIcon size={12} /> reset
        </button>
      </div>

      {/* The chain: HEAD → branch → commit, drawn as three columns */}
      <div className='relative overflow-hidden rounded-xl border border-default-100 bg-background p-5 shadow-sm'>
        <StageDots />
        <div className='relative grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-x-2 gap-y-4'>
          {/* Column headers */}
          <div className='text-[10px] uppercase tracking-wide text-default-400'>HEAD</div>
          <div />
          <div className='text-[10px] uppercase tracking-wide text-default-400'>branches</div>
          <div />
          <div className='text-[10px] uppercase tracking-wide text-default-400'>commits</div>

          {/* HEAD box (spans both branch rows, arrow swings to the active one) */}
          <div className='row-span-2 self-center'>
            <div className='inline-flex flex-col items-center gap-1 rounded-lg border border-primary bg-default-50 px-3 py-2'>
              <span className='rounded bg-primary px-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground'>
                HEAD
              </span>
              <div className='relative h-4 w-[7.5rem] text-center'>
                <AnimatePresence mode='wait'>
                  <motion.code
                    key={head}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={swap}
                    className='absolute inset-0 font-sourceCodePro text-[10px] text-foreground'
                  >
                    ref: …/{head}
                  </motion.code>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Arrow from HEAD → active branch (swings toward whichever row is active) */}
          <div className='row-span-2 flex items-center justify-center'>
            <motion.div
              animate={{ y: head === 'main' ? -24 : 24 }}
              transition={spring}
              className='text-primary'
            >
              <MoveRightIcon size={26} strokeWidth={2.25} />
            </motion.div>
          </div>

          {/* Branch rows */}
          {branches.map(b => {
            const isHead = b === head
            return (
              <BranchRow
                key={b}
                name={b}
                tip={tips[b]}
                isHead={isHead}
                swap={swap}
              />
            )
          })}
        </div>
      </div>

      {/* narration */}
      <AnimatePresence mode='wait'>
        <motion.p
          key={note}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className='mt-4 rounded-lg bg-default-100 px-3 py-2 text-xs leading-5 text-default-600 shadow-sm'
        >
          {note}
        </motion.p>
      </AnimatePresence>
    </GitDemoContainer>
  )
}

/** One branch → its commit, laid across the branches + commits columns. */
function BranchRow({
  name,
  tip,
  isHead,
  swap
}: {
  name: BranchName
  tip: string
  isHead: boolean
  swap: ReturnType<typeof useGitMotion>['swap']
}) {
  return (
    <>
      {/* branch pointer box */}
      <div>
        <div
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-2 py-1 font-sourceCodePro text-xs font-semibold transition-colors',
            isHead
              ? 'border-success bg-default-50 text-success'
              : 'border-default-200 bg-default-50 text-default-400'
          )}
        >
          <GitBranchIcon size={11} />
          {name}
        </div>
      </div>

      {/* branch → commit arrow */}
      <div className='flex items-center justify-center text-default-400'>
        <MoveRightIcon size={20} strokeWidth={2} />
      </div>

      {/* the commit this branch points at */}
      <div>
        <AnimatePresence mode='wait'>
          <motion.div
            key={tip}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={swap}
          >
            <GitObjectNode
              type='commit'
              hash={tip}
              state={isHead ? 'head' : 'normal'}
              hideBadge
              compact
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
