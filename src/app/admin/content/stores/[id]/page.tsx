
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ButikerEditPage({ params }: { params: { id: string } }) {
  const p = await params; const id = p.id; const isNew = id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.store.findUnique({ where: { id: id } });
    if (!item) redirect('/admin/content/stores');
  }

  async function saveAction(formData: FormData) {
    'use server';
    const data = {
      name: formData.get('name') || null,
      address: formData.get('address') || null,
      lat: formData.get('lat') ? parseFloat(formData.get('lat')) : null,
      lng: formData.get('lng') ? parseFloat(formData.get('lng')) : null,
      googlePlaceId: formData.get('googlePlaceId') || null,
    };
    
    if (isNew) {
      await prisma.store.create({ data });
    } else {
      await prisma.store.update({ where: { id: id }, data });
    }
    
    // Trigger build
    try { await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/rebuild', { method: 'POST' }) } catch(e) {}
    
    redirect('/admin/content/stores');
  }

  async function deleteAction() {
    'use server';
    await prisma.store.delete({ where: { id: id } });
    redirect('/admin/content/stores');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/content/stores" className="p-2 text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
          {isNew ? 'Skapa ny' : 'Redigera'} Butiker
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form action={saveAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Butikens namn</label>
              <input type="text" step="" name="name" defaultValue={item?.name || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Adress</label>
              <input type="text" step="" name="address" defaultValue={item?.address || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Latitud</label>
              <input type="number" step="any" name="lat" defaultValue={item?.lat || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Longitud</label>
              <input type="number" step="any" name="lng" defaultValue={item?.lng || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Google Place ID</label>
              <input type="text" step="" name="googlePlaceId" defaultValue={item?.googlePlaceId || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
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
