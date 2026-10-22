import Link from 'next/link'
import formatDate from '@/libs/utils'
import { PostCategory, PostMetadata } from '@/types'
import NextImage from 'next/image'
import {
  IconClock,
  IconFileInvoice,
  IconFilePower,
  IconHelpSmall
} from '@tabler/icons-react'
import React from 'react'

type PostProps = {
  posts: PostMetadata[]
}

export default function Posts({ posts }: PostProps) {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {posts.map(post => (
        <Link
          key={post.postId}
          href={`/posts/${post.postId}`}
          className='group border-border bg-surface hover:border-accent flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02]'
        >
          {post.image && (
            <div className='relative aspect-video w-full overflow-hidden'>
              <NextImage
                src={post.image}
                alt={post.title ?? ''}
                fill
                sizes='(max-width: 768px) 100vw, 33vw'
                className='object-cover'
              />
            </div>
          )}
          <div className='flex flex-1 flex-col justify-between space-y-2 p-4'>
            <div className='space-y-1'>
              <p className='text-foreground text-base leading-snug font-semibold'>
                {post.title}
              </p>
              <p className='text-muted line-clamp-2 text-sm'>{post.summary}</p>
            </div>
            <div className='text-muted flex items-center gap-2 pt-2 text-xs'>
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readingTime && (
                <>
                  <span>·</span>
                  <span className='flex items-center gap-1'>
                    <IconClock size={12} />
                    {post.readingTime} min read
                  </span>
                </>
              )}
              {post.category && (
                <>
                  <span>·</span>
                  <span className='flex items-center gap-1 text-xs capitalize'>
                    {post.category === ('bite-sized' as PostCategory) ? (
                      <IconFilePower size={12} />
                    ) : (
                      <IconFileInvoice size={12} />
                    )}
                    {post.category}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
