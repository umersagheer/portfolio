export type Post = {
  metadata: PostMetadata
  content: string
}

export type PostCategory = 'post' | 'bite-sized'

export type PostMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  readingTime?: number
  category: PostCategory
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
