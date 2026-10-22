import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { z } from 'zod'
import screensManifest from '@/content/projects/screens.json'

// One MDX file per project in src/content/projects/. The frontmatter is
// validated here and every screenshot it lists is checked against the
// manifest written by `pnpm screens`, so a bad field or a missing image fails
// the build instead of shipping a broken page.

const rootDirectory = path.join(process.cwd(), 'src', 'content', 'projects')

const FrontmatterSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  logo: z.string(),
  order: z.number().int(),
  featured: z.boolean().default(false),
  status: z.string(),
  platform: z.string(),
  client: z.string().optional(),
  role: z.string().optional(),
  period: z.string().optional(),
  links: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
  code: z.union([z.literal('private'), z.string().url()]).default('private'),
  stack: z
    .array(z.object({ name: z.string(), icon: z.string().optional() }))
    .default([]),
  screens: z
    .array(
      z.object({
        file: z.string(),
        alt: z.string().min(1),
        caption: z.string().optional()
      })
    )
    .default([]),
  screensNote: z.string().optional()
})

type ManifestEntry = {
  device: 'phone' | 'tablet' | 'desktop'
  width: number
  height: number
  dark: boolean
  full?: { width: number; height: number }
}

export type ProjectScreen = {
  src: string
  srcDark?: string
  full?: { src: string; width: number; height: number }
  width: number
  height: number
  device: ManifestEntry['device']
  alt: string
  caption?: string
}

export type ProjectMeta = Omit<z.infer<typeof FrontmatterSchema>, 'screens'> & {
  slug: string
  screens: ProjectScreen[]
}

export type Project = {
  meta: ProjectMeta
  content: string
}

const manifest = screensManifest as Record<string, ManifestEntry>

function resolveScreens(
  slug: string,
  refs: z.infer<typeof FrontmatterSchema>['screens'],
  fileName: string
): ProjectScreen[] {
  return refs.map(({ file, alt, caption }) => {
    const entry = manifest[`${slug}/${file}`]
    if (!entry) {
      throw new Error(
        `src/content/projects/${fileName}: screen "${file}" is not in screens.json. Add it to scripts/project-screens.config.mjs and run \`pnpm screens\`.`
      )
    }
    const base = `/images/projects/${slug}/${file}`
    return {
      src: `${base}.webp`,
      srcDark: entry.dark ? `${base}-dark.webp` : undefined,
      full: entry.full
        ? { src: `${base}-full.webp`, ...entry.full }
        : undefined,
      width: entry.width,
      height: entry.height,
      device: entry.device,
      alt,
      caption
    }
  })
}

function readProject(fileName: string): Project {
  const slug = fileName.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(rootDirectory, fileName), 'utf8')
  const { data, content } = matter(raw)

  const parsed = FrontmatterSchema.safeParse(data)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map(issue => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(
      `Invalid frontmatter in src/content/projects/${fileName}:\n${issues}`
    )
  }

  const { screens, ...rest } = parsed.data
  return {
    meta: { ...rest, slug, screens: resolveScreens(slug, screens, fileName) },
    content
  }
}

let cache: Project[] | null = null

function loadProjects(): Project[] {
  // Cached for the build; re-read in dev so content edits show up.
  if (cache && process.env.NODE_ENV === 'production') return cache
  cache = fs
    .readdirSync(rootDirectory)
    .filter(file => file.endsWith('.mdx'))
    .map(readProject)
    .sort((a, b) => a.meta.order - b.meta.order)
  return cache
}

export function getProjects(): ProjectMeta[] {
  return loadProjects().map(project => project.meta)
}

export function getProjectBySlug(slug: string): Project | null {
  return loadProjects().find(project => project.meta.slug === slug) ?? null
}

export function getAdjacentProjects(slug: string) {
  const projects = getProjects()
  const index = projects.findIndex(project => project.slug === slug)
  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : null
  }
}
