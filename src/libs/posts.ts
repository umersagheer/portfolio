import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

export type Post = {
  metadata: PostMetadata
  content: string
}

export type PostMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  postId: string
}

const rootDirectory = path.join(process.cwd(), 'src', 'content', 'posts')

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const filePath = path.join(rootDirectory, `${postId}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return { metadata: { ...data, postId }, content }
  } catch (error) {
    return null
  }
}
