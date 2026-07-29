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
  // Capture h2 AND h3 so the ToC can nest (## Part 1/2 top-level, ### as children).
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
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
