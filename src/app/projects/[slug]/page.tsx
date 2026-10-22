import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import MDXContent from '@/components/mdx-content'
import BackLink from '@/components/projects/back-link'
import DeviceFrame from '@/components/projects/device-frame'
import KeyboardNav from '@/components/projects/keyboard-nav'
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

  const { title, tagline, screens } = project.meta
  const cover = screens[0]
  return {
    title: `${title} · Umer Sagheer`,
    description: tagline,
    openGraph: {
      title,
      description: tagline,
      images: cover
        ? [
            {
              url: cover.src,
              width: cover.width,
              height: cover.height,
              alt: cover.alt
            }
          ]
        : undefined
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

  return (
    <>
      <KeyboardNav
        previousHref={previous ? `/projects/${previous.slug}` : null}
        nextHref={next ? `/projects/${next.slug}` : null}
      />
      <ProjectRail meta={meta} toc={toc} previous={previous} next={next} />

      <div className='pb-8'>
        <BackLink className='xl:hidden' />

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
          <StackList stack={meta.stack} />
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

        <ProjectPager previous={previous} next={next} />
      </div>
    </>
  )
}

function ProjectPager({
  previous,
  next
}: {
  previous: ProjectMeta | null
  next: ProjectMeta | null
}) {
  if (!previous && !next) return null

  return (
    <nav
      aria-label='More projects'
      className='border-hair mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2'
    >
      {previous ? (
        <PagerLink project={previous} label='← Previous' />
      ) : (
        <span />
      )}
      {next && <PagerLink project={next} label='Next →' alignEnd />}
    </nav>
  )
}

function PagerLink({
  project,
  label,
  alignEnd = false
}: {
  project: ProjectMeta
  label: string
  alignEnd?: boolean
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`border-hair hover:border-accent group rounded-xl border p-4 transition-colors ${
        alignEnd ? 'sm:text-right' : ''
      }`}
    >
      <span className='font-sourceCodePro text-muted text-xs'>{label}</span>
      <span className='group-hover:text-accent mt-1 block font-semibold transition-colors'>
        {project.title}
      </span>
      <span className='text-muted mt-0.5 line-clamp-1 text-sm'>
        {project.tagline}
      </span>
    </Link>
  )
}
