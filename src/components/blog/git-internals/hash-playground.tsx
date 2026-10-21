'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chip, TextArea, cn } from '@heroui/react'
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
        'flex flex-1 flex-col gap-3 rounded-xl p-3 shadow-xs transition-all',
        focused ? 'bg-surface-secondary ring-accent ring-1' : 'bg-background'
      )}
    >
      <div className='flex items-center justify-between'>
        <span className='text-muted text-xs font-medium'>File {side}</span>
        <span className='text-muted text-[11px]'>
          {new TextEncoder().encode(value).length} bytes
        </span>
      </div>

      <TextArea
        aria-label={`Content of file ${side}`}
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        className='font-sourceCodePro max-h-36 min-h-[4.5rem] text-sm'
      />

      <div className='flex items-center gap-2'>
        <span className='text-muted text-[11px] tracking-wide uppercase'>
          hash
        </span>
        <div className='relative overflow-hidden'>
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.code
              key={hash}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={swap}
              className='font-sourceCodePro text-secondary block text-sm font-semibold'
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
          className='text-muted hover:text-foreground flex items-center gap-1 text-[11px] transition-colors'
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
              <div className='bg-surface-secondary font-sourceCodePro mt-2 rounded-lg p-2.5 text-xs'>
                <p className='text-muted mb-1.5 text-[10px] tracking-wide uppercase'>
                  what Git actually hashes
                </p>
                <code className='text-foreground block leading-relaxed'>
                  <span className='text-warning'>{gitBlobHeader(value)}</span>
                  <span className='text-foreground'>{value || '·'}</span>
                </code>
                <div className='text-muted my-1 flex items-center gap-1 text-[10px]'>
                  <ArrowRightIcon size={11} className='rotate-90' /> SHA-1
                </div>
                <code className='text-secondary block font-semibold'>
                  {hash}
                </code>
                <p className='text-muted mt-1.5 text-[10px] leading-snug'>
                  A blob is a tiny header (
                  <code className='text-warning'>blob</code>, the byte count, a
                  hidden NUL) glued to your content — that whole thing is what
                  gets hashed.
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
          Real Git runs SHA-1 (or SHA-256) and gives a 40-character hash, shown
          here abbreviated to 7. We use a stand-in hash — what matters is the
          behavior, which is identical: same bytes in ⇒ same hash out, one
          character changed ⇒ a completely different hash. Hit “peek inside the
          blob” to see the exact bytes it hashes.
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
        <span className='text-muted text-xs'>Load into file {focused}:</span>
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            type='button'
            onClick={() => loadPreset(preset.value)}
            title={
              preset.note
                ? `"${preset.value}" — ${preset.note}`
                : `"${preset.value}"`
            }
            className='border-border bg-background font-sourceCodePro text-foreground hover:border-accent hover:text-accent focus-visible:ring-accent rounded-md border px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden'
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* The payoff: what Git actually stores. Same content ⇒ one shared blob. */}
      <div className='border-separator bg-background relative mt-5 overflow-hidden rounded-xl border p-4 shadow-xs'>
        <StageDots />
        <div className='relative mb-3 flex items-center justify-between'>
          <span className='text-muted text-xs font-medium'>
            What Git stores in{' '}
            <code className='text-foreground'>.git/objects</code>
          </span>
          <AnimatePresence mode='wait'>
            {identical ? (
              <motion.span key='dedup' {...fade} aria-live='polite'>
                <Chip
                  size='sm'
                  variant='soft'
                  className='bg-secondary-soft text-secondary-soft-foreground'
                >
                  <CheckIcon size={13} />
                  stored once — deduplicated
                </Chip>
              </motion.span>
            ) : (
              <motion.span
                key='distinct'
                {...fade}
                aria-live='polite'
                className='text-muted text-[11px]'
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
                <span className='text-muted text-[11px]'>
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
                  className='text-muted hidden sm:block'
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

        <p className='text-muted mt-2 text-center text-xs'>
          {identical
            ? 'Identical content produces an identical hash, so Git keeps just one copy — no matter how many files (or commits) share it.'
            : 'Different content, different hash, different object. Make the two files match to see Git store it only once.'}
        </p>
      </div>
    </GitDemoContainer>
  )
}
