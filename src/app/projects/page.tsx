import Projects from '@/components/projects'
import React from 'react'
import { projects } from '@/content/projects'

export default function ProjectsPage() {
  return (
    <div className='space-y-4'>
      <h1 className='font-display text-4xl leading-tight'>Projects</h1>
      <Projects projects={projects} />
    </div>
  )
}
