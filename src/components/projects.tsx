import formatDate from '@/libs/utils'
import { ProjectMetadata } from '@/types'
import { Link } from "@heroui/react"
import React from 'react'

type ProjectProps = {
  projects: ProjectMetadata[]
}

export default function Projects({ projects }: ProjectProps) {
  return (
    <ul className='space-y-5'>
      {projects.map(project => (
        <li key={project.projectId}>
          <Link
            href={`/projects/${project.projectId}`}
            color='foreground'
            isBlock
            className='flex items-start justify-between gap-4 p-2'
          >
            {/* {project.image && (
              <div className='bg-muted h-72 w-full overflow-hidden sm:h-60'>
                <Image
                  src={project.image}
                  alt={project.title || ''}
                  className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
                />
              </div>
            )} */}
            <div className='gap-1'>
              <p className='font-sourceCodePro text-base font-semibold'>
                {project.title}
              </p>
              <p className='max-w-xl text-xs tracking-wide dark:text-zinc-200'>
                {project.summary}
              </p>
            </div>
            {project.publishedAt && (
              <p className='text-xs font-medium'>
                {formatDate(project.publishedAt)}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
