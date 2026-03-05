import { and, eq, sql } from 'drizzle-orm'
import { getDb } from '@/libs/connection'
import { postLikes, postLikeVisitors } from '@/libs/db'

export type LikesResponse = {
  globalCount: number
  userCount: number
  visitorId: string
}

export function getGlobalCount(postId: string): number {
  const db = getDb()
  const rows = db
    .select({ count: postLikes.count })
    .from(postLikes)
    .where(eq(postLikes.postId, postId))
    .all()
  return rows[0]?.count ?? 0
}

export function getVisitorCount(
  postId: string,
  visitorId: string,
  fingerprint: string
): { count: number; resolvedVisitorId: string } {
  const db = getDb()

  // Try by visitorId first
  if (visitorId) {
    const rows = db
      .select({ count: postLikeVisitors.count })
      .from(postLikeVisitors)
      .where(
        and(
          eq(postLikeVisitors.postId, postId),
          eq(postLikeVisitors.visitorId, visitorId)
        )
      )
      .all()
    if (rows.length > 0) {
      return { count: rows[0].count, resolvedVisitorId: visitorId }
    }
  }

  // Fallback: match by fingerprint
  if (fingerprint) {
    const rows = db
      .select({
        count: postLikeVisitors.count,
        visitorId: postLikeVisitors.visitorId
      })
      .from(postLikeVisitors)
      .where(
        and(
          eq(postLikeVisitors.postId, postId),
          eq(postLikeVisitors.fingerprint, fingerprint)
        )
      )
      .all()
    if (rows.length > 0) {
      return { count: rows[0].count, resolvedVisitorId: rows[0].visitorId }
    }
  }

  return { count: 0, resolvedVisitorId: visitorId }
}

export function getLikes(
  postId: string,
  visitorId: string,
  fingerprint: string
): LikesResponse {
  const globalCount = getGlobalCount(postId)
  const visitor = getVisitorCount(postId, visitorId, fingerprint)
  return {
    globalCount,
    userCount: visitor.count,
    visitorId: visitor.resolvedVisitorId
  }
}

export function incrementLikes(
  postId: string,
  visitorId: string,
  fingerprint: string
): LikesResponse {
  const db = getDb()

  // Check current visitor count
  const visitor = getVisitorCount(postId, visitorId, fingerprint)
  const resolvedId = visitor.resolvedVisitorId || visitorId
  if (visitor.count >= 10) {
    return {
      globalCount: getGlobalCount(postId),
      userCount: visitor.count,
      visitorId: resolvedId
    }
  }

  // Increment global count
  db.insert(postLikes)
    .values({ postId, count: 1 })
    .onConflictDoUpdate({
      target: postLikes.postId,
      set: { count: sql`${postLikes.count} + 1` }
    })
    .run()

  // Upsert visitor record
  db.insert(postLikeVisitors)
    .values({ postId, visitorId: resolvedId, fingerprint, count: 1 })
    .onConflictDoUpdate({
      target: [postLikeVisitors.postId, postLikeVisitors.visitorId],
      set: { count: sql`${postLikeVisitors.count} + 1` }
    })
    .run()

  return {
    globalCount: getGlobalCount(postId),
    userCount: visitor.count + 1,
    visitorId: resolvedId
  }
}
