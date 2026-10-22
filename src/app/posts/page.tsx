import PostsWithSearch from '@/components/posts-with-search'
import { getPosts } from '@/libs/posts'
import React from 'react'

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div className='space-y-4'>
      <h1 className='font-display text-4xl leading-tight'>Posts</h1>
      <PostsWithSearch posts={posts} />
    </div>
  )
}
