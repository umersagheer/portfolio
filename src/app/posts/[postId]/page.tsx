import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NextImage from 'next/image'

import { siteProfile } from '@/constants/site-profile'
import { getAdjacentPosts, getPostById, getPosts } from '@/libs/posts'
import { getAbsoluteUrl, getOpenGraphImageMetadata } from '@/libs/metadata'
import MDXContent from '@/components/mdx-content'
import ChevronLikeButton from '@/components/chevron-like-button'
import ReducedMotion from '@/components/reduced-motion'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import AuthorSidebar from '@/components/blog/author-sidebar'
import AuthorCardInline from '@/components/blog/author-card-inline'
import { extractToc } from '@/libs/toc'
import { getPostCategoryLabel } from '@/libs/post-category'
import BackLink from '@/components/reading/back-link'
import KeyboardNav from '@/components/reading/keyboard-nav'
import Pager, { type PagerEntry } from '@/components/reading/pager'
import SideNav from '@/components/reading/side-nav'
import JsonLd, { personRef } from '@/components/json-ld'

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

  const { title, summary, image, author, publishedAt, draft, seoTitle } =
    post.metadata
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
    title: seoTitle ? { absolute: seoTitle } : title,
    description: summary,
    // Drafts stay reachable by link but out of search results.
    robots: draft ? { index: false, follow: true } : undefined,
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
      creator: siteProfile.socials.x.label,
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
  const article = metadata.draft
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: metadata.summary,
        image: image ? getAbsoluteUrl(image) : undefined,
        datePublished: publishedAt,
        url: getAbsoluteUrl(`/posts/${postId}`),
        mainEntityOfPage: getAbsoluteUrl(`/posts/${postId}`),
        author: personRef
      }
  const toc = extractToc(content)
  const { newerPost, olderPost } = await getAdjacentPosts(postId)
  // List order is newest first, so the previous entry is the newer post.
  const toEntry = (p: typeof newerPost): PagerEntry | null =>
    p
      ? {
          href: `/posts/${p.postId}`,
          title: p.title ?? p.postId,
          summary: p.summary
        }
      : null
  const previous = toEntry(newerPost)
  const next = toEntry(olderPost)
  const label = [getPostCategoryLabel(metadata.category), metadata.topic]
    .filter(Boolean)
    .join(' · ')

  return (
    <ReducedMotion>
      {article && <JsonLd data={article} />}
      <KeyboardNav
        backHref='/posts'
        previousHref={previous?.href ?? null}
        nextHref={next?.href ?? null}
      />
      <ScrollProgress />
      <AuthorSidebar
        publishedAt={publishedAt ?? ''}
        readingTime={readingTime ?? 1}
      />
      <SideNav
        toc={toc}
        previous={previous}
        next={next}
        listLabel='posts'
        reserveBottom
      />

      <section className='pb-20'>
        <BackLink href='/posts' label='All posts' className='xl:hidden' />

        {/* What it is, whether it's worth the time, then the cover. */}
        <header className='mt-6 space-y-4 xl:mt-0'>
          <p className='font-sourceCodePro text-muted text-xs tracking-wide'>
            {label}
          </p>
          <h1 className='title'>{title}</h1>
          {metadata.summary && (
            <p className='text-muted max-w-2xl text-lg leading-relaxed'>
              {metadata.summary}
            </p>
          )}
          <div className='xl:hidden'>
            <AuthorCardInline
              publishedAt={publishedAt ?? ''}
              readingTime={readingTime ?? 1}
            />
          </div>
        </header>

        {image && (
          <NextImage
            src={image}
            alt=''
            width={2560}
            height={1440}
            sizes='(max-width: 768px) 100vw, 768px'
            priority
            className='mt-10 h-auto w-full rounded-xl'
          />
        )}

        <article className='prose dark:prose-invert mt-10 max-w-3xl'>
          <MDXContent source={content} />
        </article>

        <Pager label='More posts' previous={previous} next={next} />
      </section>

      {/* One like button (one fetch, one state): floats bottom-right on small
          screens, sits centred under the side navigation on xl. */}
      <div className='fixed right-6 bottom-6 z-50 xl:right-auto xl:bottom-14 xl:left-[calc(50%+384px+1.5rem)] xl:flex xl:w-56 xl:justify-center'>
        <ChevronLikeButton postId={postId} />
      </div>
    </ReducedMotion>
  )
}
