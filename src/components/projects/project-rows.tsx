import Image from 'next/image'
import Link from 'next/link'
import type { ProjectMeta } from '@/libs/projects'

// Compact project list for the home page; each row opens the case study.
export default function ProjectRows({ projects }: { projects: ProjectMeta[] }) {
  return (
    <ul className='space-y-3'>
      {projects.map(project => (
        <li key={project.slug}>
          <Link
            href={`/projects/${project.slug}`}
            className='group border-hair hover:border-accent focus-visible:outline-accent flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors focus-visible:outline-2'
          >
            <Image
              src={project.logo}
              alt=''
              width={36}
              height={36}
              className='size-9 shrink-0 object-contain'
            />
            <div className='min-w-0'>
              <p className='group-hover:text-accent font-semibold transition-colors'>
                {project.title}
              </p>
              <p className='text-muted line-clamp-1 text-sm'>
                {project.tagline}
              </p>
            </div>
            <span
              aria-hidden='true'
              className='text-muted group-hover:text-accent ml-auto shrink-0 transition-colors'
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
