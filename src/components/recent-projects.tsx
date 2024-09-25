import { getProjects } from '@/libs/projects'
import React from 'react'
import Projects from './projects'
import { Link } from '@nextui-org/react'
import { ArrowRightIcon } from 'lucide-react'

export default async function RecentProjects() {
  const projects = await getProjects(3)
  return (
    <div className='flex flex-col gap-1'>
      <h3 className='font-sourceCodePro text-xl font-semibold'>
        Recent Projects
      </h3>
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
