'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// The palette's code (and its search library) loads on first open only.
const SearchPalette = dynamic(
  () => import('@/components/search/search-palette'),
  { ssr: false }
)

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

// The navbar's search button, and the keys that open search anywhere:
// ⌘K / Ctrl+K, or "/" when not typing.
export default function SearchTrigger() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform))
    const onKey = (event: KeyboardEvent) => {
      const k = event.key.toLowerCase()
      if ((event.metaKey || event.ctrlKey) && k === 'k') {
        event.preventDefault()
        setLoaded(true)
        setOpen(o => !o)
      } else if (
        k === '/' &&
        !isTyping(event.target) &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        event.preventDefault()
        setLoaded(true)
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        type='button'
        onClick={() => {
          setLoaded(true)
          setOpen(true)
        }}
        aria-label='Search'
        aria-keyshortcuts='Meta+K Control+K /'
        className='border-hair text-muted hover:text-foreground focus-visible:outline-accent ml-1 flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2 text-xs transition-colors focus-visible:outline-2'
      >
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          className='size-4'
        >
          <circle cx='11' cy='11' r='6.5' />
          <path d='m20 20-4.2-4.2' />
        </svg>
        <kbd className='font-sourceCodePro hidden sm:inline'>
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      {loaded && <SearchPalette open={open} onClose={() => setOpen(false)} />}
    </>
  )
}
