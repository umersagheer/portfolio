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
      <Posts posts={posts} />
    </>
  )
}
