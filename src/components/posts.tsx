import formatDate from '@/libs/utils'
import { PostMetadata } from '@/types'
import { Link } from "@heroui/react"
import React from 'react'

type PostProps = {
  posts: PostMetadata[]
}

export default function Posts({ posts }: PostProps) {
  return (
    <ul className='space-y-5'>
      {posts.map(post => (
        <li key={post.postId}>
          <Link
            href={`/posts/${post.postId}`}
            color='foreground'
            isBlock
            className='flex items-start justify-between gap-4 p-2'
          >
            <div className='gap-1'>
              <p className='font-sourceCodePro text-base font-semibold'>
                {post.title}
              </p>
              <p className='max-w-xl text-xs tracking-wide dark:text-zinc-200'>
                {post.summary}
              </p>
            </div>
            {post.publishedAt && (
              <p className='text-xs font-medium'>
                {formatDate(post.publishedAt)}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
