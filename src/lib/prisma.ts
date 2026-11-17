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
  const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10,
    min: 0,
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 8000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
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

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
