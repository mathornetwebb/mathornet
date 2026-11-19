import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Force IPv4 for Supabase pooler compatibility in Node.js
pg.defaults.family = 4;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  let connectionString = process.env.DATABASE_URL || '';
  if (connectionString.includes('pooler.supabase.com:5432')) {
    connectionString = connectionString.replace('pooler.supabase.com:5432', 'pooler.supabase.com:6543');
  }

  const pool = new pg.Pool({ 
    connectionString,
    max: process.env.NODE_ENV === 'production' ? 1 : 3,
    min: 0,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 8000,
    allowExitOnIdle: true,
    ssl: { rejectUnauthorized: false } // Supabase requires SSL
  });

  // Handle idle connection errors gracefully (e.g. Supabase pooler disconnects / ECONNRESET)
  pool.on('error', (err) => {
    // Only log if it's not a normal idle socket disconnect
    if ((err as any)?.code !== 'ECONNRESET') {
      console.warn('Postgres pool warning:', err?.message || err);
    }
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

globalThis.prisma = prisma;

export default prisma;
