import Projects from '@/components/projects'
import React from 'react'
import { projects } from '@/content/projects'

export default async function ProjectsPage() {
  return (
    <div className='space-y-4'>
      <h1 className='font-sourceCodePro text-xl font-bold'>Projects</h1>
      <Projects projects={projects} />
    </div>
  )
}
