import { siteProfile } from '@/constants/site-profile'
import { getAbsoluteUrl } from '@/libs/metadata'
import { getPosts } from '@/libs/posts'

// Built once at build time, like the pages.
export const dynamic = 'force-static'

const escape = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Published posts only (getPosts() leaves drafts out).
export async function GET() {
  const posts = await getPosts()
  const items = posts
    .map(post => {
      const url = getAbsoluteUrl(`/posts/${post.postId}`)
      return `    <item>
      <title>${escape(post.title ?? post.postId)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteProfile.name)}</title>
    <link>${getAbsoluteUrl('/')}</link>
    <description>${escape(`Writing by ${siteProfile.name}: interactive deep dives with demos you can play with.`)}</description>
    <language>en</language>
    <atom:link href="${getAbsoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  })
}
