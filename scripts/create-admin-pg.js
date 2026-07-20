const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: '.env.local' });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const email = 'admin@mathornet.se';
  const password = 'Mathornet2026!!';
  const passwordHash = await bcrypt.hash(password, 10);
  const id = 'clk1234567890abcdefgh'; // random cuid-like string
  
  await pool.query(
    `INSERT INTO "User" (id, email, "passwordHash", name, role, "createdAt", "updatedAt") 
     VALUES ($1, $2, $3, $4, 'ADMIN', NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET "passwordHash" = $3`,
    [id, email, passwordHash, 'Admin']
  );
  
  console.log('Admin user created:', email);
  await pool.end();
}

main().catch(console.error);
