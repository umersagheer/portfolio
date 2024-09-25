import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

export type Project = {
  metadata: ProjectMetadata
  content: string
}

export type ProjectMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  projectId: string
}

const rootDirectory = path.join(process.cwd(), 'src', 'content', 'projects')

export async function getProjectById(
  projectId: string
): Promise<Project | null> {
  try {
    const filePath = path.join(rootDirectory, `${projectId}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return { metadata: { ...data, projectId }, content }
  } catch (error) {
    return null
  }
}

export async function getProjects(limit?: number) {
  const files = fs.readdirSync(rootDirectory)

  const projects = files
    .map(file => getProjectMetadata(file))
    .sort((a, b) => {
      if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
        return 1
      } else {
        return -1
      }
    })

  if (limit) {
    return projects.slice(0, limit)
  }

  return projects
}

function getProjectMetadata(filepath: string): ProjectMetadata {
  const projectId = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, filepath)
  const fileContent = fs.readFileSync(filePath, 'utf8')

  const { data } = matter(fileContent)
  return { ...data, projectId }
}
