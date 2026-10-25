import type { Metadata } from 'next'
import ProjectCard from '@/components/projects/project-card'
import { getProjects } from '@/libs/projects'

export const metadata: Metadata = {
  title: { absolute: 'Full-Stack & AI Case Studies – Umer Sagheer' },
  description:
    'An offline-first restaurant POS on Next.js and PostgreSQL, an AI writing platform for 30–40 universities, and React Native apps on iOS and Android.',
  alternates: { canonical: '/projects' },
  openGraph: { url: '/projects' }
}

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <div className='space-y-8'>
      <div className='space-y-3'>
        <h1 className='font-display text-4xl leading-tight'>Projects</h1>
        <p className='text-muted max-w-2xl leading-relaxed'>
          Case studies: what each product does, how it&apos;s built, and screens
          from it.
        </p>
      </div>
      <div className='grid gap-6 sm:grid-cols-2'>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  )
}
