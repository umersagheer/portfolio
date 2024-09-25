import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { Image, Link } from '@nextui-org/react'

import { getProjectById, getProjects } from '@/libs/projects'
import formatDate from '@/libs/utils'
import MDXContent from '@/components/mdx-content'

type ProjectProps = {
  params: {
    projectId: string
  }
}

export async function generateStaticParams() {
  const projects = await getProjects()
  const staticProjects = projects.map(project => ({
    projectId: project.projectId
  }))

  return staticProjects
}

export default async function Project({ params }: ProjectProps) {
  const { projectId } = params
  const project = await getProjectById(projectId)
  if (!project) {
    notFound()
  }

  const { metadata, content } = project
  const { title, image, author, publishedAt } = metadata
  return (
    <section className='pb-20'>
      <div className='space-y-4'>
        <Link href={'/projects'} color='foreground' isBlock size='sm'>
          <ArrowLeftIcon className='mr-2 size-5' />
          <p className='font-medium'>Back to projects</p>
        </Link>
        {image && <Image src={image} alt={title} />}
        <header>
          <h1 className='title'>{title}</h1>
          <p className='pt-2 text-small'>
            {author} / {formatDate(publishedAt ?? '')}
          </p>
        </header>

        <main className='prose-znc prose mt-10 max-w-6xl dark:prose-invert'>
          <MDXContent source={content} />
        </main>
      </div>
    </section>
  )
}
