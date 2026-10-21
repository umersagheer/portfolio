import Link from 'next/link'
import React from 'react'
import { ArrowRightIcon } from 'lucide-react'
import Heading from './heading'
import Projects from './projects'
import { projects } from '@/content/projects'

export default async function RecentProjects() {
  return (
    <div className='flex flex-col gap-1'>
      <Heading>What I worked on...</Heading>
      <Projects projects={projects} />
      <Link
        href='/projects'
        className='text-foreground hover:bg-surface-secondary inline-flex items-center self-center rounded-md px-2 py-1 text-sm transition-colors'
      >
        <p className='font-medium'>All projects</p>
        <ArrowRightIcon className='ml-2 size-5' />
      </Link>
    </div>
  )
}
