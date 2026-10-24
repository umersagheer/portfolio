'use client'

import MiniSearch, { type SearchResult } from 'minisearch'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { openCal } from '@/components/about/book-call'
import { siteProfile } from '@/constants/site-profile'
import type { SearchDoc } from '@/app/search-index.json/route'

type Doc = Omit<SearchDoc, 'type'> & {
  type: SearchDoc['type'] | 'action'
  action?: string
}
type Scope = 'all' | 'project' | 'post' | 'section' | 'action'
type Topic = 'Git' | 'Frontend' | 'Backend' | null

const ACTIONS: Doc[] = [
  {
    id: 'action-book',
    type: 'action',
    action: 'book',
    title: 'Book a 15-minute intro',
    href: siteProfile.booking.intro,
    text: 'call meeting hire calendar cal'
  },
  {
    id: 'action-email',
    type: 'action',
    action: 'email',
    title: 'Copy email address',
    href: `mailto:${siteProfile.email}`,
    text: `${siteProfile.email} contact mail`
  },
  {
    id: 'action-theme',
    type: 'action',
    action: 'theme',
    title: 'Toggle dark mode',
    href: '#',
    text: 'theme light dark appearance'
  },
  {
    id: 'action-cv',
    type: 'action',
    action: 'open',
    title: 'View my CV',
    href: siteProfile.cv,
    text: 'resume cv pdf experience'
  },
  {
    id: 'action-github',
    type: 'action',
    action: 'open',
    title: 'GitHub',
    href: siteProfile.socials.github.url,
    text: 'code repositories'
  },
  {
    id: 'action-linkedin',
    type: 'action',
    action: 'open',
    title: 'LinkedIn',
    href: siteProfile.socials.linkedin.url,
    text: 'profile connect'
  },
  {
    id: 'action-rss',
    type: 'action',
    action: 'open',
    title: 'RSS feed',
    href: '/rss.xml',
    text: 'subscribe feed'
  }
]

const SUGGESTED = [
  'project-munshi',
  'project-engagemo',
  'post-git-internals',
  'post-timezones',
  'action-book'
]
const GROUPS: { type: Doc['type']; label: string }[] = [
  { type: 'page', label: 'Pages' },
  { type: 'project', label: 'Projects' },
  { type: 'post', label: 'Posts' },
  { type: 'section', label: 'Sections' },
  { type: 'action', label: 'Actions' }
]
const SCOPES: { id: Scope; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Projects' },
  { id: 'post', label: 'Posts' },
  { id: 'section', label: 'Sections' },
  { id: 'action', label: 'Actions' }
]
const TOPICS: Exclude<Topic, null>[] = ['Git', 'Frontend', 'Backend']
const PER_GROUP = 4
const RECENT_KEY = 'palette-recent'

// Index fetched once per visit, on first open.
let indexPromise: Promise<{ docs: Doc[]; search: MiniSearch<Doc> }> | null =
  null
function loadIndex() {
  indexPromise ??= fetch('/search-index.json')
    .then(r => r.json() as Promise<SearchDoc[]>)
    .then(list => {
      const docs: Doc[] = [...list, ...ACTIONS]
      const search = new MiniSearch<Doc>({
        fields: ['title', 'group', 'text', 'topic'],
        storeFields: [
          'id',
          'type',
          'title',
          'href',
          'group',
          'topic',
          'action'
        ],
        searchOptions: {
          boost: { title: 3, group: 1.5 },
          prefix: true,
          fuzzy: 0.2
        }
      })
      search.addAll(docs)
      return { docs, search }
    })
  return indexPromise
}

const readRecent = (): Doc[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}
const saveRecent = (doc: Doc) => {
  try {
    const next = [doc, ...readRecent().filter(d => d.id !== doc.id)].slice(0, 5)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {}
}

// Wraps the matched words in a highlight.
function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text
  const pattern = new RegExp(
    `(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  )
  return text.split(pattern).map((part, i) =>
    i % 2 ? (
      <mark key={i} className='text-accent bg-transparent'>
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

export default function SearchPalette({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<Awaited<
    ReturnType<typeof loadIndex>
  > | null>(null)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<Scope>('all')
  const [topic, setTopic] = useState<Topic>(null)
  const [expanded, setExpanded] = useState<Doc['type'] | null>(null)
  const [active, setActive] = useState(0)
  const [recent, setRecent] = useState<Doc[]>([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadIndex().then(setIndex)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setRecent(readRecent())
      setStatus('')
      dialog.showModal()
      requestAnimationFrame(() => inputRef.current?.select())
    } else if (!open && dialog.open) dialog.close()
  }, [open])

  // Search results, filtered by scope and topic, grouped by type.
  const groups = useMemo(() => {
    if (!index) return []
    const q = query.trim()
    if (!q) {
      const byId = new Map(index.docs.map(d => [d.id, d]))
      const suggested = SUGGESTED.map(id => byId.get(id)).filter(
        Boolean
      ) as Doc[]
      return [
        ...(recent.length
          ? [
              {
                type: 'recent',
                label: 'Recent',
                items: recent.map(d => ({ doc: d, terms: [] as string[] })),
                total: recent.length
              }
            ]
          : []),
        {
          type: 'suggested',
          label: 'Suggested',
          items: suggested.map(d => ({ doc: d, terms: [] as string[] })),
          total: suggested.length
        }
      ]
    }
    const hits = (index.search.search(q) as (SearchResult & Doc)[])
      .filter(h => scope === 'all' || h.type === scope)
      .filter(h => !topic || h.topic === topic)
    return GROUPS.map(g => {
      const all = hits.filter(h => h.type === g.type)
      const shown =
        expanded === g.type || scope !== 'all' ? all : all.slice(0, PER_GROUP)
      return {
        type: g.type,
        label: g.label,
        items: shown.map(h => ({ doc: h as Doc, terms: h.terms })),
        total: all.length
      }
    }).filter(g => g.total > 0)
  }, [index, query, scope, topic, expanded, recent])

  const flat = useMemo(() => groups.flatMap(g => g.items), [groups])

  useEffect(() => setActive(0), [query, scope, topic])
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = useCallback(
    async (doc: Doc) => {
      saveRecent(doc)
      if (doc.type !== 'action') {
        onClose()
        router.push(doc.href)
        return
      }
      if (doc.action === 'theme') {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      } else if (doc.action === 'email') {
        try {
          await navigator.clipboard.writeText(siteProfile.email)
          setStatus(`Copied ${siteProfile.email}`)
        } catch {
          window.location.href = doc.href
        }
      } else if (doc.action === 'book') {
        onClose()
        openCal(doc.href)
      } else {
        window.open(doc.href, '_blank', 'noopener,noreferrer')
      }
    },
    [onClose, router, resolvedTheme, setTheme]
  )

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive(a => Math.min(a + 1, flat.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (event.key === 'Enter' && flat[active]) {
      event.preventDefault()
      run(flat[active].doc)
    } else if (event.key === 'Tab') {
      event.preventDefault()
      const i = SCOPES.findIndex(s => s.id === scope)
      setScope(
        SCOPES[(i + (event.shiftKey ? SCOPES.length - 1 : 1)) % SCOPES.length]
          .id
      )
    }
  }

  const chip = (on: boolean) =>
    `rounded-full border px-2.5 py-0.5 text-xs transition-colors ${on ? 'border-accent text-accent' : 'border-hair text-muted hover:text-foreground'}`
  let n = -1

  return (
    <dialog
      ref={dialogRef}
      aria-label='Search'
      onClose={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
      className='border-hair bg-background text-foreground mx-auto mt-[10vh] w-[min(94vw,640px)] max-w-none overflow-hidden rounded-xl border p-0 backdrop:bg-black/60'
    >
      <div onKeyDown={onKeyDown}>
        <div className='border-hair flex items-center gap-3 border-b px-4'>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            className='text-muted size-4 shrink-0'
          >
            <circle cx='11' cy='11' r='6.5' />
            <path d='m20 20-4.2-4.2' />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search projects, posts, sections…'
            aria-label='Search'
            aria-controls='palette-results'
            aria-activedescendant={
              flat[active] ? `palette-${active}` : undefined
            }
            role='combobox'
            aria-expanded='true'
            className='h-12 w-full bg-transparent text-[15px] outline-none'
          />
          <kbd className='font-sourceCodePro text-muted border-hair hidden rounded border px-1.5 text-[10px] sm:block'>
            esc
          </kbd>
        </div>

        <div className='border-hair flex flex-wrap items-center gap-1.5 border-b px-4 py-2'>
          {SCOPES.map(s => (
            <button
              key={s.id}
              type='button'
              onClick={() => setScope(s.id)}
              className={chip(scope === s.id)}
            >
              {s.label}
            </button>
          ))}
          {(scope === 'post' || scope === 'section') && (
            <>
              <span className='text-muted mx-1 text-xs'>·</span>
              {TOPICS.map(t => (
                <button
                  key={t}
                  type='button'
                  onClick={() => setTopic(topic === t ? null : t)}
                  className={chip(topic === t)}
                >
                  {t}
                </button>
              ))}
            </>
          )}
        </div>

        <div
          ref={listRef}
          id='palette-results'
          role='listbox'
          className='max-h-[min(60vh,440px)] overflow-y-auto py-2'
        >
          {!index && <p className='text-muted px-4 py-6 text-sm'>Loading…</p>}
          {index && query.trim() && flat.length === 0 && (
            <div className='px-4 py-6 text-sm'>
              <p>Nothing for “{query.trim()}”.</p>
              <p className='text-muted mt-1'>
                Try Git, offline, WebSockets, Expo, timezones, or AI.
              </p>
            </div>
          )}
          {groups.map(group => (
            <div key={group.type} className='mb-1'>
              <p className='font-sourceCodePro text-muted px-4 pt-2 pb-1 text-[11px] tracking-wide uppercase'>
                {group.label}
              </p>
              {group.items.map(({ doc, terms }) => {
                n += 1
                const i = n
                return (
                  <button
                    key={`${group.type}-${doc.id}`}
                    id={`palette-${i}`}
                    data-index={i}
                    type='button'
                    role='option'
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => run(doc)}
                    className={`flex w-full items-baseline gap-3 px-4 py-2 text-left text-sm ${i === active ? 'bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]' : ''}`}
                  >
                    <span className='line-clamp-1 min-w-0 flex-1'>
                      {doc.group && (
                        <span className='text-muted'>{doc.group} › </span>
                      )}
                      <span className={i === active ? 'text-foreground' : ''}>
                        {highlight(doc.title, terms)}
                      </span>
                    </span>
                    <span className='font-sourceCodePro text-muted shrink-0 text-[10px] uppercase'>
                      {doc.type === 'section' ? 'section' : doc.type}
                    </span>
                  </button>
                )
              })}
              {query.trim() &&
                scope === 'all' &&
                group.total > PER_GROUP &&
                expanded !== group.type && (
                  <button
                    type='button'
                    onClick={() => setExpanded(group.type as Doc['type'])}
                    className='text-muted hover:text-accent px-4 py-1 text-xs'
                  >
                    Show all {group.total} →
                  </button>
                )}
            </div>
          ))}
        </div>

        <div className='border-hair font-sourceCodePro text-muted flex justify-between gap-3 border-t px-4 py-2 text-[11px]'>
          <span aria-live='polite'>
            {status || '↑↓ move · ↵ open · tab scope'}
          </span>
          <span className='hidden sm:inline'>esc close</span>
        </div>
      </div>
    </dialog>
  )
}
