'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Checkbox, cn } from '@heroui/react'
import { FileIcon, GitCommitHorizontalIcon, RotateCcwIcon } from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import StageDots from './shared/stage-dots'
import { hashContent } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

// ONE job: show that the index is a CHOICE. A multi-file working directory with
// checkboxes — you pick which files to stage. `git add` writes a blob for each
// PICKED file and lists it in the index. `git commit` folds ONLY the index into
// a tree + commit; unstaged files stay behind in the working dir, visibly left
// out of the commit. add and commit touch different lanes; the index is the pick.

type FileName = 'app.py' | 'utils.py' | 'README.md'

const FILES: { name: FileName; content: string }[] = [
  { name: 'app.py', content: 'print("hi")' },
  { name: 'utils.py', content: 'def add(a, b): return a + b' },
  { name: 'README.md', content: '# Demo' }
]

const blobOf = (name: FileName) =>
  hashContent(FILES.find(f => f.name === name)!.content)

export default function StagingArea() {
  // which files the reader has ticked to stage (but not yet added)
  const [picked, setPicked] = useState<Set<FileName>>(new Set())
  // what git add has written to the index for the NEXT commit (path → blob)
  const [staged, setStaged] = useState<FileName[]>([])
  // files already captured in a previous commit (their blobs live in objects)
  const [committedFiles, setCommittedFiles] = useState<FileName[]>([])
  const [commitCount, setCommitCount] = useState(0)
  const [justCommitted, setJustCommitted] = useState(false)
  const [note, setNote] = useState(
    'Three modified files. Tick the ones you want in your next commit, then git add — only what you pick gets staged.'
  )
  const { nodeAppear, fade } = useGitMotion()

  const treeHash = hashContent(
    [...committedFiles, ...staged].map(f => `${f}:${blobOf(f)}`).join(',')
  )
  const commitHash = hashContent(`${treeHash}:c${commitCount}`)

  const isCommitted = (name: FileName) => committedFiles.includes(name)

  function toggle(name: FileName) {
    if (isCommitted(name) || staged.includes(name)) return
    setJustCommitted(false)
    setPicked(p => {
      const next = new Set(p)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  function add() {
    const toStage = Array.from(picked).filter(
      f => !staged.includes(f) && !isCommitted(f)
    )
    if (!toStage.length) return
    setStaged(s => [...s, ...toStage])
    setPicked(new Set())
    setJustCommitted(false)
    setNote(
      `git add wrote a blob for ${toStage.length > 1 ? 'each picked file' : toStage[0]} into objects/ right now, and listed ${toStage.length > 1 ? 'them' : 'it'} in the index. Stage more, or commit what you have.`
    )
  }

  function commit() {
    if (!staged.length) return
    const n = commitCount + 1
    setCommittedFiles(c => [...c, ...staged])
    setStaged([])
    setCommitCount(n)
    setJustCommitted(true)
    setNote(
      n === 1
        ? `git commit folded the index into ONE tree and a commit. The commit points at the tree; the tree points at the ${staged.length} staged blob(s). The index is empty again — you can stage more and commit again.`
        : `Second commit. Git wrote a new tree + commit for the files you just staged, linked back to the last commit as its parent. Nothing before it was touched.`
    )
  }

  function reset() {
    setPicked(new Set())
    setStaged([])
    setCommittedFiles([])
    setCommitCount(0)
    setJustCommitted(false)
    setNote(
      'Three modified files. Tick the ones you want in your next commit, then git add — only what you pick gets staged.'
    )
  }

  const blobs: FileName[] = [...committedFiles, ...staged]
  const hasPick = Array.from(picked).some(
    f => !staged.includes(f) && !isCommitted(f)
  )
  const pickCount = Array.from(picked).filter(
    f => !staged.includes(f) && !isCommitted(f)
  ).length

  return (
    <GitDemoContainer
      title='Working directory → index → objects'
      description='The index is a choice: you pick which files go into the next commit. git add writes a blob for each picked file and lists it in the index; git commit folds that list into a tree and a commit. Unstaged files are simply left out.'
      caption={
        <>
          The <code>index</code> is a single file listing “what my next commit will contain”.
          <code>git add</code> writes a blob per staged file and records it; <code>git commit</code>{' '}
          folds the index into one tree, then a commit that points at that tree plus the author,
          message, and parent. Nothing is invented at commit time.
        </>
      }
    >
      {/* controls */}
      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={add}
          disabled={!hasPick}
          className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40'
        >
          git add {hasPick ? `(${pickCount})` : ''}
        </button>
        <button
          type='button'
          onClick={commit}
          disabled={!staged.length}
          className='inline-flex items-center gap-1.5 rounded-lg border border-default-200 px-3 py-1.5 text-sm text-default-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-default-200 disabled:hover:text-default-600'
        >
          <GitCommitHorizontalIcon size={15} /> git commit
        </button>
        <button
          type='button'
          onClick={reset}
          className='ml-auto inline-flex items-center gap-1 text-[11px] text-default-400 transition-colors hover:text-default-600'
        >
          <RotateCcwIcon size={12} /> reset
        </button>
      </div>

      {/* three lanes */}
      <div className='grid gap-3 md:grid-cols-3'>
        {/* working directory — checkboxes to pick what to stage */}
        <Lane title='working directory' subtitle='pick what to stage'>
          <div className='space-y-1.5'>
            {FILES.map(f => {
              const isStaged = staged.includes(f.name)
              const done = isCommitted(f.name)
              return (
                <div
                  key={f.name}
                  className={cn(
                    'flex items-center gap-2 rounded-md bg-background px-2 py-1.5 shadow-sm transition-opacity',
                    (isStaged || done) && 'opacity-50'
                  )}
                >
                  <Checkbox
                    size='sm'
                    radius='sm'
                    isSelected={picked.has(f.name) || isStaged || done}
                    isDisabled={isStaged || done}
                    onValueChange={() => toggle(f.name)}
                    aria-label={`Stage ${f.name}`}
                  />
                  <FileIcon size={14} className='text-default-400' />
                  <span className='font-sourceCodePro text-xs text-foreground'>
                    {f.name}
                  </span>
                  <span
                    className={cn(
                      'ml-auto text-[10px] font-medium',
                      done
                        ? 'text-default-400'
                        : isStaged
                          ? 'text-success'
                          : 'text-warning'
                    )}
                  >
                    {done ? 'committed' : isStaged ? 'staged' : 'modified'}
                  </span>
                </div>
              )
            })}
          </div>
        </Lane>

        {/* index / staging */}
        <Lane title='index (staging area)' subtitle='next commit’s file list'>
          <AnimatePresence mode='popLayout'>
            {staged.length === 0 ? (
              <motion.p key='empty' {...fade} className='px-1 text-[11px] text-default-400'>
                {justCommitted ? '(emptied — folded into the commit)' : '(empty)'}
              </motion.p>
            ) : (
              staged.map(name => (
                <motion.div
                  key={name}
                  layout
                  {...fade}
                  className='rounded-md bg-background px-2 py-1.5 font-sourceCodePro text-xs shadow-sm'
                >
                  <span className='text-foreground'>{name}</span>
                  <span className='text-default-400'> → </span>
                  <span className='font-semibold text-secondary'>{blobOf(name)}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </Lane>

        {/* objects */}
        <Lane title='.git/objects' subtitle='permanent store' dots>
          <div className='flex flex-wrap gap-2'>
            <AnimatePresence mode='popLayout'>
              {blobs.length === 0 && (
                <motion.p key='empty-obj' {...fade} className='px-1 text-[11px] text-default-400'>
                  (empty)
                </motion.p>
              )}
              {blobs.map(name => (
                <motion.div key={`blob-${name}`} layout {...nodeAppear}>
                  <GitObjectNode
                    type='blob'
                    hash={blobOf(name)}
                    label={name}
                    state={staged.includes(name) ? 'new' : 'normal'}
                    hideBadge
                    compact
                  />
                </motion.div>
              ))}
              {commitCount > 0 && (
                <motion.div key='tree' layout {...nodeAppear}>
                  <GitObjectNode type='tree' hash={treeHash} label='/' compact />
                </motion.div>
              )}
              {commitCount > 0 && (
                <motion.div key='commit' layout {...nodeAppear}>
                  <GitObjectNode
                    type='commit'
                    hash={commitHash}
                    label={`commit #${commitCount}`}
                    state={justCommitted ? 'new' : 'normal'}
                    compact
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Lane>
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

function Lane({
  title,
  subtitle,
  children,
  dots = false
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  dots?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-3 shadow-sm',
        dots ? 'border border-default-100 bg-background' : 'bg-default-100'
      )}
    >
      {dots && <StageDots />}
      <div className='relative mb-0.5 text-xs font-medium text-default-500'>{title}</div>
      <div className='relative mb-3 text-[10px] text-default-400'>{subtitle}</div>
      <div className='relative min-h-[6rem] space-y-2'>{children}</div>
    </div>
  )
}
