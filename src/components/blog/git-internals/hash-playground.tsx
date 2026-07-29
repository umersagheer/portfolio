'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chip, Textarea, cn } from '@heroui/react'
import { CheckIcon, ArrowRightIcon, ChevronRightIcon } from 'lucide-react'

import GitDemoContainer from './shared/git-demo-container'
import GitObjectNode from './shared/git-object-node'
import StageDots from './shared/stage-dots'
import { hashContent, gitBlobHeader } from './shared/hashes'
import { useGitMotion } from './shared/use-git-motion'

/** One-character-different presets so the avalanche effect is obvious on a click. */
const PRESETS = [
  { label: 'hello', value: 'hello' },
  { label: 'hello␣', value: 'hello ', note: 'trailing space' },
  { label: 'Hello', value: 'Hello', note: 'capital H' },
  { label: 'hello!', value: 'hello!', note: 'added !' }
]

/** How many of the 7 hash characters differ — a felt measure of "avalanche". */
function charsDiffering(a: string, b: string): number {
  let n = 0
  for (let i = 0; i < 7; i++) if (a[i] !== b[i]) n++
  return n
}

function Panel({
  side,
  value,
  onChange,
  onFocus,
  focused
}: {
  side: 'A' | 'B'
  value: string
  onChange: (v: string) => void
  onFocus: () => void
  focused: boolean
}) {
  const hash = hashContent(value)
  const { swap } = useGitMotion()
  const [peek, setPeek] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-3 rounded-xl p-3 shadow-sm transition-all',
        focused ? 'bg-default-100 ring-1 ring-primary' : 'bg-background'
      )}
    >
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium text-default-500'>File {side}</span>
        <span className='text-[11px] text-default-400'>
          {new TextEncoder().encode(value).length} bytes
        </span>
      </div>

      <Textarea
        aria-label={`Content of file ${side}`}
        size='sm'
        variant='bordered'
        minRows={3}
        maxRows={6}
        value={value}
        onValueChange={onChange}
        onFocus={onFocus}
        classNames={{ input: 'font-sourceCodePro text-sm' }}
      />

      <div className='flex items-center gap-2'>
        <span className='text-[11px] uppercase tracking-wide text-default-400'>hash</span>
        <div className='relative overflow-hidden'>
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.code
              key={hash}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={swap}
              className='block font-sourceCodePro text-sm font-semibold text-secondary'
            >
              {hash}
            </motion.code>
          </AnimatePresence>
        </div>
      </div>

      {/* Peek inside the blob: the exact bytes Git hashes, not the raw content. */}
      <div>
        <button
          type='button'
          onClick={() => setPeek(p => !p)}
          className='flex items-center gap-1 text-[11px] text-default-400 transition-colors hover:text-default-600'
          aria-expanded={peek}
        >
          <ChevronRightIcon
            size={12}
            className={cn('transition-transform', peek && 'rotate-90')}
          />
          peek inside the blob
        </button>

        <AnimatePresence initial={false}>
          {peek && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='overflow-hidden'
            >
              <div className='mt-2 rounded-lg bg-default-100 p-2.5 font-sourceCodePro text-xs'>
                <p className='mb-1.5 text-[10px] uppercase tracking-wide text-default-400'>
                  what Git actually hashes
                </p>
                <code className='block leading-relaxed text-default-600'>
                  <span className='text-warning'>{gitBlobHeader(value)}</span>
                  <span className='text-foreground'>{value || '·'}</span>
                </code>
                <div className='my-1 flex items-center gap-1 text-[10px] text-default-400'>
                  <ArrowRightIcon size={11} className='rotate-90' /> SHA-1
                </div>
                <code className='block font-semibold text-secondary'>{hash}</code>
                <p className='mt-1.5 text-[10px] leading-snug text-default-400'>
                  A blob is a tiny header (<code className='text-warning'>blob</code>,
                  the byte count, a hidden NUL) glued to your content — that whole
                  thing is what gets hashed.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function HashPlayground() {
  const [valueA, setValueA] = useState('hello')
  const [valueB, setValueB] = useState('world')
  const [focused, setFocused] = useState<'A' | 'B'>('A')
  const { nodeAppear, fade, spring } = useGitMotion()

  const hashA = useMemo(() => hashContent(valueA), [valueA])
  const hashB = useMemo(() => hashContent(valueB), [valueB])
  const identical = valueA === valueB
  const diff = charsDiffering(hashA, hashB)

  const loadPreset = (v: string) => {
    if (focused === 'A') setValueA(v)
    else setValueB(v)
  }

  return (
    <GitDemoContainer
      title='Content in, hash out'
      description='Git names things by their content. Hand it some bytes, it hands back a hash — and that hash is the address it files the content under. Edit either file and watch its hash recompute live.'
      caption={
        <>
          Real Git runs SHA-1 (or SHA-256) and gives a 40-character hash, shown here
          abbreviated to 7. We use a stand-in hash — what matters is the behavior, which
          is identical: same bytes in ⇒ same hash out, one character changed ⇒ a
          completely different hash. Hit “peek inside the blob” to see the exact bytes it
          hashes.
        </>
      }
    >
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Panel
          side='A'
          value={valueA}
          onChange={setValueA}
          onFocus={() => setFocused('A')}
          focused={focused === 'A'}
        />
        <Panel
          side='B'
          value={valueB}
          onChange={setValueB}
          onFocus={() => setFocused('B')}
          focused={focused === 'B'}
        />
      </div>

      {/* Presets: one click shows how a tiny change scrambles the hash. */}
      <div className='mt-4 flex flex-wrap items-center gap-2'>
        <span className='text-xs text-default-400'>
          Load into file {focused}:
        </span>
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            type='button'
            onClick={() => loadPreset(preset.value)}
            title={preset.note ? `"${preset.value}" — ${preset.note}` : `"${preset.value}"`}
            className='rounded-md border border-default-200 bg-background px-2 py-1 font-sourceCodePro text-xs text-default-600 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* The payoff: what Git actually stores. Same content ⇒ one shared blob. */}
      <div className='relative mt-5 overflow-hidden rounded-xl border border-default-100 bg-background p-4 shadow-sm'>
        <StageDots />
        <div className='relative mb-3 flex items-center justify-between'>
          <span className='text-xs font-medium text-default-500'>
            What Git stores in <code className='text-default-600'>.git/objects</code>
          </span>
          <AnimatePresence mode='wait'>
            {identical ? (
              <motion.span key='dedup' {...fade} aria-live='polite'>
                <Chip
                  size='sm'
                  variant='flat'
                  color='secondary'
                  startContent={<CheckIcon size={13} />}
                >
                  stored once — deduplicated
                </Chip>
              </motion.span>
            ) : (
              <motion.span
                key='distinct'
                {...fade}
                aria-live='polite'
                className='text-[11px] text-default-400'
              >
                {diff}/7 hash characters differ
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className='relative flex items-center justify-center gap-6 py-2'>
          <AnimatePresence mode='popLayout' initial={false}>
            {identical ? (
              // Byte-equal content collapses to a single shared blob.
              <motion.div
                key={`shared-${hashA}`}
                layout
                {...nodeAppear}
                className='flex flex-col items-center gap-2'
              >
                <GitObjectNode type='blob' hash={hashA} state='new' />
                <span className='text-[11px] text-default-400'>
                  both files point here
                </span>
              </motion.div>
            ) : (
              // Different content ⇒ two distinct blobs, two distinct addresses.
              <motion.div
                key='two-blobs'
                layout
                {...fade}
                className='flex items-center gap-6'
              >
                <div className='flex flex-col items-center gap-2'>
                  <GitObjectNode type='blob' hash={hashA} label='file A' />
                </div>
                <motion.div
                  layout
                  transition={spring}
                  className='hidden text-default-300 sm:block'
                  aria-hidden
                >
                  <ArrowRightIcon size={18} className='rotate-90 sm:rotate-0' />
                </motion.div>
                <div className='flex flex-col items-center gap-2'>
                  <GitObjectNode type='blob' hash={hashB} label='file B' />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className='mt-2 text-center text-xs text-default-400'>
          {identical
            ? 'Identical content produces an identical hash, so Git keeps just one copy — no matter how many files (or commits) share it.'
            : 'Different content, different hash, different object. Make the two files match to see Git store it only once.'}
        </p>
      </div>
    </GitDemoContainer>
  )
}
