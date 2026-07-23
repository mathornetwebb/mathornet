const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.recipe.create({
    data: {
      title: 'Krämig Hummus från grunden',
      slug: 'kramig-hummus-fran-grunden',
      description: 'Silkeslen hummus med tahini och citron. Det självklara tillbehöret till nyfriterad falafel och varmt pitabröd.',
      featuredImage: 'img/recipe_hummus_1781120953317.png',
      prepTime: '30 min',
      difficulty: 'Lätt',
      servings: 4,
      content: '[]',
      ingredients: '[]',
      isPublished: true,
    }
  });
  console.log("Dummy recipe created!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
