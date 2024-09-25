import Projects from '@/components/projects'
import { getProjects } from '@/libs/projects'
import React from 'react'

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <div className='space-y-4'>
      <h1 className='font-sourceCodePro text-xl font-bold'>Projects</h1>
      <Projects projects={projects} />
    </div>
  )
}
