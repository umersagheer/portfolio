import { siteProfile } from '@/constants/site-profile'
import { getAbsoluteUrl } from '@/libs/metadata'
import { getPosts } from '@/libs/posts'
import { getProjects } from '@/libs/projects'

// A plain-text map of the site for AI assistants (the llms.txt convention):
// who I am, what I've built and what I've written, with links.
export const dynamic = 'force-static'

export async function GET() {
  const posts = await getPosts()
  const projects = getProjects()
  const { socials } = siteProfile

  const text = `# ${siteProfile.name}

> Full-stack developer in Lahore, Pakistan (${siteProfile.status.toLowerCase()}). Four years building web and mobile products with React, Next.js, React Native/Expo, Node.js, NestJS, PostgreSQL and MongoDB, and AI features with LangChain (RAG, LLM workflows, guardrails on model output).

- Lead engineer on Engagemo, an AI writing platform used by 7,000+ people across 30–40 institutions.
- Founder and sole engineer of Munshi, an offline-first restaurant system in production since September 2025.
- Contact: ${siteProfile.email} · ${getAbsoluteUrl('/contact')} · GitHub ${socials.github.url} · LinkedIn ${socials.linkedin.url}

## Pages

- [About](${getAbsoluteUrl('/about')}): background, how I work, and the stack layer by layer
- [Projects](${getAbsoluteUrl('/projects')}): case studies
- [Writing](${getAbsoluteUrl('/posts')}): interactive deep dives

## Case studies

${projects.map(p => `- [${p.title}](${getAbsoluteUrl(`/projects/${p.slug}`)}): ${p.tagline}`).join('\n')}

## Writing

${posts.map(p => `- [${p.title ?? p.postId}](${getAbsoluteUrl(`/posts/${p.postId}`)})${p.summary ? `: ${p.summary}` : ''}`).join('\n')}
`

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
