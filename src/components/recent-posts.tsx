import { getPosts } from '@/libs/posts'
import React from 'react'
import Posts from './posts'
import { Link } from '@nextui-org/react'
import { ArrowRightIcon } from 'lucide-react'

export default async function RecentPosts() {
  const posts = await getPosts(3)
  return (
    <div className='flex flex-col gap-1'>
      <h3 className='font-sourceCodePro text-xl font-semibold'>Recent Posts</h3>
      <Posts posts={posts} />
      <Link
        href='/posts'
        color='foreground'
        isBlock
        className='self-center'
        size='sm'
      >
        <p className='font-medium'>All posts</p>
        <ArrowRightIcon className='ml-2 size-5' />
      </Link>
    </div>
  )
}
