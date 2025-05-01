import React from 'react'
import { Link } from '@heroui/react'
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
        color='foreground'
        isBlock
        className='self-center'
        size='sm'
      >
        <p className='font-medium'>All projects</p>
        <ArrowRightIcon className='ml-2 size-5' />
      </Link>
    </div>
  )
}
