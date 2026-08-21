import { PostMetadata, PostTopic } from '@/types'

// Canonical chip order, so the filter row stays stable no matter how posts sort.
const topicOrder: PostTopic[] = ['Git', 'Frontend', 'Backend']

export type TopicCount = {
  topic: PostTopic
  count: number
}

// Only surfaces topics that actually have posts behind them — no dead chips.
export function getTopicCounts(posts: PostMetadata[]): TopicCount[] {
  const counts = new Map<PostTopic, number>()

  posts.forEach(post => {
    if (!post.topic) return
    counts.set(post.topic, (counts.get(post.topic) ?? 0) + 1)
  })

  return topicOrder
    .filter(topic => counts.has(topic))
    .map(topic => ({ topic, count: counts.get(topic) ?? 0 }))
}
