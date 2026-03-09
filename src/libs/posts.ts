import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { Post, PostMetadata } from '@/types'
import { calculateReadingTime } from '@/libs/utils'

const rootDirectory = path.join(process.cwd(), 'src', 'content', 'posts')

function getPostFiles() {
  return fs
    .readdirSync(rootDirectory, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.mdx'))
    .map(entry => entry.name)
}

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const filePath = path.join(rootDirectory, `${postId}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      metadata: {
        ...data,
        postId,
        readingTime: calculateReadingTime(content)
      },
      content
    }
  } catch (error) {
    console.log('[getPostById]', error)
    return null
  }
}

export async function getPosts(limit?: number) {
  const posts = getPostFiles()
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

  const { data, content } = matter(fileContent)
  return { ...data, postId, readingTime: calculateReadingTime(content) }
}
