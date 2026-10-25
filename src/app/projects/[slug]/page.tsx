import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import MDXContent from '@/components/mdx-content'
import BackLink from '@/components/reading/back-link'
import DeviceFrame from '@/components/projects/device-frame'
import KeyboardNav from '@/components/reading/keyboard-nav'
import Pager, { type PagerEntry } from '@/components/reading/pager'
import SideNav from '@/components/reading/side-nav'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import ProjectRail, { ProjectFacts } from '@/components/projects/project-rail'
import ScreenImage from '@/components/projects/screen-image'
import ScreenshotGallery from '@/components/projects/screenshot-gallery'
import StackList from '@/components/projects/stack-list'
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjects,
  type ProjectMeta
} from '@/libs/projects'
import { extractToc } from '@/libs/toc'
import JsonLd, { personRef } from '@/components/json-ld'
import { getAbsoluteUrl } from '@/libs/metadata'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

// Every project is known at build time; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return getProjects().map(project => ({ slug: project.slug }))
}

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  // The preview image comes from ./opengraph-image.tsx.
  const { title, tagline, seoTitle } = project.meta
  return {
    title: seoTitle ? { absolute: seoTitle } : title,
    description: tagline,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: 'article',
      url: `/projects/${slug}`,
      title,
      description: tagline
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const { meta, content } = project
  const { previous, next } = getAdjacentProjects(slug)

  // Phone apps lead with three screens side by side; wide apps with one.
  const heroCount = meta.screens[0]?.device === 'phone' ? 3 : 1
  const hero = meta.screens.slice(0, heroCount)
  const gallery = meta.screens.slice(heroCount)

  const toc = [
    ...extractToc(content).filter(item => item.level === 2),
    ...(gallery.length > 0
      ? [{ id: 'screens', text: 'Screens', level: 2 }]
      : [])
  ]

  const work = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: meta.title,
    description: meta.tagline,
    url: getAbsoluteUrl(`/projects/${meta.slug}`),
    image: getAbsoluteUrl(`/projects/${meta.slug}/opengraph-image`),
    author: personRef
  }

  const toEntry = (p: ProjectMeta | null): PagerEntry | null =>
    p
      ? { href: `/projects/${p.slug}`, title: p.title, summary: p.tagline }
      : null
  const previousEntry = toEntry(previous)
  const nextEntry = toEntry(next)

  return (
    <>
      <JsonLd data={work} />
      <KeyboardNav
        backHref='/projects'
        previousHref={previousEntry?.href ?? null}
        nextHref={nextEntry?.href ?? null}
      />
      <ScrollProgress />
      <ProjectRail meta={meta} />
      <SideNav
        toc={toc}
        previous={previousEntry}
        next={nextEntry}
        listLabel='projects'
      />

      <div className='pb-8'>
        <BackLink href='/projects' label='All projects' className='xl:hidden' />

        {/* What it is and my part in it, then the screens, then the story. */}
        <header className='mt-6 space-y-5 xl:mt-0'>
          <p className='font-sourceCodePro text-muted text-xs tracking-wide'>
            Case study
          </p>
          <h1 className='font-display text-4xl leading-tight md:text-5xl'>
            {meta.title}
          </h1>
          <p className='text-muted max-w-2xl text-lg leading-relaxed'>
            {meta.tagline}
          </p>
          <ProjectFacts meta={meta} className='xl:hidden' />
        </header>

        {hero.length > 0 && (
          <div
            className={`mt-12 ${
              heroCount > 1 ? 'grid grid-cols-3 gap-3 sm:gap-6' : ''
            }`}
          >
            {hero.map((screen, index) => (
              <DeviceFrame key={screen.src} device={screen.device}>
                <ScreenImage
                  screen={screen}
                  sizes={
                    screen.device === 'phone'
                      ? '(max-width: 640px) 33vw, 250px'
                      : '(max-width: 768px) 100vw, 768px'
                  }
                  priority={index === 0}
                />
              </DeviceFrame>
            ))}
          </div>
        )}

        {/* On wide screens the stack sits in the left rail. */}
        {meta.stack.length > 0 && (
          <div className='mt-8 space-y-2 xl:hidden'>
            <p className='font-sourceCodePro text-muted text-xs'>Built with</p>
            <StackList stack={meta.stack} />
          </div>
        )}

        <article className='prose dark:prose-invert mt-12 max-w-none'>
          <MDXContent source={content} />
        </article>

        {gallery.length > 0 && (
          <section aria-labelledby='screens' className='mt-14'>
            <h2 id='screens' className='font-display mb-8 text-3xl'>
              Screens
            </h2>
            <ScreenshotGallery screens={gallery} />
            {meta.screensNote && (
              <p className='font-sourceCodePro text-muted mt-8 text-xs'>
                {meta.screensNote}
              </p>
            )}
          </section>
        )}

        <Pager
          label='More projects'
          previous={previousEntry}
          next={nextEntry}
        />
      </div>
    </>
  )
}
