import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { Image, Link } from '@nextui-org/react'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { getPostById } from '@/libs/posts'
import formatDate from '@/libs/utils'

type PostProps = {
  params: {
    postId: string
  }
}

export default async function Post({ params }: PostProps) {
  const { postId } = params
  const post = await getPostById(postId)
  if (!post) {
    notFound()
  }

  const { metadata, content } = post
  const { title, summary, image, author, publishedAt } = metadata
  return (
    <section className='pb-20 pt-10'>
      <div className=''>
        <Link href={'/posts'} isBlock>
          <ArrowLeftIcon className='mr-2 size-5' />
          Back to posts
        </Link>
        {image && <Image src={image} alt={title} width={800} height={400} />}
        <header>
          <h1 className='title'>{title}</h1>
          <p className='pt-2 text-small'>
            {author} / {formatDate(publishedAt ?? '')}
          </p>
        </header>

        <main className='prose'>
          <MDXRemote source={content} />
        </main>
      </div>
    </section>
  )
}
