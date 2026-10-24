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
  // The <title> in search results; the page heading keeps `title`.
  seoTitle?: string
  postId: string
}

// Project types are inferred from the validated frontmatter: see
// src/libs/projects.ts (Project, ProjectMeta, ProjectScreen).
