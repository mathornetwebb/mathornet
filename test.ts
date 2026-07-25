require('dotenv').config({ path: '.env.local' });
import prisma from './src/lib/prisma';
import pg from 'pg';
pg.defaults.family = 4;

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const store = await prisma.store.create({
      data: {
        name: "Test Store",
        lat: 1.0,
        lng: 1.0,
        published: true
      }
    });
    console.log("Success:", store);
    await prisma.store.delete({ where: { id: store.id } });
  } catch (error) {
    console.error("Error:", error);
  }
}
main();
