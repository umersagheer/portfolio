import Link from 'next/link'
import type { ProjectMeta } from '@/libs/projects'
import type { TocItem } from '@/libs/toc'
import BackLink from '@/components/projects/back-link'

type ProjectRailProps = {
  meta: ProjectMeta
  toc: TocItem[]
  previous: ProjectMeta | null
  next: ProjectMeta | null
}

// The left rail on wide screens, mirroring the post page's author rail:
// back link, the facts, the page's sections and the neighbouring projects.
// Server-rendered links only; no client JS.
export default function ProjectRail({
  meta,
  toc,
  previous,
  next
}: ProjectRailProps) {
  return (
    <aside
      aria-label='Project details'
      className='fixed top-24 right-[calc(50%+384px+1.5rem)] hidden max-h-[calc(100vh-7rem)] w-48 overflow-y-auto xl:block'
    >
      <BackLink />

      <ProjectFacts meta={meta} className='mt-6' />

      {toc.length > 0 && (
        <nav
          aria-label='On this page'
          className='border-hair mt-6 border-t pt-4'
        >
          <p className='font-sourceCodePro text-muted mb-2 text-xs'>
            On this page
          </p>
          <ul className='space-y-1.5 text-xs'>
            {toc.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className='text-muted hover:text-foreground transition-colors'
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {(previous || next) && (
        <nav
          aria-label='More projects'
          className='border-hair mt-6 space-y-3 border-t pt-4 text-xs'
        >
          {previous && <RailNeighbour label='Previous' project={previous} />}
          {next && <RailNeighbour label='Next' project={next} />}
        </nav>
      )}

      <p className='font-sourceCodePro text-muted mt-6 text-[11px] leading-relaxed'>
        esc · back
        <br />← → · projects
      </p>
    </aside>
  )
}

function RailNeighbour({
  label,
  project
}: {
  label: string
  project: ProjectMeta
}) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='font-sourceCodePro text-muted'>{label}</span>
      <Link
        href={`/projects/${project.slug}`}
        className='hover:text-accent transition-colors'
      >
        {project.title}
      </Link>
    </div>
  )
}

// Status, platform, client, role and period (whichever are known), the
// public links, and the repository note. Shared by the rail and the inline
// header on narrow screens.
export function ProjectFacts({
  meta,
  className = ''
}: {
  meta: ProjectMeta
  className?: string
}) {
  const facts = [
    ['Status', meta.status],
    ['Platform', meta.platform],
    ['Client', meta.client],
    ['Role', meta.role],
    ['When', meta.period]
  ].filter((fact): fact is [string, string] => Boolean(fact[1]))

  return (
    <div className={`space-y-4 ${className}`}>
      <dl className='grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1.5 text-xs'>
        {facts.map(([term, value]) => (
          <div key={term} className='contents'>
            <dt className='font-sourceCodePro text-muted'>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {meta.links.length > 0 && (
        <ul className='space-y-1.5 text-sm'>
          {meta.links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-accent inline-flex items-center gap-1 transition-colors'
              >
                {link.label} <span aria-hidden='true'>↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {meta.code === 'private' ? (
        <p className='font-sourceCodePro text-muted text-xs'>
          Private repository
        </p>
      ) : (
        <a
          href={meta.code}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-accent text-sm transition-colors'
        >
          Source code <span aria-hidden='true'>↗</span>
        </a>
      )}
    </div>
  )
}
