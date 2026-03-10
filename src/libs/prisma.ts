import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { Pool } from 'pg'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
  prismaPool?: Pool
}

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  return connectionString
}

export function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const pool =
    globalForPrisma.prismaPool ??
    new Pool({
      connectionString: getConnectionString()
    })

  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  globalForPrisma.prismaPool = pool
  globalForPrisma.prisma = prisma

  return prisma
}
