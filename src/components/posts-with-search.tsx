'use client'
import { Input, Tab, Tabs, cn } from '@heroui/react'
import { useMemo, useState } from 'react'
import Posts from './posts'
import { SearchIcon } from 'lucide-react'
import { PostCategory, PostMetadata, PostTopic } from '@/types'
import { IconFileInvoiceFilled, IconFilePowerFilled } from '@tabler/icons-react'
import { getTopicCounts } from '@/libs/post-topic'

type props = {
  posts: PostMetadata[]
}

type PostFilter = 'all' | PostCategory

export default function PostsWithSearch({ posts }: props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PostFilter>('all')
  const [topics, setTopics] = useState<PostTopic[]>([])

  const topicCounts = useMemo(() => getTopicCounts(posts), [posts])
  const query = search.trim().toLowerCase()

  const filtered = posts.filter(post => {
    const matchesSearch =
      query === '' ||
      (post.title?.toLowerCase().includes(query) ?? false) ||
      (post.summary?.toLowerCase().includes(query) ?? false)
    const matchesCategory = category === 'all' || post.category === category
    // No topics picked means "everything"; picked topics are OR-ed together.
    const matchesTopics =
      topics.length === 0 || (post.topic ? topics.includes(post.topic) : false)

    return matchesSearch && matchesCategory && matchesTopics
  })

  function toggleTopic(topic: PostTopic) {
    setTopics(current =>
      current.includes(topic)
        ? current.filter(item => item !== topic)
        : [...current, topic]
    )
  }

  function resetFilters() {
    setSearch('')
    setCategory('all')
    setTopics([])
  }

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <Tabs
          size='sm'
          radius='sm'
          variant='bordered'
          selectedKey={category}
          onSelectionChange={key => setCategory(key as PostFilter)}
        >
          <Tab key='all' title='All' />
          <Tab
            key='post'
            title={
              <div className='flex items-center space-x-2'>
                <IconFileInvoiceFilled size={18} />
                <span>Posts</span>
              </div>
            }
          />
          <Tab
            key='bite-sized'
            title={
              <div className='flex items-center space-x-2'>
                <IconFilePowerFilled size={18} />
                <span>Bite-sized</span>
              </div>
            }
          />
        </Tabs>

        <Input
          type='text'
          size='sm'
          radius='sm'
          variant='flat'
          value={search}
          onValueChange={setSearch}
          onClear={() => setSearch('')}
          isClearable
          placeholder='Search posts...'
          aria-label='Search posts'
          startContent={
            <SearchIcon size={16} className='shrink-0 text-default-400' />
          }
          className='sm:max-w-[16rem]'
        />
      </div>

      {topicCounts.length > 1 && (
        <div className='flex flex-wrap items-center gap-2'>
          {topicCounts.map(({ topic, count }) => {
            const isActive = topics.includes(topic)

            return (
              <button
                key={topic}
                type='button'
                onClick={() => toggleTopic(topic)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary ring-1 ring-inset ring-primary/40'
                    : 'bg-default-100 text-default-600 hover:bg-default-200 hover:text-foreground'
                )}
              >
                {topic}
                <span className='text-[10px] tabular-nums opacity-60'>
                  {count}
                </span>
              </button>
            )
          })}

          {topics.length > 0 && (
            <button
              type='button'
              onClick={() => setTopics([])}
              className='px-1 text-xs text-default-400 underline-offset-4 transition-colors hover:text-foreground hover:underline'
            >
              Clear
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <Posts posts={filtered} />
      ) : (
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-default-200 py-14 text-center dark:border-default-100'>
          <p className='text-sm text-default-500'>
            No posts match these filters.
          </p>
          <button
            type='button'
            onClick={resetFilters}
            className='text-xs font-medium text-primary underline-offset-4 hover:underline'
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
