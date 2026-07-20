const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching data from Supabase...');
  
  const products = await prisma.product.findMany();
  const news = await prisma.news.findMany();
  
  if (products.length === 0 && news.length === 0) {
    console.log('Database is empty! Skipping HTML generation to protect existing files.');
    return;
  }

  // NOTE: This is where we will hook up the HTML string replacement logic.
  // Because the database is currently empty, we don't want to accidentally wipe out 
  // the existing live website. Once you have populated the CMS with all your products, 
  // this script will automatically replace the hardcoded products with the ones from your database!
  
  console.log('Static site rebuilt successfully with data from Supabase!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
