import { NextRequest, NextResponse } from 'next/server'
import { getLikes, incrementLikes } from '@/libs/likes'
import { postExists } from '@/libs/posts'

type RouteContext = {
  params: Promise<{
    postId: string
  }>
}

// Only real posts (drafts included) get like rows; anything else is a 404,
// so arbitrary ids can't create database rows.
function postNotFound() {
  return NextResponse.json({ error: 'Post not found' }, { status: 404 })
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { postId } = await params
  if (!postExists(postId)) return postNotFound()

  // Ids travel in headers, not the query string, so they stay out of URLs
  // and access logs.
  const visitorId = request.headers.get('x-visitor-id') ?? ''
  const fingerprint = request.headers.get('x-fingerprint') ?? ''
  const result = await getLikes(postId, visitorId, fingerprint)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { postId } = await params
  if (!postExists(postId)) return postNotFound()

  const body = await request.json().catch(() => ({}))
  const visitorId = body.visitorId ?? ''
  const fingerprint = body.fingerprint ?? ''
  const result = await incrementLikes(postId, visitorId, fingerprint)
  return NextResponse.json(result)
}
