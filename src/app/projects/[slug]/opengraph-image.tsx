import { coverForOg, ogContentType, ogSize, renderOg } from '@/libs/og'
import { getProjectBySlug, getProjects } from '@/libs/projects'

export const alt = 'A case study by Umer Sagheer'
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return getProjects().map(project => ({ slug: project.slug }))
}

export default async function Image({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return renderOg({ title: 'Projects', description: '' })
  const { title, tagline, screens } = project.meta
  return renderOg({
    label: 'Case study',
    title,
    description: tagline,
    screen: screens[0] ? await coverForOg(screens[0]) : undefined
  })
}
