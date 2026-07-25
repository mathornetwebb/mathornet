import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProductVisualEditor from '@/components/admin/ProductVisualEditor';
import DeleteButton from '@/components/admin/DeleteButton';

import { saveProductAction, deleteProductAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ProdukterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.product.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/products');
  }

  return (
    <form action={saveProductAction.bind(null, isNew, id)} className="relative">
      <ProductVisualEditor initialData={item} isNew={isNew} />
      
      {/* Delete button (only show on existing items) */}
      {!isNew && <DeleteButton action={deleteProductAction.bind(null, id)} />}
    </form>
  );
}
