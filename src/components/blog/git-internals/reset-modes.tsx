'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Checkbox, Tabs, cn } from '@heroui/react'
import {
  FileIcon,
  GitCommitHorizontalIcon,
  AlertTriangleIcon,
  RotateCcwIcon
} from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import StageDots from './shared/stage-dots'
import { hashKey } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

// A complete-but-staged reset demo. Beats: (1) two files you can stage or leave
// unstaged; (2) run reset in a mode — the branch pointer slides back, C3 orphans,
// and the two files react ACCURATELY (--hard wipes both staged+unstaged; --mixed
// keeps both, just unstaged; --soft keeps both staged); (3) optionally commit to
// see C3 truly stranded — unreachable, because commits only point back at parents.

type Mode = 'soft' | 'mixed' | 'hard'
type Phase = 'idle' | 'reset' | 'recommitted'

const COMMITS = [
  { hash: hashKey('reset c1'), msg: 'C1' },
  { hash: hashKey('reset c2'), msg: 'C2' }, // reset target
  { hash: hashKey('reset c3'), msg: 'C3' }
]
const TARGET = 1
const C4 = { hash: hashKey('reset c4'), msg: 'C4' }

const MODES: { id: Mode; label: string }[] = [
  { id: 'soft', label: '--soft' },
  { id: 'mixed', label: '--mixed' },
  { id: 'hard', label: '--hard' }
]

const FILES = ['a.py', 'b.py'] as const
type FileName = (typeof FILES)[number]

export default function ResetModes() {
  const [mode, setMode] = useState<Mode>('mixed')
  // which files the reader has staged (rest are unstaged edits in the working dir)
  const [staged, setStaged] = useState<Set<FileName>>(
    () => new Set<FileName>(['a.py'])
  )
  const [phase, setPhase] = useState<Phase>('idle')
  // files that have an uncommitted edit (only a modified file can be staged)
  const [modified, setModified] = useState<Set<FileName>>(new Set())
  const { fade } = useGitMotion()

  const isStaged = (f: FileName) => staged.has(f)
  const isModified = (f: FileName) => modified.has(f)
  const done = phase !== 'idle'
  const anyModified = modified.size > 0

  function modifyAll() {
    if (done) return
    setModified(new Set(FILES))
  }

  function toggleStage(f: FileName) {
    if (done || !isModified(f)) return
    setStaged(s => {
      const n = new Set(s)
      n.has(f) ? n.delete(f) : n.add(f)
      return n
    })
  }

  function runReset() {
    setPhase('reset')
  }
  function commit() {
    setPhase('recommitted')
  }
  function replay() {
    setPhase('idle')
    setStaged(new Set())
    setModified(new Set())
  }

  // Where does each file end up AFTER a reset in the current mode?
  //   (only MODIFIED files are in play; an unmodified file has nothing to reset)
  //   --soft  : both untouched → stay staged/unstaged exactly as before
  //   --mixed : staging cleared → everything drops to working dir (unstaged), kept
  //   --hard  : working dir reset → all tracked changes gone (staged AND unstaged)
  function fileStateAfter(
    f: FileName
  ): 'clean' | 'staged' | 'unstaged' | 'gone' {
    if (!isModified(f)) return 'clean'
    if (!done) return isStaged(f) ? 'staged' : 'unstaged'
    if (mode === 'hard') return 'gone'
    if (mode === 'soft') return isStaged(f) ? 'staged' : 'unstaged'
    return 'unstaged' // mixed: kept but unstaged
  }

  const branchIndex =
    phase === 'idle' ? COMMITS.length - 1 : phase === 'reset' ? TARGET : -1 // -1 = at C4

  const cleanFiles = FILES.filter(f => fileStateAfter(f) === 'clean')
  const stagedFiles = FILES.filter(f => fileStateAfter(f) === 'staged')
  const workingModified = FILES.filter(f => fileStateAfter(f) === 'unstaged')
  const goneFiles = FILES.filter(f => fileStateAfter(f) === 'gone')

  const note = (() => {
    if (phase === 'idle') {
      if (!anyModified)
        return 'A clean working directory at C3. Hit “Modify files” to make some edits — then you can stage them and try a reset.'
      if (staged.size === 0)
        return 'Both files are modified but unstaged. Tick a checkbox to stage a file — or run a reset now and watch which changes survive.'
      if (staged.size === FILES.length)
        return 'Both files staged. Pick a mode and run reset to C2 — then commit to see what happens to C3.'
      return 'One file staged, one just modified. Run a reset and see how each mode treats them differently.'
    }
    if (phase === 'reset') {
      if (mode === 'soft')
        return 'reset --soft: only the branch moved to C2. Both files are left exactly as they were — still staged, ready to recommit.'
      if (mode === 'mixed')
        return 'reset --mixed: the branch moved and staging was cleared. Your changes are safe — just dropped back to the working directory, unstaged.'
      return 'reset --hard: branch, staging, AND working directory reset to C2. Every tracked change — staged or not — is gone. This is the only destructive mode.'
    }
    return 'You committed again → C4. Every commit points only to its parent (never its children), so walking back from C4 reaches C2 and C1 — but never C3. Nothing points to C3, so it’s unreachable through history. Not deleted, though: git checkout its hash still lands you on it, which is exactly how reflog rescues it.'
  })()

  return (
    <GitDemoContainer
      title='What each reset mode touches'
      description='Git keeps your work in three places: your working directory, the staging area, and the commit. reset always moves the branch — the flag decides which of those come along. Stage a file or two, then run a reset.'
      caption={
        <>
          Only <code>--hard</code> touches your working directory, so it’s the
          only mode that destroys uncommitted work — and it takes <em>both</em>{' '}
          staged and unstaged changes. <code>--mixed</code> keeps your changes
          (just unstages them); <code>--soft</code> keeps them staged. Commits
          you reset past aren’t deleted — <code>git reflog</code> can recover
          them.
        </>
      }
    >
      {/* ── Beat 1: the graph — pointer moves; once reset, C3 breaks OFF the
             line onto a second lane, dead-ended, orphaned. ── */}
      <ResetGraph phase={phase} branchIndex={branchIndex} fade={fade} />

      {/* ── controls: HeroUI tabs + stage toggles + run/commit ── */}
      <div className='mb-4 flex flex-wrap items-center gap-3'>
        <Tabs
          selectedKey={mode}
          onSelectionChange={k => {
            setMode(k as Mode)
            setPhase('idle')
          }}
          variant='primary'
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label='reset mode' className='font-sourceCodePro'>
              {MODES.map(m => (
                <Tabs.Tab key={m.id} id={m.id}>
                  {m.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        {phase === 'idle' && !anyModified && (
          <button
            type='button'
            onClick={modifyAll}
            className='border-warning text-warning hover:bg-warning/10 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors'
          >
            Modify files
          </button>
        )}

        {phase === 'idle' ? (
          <button
            type='button'
            onClick={runReset}
            className='bg-accent font-sourceCodePro text-accent-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-transform hover:scale-[1.02] active:scale-95'
          >
            git reset {mode === 'mixed' ? '' : `--${mode} `}C2
          </button>
        ) : phase === 'reset' && mode !== 'hard' && goneFiles.length === 0 ? (
          <button
            type='button'
            onClick={commit}
            className='border-accent font-sourceCodePro text-accent hover:bg-accent/10 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors'
          >
            <GitCommitHorizontalIcon size={13} /> commit again
          </button>
        ) : null}

        {done && (
          <button
            type='button'
            onClick={replay}
            className='text-muted hover:text-foreground inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors'
          >
            <RotateCcwIcon size={13} /> replay
          </button>
        )}
      </div>

      {/* ── the three places ── */}
      <div className='grid gap-3 sm:grid-cols-3'>
        <Column
          title='working directory'
          subtitle={
            anyModified ? 'files on disk — tick to stage' : 'files on disk'
          }
          touched={done && mode !== 'soft'}
        >
          {goneFiles.length > 0 && (
            <Lost>{goneFiles.join(', ')} — overwritten</Lost>
          )}
          {/* clean (unmodified) files: no checkbox, no tag */}
          {cleanFiles.map(f => (
            <div
              key={f}
              className='bg-background font-sourceCodePro flex items-center gap-2 rounded-md px-2 py-1.5 text-xs shadow-xs'
            >
              <FileIcon size={13} className='text-muted' />
              <span className='text-foreground'>{f}</span>
            </div>
          ))}
          {/* modified-but-unstaged: checkbox appears, stageable */}
          {workingModified.map(f => (
            <FileRow
              key={f}
              name={f}
              checked={false}
              disabled={done}
              onToggle={() => toggleStage(f)}
              tag={done ? 'kept, unstaged' : 'modified'}
              tone='warning'
            />
          ))}
        </Column>

        <Column
          title='staging area'
          subtitle='queued for next commit'
          touched={done && mode !== 'soft'}
        >
          {stagedFiles.length === 0 ? (
            <span className='text-muted text-[11px]'>(empty)</span>
          ) : (
            stagedFiles.map(f => (
              <FileRow
                key={f}
                name={f}
                checked
                disabled={done}
                onToggle={() => toggleStage(f)}
                tag='staged'
                tone='success'
              />
            ))
          )}
        </Column>

        <Column title='the commit' subtitle='HEAD → branch' dots>
          <div className='border-border-secondary bg-surface-secondary/60 font-sourceCodePro flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs backdrop-blur-md'>
            <GitCommitHorizontalIcon size={13} className='text-foreground' />
            <span className='text-foreground font-semibold'>
              {phase === 'recommitted' ? 'C4' : phase === 'reset' ? 'C2' : 'C3'}
            </span>
          </div>
        </Column>
      </div>

      {/* narration */}
      <AnimatePresence mode='wait'>
        <motion.p
          key={note}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className='bg-surface-secondary text-foreground mt-4 rounded-lg px-3 py-2 text-xs leading-5 shadow-xs'
        >
          {note}
        </motion.p>
      </AnimatePresence>
    </GitDemoContainer>
  )
}

/**
 * Two-lane commit graph. Before reset: a straight line C1 → C2 → C3 (main on C3).
 * After reset: main is on C2, and C3 breaks OFF onto a lower lane — its forward
 * path dead-ends, so it reads as orphaned, not "still next in line". After a
 * re-commit, C4 continues the top line from C2 while C3 stays stranded below.
 */
function ResetGraph({
  phase,
  branchIndex,
  fade
}: {
  phase: Phase
  branchIndex: number
  fade: ReturnType<typeof useGitMotion>['fade']
}) {
  const done = phase !== 'idle'
  const recommitted = phase === 'recommitted'

  // The TOP line = the real, reachable history.
  //   idle:        C1 → C2 → C3   (main on C3)
  //   reset:       C1 → C2        (main on C2)  — C3 has dropped to the lane below
  //   recommitted: C1 → C2 → C4   (main on C4)
  const topNodes = !done
    ? [COMMITS[0], COMMITS[1], COMMITS[2]]
    : recommitted
      ? [COMMITS[0], COMMITS[1], C4]
      : [COMMITS[0], COMMITS[1]]

  const branchHash = COMMITS[branchIndex]?.hash ?? C4.hash

  return (
    <div className='mb-6 overflow-x-auto pt-1 pb-2'>
      <div className='relative w-max'>
        {/* top lane — arrows point CHILD → PARENT (backwards in time), the way
            Git really stores it: a commit knows its parent, never its children. */}
        <div className='flex items-end gap-3'>
          {topNodes.map((c, i) => {
            const isBranch = c.hash === branchHash
            const fresh = recommitted && c.hash === C4.hash
            return (
              <div key={c.hash} className='flex items-end gap-3'>
                {i > 0 && (
                  <span className='text-muted mb-9' title='child → parent'>
                    ←
                  </span>
                )}
                <motion.div layout {...(fresh ? fade : {})}>
                  <NodeWithPill
                    node={{ ...c, orphaned: false, isBranch }}
                    pill={isBranch ? 'main' : null}
                    orphanTag={false}
                    fade={fade}
                    fresh={fresh}
                  />
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* bottom lane — C3 broken OFF C2, dead-ended, orphaned */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className='relative'
              // sit C3 under C2's column (C1 node ~104 + arrow/gap ~46)
              style={{ paddingLeft: 150, marginTop: 4 }}
            >
              {/* dashed parent pointer: C3 still points UP to its parent C2
                  (arrowhead at the C2 end). C3 keeps its parent link — it's just
                  that nothing points down TO C3 anymore, so it's unreachable. */}
              <svg
                className='pointer-events-none absolute'
                style={{ left: 96, top: -14, width: 60, height: 40 }}
                viewBox='0 0 60 40'
                fill='none'
              >
                <defs>
                  <marker
                    id='reset-orphan-arrow'
                    markerWidth='7'
                    markerHeight='7'
                    refX='5.5'
                    refY='3'
                    orient='auto'
                  >
                    <path d='M0,0 L6,3 L0,6 Z' fill='var(--border)' />
                  </marker>
                </defs>
                {/* drawn C3-end → C2-end so the arrowhead lands at the parent (C2) */}
                <path
                  d='M 52 34 Q 4 30 4 2'
                  stroke='var(--border)'
                  strokeWidth='1.5'
                  strokeDasharray='4 4'
                  strokeLinecap='round'
                  markerEnd='url(#reset-orphan-arrow)'
                />
              </svg>
              <div className='flex items-center gap-2 opacity-60'>
                <NodeWithPill
                  node={{ ...COMMITS[2], orphaned: true, isBranch: false }}
                  pill={null}
                  orphanTag
                  fade={fade}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function NodeWithPill({
  node,
  pill,
  orphanTag,
  fade,
  fresh
}: {
  node: { hash: string; msg: string; orphaned: boolean; isBranch: boolean }
  pill: string | null
  orphanTag: boolean
  fade: ReturnType<typeof useGitMotion>['fade']
  fresh?: boolean
}) {
  return (
    <div className='flex flex-col items-center gap-1.5'>
      <GitObjectNode
        type='commit'
        hash={node.hash}
        label={node.msg}
        state={
          node.orphaned
            ? 'orphaned'
            : fresh || node.isBranch
              ? 'head'
              : 'normal'
        }
        hideBadge
        compact
      />
      <div className='h-5'>
        <AnimatePresence>
          {pill && (
            <motion.div
              layoutId='reset-branch-pill'
              {...fade}
              className='border-success bg-surface font-sourceCodePro text-success inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold'
            >
              main
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='h-4'>
        <AnimatePresence>
          {orphanTag && (
            <motion.span
              {...fade}
              className='text-muted text-[9px] font-medium whitespace-nowrap'
            >
              orphaned · reflog can recover
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Column({
  title,
  subtitle,
  children,
  touched = false,
  dots = false
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  touched?: boolean
  dots?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-3 shadow-xs transition-all',
        dots ? 'border-separator bg-background border' : 'bg-surface-secondary',
        touched && 'ring-accent ring-1'
      )}
    >
      {dots && <StageDots />}
      <div className='relative mb-0.5 flex items-center justify-between'>
        <span className='text-muted text-xs font-medium'>{title}</span>
        {touched && (
          <span className='bg-accent/15 text-accent rounded-sm px-1 text-[9px] font-semibold tracking-wide uppercase'>
            reset
          </span>
        )}
      </div>
      <div className='text-muted relative mb-3 text-[10px]'>{subtitle}</div>
      <div className='relative min-h-[3.5rem] space-y-1.5'>{children}</div>
    </div>
  )
}

function FileRow({
  name,
  checked,
  disabled,
  onToggle,
  tag,
  tone
}: {
  name: FileName
  checked: boolean
  disabled: boolean
  onToggle: () => void
  tag: string
  tone: 'warning' | 'success'
}) {
  return (
    <div className='bg-background font-sourceCodePro flex items-center gap-2 rounded-md px-2 py-1.5 text-xs shadow-xs'>
      <Checkbox
        isSelected={checked}
        isDisabled={disabled}
        onChange={onToggle}
        aria-label={`Stage ${name}`}
        className='rounded-sm'
      >
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox>
      <FileIcon size={13} className='text-muted' />
      <span className='text-foreground'>{name}</span>
      <span
        className={cn(
          'ml-auto rounded-sm px-1.5 py-0.5 text-[9px] font-medium',
          tone === 'warning'
            ? 'bg-warning/15 text-warning'
            : 'bg-success/15 text-success'
        )}
      >
        {tag}
      </span>
    </div>
  )
}

function Lost({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-danger/15 text-danger inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium'>
      <AlertTriangleIcon size={11} />
      {children}
    </div>
  )
}
