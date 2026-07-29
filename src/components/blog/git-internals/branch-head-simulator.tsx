'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@heroui/react'
import { GitCommitHorizontalIcon, GitBranchIcon, RotateCcwIcon } from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import StageDots from './shared/stage-dots'
import { hashKey, shortHash } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'
import TheSvgIcon from '@/components/blog/shared/the-svg-icon'

// ONE job: prove a branch is a literal file holding one hash. The left "GUI
// view" shows the familiar fat branch lane; the right shows the actual
// .git/refs/heads/ file(s). Commit → the file's ONE line changes to a new hash
// (the branch "moving" = a file edit). Branch → a second file appears.
//
// Deliberately does NOT touch HEAD or checkout — that's a pointer-to-a-pointer,
// and it gets its own focused section/component next. One idea per demo.

type Branch = { name: string; tip: string }

const ROOT = hashKey('branch-demo root')

function initialBranches(): Branch[] {
  return [{ name: 'main', tip: ROOT }]
}

export default function BranchHeadSimulator() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  // Which branch new commits extend. (Shown here only to know which file to
  // rewrite — we don't visualise HEAD; that's the next section's job.)
  const [active, setActive] = useState('main')
  const [seq, setSeq] = useState(1)
  const [note, setNote] = useState(
    'One branch: main. Its file holds a single commit hash. Commit and watch that one line change.'
  )
  const { swap } = useGitMotion()

  const current = branches.find(b => b.name === active)!

  function commit() {
    const newHash = hashKey(`${current.tip} commit ${seq}`)
    setBranches(bs =>
      bs.map(b => (b.name === active ? { ...b, tip: newHash } : b))
    )
    setSeq(s => s + 1)
    setNote(
      `Committed. Git overwrote the one line inside refs/heads/${active} with the new hash ${shortHash(newHash)}. Nothing "moved" but a line of text.`
    )
  }

  function branch() {
    if (branches.some(b => b.name === 'feature')) return
    setBranches(bs => [...bs, { name: 'feature', tip: current.tip }])
    setActive('feature')
    setNote(
      'Created feature: Git wrote a new 41-byte file, refs/heads/feature, holding the same hash main points at. No project copied — just one small file.'
    )
  }

  function reset() {
    setBranches(initialBranches())
    setActive('main')
    setSeq(1)
    setNote(
      'One branch: main. Its file holds a single commit hash. Commit and watch that one line change.'
    )
  }

  const hasFeature = branches.some(b => b.name === 'feature')

  return (
    <GitDemoContainer
      title='A branch is a one-line file'
      description='What a Git GUI shows as a heavy parallel lane is, underneath, a tiny text file holding one hash. Commit and watch that single line get rewritten — that is the entire mechanism of a branch “moving.”'
      caption={
        <>
          <code>refs/heads/&lt;name&gt;</code> is a ~41-byte file: a 40-character commit hash
          plus a newline. Committing overwrites that line; branching writes a new such file. No
          commit is ever moved or copied — only a pointer is rewritten.
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
          <GitCommitHorizontalIcon size={15} /> Commit on {active}
        </button>
        <button
          type='button'
          onClick={branch}
          disabled={hasFeature}
          className='inline-flex items-center gap-1.5 rounded-lg border border-default-200 px-3 py-1.5 text-sm text-default-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-default-200 disabled:hover:text-default-600'
        >
          <GitBranchIcon size={15} /> Branch feature
        </button>
        <button
          type='button'
          onClick={reset}
          className='ml-auto inline-flex items-center gap-1 text-[11px] text-default-400 transition-colors hover:text-default-600'
        >
          <RotateCcwIcon size={12} /> reset
        </button>
      </div>

      <div className='grid gap-3 lg:grid-cols-2'>
        {/* LEFT — what a GUI shows: the fat parallel lane */}
        <div className='relative overflow-hidden rounded-xl border border-default-100 bg-background p-4 shadow-sm'>
          <StageDots />
          <div className='relative mb-3 flex items-center gap-1.5 text-xs font-medium text-default-500'>
            <TheSvgIcon
              slug='git'
              size={16}
              fallback={<GitBranchIcon size={16} className='text-primary' />}
            />
            what a Git GUI shows
          </div>
          <div className='relative flex items-end gap-6 pl-1'>
            {branches.map(b => {
              const isActive = b.name === active
              return (
                <div key={b.name} className='flex flex-col items-center gap-2'>
                  {/* a chunky "lane" — the heavy mental picture */}
                  <div
                    className={cn(
                      'h-16 w-3 rounded-full transition-colors',
                      isActive ? 'bg-primary' : 'bg-default-300'
                    )}
                  />
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-sourceCodePro text-xs font-semibold',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-default-200 text-default-500'
                    )}
                  >
                    <GitBranchIcon size={11} />
                    {b.name}
                  </span>
                </div>
              )
            })}
          </div>
          <p className='relative mt-3 text-[11px] text-default-400'>
            Looks like separate lanes of work…
          </p>
        </div>

        {/* RIGHT — what Git keeps: the literal files */}
        <div className='rounded-xl bg-default-100 p-4 font-sourceCodePro shadow-sm'>
          <div className='mb-3 text-xs font-medium text-default-500'>
            what Git keeps under the hood
          </div>

          <div className='space-y-3'>
            {branches.map(b => (
              <div key={b.name}>
                <div className='mb-1 text-[11px] text-default-400'>
                  .git/refs/heads/{b.name}
                </div>
                <div className='flex h-7 items-center rounded-md bg-background px-2 shadow-sm'>
                  <AnimatePresence mode='wait'>
                    <motion.code
                      key={b.tip}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={swap}
                      className='text-xs font-semibold text-secondary'
                    >
                      {b.tip}
                    </motion.code>
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          <p className='mt-3 text-[11px] text-default-400'>
            …but each is just one line: a hash.
          </p>
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
