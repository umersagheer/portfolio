'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@heroui/react'
import { ArrowDownIcon, RotateCcwIcon } from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import StageDots from './shared/stage-dots'
import { hashContent } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

// ONE job: watch the three object types stack. Two panels driven by the same
// steps — LEFT shows .git/objects filling up (continuity with the git init
// opener), RIGHT shows the pointer stack (commit → tree → blob). No typeable
// terminal / no add-vs-commit workflow — that scope belongs to another section.

const FILES = [
  { name: 'app.py', content: 'print("hi")' },
  { name: 'utils.py', content: 'def add(a, b): return a + b' }
]
const COMMIT_MSG = 'first commit'

type Step = 0 | 1 | 2 | 3 // 0 = empty, 1 = blobs, 2 = +tree, 3 = +commit

const blobHashes = FILES.map(f => hashContent(f.content))
const treeHash = hashContent(
  FILES.map((f, i) => `${f.name}:${blobHashes[i]}`).join(',')
)
const commitHash = hashContent(`${treeHash}:${COMMIT_MSG}`)

const STEPS: { at: Step; label: string; caption: string }[] = [
  {
    at: 1,
    label: 'add 2 files',
    caption:
      'Git stores each file’s bytes as its own blob — content only, no names yet.'
  },
  {
    at: 2,
    label: 'name them (tree)',
    caption:
      'One tree lists both files, mapping each name to its blob’s hash. That’s why a tree exists — it names the directory.'
  },
  {
    at: 3,
    label: 'commit',
    caption:
      'A commit points at that tree and adds history — author, message, parent.'
  }
]

// Each object, as it lands in .git/objects — sharded by the first 2 hash chars.
const STORE_ROWS = [
  ...FILES.map((f, i) => ({
    at: 1 as Step,
    type: 'blob' as const,
    hash: blobHashes[i],
    note: f.name
  })),
  { at: 2 as Step, type: 'tree' as const, hash: treeHash, note: 'names both files' },
  { at: 3 as Step, type: 'commit' as const, hash: commitHash, note: `"${COMMIT_MSG}"` }
]

const DOT: Record<'blob' | 'tree' | 'commit', string> = {
  blob: 'bg-secondary',
  tree: 'bg-primary',
  commit: 'bg-default-400'
}

/** A downward parent-pointer arrow with its "points at" label. */
function Pointer({ label }: { label: string }) {
  const { fade } = useGitMotion()
  return (
    <motion.div
      {...fade}
      className='flex flex-col items-center py-1 text-default-400'
    >
      <span className='mb-0.5 text-[10px] uppercase tracking-wide'>{label}</span>
      <ArrowDownIcon size={16} />
    </motion.div>
  )
}

export default function ObjectLadder() {
  const [step, setStep] = useState<Step>(0)
  const { nodeAppear } = useGitMotion()

  const next = () => setStep(s => Math.min(3, s + 1) as Step)
  const reset = () => setStep(0)

  const nextStep = STEPS.find(s => s.at === step + 1)
  const activeCaption =
    step === 0
      ? 'Click below to hand Git a file and watch .git/objects fill up.'
      : STEPS.find(s => s.at === step)!.caption

  const visibleStore = STORE_ROWS.filter(r => r.at <= step)

  return (
    <GitDemoContainer
      title='Three objects, stacked'
      description='One file becomes three objects. On the left, watch .git/objects fill up as each is created; on the right, watch them point at each other.'
      caption={
        <>
          A commit doesn’t contain your files; it <em>points</em> at a tree, which
          points at blobs. Same content ⇒ same hash, so the next commit reuses every
          blob that didn’t change.
        </>
      }
    >
      <div className='grid gap-3 lg:grid-cols-2'>
        {/* LEFT — .git/objects filling up (what Git STORES) */}
        <div className='rounded-xl bg-default-100 p-4 font-mono text-sm shadow-sm'>
          <p className='mb-3 text-xs font-medium text-default-500'>
            .git/objects/
          </p>
          <div className='min-h-[200px] space-y-1'>
            <AnimatePresence mode='popLayout'>
              {visibleStore.length === 0 && (
                <motion.p
                  key='empty-store'
                  {...nodeAppear}
                  className='text-xs text-default-400'
                >
                  (empty)
                </motion.p>
              )}
              {visibleStore.map(row => (
                <motion.div
                  key={row.hash}
                  layout
                  {...nodeAppear}
                  className='flex items-center gap-2 rounded-md px-1 py-1'
                >
                  {/* sharded dir: first 2 hash chars */}
                  <span className='text-default-400'>{row.hash.slice(0, 2)}/</span>
                  <span
                    className={cn('h-1.5 w-1.5 shrink-0 rounded-full', DOT[row.type])}
                  />
                  <span className='text-foreground'>{row.hash.slice(2)}</span>
                  <span className='text-[11px] text-default-400'>
                    {row.type} · {row.note}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — the pointer stack (how they POINT), commit on top */}
        <div className='relative flex min-h-[200px] flex-col items-center justify-end gap-0 overflow-hidden rounded-xl border border-default-100 bg-background p-4 shadow-sm'>
          <StageDots />
          <AnimatePresence mode='popLayout'>
            {step >= 3 && (
              <motion.div key='commit' layout {...nodeAppear}>
                <GitObjectNode
                  type='commit'
                  hash={commitHash}
                  label={`"${COMMIT_MSG}"`}
                  state='head'
                  compact
                />
              </motion.div>
            )}
            {step >= 3 && <Pointer key='c-arrow' label='points at tree' />}

            {step >= 2 && (
              <motion.div key='tree' layout {...nodeAppear}>
                <GitObjectNode type='tree' hash={treeHash} label='/' compact />
              </motion.div>
            )}
            {step >= 2 && <Pointer key='t-arrow' label='names both files' />}

            {step >= 1 && (
              <motion.div key='blobs' layout {...nodeAppear} className='flex gap-2'>
                {FILES.map((f, i) => (
                  <GitObjectNode
                    key={f.name}
                    type='blob'
                    hash={blobHashes[i]}
                    label={f.name}
                    state={step === 1 ? 'new' : 'normal'}
                    compact
                  />
                ))}
              </motion.div>
            )}

            {step === 0 && (
              <motion.p
                key='empty'
                {...nodeAppear}
                className='text-sm text-default-400'
              >
                (nothing points anywhere yet)
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* what just happened, in one line */}
      <div className='mt-3 min-h-[2.5rem] px-1'>
        <AnimatePresence mode='wait'>
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className='text-sm text-default-600'
          >
            {activeCaption}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* the single control: advance one rung, or reset */}
      <div className='mt-2 flex items-center gap-2'>
        {nextStep ? (
          <button
            type='button'
            onClick={next}
            className={cn(
              'rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
              'transition-transform hover:scale-[1.02] active:scale-95'
            )}
          >
            {nextStep.label}
          </button>
        ) : (
          <span className='rounded-lg bg-default-200 px-4 py-2 text-sm text-default-500'>
            stack complete ✓
          </span>
        )}

        {step > 0 && (
          <button
            type='button'
            onClick={reset}
            className='flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-default-500 transition-colors hover:text-foreground'
          >
            <RotateCcwIcon size={14} /> reset
          </button>
        )}

        {/* progress dots */}
        <div className='ml-auto flex items-center gap-1.5'>
          {[1, 2, 3].map(n => (
            <span
              key={n}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-colors',
                step >= n ? 'bg-primary' : 'bg-default-300'
              )}
            />
          ))}
        </div>
      </div>
    </GitDemoContainer>
  )
}
