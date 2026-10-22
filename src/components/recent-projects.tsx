import SectionHeader from '@/components/section-header'
import ProjectRows from '@/components/projects/project-rows'
import { getProjects } from '@/libs/projects'

export default function RecentProjects() {
  return (
    <>
      <SectionHeader
        index='01'
        label='Work'
        title="What I've worked on"
        href='/projects'
        linkText='All projects'
      />
      <ProjectRows projects={getProjects()} />
    </>
  )
}
