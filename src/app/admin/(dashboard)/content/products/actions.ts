'use server';

import prisma from '@/lib/prisma';
import { triggerRebuild } from '@/lib/triggerRebuild';
import { redirect } from 'next/navigation';

function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

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
  
  let brand = 'mathornet';
  try {
    const pInfo = JSON.parse(data.productInfo || '{}');
    if (pInfo?.brand) brand = pInfo.brand;
    if (pInfo?.packaging?.bag) {
      (data as any).countPerBag = pInfo.packaging.bag.count || null;
      (data as any).weightPerBag = pInfo.packaging.bag.weight || null;
      if (pInfo.packaging.bag.artNr) data.artNr = pInfo.packaging.bag.artNr;
      if (pInfo.packaging.bag.ean) data.ean = pInfo.packaging.bag.ean;
    }
  } catch (e) {}

  let baseSlug = sanitizeSlug(data.slug) || sanitizeSlug(data.title) || ('ny-produkt-' + Date.now());
  if (brand === 'ahalna' && isNewVal && !baseSlug.startsWith('ahalna-')) {
    baseSlug = `ahalna-${baseSlug}`;
  }

  let candidateSlug = baseSlug;
  let counter = 2;
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidateSlug },
      select: { id: true },
    });
    if (!existing || (!isNewVal && existing.id === idVal)) {
      break;
    }
    if (brand === 'ahalna' && !baseSlug.startsWith('ahalna-')) {
      baseSlug = `ahalna-${baseSlug}`;
      candidateSlug = baseSlug;
      continue;
    }
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  data.slug = candidateSlug;
  
  if (isNewVal) {
    await prisma.product.create({ data: { ...data, published: true } });
  } else {
    await prisma.product.update({ where: { id: idVal }, data });
  }
  
  // Trigger rebuild and ensure deploy hook request completes before redirect
  await triggerRebuild().catch(console.error);
  redirect('/admin/content/products');
}

export async function deleteProductAction(idVal: string) {
  await prisma.product.delete({ where: { id: idVal } });
  // Trigger rebuild and ensure deploy hook request completes before redirect
  await triggerRebuild().catch(console.error);
  redirect('/admin/content/products');
}
