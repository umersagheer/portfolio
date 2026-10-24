import { getPostById, getPosts } from '@/libs/posts'
import { getProjectBySlug, getProjects } from '@/libs/projects'
import { slugify } from '@/libs/toc'

// The command palette's index: pages, projects, published posts and the
// headings inside them. Built once at build time and fetched only when the
// palette first opens, so it costs nothing on page load.
export const dynamic = 'force-static'

export type SearchDoc = {
  id: string
  type: 'page' | 'project' | 'post' | 'section'
  title: string
  href: string
  text?: string
  group?: string
  topic?: string
}

const PAGES: SearchDoc[] = [
  {
    id: 'page-home',
    type: 'page',
    title: 'Home',
    href: '/',
    text: 'Umer Sagheer full-stack developer'
  },
  {
    id: 'page-about',
    type: 'page',
    title: 'About',
    href: '/about',
    text: 'how I build stack journey experience CV'
  },
  {
    id: 'page-projects',
    type: 'page',
    title: 'Projects',
    href: '/projects',
    text: 'case studies work'
  },
  {
    id: 'page-posts',
    type: 'page',
    title: 'Posts',
    href: '/posts',
    text: 'writing blog articles'
  },
  {
    id: 'page-contact',
    type: 'page',
    title: 'Contact',
    href: '/contact',
    text: 'hire message email'
  }
]

// ## and ### headings from MDX, skipping code fences and JSX comments. A
// heading with inline markup has no anchor on the page, so it links to the
// page itself.
function headings(content: string) {
  const clean = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  return [...clean.matchAll(/^#{2,3}\s+(.+)$/gm)].map(([, raw]) => {
    const text = raw.trim()
    const plain = text
      .replace(/[`*_[\]]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim()
    return {
      text: plain,
      anchor: /[`*_[]/.test(text) ? '' : `#${slugify(text)}`
    }
  })
}

export async function GET() {
  const docs: SearchDoc[] = [...PAGES]

  for (const project of getProjects()) {
    const href = `/projects/${project.slug}`
    docs.push({
      id: `project-${project.slug}`,
      type: 'project',
      title: project.title,
      href,
      text: [
        project.tagline,
        project.seoTitle ?? '',
        project.platform,
        ...project.stack.map(s => s.name)
      ].join(' ')
    })
    const full = getProjectBySlug(project.slug)
    headings(full?.content ?? '').forEach((h, i) =>
      docs.push({
        id: `project-${project.slug}-${i}`,
        type: 'section',
        title: h.text,
        href: `${href}${h.anchor}`,
        group: project.title
      })
    )
  }

  for (const post of await getPosts()) {
    const href = `/posts/${post.postId}`
    const title = post.title ?? post.postId
    docs.push({
      id: `post-${post.postId}`,
      type: 'post',
      title,
      href,
      text: post.summary,
      topic: post.topic
    })
    const full = await getPostById(post.postId)
    headings(full?.content ?? '').forEach((h, i) =>
      docs.push({
        id: `post-${post.postId}-${i}`,
        type: 'section',
        title: h.text,
        href: `${href}${h.anchor}`,
        group: title,
        topic: post.topic
      })
    )
  }

  return Response.json(docs)
}
