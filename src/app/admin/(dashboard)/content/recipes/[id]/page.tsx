import RecipeEditor from "@/components/admin/RecipeEditor";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    redirect('/admin/content/recipes');
  }

  return <RecipeEditor initialData={recipe} />;
}
