import { NextRequest, NextResponse } from 'next/server'
import { getLikes, incrementLikes } from '@/libs/likes'

type RouteContext = {
  params: {
    postId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { postId } = params
  const { searchParams } = request.nextUrl
  const visitorId = searchParams.get('vid') ?? ''
  const fingerprint = searchParams.get('fp') ?? ''
  const result = getLikes(postId, visitorId, fingerprint)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { postId } = params
  const body = await request.json().catch(() => ({}))
  const visitorId = body.visitorId ?? ''
  const fingerprint = body.fingerprint ?? ''
  const result = incrementLikes(postId, visitorId, fingerprint)
  return NextResponse.json(result)
}
