import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { Image, Link } from '@heroui/react'

import { getPostById, getPosts } from '@/libs/posts'
import { getAbsoluteUrl } from '@/libs/metadata'
import formatDate from '@/libs/utils'
import MDXContent from '@/components/mdx-content'
import TableOfContents from '@/components/table-of-contents'
import GemLikeButton from '@/components/gem-like-button'
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

export async function generateMetadata({
  params
}: PostProps): Promise<Metadata> {
  const post = await getPostById(params.postId)

  if (!post) {
    return {}
  }

  const { title, summary, image, author, publishedAt } = post.metadata
  const postUrl = getAbsoluteUrl(`/posts/${params.postId}`)
  const coverImageUrl = image ? getAbsoluteUrl(image) : undefined

  return {
    title,
    description: summary,
    authors: author ? [{ name: author }] : undefined,
    alternates: {
      canonical: postUrl
    },
    openGraph: {
      type: 'article',
      url: postUrl,
      title,
      description: summary,
      siteName: 'Umer Sagheer',
      publishedTime: publishedAt,
      authors: author ? [author] : undefined,
      images: coverImageUrl
        ? [
            {
              url: coverImageUrl,
              alt: title ?? params.postId
            }
          ]
        : undefined
    },
    twitter: {
      card: coverImageUrl ? 'summary_large_image' : 'summary',
      title,
      description: summary,
      images: coverImageUrl ? [coverImageUrl] : undefined
    }
  }
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

      <div className='fixed bottom-6 left-[calc(50%+384px+1.5rem)] top-24 hidden w-56 xl:flex xl:flex-col'>
        <div className='min-h-0 flex-1'>
          <TableOfContents items={toc} />
        </div>
        <div className='flex shrink-0 justify-center pt-6'>
          <GemLikeButton postId={postId} />
        </div>
      </div>

      {/* Mobile floating crystal */}
      <div className='fixed bottom-6 right-6 z-50 xl:hidden'>
        <GemLikeButton postId={postId} size='sm' />
      </div>
    </section>
  )
}
