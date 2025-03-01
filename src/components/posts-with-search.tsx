'use client'
import { Input } from "@heroui/react"
import { useState } from 'react'
import Posts from './posts'
import { SearchIcon } from 'lucide-react'
import { PostMetadata } from '@/types'

type props = {
  posts: PostMetadata[]
}
export default function PostsWithSearch({ posts }: props) {
  const [search, setSearch] = useState('')
  const filtered = posts.filter(post =>
    post.title?.toLowerCase().includes(search.toLowerCase())
  )

  function resetFilter() {
    setSearch('')
  }
  return (
    <div className='space-y-5'>
      <div className='flex w-full justify-start gap-5'>
        <Input
          labelPlacement='outside'
          type='text'
          variant='flat'
          value={search}
          onChange={e => setSearch(e.target.value)}
          label='Search by title...'
          className='basis-1/2 md:basis-1/3'
          onClear={resetFilter}
          startContent={<SearchIcon size={20} />}
        />
      </div>
      <Posts posts={filtered} />
    </div>
  )
}
