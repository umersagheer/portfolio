import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const postLikes = sqliteTable('post_likes', {
  postId: text('post_id').primaryKey(),
  count: integer('count').notNull().default(0)
})

export const postLikeVisitors = sqliteTable('post_like_visitors', {
  postId: text('post_id').notNull(),
  visitorId: text('visitor_id').notNull(),
  fingerprint: text('fingerprint').notNull(),
  count: integer('count').notNull().default(0)
})
