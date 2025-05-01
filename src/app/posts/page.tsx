import { BlurFade } from '@/components/blur-fade'
import PostsWithSearch from '@/components/posts-with-search'
import { getPosts } from '@/libs/posts'
import React from 'react'

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div className='space-y-4'>
      <BlurFade inView delay={0.25}>
        <h1 className='font-sourceCodePro text-xl font-bold'>Posts</h1>
      </BlurFade>
      <BlurFade inView delay={0.35}>
        <PostsWithSearch posts={posts} />
      </BlurFade>
    </div>
  )
}
