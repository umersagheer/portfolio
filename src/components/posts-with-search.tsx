'use client'
import { Input, Tab, Tabs } from '@heroui/react'
import { useState } from 'react'
import Posts from './posts'
import { SearchIcon } from 'lucide-react'
import { PostCategory, PostMetadata } from '@/types'
import { IconFileInvoice, IconFileInvoiceFilled, IconFilePower, IconFilePowerFilled } from '@tabler/icons-react'

type props = {
  posts: PostMetadata[]
}

type PostFilter = 'all' | PostCategory

export default function PostsWithSearch({ posts }: props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PostFilter>('all')
  const filtered = posts.filter(post => {
    const matchesSearch =
      post.title?.toLowerCase().includes(search.toLowerCase()) ?? false
    const matchesCategory = category === 'all' || post.category === category

    return matchesSearch && matchesCategory
  })

  function resetFilter() {
    setSearch('')
  }

  return (
    <div className='space-y-6'>
      <Tabs
        size='sm'
        radius='sm'
        variant='bordered'
        selectedKey={category}
        onSelectionChange={key => setCategory(key as PostFilter)}
        className='mb-4'
      >
        <Tab key='all' title={`All`} />
        <Tab
          key='post'
          title={
            <div className="flex items-center space-x-2">
              <IconFileInvoiceFilled size={"18"}/>
              <span>Posts</span>
            </div>
          }
        />
        <Tab
          key='bite-sized'
          title={
            <div className="flex items-center space-x-2">
              <IconFilePowerFilled size={"18"}/>
              <span>Bite-sized</span>
            </div>
          }
        />
      </Tabs>

      <Input
        labelPlacement='outside'
        type='text'
        variant='flat'
        value={search}
        onChange={e => setSearch(e.target.value)}
        label='Search by title...'
        className='max-w-sm'
        onClear={resetFilter}
        startContent={<SearchIcon size={20} />}
      />
      <Posts posts={filtered} />
    </div>
  )
}
