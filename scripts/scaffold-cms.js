const fs = require('fs');
const path = require('path');

const models = [
  {
    name: 'news',
    modelName: 'news',
    title: 'Nyheter',
    fields: [
      { name: 'title', label: 'Rubrik', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'excerpt', label: 'Sammanfattning', type: 'textarea' },
      { name: 'content', label: 'Innehåll (Rich Text)', type: 'textarea' },
      { name: 'featuredImage', label: 'Bild-URL', type: 'text' },
      { name: 'seoTitle', label: 'SEO Titel', type: 'text' },
      { name: 'metaDescription', label: 'SEO Beskrivning', type: 'text' },
    ]
  },
  {
    name: 'products',
    modelName: 'product',
    title: 'Produkter',
    fields: [
      { name: 'title', label: 'Benämning (Rubrik)', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'artNr', label: 'Art. nr', type: 'text' },
      { name: 'ean', label: 'EAN', type: 'text' },
      { name: 'countPerBag', label: 'Antal/påse', type: 'text' },
      { name: 'weightPerBag', label: 'Vikt/påse', type: 'text' },
      { name: 'description', label: 'Beskrivning', type: 'textarea' },
      { name: 'productInfo', label: 'Produktinformation', type: 'textarea' },
      { name: 'nutritionInfo', label: 'Näringsvärde', type: 'textarea' },
      { name: 'ingredients', label: 'Innehållsförteckning', type: 'textarea' },
      { name: 'storage', label: 'Förvaring', type: 'textarea' },
      { name: 'cookingInstructions', label: 'Tillagningsanvisningar', type: 'textarea' },
      { name: 'featuredImage', label: 'Bild-URL', type: 'text' },
    ]
  },
  {
    name: 'recipes',
    modelName: 'recipe',
    title: 'Recept',
    fields: [
      { name: 'title', label: 'Rubrik', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Beskrivning', type: 'textarea' },
      { name: 'prepTime', label: 'Tillagningstid', type: 'text' },
      { name: 'ingredients', label: 'Ingredienser (Rich Text)', type: 'textarea' },
      { name: 'instructions', label: 'Gör så här (Rich Text)', type: 'textarea' },
      { name: 'featuredImage', label: 'Bild-URL', type: 'text' },
    ]
  },
  {
    name: 'stores',
    modelName: 'store',
    title: 'Butiker',
    fields: [
      { name: 'name', label: 'Butikens namn', type: 'text' },
      { name: 'address', label: 'Adress', type: 'text' },
      { name: 'lat', label: 'Latitud', type: 'number' },
      { name: 'lng', label: 'Longitud', type: 'number' },
      { name: 'googlePlaceId', label: 'Google Place ID', type: 'text' },
    ]
  }
];

function generateListPage(model) {
  return `
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Edit, Plus, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ${model.title}ListPage() {
  const items = await prisma.${model.modelName}.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">${model.title}</h1>
          <p className="text-slate-500 mt-1">Hantera ${model.title.toLowerCase()} på hemsidan.</p>
        </div>
        <Link 
          href="/admin/content/${model.name}/new" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          Lägg till ny
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Titel/Namn</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Skapad</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Åtgärd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{item.title || item.name}</td>
                <td className="py-4 px-6 text-slate-500">{new Date(item.createdAt).toLocaleDateString('sv-SE')}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={\`/admin/content/${model.name}/\${item.id}\`} className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-slate-500">
                  Inga ${model.title.toLowerCase()} hittades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
}

function generateEditPage(model) {
  const fieldsTsx = model.fields.map(f => {
    if (f.type === 'textarea') {
      return `
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">${f.label}</label>
              <textarea name="${f.name}" defaultValue={item?.${f.name} || ''} rows={5} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"></textarea>
            </div>`;
    }
    return `
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">${f.label}</label>
              <input type="${f.type === 'number' ? 'number' : 'text'}" step="${f.type === 'number' ? 'any' : ''}" name="${f.name}" defaultValue={item?.${f.name} || ''} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" />
            </div>`;
  }).join('\n');

  const fieldsDataObj = model.fields.map(f => {
    if (f.type === 'number') {
      return `      ${f.name}: formData.get('${f.name}') ? parseFloat(formData.get('${f.name}')) : null,`;
    }
    return `      ${f.name}: formData.get('${f.name}') || null,`;
  }).join('\n');

  return `
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ${model.title}EditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let item = null;
  
  if (!isNew) {
    item = await prisma.${model.modelName}.findUnique({ where: { id: params.id } });
    if (!item) redirect('/admin/content/${model.name}');
  }

  async function saveAction(formData: FormData) {
    'use server';
    const data = {
${fieldsDataObj}
    };
    
    if (isNew) {
      await prisma.${model.modelName}.create({ data });
    } else {
      await prisma.${model.modelName}.update({ where: { id: params.id }, data });
    }
    
    // Trigger build
    try { await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/rebuild', { method: 'POST' }) } catch(e) {}
    
    redirect('/admin/content/${model.name}');
  }

  async function deleteAction() {
    'use server';
    await prisma.${model.modelName}.delete({ where: { id: params.id } });
    redirect('/admin/content/${model.name}');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/content/${model.name}" className="p-2 text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
          {isNew ? 'Skapa ny' : 'Redigera'} ${model.title}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form action={saveAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            ${fieldsTsx}
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
`;
}

models.forEach(model => {
  const dirPath = path.join(__dirname, 'src', 'app', 'admin', 'content', model.name);
  const idDirPath = path.join(dirPath, '[id]');
  
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  if (!fs.existsSync(idDirPath)) fs.mkdirSync(idDirPath, { recursive: true });
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), generateListPage(model));
  fs.writeFileSync(path.join(idDirPath, 'page.tsx'), generateEditPage(model));
});

console.log('CMS pages generated successfully.');
