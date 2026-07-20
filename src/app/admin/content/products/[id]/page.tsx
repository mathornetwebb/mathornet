import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProductVisualEditor from '@/components/admin/ProductVisualEditor';

export const dynamic = 'force-dynamic';

export default async function ProdukterEditPage({ params }: { params: { id: string } }) {
  const p = await params; const id = p.id; const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.product.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/products');
  }

  async function saveAction(formData: FormData) {
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
    
    if (isNew) {
      await prisma.product.create({ data: { ...data, published: true } });
    } else {
      await prisma.product.update({ where: { id: id }, data });
    }
    
    // Trigger build
    try { await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/rebuild', { method: 'POST' }) } catch(e) {}
    
    redirect('/admin/content/products');
  }

  async function deleteAction() {
    'use server';
    await prisma.product.delete({ where: { id: id } });
    redirect('/admin/content/products');
  }

  return (
    <form action={saveAction} className="relative">
      <ProductVisualEditor initialData={item} isNew={isNew} />
      
      {/* Delete button (only show on existing items) */}
      {!isNew && (
        <div className="fixed bottom-6 right-6 z-50">
          <button formAction={deleteAction} className="flex items-center gap-2 bg-red-100 text-red-600 hover:text-red-700 hover:bg-red-200 font-medium px-4 py-2 rounded-xl transition-colors shadow-sm">
            Ta bort produkt
          </button>
        </div>
      )}
    </form>
  );
}
