'use server';

import prisma from '@/lib/prisma';
import { triggerRebuild } from '@/lib/triggerRebuild';
import { redirect } from 'next/navigation';

export async function saveProductAction(isNewVal: boolean, idVal: string, formData: FormData) {
  const data = {
    title: formData.get('title') as string || '',
    slug: formData.get('slug') as string || '',
    artNr: formData.get('artNr') as string || null,
    ean: formData.get('ean') as string || null,
    featuredImage: formData.get('featuredImage') as string || null,
    description: formData.get('description') as string || null,
    productInfo: formData.get('productInfo') as string || null,
    nutritionInfo: formData.get('nutritionInfo') as string || null,
    ingredients: formData.get('ingredients') as string || null,
    cookingInstructions: formData.get('cookingInstructions') as string || null,
    storage: formData.get('storage') as string || null,
  };
  
  try {
     const pInfo = JSON.parse(data.productInfo || '{}');
     if (pInfo?.packaging?.bag) {
       (data as any).countPerBag = pInfo.packaging.bag.count || null;
       (data as any).weightPerBag = pInfo.packaging.bag.weight || null;
     }
  } catch(e) {}
  
  if (isNewVal) {
    await prisma.product.create({ data: { ...data, published: true } });
  } else {
    await prisma.product.update({ where: { id: idVal }, data });
  }
  
  await triggerRebuild();
  redirect('/admin/content/products');
}

export async function deleteProductAction(idVal: string) {
  await prisma.product.delete({ where: { id: idVal } });
  redirect('/admin/content/products');
}
