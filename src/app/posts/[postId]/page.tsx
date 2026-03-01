import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { Image, Link } from '@heroui/react'

import { getPostById, getPosts } from '@/libs/posts'
import formatDate from '@/libs/utils'
import MDXContent from '@/components/mdx-content'
import TableOfContents from '@/components/table-of-contents'
import { extractToc } from '@/libs/toc'

type PostProps = {
  params: {
    postId: string
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  const staticPosts = posts.map(post => ({ postId: post.postId }))

  return staticPosts
}

export default async function Post({ params }: PostProps) {
  const { postId } = params
  const post = await getPostById(postId)
  if (!post) {
    notFound()
  }

  const { metadata, content } = post
  const { title, image, author, publishedAt } = metadata
  const toc = extractToc(content)

  return (
    <section className='pb-20'>
      <div className='space-y-4'>
        <Link href={'/posts'} color='foreground' isBlock size='sm'>
          <ArrowLeftIcon className='mr-2 size-5' />
          <p className='font-medium'>Back to posts</p>
        </Link>
        {image && <Image src={image} alt={title} />}
        <header>
          <h1 className='title'>{title}</h1>
          <p className='pt-2 text-small'>
            {author} / {formatDate(publishedAt ?? '')}
          </p>
        </header>
      </div>

      <div className='relative mt-10'>
        <main className='prose max-w-3xl dark:prose-invert'>
          <MDXContent source={content} />
        </main>
      </div>

      <div className='fixed left-[calc(50%+384px+1.5rem)] top-24 hidden w-56 xl:block'>
        <TableOfContents items={toc} />
      </div>
    </section>
  )
}
