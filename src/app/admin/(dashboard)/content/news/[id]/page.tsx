import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import NewsVisualEditor from '@/components/admin/NewsVisualEditor';
import DeleteButton from '@/components/admin/DeleteButton';

import { saveNewsAction, deleteNewsAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NyheterEditPage({ params }: { params: any }) {
  const id = params.id;
  const isNew = id === 'new';
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
