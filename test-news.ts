import prisma from './src/lib/prisma';

async function main() {
  try {
    const res = await prisma.news.create({
      data: {
        title: "Test News",
        slug: "test-news-" + Date.now(),
        content: "[]",
        published: true
      }
    });
    console.log("Success", res);
  } catch(e) {
    console.error("Error creating news:", e);
  }
}

main();
