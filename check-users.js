const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.zgylvcwzwfqmligweato:Mathornet2026%21%21@aws-0-eu-north-1.pooler.supabase.com:5432/postgres'
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM "User"');
  console.log('Users:', res.rows);
  await client.end();
}

main().catch(console.error);
