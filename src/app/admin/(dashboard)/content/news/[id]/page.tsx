import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import NewsVisualEditor from '@/components/admin/NewsVisualEditor';

export const dynamic = 'force-dynamic';

export default async function NyheterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params; const id = p.id; const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.news.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/news');
  }

  async function saveAction(formData: FormData) {
    'use server';
    const data = {
      title: formData.get('title') as string || '',
      slug: formData.get('slug') as string || '',
      excerpt: formData.get('excerpt') as string || null,
      content: formData.get('content') as string || '', // Now JSON string
      featuredImage: formData.get('featuredImage') as string || null,
      seoTitle: formData.get('seoTitle') as string || null,
      metaDescription: formData.get('metaDescription') as string || null,
    };
    
    // Auto-publish by default for this simple CMS setup, or handle it via a boolean
    if (isNew) {
      await prisma.news.create({ data: { ...data, published: true } });
    } else {
      await prisma.news.update({ where: { id: id }, data });
    }
    
    // Trigger build silently
    try { await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/rebuild', { method: 'POST' }) } catch(e) {}
    
    redirect('/admin/content/news');
  }

  async function deleteAction() {
    'use server';
    await prisma.news.delete({ where: { id: id } });
    redirect('/admin/content/news');
  }

  return (
    <form action={saveAction} className="relative">
      <NewsVisualEditor initialData={item} isNew={isNew} />
    </form>
  );
}
