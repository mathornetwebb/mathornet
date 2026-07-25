import prisma from '@/lib/prisma';
import { triggerRebuild } from '@/lib/triggerRebuild';
import { redirect } from 'next/navigation';
import ProductVisualEditor from '@/components/admin/ProductVisualEditor';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function ProdukterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params; const id = p.id; const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.product.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/products');
  }

  async function saveAction(isNewVal: boolean, idVal: string, formData: FormData) {
    'use server';
    const data = {
      title: formData.get('title') as string || '',
      slug: formData.get('slug') as string || '',
      artNr: formData.get('artNr') as string || null,
      ean: formData.get('ean') as string || null,
      featuredImage: formData.get('featuredImage') as string || null,
      description: formData.get('description') as string || null,
      
      // JSON fields from the advanced editor
      productInfo: formData.get('productInfo') as string || null,
      nutritionInfo: formData.get('nutritionInfo') as string || null,
      ingredients: formData.get('ingredients') as string || null,
      cookingInstructions: formData.get('cookingInstructions') as string || null,
      storage: formData.get('storage') as string || null,
    };
    
    // Default values if packaging count/weight was provided but needs fallback to Prisma model
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
    
    // Trigger build silently
    await triggerRebuild();
    
    redirect('/admin/content/products');
  }

  async function deleteAction(idVal: string) {
    'use server';
    await prisma.product.delete({ where: { id: idVal } });
    redirect('/admin/content/products');
  }

  return (
    <form action={saveAction.bind(null, isNew, id)} className="relative">
      <ProductVisualEditor initialData={item} isNew={isNew} />
      
      {/* Delete button (only show on existing items) */}
      {!isNew && <DeleteButton action={deleteAction.bind(null, id)} />}
    </form>
  );
}
