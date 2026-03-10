import fs from 'fs'
import path from 'path'

import { brandDomain } from '@/remotion/shared/brand'

const fallbackSiteUrl = `https://${brandDomain}`

const imageMimeTypes = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
} as const

type ImageDimensions = {
  width: number
  height: number
}

type OpenGraphImageMetadata = {
  width?: number
  height?: number
  type?: (typeof imageMimeTypes)[keyof typeof imageMimeTypes]
}

function normalizeSiteUrl(siteUrl: string) {
  if (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')) {
    return siteUrl
  }

  return `https://${siteUrl}`
}

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    fallbackSiteUrl

  return new URL(normalizeSiteUrl(siteUrl))
}

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString()
}

function getImageMimeType(pathname: string) {
  const extension = path.extname(pathname).toLowerCase()

  return imageMimeTypes[extension as keyof typeof imageMimeTypes]
}

function getPngDimensions(fileBuffer: Buffer): ImageDimensions | undefined {
  if (
    fileBuffer.length < 24 ||
    fileBuffer.toString('hex', 0, 8) !== '89504e470d0a1a0a'
  ) {
    return undefined
  }

  return {
    width: fileBuffer.readUInt32BE(16),
    height: fileBuffer.readUInt32BE(20)
  }
}

function getJpegDimensions(fileBuffer: Buffer): ImageDimensions | undefined {
  if (fileBuffer.length < 4 || fileBuffer[0] !== 0xff || fileBuffer[1] !== 0xd8) {
    return undefined
  }

  let offset = 2

  while (offset + 8 < fileBuffer.length) {
    if (fileBuffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = fileBuffer[offset + 1]
    const segmentLength = fileBuffer.readUInt16BE(offset + 2)

    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: fileBuffer.readUInt16BE(offset + 5),
        width: fileBuffer.readUInt16BE(offset + 7)
      }
    }

    if (segmentLength < 2) {
      return undefined
    }

    offset += segmentLength + 2
  }

  return undefined
}

function getImageDimensions(fileBuffer: Buffer, pathname: string) {
  const extension = path.extname(pathname).toLowerCase()

  if (extension === '.png') {
    return getPngDimensions(fileBuffer)
  }

  if (extension === '.jpg' || extension === '.jpeg') {
    return getJpegDimensions(fileBuffer)
  }

  return undefined
}

export function getOpenGraphImageMetadata(
  pathname: string
): OpenGraphImageMetadata {
  const type = getImageMimeType(pathname)

  if (!pathname.startsWith('/')) {
    return { type }
  }

  const publicImagePath = path.join(process.cwd(), 'public', pathname.replace(/^\//, ''))

  if (!fs.existsSync(publicImagePath)) {
    console.warn(`[getOpenGraphImageMetadata] Missing public image: ${pathname}`)

    return { type }
  }

  const fileBuffer = fs.readFileSync(publicImagePath)
  const dimensions = getImageDimensions(fileBuffer, pathname)

  if (!dimensions) {
    console.warn(
      `[getOpenGraphImageMetadata] Unsupported image dimensions for: ${pathname}`
    )

    return { type }
  }

  return {
    ...dimensions,
    type
  }
}
