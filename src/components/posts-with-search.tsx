'use client'
import { SearchField, Tabs, cn } from '@heroui/react'
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
          variant='primary'
          selectedKey={category}
          onSelectionChange={key => setCategory(key as PostFilter)}
        >
          <Tabs.ListContainer>
            <Tabs.List>
              <Tabs.Tab id='all'>
                All
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='post'>
                <div className='flex items-center space-x-2'>
                  <IconFileInvoiceFilled size={18} />
                  <span>Posts</span>
                </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='bite-sized'>
                <div className='flex items-center space-x-2'>
                  <IconFilePowerFilled size={18} />
                  <span>Bite-sized</span>
                </div>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        <SearchField
          aria-label='Search posts'
          value={search}
          onChange={setSearch}
          className='sm:max-w-[16rem]'
        >
          <SearchField.Group>
            <SearchIcon size={16} className='text-muted shrink-0' />
            <SearchField.Input placeholder='Search posts...' />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
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
                    ? 'bg-accent/15 text-accent ring-accent/40 ring-1 ring-inset'
                    : 'bg-surface-secondary text-foreground hover:bg-surface-tertiary hover:text-foreground'
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
              className='text-muted hover:text-foreground px-1 text-xs underline-offset-4 transition-colors hover:underline'
            >
              Clear
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <Posts posts={filtered} />
      ) : (
        <div className='border-border dark:border-separator flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center'>
          <p className='text-muted text-sm'>No posts match these filters.</p>
          <button
            type='button'
            onClick={resetFilters}
            className='text-accent text-xs font-medium underline-offset-4 hover:underline'
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
