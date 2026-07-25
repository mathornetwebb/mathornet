'use server';

import prisma from '@/lib/prisma';
import { triggerRebuild } from '@/lib/triggerRebuild';
import { redirect } from 'next/navigation';

export async function saveNewsAction(isNewVal: boolean, idVal: string, formData: FormData) {
  const data = {
    title: formData.get('title') as string || '',
    slug: formData.get('slug') as string || '',
    excerpt: formData.get('excerpt') as string || null,
    content: formData.get('content') as string || '', 
    featuredImage: formData.get('featuredImage') as string || null,
    seoTitle: formData.get('seoTitle') as string || null,
    metaDescription: formData.get('metaDescription') as string || null,
  };
  
  if (isNewVal) {
    await prisma.news.create({ data: { ...data, published: true } });
  } else {
    await prisma.news.update({ where: { id: idVal }, data });
  }
  
  await triggerRebuild();
  redirect('/admin/content/news');
}

export async function deleteNewsAction(idVal: string) {
  await prisma.news.delete({ where: { id: idVal } });
  redirect('/admin/content/news');
}
