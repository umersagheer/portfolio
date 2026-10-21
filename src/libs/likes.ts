import type { Prisma } from '@/generated/prisma/client'
import { getPrisma } from '@/libs/prisma'

export const MAX_LIKES_PER_VISITOR = 5

export type LikesResponse = {
  globalCount: number
  userCount: number
  visitorId: string
}

type Db = Prisma.TransactionClient

async function getGlobalCount(db: Db, postId: string): Promise<number> {
  const postLike = await db.postLike.findUnique({
    where: { postId },
    select: { count: true }
  })

  return postLike?.count ?? 0
}

async function findVisitor(
  db: Db,
  postId: string,
  visitorId: string,
  fingerprint: string
): Promise<{ count: number; visitorId: string } | null> {
  // Try by visitorId first
  if (visitorId) {
    const visitor = await db.postLikeVisitor.findUnique({
      where: { postId_visitorId: { postId, visitorId } },
      select: { count: true, visitorId: true }
    })

    if (visitor) return visitor
  }

  // Fallback: match by fingerprint (cleared storage, same browser)
  if (fingerprint) {
    return db.postLikeVisitor.findFirst({
      where: { postId, fingerprint },
      select: { count: true, visitorId: true }
    })
  }

  return null
}

export async function getLikes(
  postId: string,
  visitorId: string,
  fingerprint: string
): Promise<LikesResponse> {
  const prisma = getPrisma()
  const [globalCount, visitor] = await Promise.all([
    getGlobalCount(prisma, postId),
    findVisitor(prisma, postId, visitorId, fingerprint)
  ])

  return {
    globalCount,
    userCount: visitor?.count ?? 0,
    visitorId: visitor?.visitorId ?? visitorId
  }
}

export async function incrementLikes(
  postId: string,
  visitorId: string,
  fingerprint: string
): Promise<LikesResponse> {
  return getPrisma().$transaction(async tx => {
    const visitor = await findVisitor(tx, postId, visitorId, fingerprint)
    const resolvedId = visitor?.visitorId ?? visitorId
    let liked = false

    if (!visitor) {
      // INSERT ... ON CONFLICT DO NOTHING: of several parallel first clicks,
      // exactly one creates the row; the rest fall through to the capped
      // update below.
      const { count } = await tx.postLikeVisitor.createMany({
        data: [{ postId, visitorId: resolvedId, fingerprint, count: 1 }],
        skipDuplicates: true
      })
      liked = count === 1
    }

    if (!liked) {
      // Atomic capped increment: Postgres re-checks `count < max` under the
      // row lock, so parallel clicks can never push a visitor past the cap.
      const { count } = await tx.postLikeVisitor.updateMany({
        where: {
          postId,
          visitorId: resolvedId,
          count: { lt: MAX_LIKES_PER_VISITOR }
        },
        data: { count: { increment: 1 } }
      })
      liked = count === 1
    }

    // We hold the row lock if we changed it, so this read is exact.
    const row = await tx.postLikeVisitor.findUnique({
      where: { postId_visitorId: { postId, visitorId: resolvedId } },
      select: { count: true }
    })
    const userCount = row?.count ?? 0

    if (!liked) {
      return {
        globalCount: await getGlobalCount(tx, postId),
        userCount,
        visitorId: resolvedId
      }
    }

    // The post total only moves when a visitor row did.
    const postLike = await tx.postLike.upsert({
      where: { postId },
      update: { count: { increment: 1 } },
      create: { postId, count: 1 },
      select: { count: true }
    })

    return { globalCount: postLike.count, userCount, visitorId: resolvedId }
  })
}
