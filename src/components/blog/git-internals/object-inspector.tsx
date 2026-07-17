'use client'

import { useMemo, useReducer, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, cn } from '@heroui/react'
import {
  FileIcon,
  FilesIcon,
  GitBranchIcon,
  ArrowRightIcon,
  RotateCcwIcon,
  CheckIcon
} from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import RefTag from './shared/ref-tag'
import { hashContent, hashKey, shortHash } from './shared/hashes'
import { diffLines, diffStat, type DiffRow } from './shared/diff'
import { useGitMotion } from './shared/use-git-motion'

// ────────────────────────────────────────────────────────────────────────────
// The in-memory Git. Deterministic; every object's hash derives from its content
// exactly the way the prose describes (blob = content, tree = the name→blob
// listing, commit = tree + parent + message). No RNG anywhere.
// ────────────────────────────────────────────────────────────────────────────

type FileName = 'app.py' | 'README.md'

type StoreObject =
  | { kind: 'blob'; hash: string; content: string }
  | { kind: 'tree'; hash: string; entries: { name: string; blob: string }[] }
  | {
      kind: 'commit'
      hash: string
      tree: string
      parent: string | null
      message: string
    }

type Repo = {
  files: Record<FileName, { committed: string; working: string }>
  index: Partial<Record<FileName, string>>
  store: Record<string, StoreObject>
  main: string
  history: string[]
  orphaned: string[]
  /** Hashes flagged as freshly created, for the glow-in animation. */
  fresh: string[]
  /** A short human sentence describing the last thing that happened (row-1 caption). */
  lastAction: string
}

const INITIAL_FILES: Record<FileName, string> = {
  'app.py': 'def main():\n    print("hello")\n\nmain()',
  'README.md': '# Demo\n\nA tiny repo.'
}

const FILE_ORDER: FileName[] = ['app.py', 'README.md']

/** Build a tree object from a set of name→content, writing its blobs too. */
function buildTree(
  entriesByName: Record<string, string>,
  store: Record<string, StoreObject>
): { treeHash: string; blobs: { name: string; blob: string }[] } {
  const names = Object.keys(entriesByName).sort()
  const blobs = names.map(name => {
    const content = entriesByName[name]
    const blob = hashContent(content, 'blob')
    if (!store[blob]) store[blob] = { kind: 'blob', hash: blob, content }
    return { name, blob }
  })
  const listing = blobs.map(b => `${b.name} ${b.blob}`).join('\n')
  const treeHash = hashContent(listing, 'tree')
  if (!store[treeHash]) {
    store[treeHash] = { kind: 'tree', hash: treeHash, entries: blobs }
  }
  return { treeHash, blobs }
}

function makeInitialRepo(): Repo {
  const store: Record<string, StoreObject> = {}
  const { treeHash } = buildTree(INITIAL_FILES, store)
  const message = 'Initial commit'
  const commitHash = hashKey(`${treeHash} <root> ${message}`)
  store[commitHash] = {
    kind: 'commit',
    hash: commitHash,
    tree: treeHash,
    parent: null,
    message
  }
  return {
    files: Object.fromEntries(
      FILE_ORDER.map(name => [
        name,
        { committed: INITIAL_FILES[name], working: INITIAL_FILES[name] }
      ])
    ) as Repo['files'],
    index: {},
    store,
    main: commitHash,
    history: [commitHash],
    orphaned: [],
    fresh: [],
    lastAction: 'Repo starts at one commit. Edit a file to see Git respond.'
  }
}

// ── file status (derived) ────────────────────────────────────────────────────

type FileStatus = 'committed' | 'modified' | 'staged' | 'staged-modified'

function fileStatus(repo: Repo, name: FileName): FileStatus {
  const { committed, working } = repo.files[name]
  const staged = repo.index[name]
  if (staged !== undefined) {
    return staged === working ? 'staged' : 'staged-modified'
  }
  return working === committed ? 'committed' : 'modified'
}

/** Files that differ from their committed version (VS Code "Changes"). */
function changedFiles(repo: Repo): FileName[] {
  return FILE_ORDER.filter(name => {
    const s = fileStatus(repo, name)
    return s !== 'committed'
  })
}

// ── reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'edit'; name: FileName; content: string }
  | { type: 'stage'; name: FileName }
  | { type: 'unstage'; name: FileName }
  | { type: 'commit'; message: string }
  | { type: 'reset' }
  | { type: 'reset-all' }

function reducer(repo: Repo, action: Action): Repo {
  switch (action.type) {
    case 'edit': {
      return {
        ...repo,
        fresh: [],
        files: {
          ...repo.files,
          [action.name]: { ...repo.files[action.name], working: action.content }
        },
        lastAction: `Edited ${action.name}. Its content changed, so its blob hash changed too — but nothing is stored until you stage it.`
      }
    }

    case 'stage': {
      const content = repo.files[action.name].working
      const blob = hashContent(content, 'blob')
      const store = { ...repo.store }
      const isNew = !store[blob]
      if (isNew) store[blob] = { kind: 'blob', hash: blob, content }
      return {
        ...repo,
        store,
        index: { ...repo.index, [action.name]: content },
        fresh: isNew ? [blob] : [],
        lastAction: `Staged ${action.name} → git wrote blob ${blob} into the object store. The index now points at it.`
      }
    }

    case 'unstage': {
      const nextIndex = { ...repo.index }
      delete nextIndex[action.name]
      return {
        ...repo,
        index: nextIndex,
        fresh: [],
        lastAction: `Unstaged ${action.name}. (The blob stays in the store — nothing is ever deleted — the index just stops pointing at it.)`
      }
    }

    case 'commit': {
      if (Object.keys(repo.index).length === 0) return repo
      const contents: Record<string, string> = {}
      for (const name of FILE_ORDER) {
        contents[name] = repo.index[name] ?? repo.files[name].committed
      }
      const store = { ...repo.store }
      const treeExisted = (() => {
        const names = Object.keys(contents).sort()
        const listing = names
          .map(n => `${n} ${hashContent(contents[n], 'blob')}`)
          .join('\n')
        return Boolean(repo.store[hashContent(listing, 'tree')])
      })()
      const { treeHash } = buildTree(contents, store)
      const parent = repo.main
      const message = action.message.trim() || 'Update files'
      const commitHash = hashKey(`${treeHash} ${parent} ${message}`)
      store[commitHash] = {
        kind: 'commit',
        hash: commitHash,
        tree: treeHash,
        parent,
        message
      }
      const files = { ...repo.files }
      for (const name of FILE_ORDER) {
        if (repo.index[name] !== undefined) {
          files[name] = {
            committed: repo.index[name] as string,
            working: repo.index[name] as string
          }
        }
      }
      return {
        ...repo,
        files,
        index: {},
        store,
        main: commitHash,
        history: [...repo.history, commitHash],
        fresh: treeExisted ? [commitHash] : [treeHash, commitHash],
        lastAction: `Committed → git built a tree (${shortHash(treeHash)}) and a commit (${shortHash(commitHash)}) that points back to its parent. main and HEAD moved forward.`
      }
    }

    case 'reset': {
      if (repo.history.length < 2) return repo
      const history = [...repo.history]
      const popped = history.pop() as string
      const target = history[history.length - 1]
      const targetCommit = repo.store[target]
      if (!targetCommit || targetCommit.kind !== 'commit') return repo
      const tree = repo.store[targetCommit.tree]
      const files = { ...repo.files }
      if (tree && tree.kind === 'tree') {
        for (const entry of tree.entries) {
          const blob = repo.store[entry.blob]
          if (blob && blob.kind === 'blob') {
            files[entry.name as FileName] = {
              committed: blob.content,
              working: blob.content
            }
          }
        }
      }
      return {
        ...repo,
        files,
        index: {},
        main: target,
        history,
        orphaned: [...repo.orphaned, popped],
        fresh: [],
        lastAction: `reset --hard moved main back one commit. Commit ${shortHash(popped)} is now unreferenced — but it is still in the store (the reflog can recover it later).`
      }
    }

    case 'reset-all':
      return makeInitialRepo()

    default:
      return repo
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Row 1 — the live .git pipeline (Working → Staging → Commit → Branch/HEAD)
// ────────────────────────────────────────────────────────────────────────────

function Lane({
  title,
  hint,
  children
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className='flex min-w-0 flex-1 flex-col rounded-xl border border-default-200 bg-default-50 p-3'>
      <div className='mb-0.5 text-xs font-semibold text-foreground'>{title}</div>
      <div className='mb-2 text-[10px] leading-4 text-default-400'>{hint}</div>
      <div className='flex min-h-[4.5rem] flex-1 flex-wrap content-start items-start gap-2'>
        {children}
      </div>
    </div>
  )
}

function LaneArrow() {
  return (
    <div className='flex shrink-0 items-center justify-center px-0.5 text-default-300'>
      <ArrowRightIcon size={18} />
    </div>
  )
}

function EmptyLane({ label }: { label: string }) {
  return (
    <span className='py-4 text-center text-[10px] text-default-300'>{label}</span>
  )
}

function GitPipeline({ repo }: { repo: Repo }) {
  const { nodeAppear, fade, spring } = useGitMotion()
  const isFresh = (hash: string) => repo.fresh.includes(hash)

  const modified = FILE_ORDER.filter(n => {
    const s = fileStatus(repo, n)
    return s === 'modified' || s === 'staged-modified'
  })
  const staged = FILE_ORDER.filter(n => repo.index[n] !== undefined)

  const headCommit = repo.store[repo.main]
  const headTree =
    headCommit && headCommit.kind === 'commit'
      ? repo.store[headCommit.tree]
      : undefined
  const parentOfHead =
    headCommit && headCommit.kind === 'commit' ? headCommit.parent : null

  return (
    <div className='rounded-2xl border border-default-200 bg-default-100 p-3 sm:p-4'>
      <div className='mb-3 flex items-center gap-2'>
        <span className='rounded-md bg-default-200 px-2 py-0.5 font-sourceCodePro text-[11px] font-semibold text-foreground'>
          .git
        </span>
        <span className='text-xs text-default-500'>
          what actually happens inside the repo
        </span>
      </div>

      <div className='flex flex-col gap-2 lg:flex-row lg:items-stretch'>
        {/* 1 · Working directory → blobs of changed files */}
        <Lane title='Working directory' hint='files you edit (not yet stored)'>
          {modified.length === 0 ? (
            <EmptyLane label='no changes' />
          ) : (
            modified.map(name => (
              <motion.div key={name} layout {...fade} className='flex flex-col items-center gap-1'>
                <GitObjectNode
                  type='blob'
                  hash={hashContent(repo.files[name].working, 'blob')}
                  label={name}
                  hideBadge
                />
              </motion.div>
            ))
          )}
        </Lane>

        <LaneArrow />

        {/* 2 · Staging (index) → blobs written by `git add` */}
        <Lane title='Staging area (index)' hint='blobs written by git add'>
          {staged.length === 0 ? (
            <EmptyLane label='nothing staged' />
          ) : (
            staged.map(name => (
              <motion.div
                key={name}
                layout
                {...nodeAppear}
                className='flex flex-col items-center gap-1'
              >
                <GitObjectNode
                  type='blob'
                  hash={hashContent(repo.index[name] as string, 'blob')}
                  label={name}
                  state={isFresh(hashContent(repo.index[name] as string, 'blob')) ? 'new' : 'normal'}
                  hideBadge
                />
              </motion.div>
            ))
          )}
        </Lane>

        <LaneArrow />

        {/* 3 · Commit → tree + commit objects */}
        <Lane title='Commit' hint='a tree + a commit object'>
          {headTree && headTree.kind === 'tree' ? (
            <motion.div layout {...(isFresh(headTree.hash) ? nodeAppear : {})} className='flex flex-wrap items-start gap-2'>
              <GitObjectNode
                type='tree'
                hash={headTree.hash}
                state={isFresh(headTree.hash) ? 'new' : 'normal'}
              />
              <GitObjectNode
                type='commit'
                hash={repo.main}
                label={headCommit && headCommit.kind === 'commit' ? headCommit.message : undefined}
                state={isFresh(repo.main) ? 'new' : 'head'}
              />
            </motion.div>
          ) : (
            <EmptyLane label='—' />
          )}
        </Lane>

        <LaneArrow />

        {/* 4 · Branch / HEAD → the pointers */}
        <Lane title='Branch & HEAD' hint='pointers to a commit'>
          <motion.div layout transition={spring} className='flex flex-col gap-1.5'>
            <RefTag name='main' variant='branch' />
            <RefTag name='HEAD' variant='head' />
            <span className='mt-1 font-sourceCodePro text-[10px] text-default-400'>
              → {shortHash(repo.main)}
            </span>
            {parentOfHead && (
              <span className='font-sourceCodePro text-[10px] text-default-300'>
                parent {shortHash(parentOfHead)}
              </span>
            )}
          </motion.div>
        </Lane>
      </div>

      {/* Narration caption. */}
      <AnimatePresence mode='wait'>
        <motion.p
          key={repo.lastAction}
          {...fade}
          aria-live='polite'
          className='mt-3 rounded-lg bg-default-50 px-3 py-2 text-xs leading-5 text-default-600'
        >
          {repo.lastAction}
        </motion.p>
      </AnimatePresence>

      {/* Orphaned commits, if any. */}
      <AnimatePresence>
        {repo.orphaned.length > 0 && (
          <motion.div key='orphans' {...fade} className='mt-3 flex flex-wrap items-center gap-2'>
            <span className='text-[10px] uppercase tracking-wide text-default-400'>
              unreferenced:
            </span>
            {repo.orphaned.map(hash => {
              const commit = repo.store[hash]
              return (
                <GitObjectNode
                  key={hash}
                  type='commit'
                  hash={hash}
                  label={commit && commit.kind === 'commit' ? commit.message : undefined}
                  state='orphaned'
                  hideBadge
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Row 2 — the VS Code shell (Explorer / Source Control + editor)
// ────────────────────────────────────────────────────────────────────────────

type VscTab = 'explorer' | 'scm'

function DiffView({ rows }: { rows: DiffRow[] }) {
  const { added, removed } = diffStat(rows)
  if (added === 0 && removed === 0) return null
  return (
    <div className='overflow-hidden rounded-md border border-default-200 bg-default-50 font-sourceCodePro text-[11px] leading-5'>
      <div className='flex items-center gap-2 border-b border-default-200 px-2 py-1 text-[10px] text-default-500'>
        <span className='text-success'>+{added}</span>
        <span className='text-danger'>−{removed}</span>
        <span>vs last commit</span>
      </div>
      <div className='max-h-28 overflow-auto'>
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

const STATUS_BADGE: Record<FileStatus, { letter: string; className: string } | null> = {
  committed: null,
  modified: { letter: 'M', className: 'text-warning' },
  staged: { letter: 'M', className: 'text-success' },
  'staged-modified': { letter: 'M', className: 'text-warning' }
}

function ActivityBar({
  tab,
  onTab,
  changeCount
}: {
  tab: VscTab
  onTab: (t: VscTab) => void
  changeCount: number
}) {
  const item = (id: VscTab, label: string, icon: React.ReactNode, badge?: number) => {
    const active = tab === id
    return (
      <button
        type='button'
        aria-label={label}
        aria-pressed={active}
        title={label}
        onClick={() => onTab(id)}
        className={cn(
          'relative flex h-11 w-11 items-center justify-center border-l-2 transition-colors',
          active
            ? 'border-primary text-foreground'
            : 'border-transparent text-default-400 hover:text-default-600'
        )}
      >
        {icon}
        {badge ? (
          <span className='absolute bottom-1.5 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground'>
            {badge}
          </span>
        ) : null}
      </button>
    )
  }
  return (
    <div className='flex flex-row gap-1 border-b border-default-200 bg-default-100 sm:flex-col sm:gap-0 sm:border-b-0 sm:border-r'>
      {item('explorer', 'Explorer', <FilesIcon size={20} />)}
      {item('scm', 'Source Control', <GitBranchIcon size={20} />, changeCount)}
    </div>
  )
}

function VscodeShell({
  repo,
  selected,
  onSelect,
  message,
  onMessage,
  dispatch
}: {
  repo: Repo
  selected: FileName
  onSelect: (f: FileName) => void
  message: string
  onMessage: (m: string) => void
  dispatch: React.Dispatch<Action>
}) {
  const [tab, setTab] = useState<VscTab>('explorer')
  const changes = changedFiles(repo)
  const staged = FILE_ORDER.filter(n => repo.index[n] !== undefined)
  const canCommit = staged.length > 0

  const file = repo.files[selected]
  const workingHash = useMemo(
    () => hashContent(file.working, 'blob'),
    [file.working]
  )
  const diffRows = useMemo(
    () => diffLines(file.committed, file.working),
    [file.committed, file.working]
  )

  return (
    <div className='overflow-hidden rounded-2xl border border-default-200 bg-default-50'>
      {/* Title bar */}
      <div className='flex items-center gap-2 border-b border-default-200 bg-default-100 px-3 py-1.5'>
        <span className='flex gap-1.5'>
          <span className='h-2.5 w-2.5 rounded-full bg-default-300' />
          <span className='h-2.5 w-2.5 rounded-full bg-default-300' />
          <span className='h-2.5 w-2.5 rounded-full bg-default-300' />
        </span>
        <span className='ml-1 text-xs text-default-500'>demo-repo — VS Code</span>
      </div>

      <div className='flex flex-col sm:flex-row'>
        <ActivityBar tab={tab} onTab={setTab} changeCount={changes.length} />

        {/* Side panel */}
        <div className='w-full border-b border-default-200 sm:w-56 sm:border-b-0 sm:border-r'>
          {tab === 'explorer' ? (
            <ExplorerPanel repo={repo} selected={selected} onSelect={onSelect} />
          ) : (
            <SourceControlPanel
              repo={repo}
              message={message}
              onMessage={onMessage}
              canCommit={canCommit}
              dispatch={dispatch}
              onSelect={onSelect}
            />
          )}
        </div>

        {/* Editor */}
        <div className='flex min-w-0 flex-1 flex-col'>
          <div className='flex items-center justify-between border-b border-default-200 bg-default-100 px-3 py-1.5'>
            <span className='flex items-center gap-1.5 font-sourceCodePro text-xs text-foreground'>
              <FileIcon size={13} className='text-default-400' />
              {selected}
            </span>
            <span className='font-sourceCodePro text-[10px] text-secondary'>
              blob {workingHash}
            </span>
          </div>

          <textarea
            aria-label={`Edit ${selected}`}
            spellCheck={false}
            value={file.working}
            onChange={e => dispatch({ type: 'edit', name: selected, content: e.target.value })}
            className='h-40 w-full resize-none border-0 bg-default-50 p-3 font-sourceCodePro text-xs text-foreground outline-none'
          />

          <div className='border-t border-default-200 p-2'>
            <DiffView rows={diffRows} />
            {diffStat(diffRows).added === 0 && diffStat(diffRows).removed === 0 && (
              <p className='px-1 py-2 text-center text-[11px] text-default-400'>
                No changes yet — edit the file above, then switch to{' '}
                <span className='text-foreground'>Source Control</span> to stage &amp; commit.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExplorerPanel({
  repo,
  selected,
  onSelect
}: {
  repo: Repo
  selected: FileName
  onSelect: (f: FileName) => void
}) {
  return (
    <div className='py-2'>
      <div className='px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-default-400'>
        Explorer
      </div>
      <div className='flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-default-500'>
        <FilesIcon size={13} /> demo-repo
      </div>
      {FILE_ORDER.map(name => {
        const status = fileStatus(repo, name)
        const badge = STATUS_BADGE[status]
        const active = name === selected
        return (
          <button
            key={name}
            type='button'
            onClick={() => onSelect(name)}
            aria-pressed={active}
            className={cn(
              'flex w-full items-center gap-2 py-1 pl-6 pr-3 text-left text-xs transition-colors',
              active ? 'bg-default-200 text-foreground' : 'text-default-600 hover:bg-default-100'
            )}
          >
            <FileIcon size={13} className='text-default-400' />
            <span className='flex-1 font-sourceCodePro'>{name}</span>
            {badge && (
              <span className={cn('font-sourceCodePro text-[11px] font-bold', badge.className)}>
                {badge.letter}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function SourceControlPanel({
  repo,
  message,
  onMessage,
  canCommit,
  dispatch,
  onSelect
}: {
  repo: Repo
  message: string
  onMessage: (m: string) => void
  canCommit: boolean
  dispatch: React.Dispatch<Action>
  onSelect: (f: FileName) => void
}) {
  const changes = changedFiles(repo)

  return (
    <div className='py-2'>
      <div className='px-3 pb-2 text-[10px] font-semibold uppercase tracking-wide text-default-400'>
        Source Control
      </div>

      <div className='px-2'>
        <Input
          size='sm'
          variant='bordered'
          radius='sm'
          placeholder='Message (commit)'
          value={message}
          onValueChange={onMessage}
          classNames={{
            input: 'font-sourceCodePro text-xs',
            inputWrapper: 'border-default-200'
          }}
        />
        <Button
          size='sm'
          color='primary'
          radius='sm'
          className='mt-2 w-full'
          startContent={<CheckIcon size={14} />}
          isDisabled={!canCommit}
          onPress={() => dispatch({ type: 'commit', message })}
        >
          Commit
        </Button>
        <p className='mt-1 px-0.5 text-[10px] leading-4 text-default-400'>
          Check a file to stage it (that writes its blob). The message becomes part of the
          commit&apos;s hash.
        </p>
      </div>

      <div className='mt-2 px-2'>
        <div className='mb-1 flex items-center justify-between px-1'>
          <span className='text-[10px] font-semibold uppercase tracking-wide text-default-400'>
            Changes
          </span>
          <span className='text-[10px] text-default-400'>{changes.length}</span>
        </div>

        {changes.length === 0 ? (
          <p className='px-1 py-3 text-center text-[11px] text-default-400'>
            No changes.
          </p>
        ) : (
          changes.map(name => {
            const isStaged = repo.index[name] !== undefined
            const status = fileStatus(repo, name)
            const badge = STATUS_BADGE[status]
            return (
              <div
                key={name}
                className='flex items-center gap-2 rounded-md px-1 py-1 hover:bg-default-100'
              >
                <input
                  type='checkbox'
                  aria-label={`Stage ${name}`}
                  checked={isStaged}
                  onChange={() =>
                    dispatch({ type: isStaged ? 'unstage' : 'stage', name })
                  }
                  className='h-3.5 w-3.5 shrink-0 accent-primary'
                />
                <button
                  type='button'
                  onClick={() => onSelect(name)}
                  className='flex flex-1 items-center gap-1.5 text-left'
                >
                  <FileIcon size={13} className='text-default-400' />
                  <span className='flex-1 font-sourceCodePro text-xs text-default-600'>
                    {name}
                  </span>
                  {badge && (
                    <span className={cn('font-sourceCodePro text-[11px] font-bold', badge.className)}>
                      {badge.letter}
                    </span>
                  )}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────

export default function ObjectInspector() {
  const [repo, dispatch] = useReducer(reducer, undefined, makeInitialRepo)
  const [selected, setSelected] = useState<FileName>('app.py')
  const [message, setMessage] = useState('Update app.py')

  const canReset = repo.history.length >= 2

  return (
    <GitDemoContainer
      title='The workbench: drive Git, watch the objects'
      description='Below is a familiar editor. Edit a file, stage it, and commit — just like you would in VS Code. Up top, watch what Git is really doing underneath: writing blobs, building a tree and a commit, and moving the branch pointer.'
      caption={
        <>
          Everything here is real Git behavior in miniature: staging a file writes a blob
          immediately; committing is what builds the tree and the commit object; the commit
          stores its <em>parent&apos;s</em> hash; and <code>reset --hard</code> just moves the
          branch pointer — the old commit isn&apos;t deleted, only unreferenced. Hashes are a
          stand-in, but the relationships are exact.
        </>
      }
    >
      <div className='flex flex-col gap-4'>
        {/* Row 1 — the live .git pipeline */}
        <GitPipeline repo={repo} />

        {/* Row 2 — the VS Code shell */}
        <VscodeShell
          repo={repo}
          selected={selected}
          onSelect={setSelected}
          message={message}
          onMessage={setMessage}
          dispatch={dispatch}
        />

        {/* Footer controls */}
        <div className='flex items-center justify-between'>
          <Button
            size='sm'
            variant='bordered'
            radius='sm'
            startContent={<RotateCcwIcon size={13} />}
            isDisabled={!canReset}
            onPress={() => dispatch({ type: 'reset' })}
          >
            git reset --hard HEAD~1
          </Button>
          <button
            type='button'
            onClick={() => dispatch({ type: 'reset-all' })}
            className='text-[11px] text-default-400 underline-offset-2 hover:text-default-600 hover:underline'
          >
            reset the demo
          </button>
        </div>
      </div>
    </GitDemoContainer>
  )
}
