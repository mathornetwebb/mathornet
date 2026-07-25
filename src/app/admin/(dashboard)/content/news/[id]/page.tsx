import prisma from '@/lib/prisma';
import { triggerRebuild } from '@/lib/triggerRebuild';
import { redirect } from 'next/navigation';
import NewsVisualEditor from '@/components/admin/NewsVisualEditor';
import DeleteButton from '@/components/admin/DeleteButton';

import { saveNewsAction, deleteNewsAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NyheterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params; const id = p.id; const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.news.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/news');
  }

  return (
    <form action={saveNewsAction.bind(null, isNew, id)} className="relative">
      <NewsVisualEditor initialData={item} isNew={isNew} />
      
      {!isNew && <DeleteButton action={deleteNewsAction.bind(null, id)} />}
    </form>
  );
}
