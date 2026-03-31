import { getPrisma } from '@/libs/prisma'

export type LikesResponse = {
  globalCount: number
  userCount: number
  visitorId: string
}

export async function getGlobalCount(postId: string): Promise<number> {
  const prisma = getPrisma()
  const postLike = await prisma.postLike.findUnique({
    where: { postId },
    select: { count: true }
  })

  return postLike?.count ?? 0
}

export async function getVisitorCount(
  postId: string,
  visitorId: string,
  fingerprint: string
): Promise<{ count: number; resolvedVisitorId: string }> {
  const prisma = getPrisma()

  // Try by visitorId first
  if (visitorId) {
    const visitor = await prisma.postLikeVisitor.findUnique({
      where: {
        postId_visitorId: {
          postId,
          visitorId
        }
      },
      select: { count: true }
    })

    if (visitor) {
      return { count: visitor.count, resolvedVisitorId: visitorId }
    }
  }

  // Fallback: match by fingerprint
  if (fingerprint) {
    const visitor = await prisma.postLikeVisitor.findFirst({
      where: {
        postId,
        fingerprint
      },
      select: {
        count: true,
        visitorId: true
      }
    })

    if (visitor) {
      return { count: visitor.count, resolvedVisitorId: visitor.visitorId }
    }
  }

  return { count: 0, resolvedVisitorId: visitorId }
}

export async function getLikes(
  postId: string,
  visitorId: string,
  fingerprint: string
): Promise<LikesResponse> {
  const globalCount = await getGlobalCount(postId)
  const visitor = await getVisitorCount(postId, visitorId, fingerprint)
  return {
    globalCount,
    userCount: visitor.count,
    visitorId: visitor.resolvedVisitorId
  }
}

export async function incrementLikes(
  postId: string,
  visitorId: string,
  fingerprint: string
): Promise<LikesResponse> {
  const prisma = getPrisma()

  // Check current visitor count
  const visitor = await getVisitorCount(postId, visitorId, fingerprint)
  const resolvedId = visitor.resolvedVisitorId || visitorId
  if (visitor.count >= 5) {
    return {
      globalCount: await getGlobalCount(postId),
      userCount: visitor.count,
      visitorId: resolvedId
    }
  }

  // Increment global count
  await prisma.postLike.upsert({
    where: { postId },
    update: {
      count: {
        increment: 1
      }
    },
    create: {
      postId,
      count: 1
    }
  })

  // Upsert visitor record
  await prisma.postLikeVisitor.upsert({
    where: {
      postId_visitorId: {
        postId,
        visitorId: resolvedId
      }
    },
    update: {
      count: {
        increment: 1
      }
    },
    create: {
      postId,
      visitorId: resolvedId,
      fingerprint,
      count: 1
    }
  })

  const updatedPostLike = await prisma.postLike.findUnique({
    where: { postId },
    select: { count: true }
  })

  return {
    globalCount: updatedPostLike?.count ?? 0,
    userCount: visitor.count + 1,
    visitorId: resolvedId
  }
}
