export type Post = {
  metadata: PostMetadata
  content: string
}

export type PostCategory = 'post' | 'bite-sized'

// Deliberately coarse and mutually exclusive — one bucket per post, so the
// filter row never offers two chips that return overlapping sets.
export type PostTopic = 'Git' | 'Frontend' | 'Backend'

export type PostMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  readingTime?: number
  category: PostCategory
  topic?: PostTopic
  draft?: boolean
  postId: string
}

export type Project = {
  metadata: ProjectMetadata
  content: string
}

export type ProjectMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  projectId: string
}
