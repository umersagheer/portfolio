import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Image } from '@heroui/react'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

import { siteProfile } from '@/constants/site-profile'
import { getAdjacentPosts, getPostById, getPosts } from '@/libs/posts'
import { getAbsoluteUrl, getOpenGraphImageMetadata } from '@/libs/metadata'
import MDXContent from '@/components/mdx-content'
import TableOfContents from '@/components/table-of-contents'
import SleekLikeButton from '@/components/sleek-like-button'
import AuthorSidebar from '@/components/blog/author-sidebar'
import AuthorCardInline from '@/components/blog/author-card-inline'
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
  const coverImage = image && coverImageUrl
    ? {
        url: coverImageUrl,
        alt: title ?? params.postId,
        ...getOpenGraphImageMetadata(image)
      }
    : undefined

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
      siteName: siteProfile.name,
      publishedTime: publishedAt,
      authors: author ? [author] : undefined,
      images: coverImage ? [coverImage] : undefined
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
  const { title, image, publishedAt, readingTime } = metadata
  const toc = extractToc(content)
  const { newerPost, olderPost } = await getAdjacentPosts(postId)

  return (
    <section className='pb-20'>
      <div className='space-y-4'>
        {image && <Image src={image} alt={title} />}
        <header>
          <h1 className='title'>{title}</h1>
          <div className='xl:hidden'>
            <AuthorCardInline
              publishedAt={publishedAt ?? ''}
              readingTime={readingTime ?? 1}
            />
          </div>
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
          <SleekLikeButton postId={postId} />
        </div>
      </div>

      <AuthorSidebar
        adjacentPosts={{ newerPost, olderPost }}
        publishedAt={publishedAt ?? ''}
        readingTime={readingTime ?? 1}
      />

      {/* Mobile floating crystal */}
      <div className='fixed bottom-6 right-6 z-50 xl:hidden'>
        <SleekLikeButton postId={postId} size='sm' />
      </div>

      {/* Mobile prev/next nav */}
      <nav className='mt-16 flex flex-col gap-4 border-t border-default-200 pt-6 xl:hidden'>
        <div className='flex justify-between gap-4'>
          {newerPost ? (
            <Link
              href={`/posts/${newerPost.postId}`}
              className='flex flex-col gap-1'
            >
              <span className='text-[10px] uppercase tracking-wider text-default-400'>
                Previous
              </span>
              <span className='line-clamp-1 text-sm text-default-600 transition-colors hover:text-primary'>
                {newerPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {olderPost ? (
            <Link
              href={`/posts/${olderPost.postId}`}
              className='flex flex-col items-end gap-1 text-right'
            >
              <span className='text-[10px] uppercase tracking-wider text-default-400'>
                Next
              </span>
              <span className='line-clamp-1 text-sm text-default-600 transition-colors hover:text-primary'>
                {olderPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
        <Link
          href='/posts'
          className='flex items-center gap-1.5 text-xs text-default-500 transition-colors hover:text-primary'
        >
          <ArrowLeftIcon size={12} />
          Back to posts
        </Link>
      </nav>
    </section>
  )
}
