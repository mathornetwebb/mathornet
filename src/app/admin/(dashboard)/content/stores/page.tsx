
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Edit, Plus, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ButikerListPage() {
  const items = await prisma.store.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto cms-animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Butiker</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {items.length} st
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Hantera återförsäljare, adresser och öppettider.</p>
        </div>
        <Link 
          href="/admin/content/stores/new" 
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Lägg till ny butik</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Butik</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Adress</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skapad</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 overflow-hidden shrink-0 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <Link 
                          href={`/admin/content/stores/${item.id}`} 
                          className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs text-slate-400 font-mono block truncate">
                          ID: {item.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                    {item.address || '—'}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <Link 
                      href={`/admin/content/stores/${item.id}`} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Redigera</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">Inga butiker hittades</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Kom igång genom att lägga till din första butik eller återförsäljare.</p>
                    <Link
                      href="/admin/content/stores/new"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Lägg till butik</span>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

