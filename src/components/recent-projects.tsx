import SectionHeader from '@/components/section-header'
import ProjectCard from '@/components/projects/project-card'
import ProjectRows from '@/components/projects/project-rows'
import { getProjects } from '@/libs/projects'

// Featured case studies as cards with their covers; the rest as compact rows.
export default function RecentProjects() {
  const projects = getProjects()
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)

  return (
    <>
      <SectionHeader
        index='01'
        label='Work'
        title='Selected work'
        href='/projects'
        linkText='All projects'
      />
      <div className='grid gap-6 sm:grid-cols-2'>
        {featured.map(project => (
          <ProjectCard key={project.slug} project={project} headingLevel='h3' />
        ))}
      </div>
      {rest.length > 0 && (
        <div className='mt-6'>
          <ProjectRows projects={rest} />
        </div>
      )}
    </>
  )
}
