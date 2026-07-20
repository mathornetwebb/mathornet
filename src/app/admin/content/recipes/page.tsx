
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Edit, Plus, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ReceptListPage() {
  const items = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Recept</h1>
          <p className="text-slate-500 mt-1">Hantera recept på hemsidan.</p>
        </div>
        <Link 
          href="/admin/content/recipes/new" 
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
                    <Link href={`/admin/content/recipes/${item.id}`} className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-slate-500">
                  Inga recept hittades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
