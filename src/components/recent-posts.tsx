import { getPosts } from '@/libs/posts'
import React from 'react'
import SectionHeader from '@/components/section-header'
import Posts from '@/components/posts'

export default async function RecentPosts() {
  const posts = await getPosts(2)
  return (
    <>
      <SectionHeader
        index='02'
        label='Writing'
        title='Recent posts'
        href='/posts'
        linkText='All posts'
      />
      <p className='text-muted -mt-2 mb-6 max-w-2xl leading-relaxed'>
        Deep dives with demos you can play with.
      </p>
      <Posts posts={posts} />
    </>
  )
}
