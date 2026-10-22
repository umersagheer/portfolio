import React from 'react'
import SectionHeader from '@/components/section-header'
import Projects from '@/components/projects'
import { projects } from '@/content/projects'

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
      <Projects projects={projects} />
    </>
  )
}
