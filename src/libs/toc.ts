export type TocItem = {
  id: string
  text: string
  level: number
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = slugify(text)
    toc.push({ id, text, level })
  }

  return toc
}
