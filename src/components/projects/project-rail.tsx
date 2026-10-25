import type { ProjectMeta } from '@/libs/projects'
import BackLink from '@/components/reading/back-link'
import StackList from '@/components/projects/stack-list'

// The left rail on wide screens, mirroring the post page's author rail:
// back to the list, then the facts and what it's built with. Navigation
// (sections, neighbours) lives in the right rail. Server-rendered; the only
// client JS is the back link.
export default function ProjectRail({ meta }: { meta: ProjectMeta }) {
  return (
    <aside
      aria-label='Project details'
      className='fixed top-24 right-[calc(50%+384px+1.5rem)] hidden max-h-[calc(100vh-7rem)] w-48 overflow-y-auto xl:block'
    >
      <BackLink href='/projects' label='All projects' />

      <ProjectFacts meta={meta} className='mt-6' />

      {meta.stack.length > 0 && (
        <div className='border-hair mt-6 space-y-2 border-t pt-4'>
          <p className='font-sourceCodePro text-muted text-xs'>Built with</p>
          <StackList stack={meta.stack} />
        </div>
      )}
    </aside>
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
