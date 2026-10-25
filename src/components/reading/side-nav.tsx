import Link from 'next/link'
import TableOfContents from '@/components/table-of-contents'
import type { TocItem } from '@/libs/toc'
import type { PagerEntry } from '@/components/reading/pager'

// The right rail on wide screens, the same on posts and case studies: the
// page's sections (the one being read is lit), the neighbours, and the
// keyboard shortcuts. The left rail holds the context (author or facts).
export default function SideNav({
  toc,
  previous,
  next,
  listLabel,
  reserveBottom = false
}: {
  toc: TocItem[]
  previous: PagerEntry | null
  next: PagerEntry | null
  // What ← → step through, for the shortcut hint ("posts", "projects").
  listLabel: string
  // Leave room under the rail for the post's like button.
  reserveBottom?: boolean
}) {
  return (
    <aside
      aria-label='Page navigation'
      className={`fixed top-24 left-[calc(50%+384px+1.5rem)] hidden w-56 flex-col gap-6 xl:flex ${
        reserveBottom ? 'bottom-32' : 'bottom-10'
      }`}
    >
      <div className='min-h-0 flex-1'>
        <TableOfContents items={toc} />
      </div>

      {(previous || next) && (
        <nav
          aria-label={`More ${listLabel}`}
          className='border-hair space-y-3 border-t pt-4 text-xs'
        >
          {previous && <Neighbour label='Previous' entry={previous} />}
          {next && <Neighbour label='Next' entry={next} />}
        </nav>
      )}

      <p className='font-sourceCodePro text-muted text-[11px] leading-relaxed'>
        esc · back
        <br />← → · {listLabel}
      </p>
    </aside>
  )
}

function Neighbour({ label, entry }: { label: string; entry: PagerEntry }) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='font-sourceCodePro text-muted'>{label}</span>
      <Link
        href={entry.href}
        className='hover:text-accent line-clamp-2 transition-colors'
      >
        {entry.title}
      </Link>
    </div>
  )
}
