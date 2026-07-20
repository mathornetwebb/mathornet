
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReceptEditPage({ params }: { params: { id: string } }) {
  const p = await params; const id = p.id; const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.recipe.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/recipes');
  }

  async function saveAction(formData: FormData) {
    'use server';
    const data = {
      title: formData.get('title') || null,
      slug: formData.get('slug') || null,
      description: formData.get('description') || null,
      prepTime: formData.get('prepTime') || null,
      ingredients: formData.get('ingredients') || null,
      instructions: formData.get('instructions') || null,
      featuredImage: formData.get('featuredImage') || null,
    };
    
    if (isNew) {
      await prisma.recipe.create({ data });
    } else {
      await prisma.recipe.update({ where: { id: id }, data });
    }
    
    // Trigger build
    try { await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/rebuild', { method: 'POST' }) } catch(e) {}
    
    redirect('/admin/content/recipes');
  }

  async function deleteAction() {
    'use server';
    await prisma.recipe.delete({ where: { id: id } });
    redirect('/admin/content/recipes');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/content/recipes" className="p-2 text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
          {isNew ? 'Skapa ny' : 'Redigera'} Recept
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form action={saveAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rubrik</label>
              <input type="text" step="" name="title" defaultValue={item?.title || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
              <input type="text" step="" name="slug" defaultValue={item?.slug || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Beskrivning</label>
              <textarea name="description" defaultValue={item?.description || ''} rows={5} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tillagningstid</label>
              <input type="text" step="" name="prepTime" defaultValue={item?.prepTime || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ingredienser (Rich Text)</label>
              <textarea name="ingredients" defaultValue={item?.ingredients || ''} rows={5} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gör så här (Rich Text)</label>
              <textarea name="instructions" defaultValue={item?.instructions || ''} rows={5} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bild-URL</label>
              <input type="text" step="" name="featuredImage" defaultValue={item?.featuredImage || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            {!isNew ? (
              <button formAction={deleteAction} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-5 h-5" />
                Ta bort
              </button>
            ) : <div></div>}
            
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20">
              <Save className="w-5 h-5" />
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
