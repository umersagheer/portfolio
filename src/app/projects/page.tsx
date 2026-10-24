import type { Metadata } from 'next'
import ProjectCard from '@/components/projects/project-card'
import { getProjects } from '@/libs/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Case studies: a restaurant system that runs offline, an AI writing coach used by 7,000+ people, and two apps on the App Store and Google Play.',
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
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
