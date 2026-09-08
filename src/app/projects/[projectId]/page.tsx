import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import NextImage from 'next/image'

import { getProjectById, getProjects } from '@/libs/projects'
import formatDate from '@/libs/utils'
import MDXContent from '@/components/mdx-content'

type ProjectProps = {
  params: Promise<{
    projectId: string
  }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  const staticProjects = projects.map(project => ({
    projectId: project.projectId
  }))

  return staticProjects
}

export default async function Project({ params }: ProjectProps) {
  const { projectId } = await params
  const project = await getProjectById(projectId)
  if (!project) {
    notFound()
  }

  const { metadata, content } = project
  const { title, image, author, publishedAt } = metadata
  return (
    <section className='pb-20'>
      <div className='space-y-4'>
        <Link
          href={'/projects'}
          className='text-foreground hover:bg-surface-secondary inline-flex items-center rounded-md px-2 py-1 text-sm transition-colors'
        >
          <ArrowLeftIcon className='mr-2 size-5' />
          <p className='font-medium'>Back to projects</p>
        </Link>
        {image && (
          <NextImage
            src={image}
            alt={title ?? ''}
            width={0}
            height={0}
            sizes='100vw'
            className='h-auto w-full rounded-xl'
          />
        )}
        <header>
          <h1 className='title'>{title}</h1>
          <p className='text-small pt-2'>
            {author} / {formatDate(publishedAt ?? '')}
          </p>
        </header>

        <main className='prose-znc prose dark:prose-invert mt-10 max-w-6xl'>
          <MDXContent source={content} />
        </main>
      </div>
    </section>
  )
}
