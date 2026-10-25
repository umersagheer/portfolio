import Link from 'next/link'

export type PagerEntry = { href: string; title: string; summary?: string }

// Previous / next at the end of a post or case study, in list order.
export default function Pager({
  label,
  previous,
  next
}: {
  label: string
  previous: PagerEntry | null
  next: PagerEntry | null
}) {
  if (!previous && !next) return null

  return (
    <nav
      aria-label={label}
      className='border-hair mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2'
    >
      {previous ? <PagerLink entry={previous} label='← Previous' /> : <span />}
      {next && <PagerLink entry={next} label='Next →' alignEnd />}
    </nav>
  )
}

function PagerLink({
  entry,
  label,
  alignEnd = false
}: {
  entry: PagerEntry
  label: string
  alignEnd?: boolean
}) {
  return (
    <Link
      href={entry.href}
      className={`border-hair hover:border-accent focus-visible:outline-accent group rounded-xl border p-4 transition-colors focus-visible:outline-2 ${
        alignEnd ? 'sm:text-right' : ''
      }`}
    >
      <span className='font-sourceCodePro text-muted text-xs'>{label}</span>
      <span className='group-hover:text-accent mt-1 block font-semibold transition-colors'>
        {entry.title}
      </span>
      {entry.summary && (
        <span className='text-muted mt-0.5 line-clamp-1 text-sm'>
          {entry.summary}
        </span>
      )}
    </Link>
  )
}
