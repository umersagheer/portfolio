'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Tab, Tabs, cn } from '@heroui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  FileIcon,
  FolderIcon,
  GitCompareIcon,
  LinkIcon
} from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import StageDots from './shared/stage-dots'
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

/** Tree hash for a snapshot — a function of its (filename → blob-hash) listing. */
function treeOf(step: number): string {
  const listing = FILE_ORDER.map(n => `${n}:${blobOf(step, n)}`).join(',')
  return hashContent(listing, 'tree')
}

function SnapshotView({ step }: { step: number }) {
  return (
    <div className='flex flex-col gap-3'>
      {/* The tree that names this snapshot. Its hash changes each commit (the
          listing changed), but most of what it POINTS AT is reused unchanged. */}
      <div className='flex flex-col items-center gap-1'>
        <div className='text-[10px] uppercase tracking-wide text-primary'>
          the tree for this commit
        </div>
        <TreeBox hash={treeOf(step)} />
      </div>

      {/* connector: the tree points down at its three files */}
      <div className='mx-auto h-4 w-px bg-default-300' aria-hidden />
      <div className='text-center text-[10px] uppercase tracking-wide text-default-400'>
        points at
      </div>

      {/* Keyed by FILENAME, not step — an unchanged blob is the *same* element
          across commits and never re-animates. Stillness = "same object, reused". */}
      <div className='grid gap-2 sm:grid-cols-3'>
        {FILE_ORDER.map(name => {
          const hash = blobOf(step, name)
          // "Shared" when this same file had this exact blob in the previous
          // commit — its content didn't change, so the tree reuses the same object.
          const shared = step > 0 && blobOf(step - 1, name) === hash

          return (
            <div key={name} className='flex flex-col items-start gap-1'>
              <BlobBox hash={hash} label={name} />
              {shared ? (
                <span className='inline-flex items-center gap-1 text-[10px] font-medium text-success'>
                  <LinkIcon size={10} />
                  tree reuses the same blob — not re-stored
                </span>
              ) : (
                <span className='text-[10px] text-default-400'>
                  {step === 0 ? 'first version' : 'new content, new blob'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * The tree node. Like BlobBox, the shell stays mounted and only the hash fades
 * out→in when the listing changes — so the reader sees "new tree, but it still
 * points at the unchanged blobs below."
 */
function TreeBox({ hash }: { hash: string }) {
  return (
    <div className='inline-flex min-w-[5.5rem] flex-col items-center gap-0.5 rounded-lg border border-primary bg-default-50 p-1.5'>
      <div className='flex items-center gap-1'>
        <FolderIcon size={12} className='text-primary' aria-hidden />
        <span className='rounded bg-primary px-1 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground'>
          tree
        </span>
      </div>
      <div className='relative h-4 w-full text-center'>
        <AnimatePresence mode='wait'>
          <motion.code
            key={hash}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='absolute inset-0 font-sourceCodePro text-xs font-semibold text-primary'
          >
            {hash}
          </motion.code>
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * One blob box that stays mounted across steps, so an *unchanged* blob never
 * moves. Only the hash text lives inside an AnimatePresence keyed by the hash:
 * when the file changes, the old hash fades fully OUT and the new one fades IN
 * (a real out→in swap, not a bounce). Unchanged hash ⇒ same key ⇒ no animation.
 */
function BlobBox({ hash, label }: { hash: string; label: string }) {
  return (
    <div className='inline-flex min-w-[5.5rem] flex-col gap-0.5 rounded-lg border border-secondary bg-default-50 p-1.5'>
      <div className='flex items-center gap-1'>
        <FileIcon size={12} className='text-secondary' aria-hidden />
      </div>

      {/* only this fades — box shell holds still */}
      <div className='relative h-4'>
        <AnimatePresence mode='wait'>
          <motion.code
            key={hash}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='absolute inset-0 font-sourceCodePro text-xs font-semibold text-secondary'
          >
            {hash}
          </motion.code>
        </AnimatePresence>
      </div>

      <span
        className='max-w-[7rem] truncate text-[10px] text-default-500'
        title={label}
      >
        {label}
      </span>
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

          {/* Mode toggle — the shared HeroUI Tabs (same as the navbar) */}
          <Tabs
            aria-label='What Git stores vs what Git shows'
            selectedKey={view}
            onSelectionChange={key => setView(key as ViewMode)}
            variant='bordered'
            radius='sm'
            size='sm'
          >
            <Tab
              key='snapshot'
              title={
                <span className='flex items-center gap-1.5'>
                  <CameraIcon size={13} />
                  What Git stores
                </span>
              }
            />
            <Tab
              key='diff'
              title={
                <span className='flex items-center gap-1.5'>
                  <GitCompareIcon size={13} />
                  What Git shows
                </span>
              }
            />
          </Tabs>
        </div>

        {/* The panel — keyed by VIEW only, so flipping snapshot↔diff cross-fades,
            but stepping between commits keeps the panel mounted. That lets an
            unchanged blob (keyed by filename inside) sit perfectly still. */}
        <div
          className={cn(
            'relative overflow-hidden rounded-xl p-3 shadow-sm sm:p-4',
            view === 'snapshot'
              ? 'border border-default-100 bg-background'
              : 'bg-default-100'
          )}
        >
          {view === 'snapshot' && <StageDots />}
          <AnimatePresence mode='wait'>
            <motion.div key={view} {...fade} className='relative'>
              {view === 'snapshot' ? <SnapshotView step={step} /> : <DiffView step={step} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GitDemoContainer>
  )
}
