import formatDate from '@/libs/utils'
import { PostCategory, PostMetadata } from '@/types'
import { Image, Link } from '@heroui/react'
import { IconClock, IconFileInvoice, IconFilePower, IconHelpSmall } from '@tabler/icons-react'
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
          className='group flex flex-col overflow-hidden rounded-xl border border-default-200 bg-default-50 transition-all duration-300 hover:scale-[1.02] hover:border-primary dark:border-default-100'
        >
          {post.image && (
            <div className='aspect-video w-full overflow-hidden'>
              <Image
                src={post.image}
                alt={post.title ?? ''}
                classNames={{
                  wrapper: 'w-full h-full !max-w-full',
                  img: 'h-full w-full object-cover rounded-none'
                }}
                radius='none'
              />
            </div>
          )}
          <div className='flex flex-1 flex-col justify-between space-y-2 p-4'>
            <div className='space-y-1'>
              <p className='font-sourceCodePro text-base font-semibold text-foreground'>
                {post.title}
              </p>
              <p className='line-clamp-2 text-sm text-default-500'>
                {post.summary}
              </p>
            </div>
            <div className='flex items-center gap-2 pt-2 text-xs text-default-400'>
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
                  <span className='capitalize text-xs flex items-center gap-1'>
                    {post.category === 'bite-sized' as PostCategory ? <IconFilePower size={12} /> : <IconFileInvoice size={12} />}
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
