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
    console.log('[getPostById]', error)
    return null
  }
}

export async function getPosts(limit?: number) {
  const files = fs.readdirSync(rootDirectory)

  const posts = files
    .map(file => getPostMetadata(file))
    .sort((a, b) => {
      if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
        return 1
      } else {
        return -1
      }
    })

  if (limit) {
    return posts.slice(0, limit)
  }

  return posts
}

function getPostMetadata(filepath: string): PostMetadata {
  const postId = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, filepath)
  const fileContent = fs.readFileSync(filePath, 'utf8')

  const { data } = matter(fileContent)
  return { ...data, postId }
}
