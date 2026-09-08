import Link from 'next/link'
import { getPosts } from '@/libs/posts'
import React from 'react'
import Posts from './posts'
import { ArrowRightIcon } from 'lucide-react'

export default async function RecentPosts() {
  const posts = await getPosts(2)
  return (
    <div className='flex flex-col gap-1'>
      <h3 className='font-sourceCodePro text-xl font-semibold'>Recent Posts</h3>
      <Posts posts={posts} />
      <Link
        href='/posts'
        className='text-foreground hover:bg-default-100 self-center rounded-md px-2 py-1 text-sm transition-colors'
      >
        <p className='font-medium'>All posts</p>
        <ArrowRightIcon className='ml-2 size-5' />
      </Link>
    </div>
  )
}
