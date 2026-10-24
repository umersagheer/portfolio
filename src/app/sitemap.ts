import type { MetadataRoute } from 'next'
import { getAbsoluteUrl } from '@/libs/metadata'
import { getPosts } from '@/libs/posts'
import { getProjects } from '@/libs/projects'

// Published pages only: getPosts() leaves drafts out (they're unlisted).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  const projects = getProjects()

  const pages: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    {
      url: getAbsoluteUrl('/projects'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: getAbsoluteUrl('/about'),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    { url: getAbsoluteUrl('/posts'), changeFrequency: 'weekly', priority: 0.8 },
    {
      url: getAbsoluteUrl('/contact'),
      changeFrequency: 'yearly',
      priority: 0.5
    }
  ]

  return [
    ...pages,
    ...projects.map(project => ({
      url: getAbsoluteUrl(`/projects/${project.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    })),
    ...posts.map(post => ({
      url: getAbsoluteUrl(`/posts/${post.postId}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: 'yearly' as const,
      priority: 0.7
    }))
  ]
}
