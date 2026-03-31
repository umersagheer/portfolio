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
  const posts = getAllPostMetadata()

  if (limit) {
    return posts.slice(0, limit)
  }

  return posts
}

export async function getAdjacentPosts(postId: string) {
  const posts = getAllPostMetadata()
  const currentIndex = posts.findIndex(post => post.postId === postId)

  if (currentIndex === -1) {
    return {
      newerPost: null,
      olderPost: null
    }
  }

  return {
    newerPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
    olderPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  }
}

function getPostMetadata(filepath: string): PostMetadata {
  const postId = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, filepath)
  const fileContent = fs.readFileSync(filePath, 'utf8')

  const { data, content } = matter(fileContent)
  return { ...data, postId, readingTime: calculateReadingTime(content) }
}

function getAllPostMetadata() {
  return getPostFiles()
    .map(file => getPostMetadata(file))
    .sort((a, b) => {
      if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
        return 1
      } else {
        return -1
      }
    })
}
