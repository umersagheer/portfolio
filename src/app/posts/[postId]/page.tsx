import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

import { siteProfile } from '@/constants/site-profile'
import { getAdjacentPosts, getPostById, getPosts } from '@/libs/posts'
import { getAbsoluteUrl, getOpenGraphImageMetadata } from '@/libs/metadata'
import MDXContent from '@/components/mdx-content'
import TableOfContents from '@/components/table-of-contents'
import ChevronLikeButton from '@/components/chevron-like-button'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import AuthorSidebar from '@/components/blog/author-sidebar'
import AuthorCardInline from '@/components/blog/author-card-inline'
import { extractToc } from '@/libs/toc'

type PostProps = {
  params: Promise<{
    postId: string
  }>
}

export async function generateStaticParams() {
  const posts = await getPosts()
  const staticPosts = posts.map(post => ({ postId: post.postId }))

  return staticPosts
}

export async function generateMetadata({
  params
}: PostProps): Promise<Metadata> {
  const { postId } = await params
  const post = await getPostById(postId)

  if (!post) {
    return {}
  }

  const { title, summary, image, author, publishedAt } = post.metadata
  const postUrl = getAbsoluteUrl(`/posts/${postId}`)
  const coverImageUrl = image ? getAbsoluteUrl(image) : undefined
  const coverImage =
    image && coverImageUrl
      ? {
          url: coverImageUrl,
          alt: title ?? postId,
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
  const { postId } = await params
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
      <style>{`html{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar{display:none}`}</style>
      <ScrollProgress className='h-[3px]' />
      <div className='space-y-4'>
        {image && (
          <NextImage
            src={image}
            alt={title}
            width={2560}
            height={1440}
            priority
            className='h-auto w-full rounded-xl'
          />
        )}
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
        <main className='prose dark:prose-invert max-w-3xl'>
          <MDXContent source={content} />
        </main>
      </div>

      <div className='fixed top-24 bottom-14 left-[calc(50%+384px+1.5rem)] hidden w-56 xl:flex xl:flex-col'>
        <div className='min-h-0 flex-1'>
          <TableOfContents items={toc} />
        </div>
        <div className='flex shrink-0 justify-center pt-6'>
          <ChevronLikeButton postId={postId} />
        </div>
      </div>

      <AuthorSidebar
        adjacentPosts={{ newerPost, olderPost }}
        publishedAt={publishedAt ?? ''}
        readingTime={readingTime ?? 1}
      />

      {/* Mobile floating crystal */}
      <div className='fixed right-6 bottom-6 z-50 xl:hidden'>
        <ChevronLikeButton postId={postId} size='sm' />
      </div>

      {/* Mobile prev/next nav */}
      <nav className='border-default-200 mt-16 flex flex-col gap-4 border-t pt-6 xl:hidden'>
        <div className='flex justify-between gap-4'>
          {newerPost ? (
            <Link
              href={`/posts/${newerPost.postId}`}
              className='flex flex-col gap-1'
            >
              <span className='text-default-400 text-[10px] tracking-wider uppercase'>
                Previous
              </span>
              <span className='text-default-600 hover:text-primary line-clamp-1 text-sm transition-colors'>
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
              <span className='text-default-400 text-[10px] tracking-wider uppercase'>
                Next
              </span>
              <span className='text-default-600 hover:text-primary line-clamp-1 text-sm transition-colors'>
                {olderPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
        <Link
          href='/posts'
          className='text-default-500 hover:text-primary flex items-center gap-1.5 text-xs transition-colors'
        >
          <ArrowLeftIcon size={12} />
          Back to posts
        </Link>
      </nav>
    </section>
  )
}
