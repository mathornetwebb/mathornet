import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Force IPv4 for Supabase pooler compatibility in Node.js
pg.defaults.family = 4;

const prismaClientSingleton = () => {
  const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false } // Supabase requires SSL
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// Force reload
const prisma = prismaClientSingleton()
globalThis.prisma = prisma

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
