import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1, // Minimize connections per serverless instance
    idleTimeoutMillis: 10000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Force reload
const prisma = prismaClientSingleton()
globalThis.prisma = prisma

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
