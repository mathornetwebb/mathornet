import RecipeEditor from "@/components/admin/RecipeEditor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditRecipePage({ params }: { params: any }) {
  const id = params.id;
  
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    notFound();
  }

  return <RecipeEditor initialData={recipe} />;
}
