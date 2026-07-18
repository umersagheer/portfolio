'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@heroui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  GitCompareIcon,
  LinkIcon
} from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import { hashContent } from './shared/hashes'
import { diffLines, diffStat, type DiffRow } from './shared/diff'
import { useGitMotion } from './shared/use-git-motion'

// ────────────────────────────────────────────────────────────────────────────
// A tiny project history: three commits, each a FULL snapshot of the same three
// files. Between commits only some files change — the rest are byte-for-byte
// identical, so they hash to the same blob and Git stores them exactly once.
// This is the whole point: a commit is a snapshot, and snapshots are cheap
// because unchanged content is shared, not copied. Diffs are never stored; the
// demo computes them on demand from two snapshots, the same way Git does.
// ────────────────────────────────────────────────────────────────────────────

type FileName = 'app.py' | 'utils.py' | 'README.md'

const FILE_ORDER: FileName[] = ['app.py', 'utils.py', 'README.md']

type Snapshot = {
  message: string
  files: Record<FileName, string>
}

/**
 * Three snapshots. Note which files carry over unchanged between steps:
 *   c1 → c2 : README.md unchanged (same blob)
 *   c2 → c3 : utils.py unchanged (same blob)
 * so every step has at least one file that proves the dedup.
 */
const HISTORY: Snapshot[] = [
  {
    message: 'Initial commit',
    files: {
      'app.py': 'def main():\n    print("hi")\n\nmain()',
      'utils.py': 'def add(a, b):\n    return a + b',
      'README.md': '# Demo\n\nA tiny repo.'
    }
  },
  {
    message: 'Greet by name',
    files: {
      // app.py changed
      'app.py': 'def main():\n    print(greeting("world"))\n\nmain()',
      // utils.py changed (gained a helper)
      'utils.py': 'def add(a, b):\n    return a + b\n\ndef greeting(name):\n    return f"hi, {name}"',
      // README.md UNCHANGED → same blob as c1
      'README.md': '# Demo\n\nA tiny repo.'
    }
  },
  {
    message: 'Document usage',
    files: {
      // app.py changed
      'app.py': 'def main():\n    print(greeting("world"))\n    print(add(2, 3))\n\nmain()',
      // utils.py UNCHANGED → same blob as c2
      'utils.py': 'def add(a, b):\n    return a + b\n\ndef greeting(name):\n    return f"hi, {name}"',
      // README.md changed
      'README.md': '# Demo\n\nA tiny repo.\n\n## Usage\n\nRun `python app.py`.'
    }
  }
]

type ViewMode = 'snapshot' | 'diff'

/** Blob hash for a file's content at a given commit. */
function blobOf(step: number, name: FileName): string {
  return hashContent(HISTORY[step].files[name], 'blob')
}

// ── Snapshot view: every file, as a blob, unchanged ones flagged as shared ────

function SnapshotView({ step }: { step: number }) {
  const { nodeAppear } = useGitMotion()

  return (
    <div className='flex flex-col gap-2'>
      <div className='text-[10px] uppercase tracking-wide text-secondary'>
        blobs in this snapshot
      </div>
      <div className='grid gap-2 sm:grid-cols-3'>
        {FILE_ORDER.map(name => {
          const hash = blobOf(step, name)
          // "Shared" when this same file had this exact blob in the previous
          // commit — its content didn't change, so Git reuses the same object.
          const shared = step > 0 && blobOf(step - 1, name) === hash

          return (
            <motion.div
              key={name}
              layout
              {...nodeAppear}
              className='flex flex-col items-start gap-1'
            >
              <GitObjectNode type='blob' hash={hash} label={name} hideBadge compact />
              {shared ? (
                <span className='inline-flex items-center gap-1 text-[10px] font-medium text-success'>
                  <LinkIcon size={10} />
                  same blob as before — reused, not re-stored
                </span>
              ) : (
                <span className='text-[10px] text-default-400'>
                  {step === 0 ? 'first version' : 'new content, new blob'}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Diff view: computed on demand from the two neighbouring snapshots ─────────

function DiffRows({ rows }: { rows: DiffRow[] }) {
  return (
    <div className='overflow-hidden rounded-md bg-default-100 font-sourceCodePro text-[11px] leading-5 shadow-sm'>
      <div className='max-h-40 overflow-auto'>
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-2 border-l-2 px-2',
              row.type === 'add' && 'border-success text-success',
              row.type === 'remove' && 'border-danger text-danger',
              row.type === 'context' && 'border-transparent text-default-500'
            )}
          >
            <span className='select-none text-default-400'>
              {row.type === 'add' ? '+' : row.type === 'remove' ? '−' : ' '}
            </span>
            <span className='whitespace-pre-wrap break-all'>{row.text || ' '}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DiffView({ step }: { step: number }) {
  // A diff needs a "before". The very first commit has none — everything is new.
  const prev = step - 1

  const perFile = useMemo(() => {
    return FILE_ORDER.map(name => {
      const before = prev >= 0 ? HISTORY[prev].files[name] : ''
      const after = HISTORY[step].files[name]
      const rows = diffLines(before, after)
      const { added, removed } = diffStat(rows)
      return { name, rows, added, removed, changed: added + removed > 0 }
    })
  }, [step, prev])

  const changed = perFile.filter(f => f.changed)

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-2 text-[10px] uppercase tracking-wide text-default-500'>
        <GitCompareIcon size={12} />
        {prev >= 0
          ? `computed just now: commit ${prev + 1} → commit ${step + 1} (never stored)`
          : 'first commit — every line is new'}
      </div>

      {changed.map(f => (
        <div key={f.name} className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <span className='font-sourceCodePro text-xs text-foreground'>{f.name}</span>
            <span className='text-[10px] text-success'>+{f.added}</span>
            <span className='text-[10px] text-danger'>−{f.removed}</span>
          </div>
          <DiffRows rows={f.rows} />
        </div>
      ))}

      {/* Files that DIDN'T change: no diff at all — the snapshot just reused the blob. */}
      {perFile
        .filter(f => !f.changed)
        .map(f => (
          <div
            key={f.name}
            className='flex items-center gap-2 rounded-md bg-default-100 px-2 py-1.5 text-[11px] text-default-500 shadow-sm'
          >
            <LinkIcon size={12} className='text-success' />
            <span className='font-sourceCodePro text-foreground'>{f.name}</span>
            <span>unchanged — no diff to compute, same blob reused</span>
          </div>
        ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────

export default function SnapshotVsDiff() {
  const [step, setStep] = useState(0)
  const [view, setView] = useState<ViewMode>('snapshot')
  const { fade } = useGitMotion()

  const snap = HISTORY[step]
  const atStart = step === 0
  const atEnd = step === HISTORY.length - 1

  const modeButton = (id: ViewMode, label: string, icon: React.ReactNode) => (
    <button
      type='button'
      onClick={() => setView(id)}
      aria-pressed={view === id}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors',
        view === id
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-default-500 hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <GitDemoContainer
      title='Snapshots, not diffs'
      description='Each commit stores a complete snapshot of every file — not a list of changes. That sounds wasteful, until you see the trick: files that did not change between commits reuse the exact same blob, so a snapshot costs almost nothing. Step through the history and flip between what Git stores (snapshots) and what it shows you (diffs, computed on the fly).'
      caption={
        <>
          What Git <em>stores</em> is on the snapshot side: full trees of blobs, with unchanged
          content shared across commits by its hash. What Git <em>shows</em> you in{' '}
          <code>git diff</code> or <code>git log -p</code> is computed on demand by comparing two
          snapshots — it is never saved to disk. Same content ⇒ same blob is why history is cheap.
        </>
      }
    >
      <div className='flex flex-col gap-4'>
        {/* Stepper + snapshot label */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='bordered'
              radius='sm'
              isIconOnly
              aria-label='Previous commit'
              isDisabled={atStart}
              onPress={() => setStep(s => Math.max(0, s - 1))}
            >
              <ChevronLeftIcon size={15} />
            </Button>
            <div className='min-w-0'>
              <div className='font-sourceCodePro text-xs font-semibold text-foreground'>
                commit {step + 1} of {HISTORY.length}
              </div>
              <div className='truncate text-[11px] text-default-500'>{snap.message}</div>
            </div>
            <Button
              size='sm'
              variant='bordered'
              radius='sm'
              isIconOnly
              aria-label='Next commit'
              isDisabled={atEnd}
              onPress={() => setStep(s => Math.min(HISTORY.length - 1, s + 1))}
            >
              <ChevronRightIcon size={15} />
            </Button>
          </div>

          {/* Mode toggle */}
          <div className='inline-flex items-center gap-1 rounded-lg bg-default-100 p-1 shadow-sm'>
            {modeButton('snapshot', 'What Git stores', <CameraIcon size={13} />)}
            {modeButton('diff', 'What Git shows', <GitCompareIcon size={13} />)}
          </div>
        </div>

        {/* The panel */}
        <div className='rounded-xl bg-default-100 p-3 shadow-sm sm:p-4'>
          <AnimatePresence mode='wait'>
            <motion.div key={`${view}-${step}`} {...fade}>
              {view === 'snapshot' ? <SnapshotView step={step} /> : <DiffView step={step} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GitDemoContainer>
  )
}
