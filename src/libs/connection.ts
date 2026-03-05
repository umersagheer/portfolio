import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import path from 'path'
import * as schema from '@/libs/db'

const DB_PATH = path.join(process.cwd(), 'data', 'likes.db')

let instance: BetterSQLite3Database<typeof schema> | null = null

export function getDb() {
  if (!instance) {
    const sqlite = new Database(DB_PATH)
    sqlite.pragma('journal_mode = WAL')

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS post_likes (
        post_id TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0
      )
    `)

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS post_like_visitors (
        post_id TEXT NOT NULL,
        visitor_id TEXT NOT NULL,
        fingerprint TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        UNIQUE(post_id, visitor_id)
      )
    `)

    sqlite.exec(`
      CREATE INDEX IF NOT EXISTS idx_visitor_fingerprint
      ON post_like_visitors (post_id, fingerprint)
    `)

    instance = drizzle(sqlite, { schema })
  }
  return instance
}
