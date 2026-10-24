import type { Metadata } from 'next'
import PostsWithSearch from '@/components/posts-with-search'
import { getPosts } from '@/libs/posts'
import React from 'react'

export const metadata: Metadata = {
  title: { absolute: 'Interactive Guides to Git, WebSockets & React – Blog' },
  description:
    'Deep dives with live demos: how Git works, WebSockets from handshake to scaling, timezone bugs, FLIP layout animations and Expo Router auth.',
  alternates: { canonical: '/posts' },
  openGraph: { url: '/posts' }
}

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div className='space-y-4'>
      <h1 className='font-display text-4xl leading-tight'>Posts</h1>
      <PostsWithSearch posts={posts} />
    </div>
  )
}
