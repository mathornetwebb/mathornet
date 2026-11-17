
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Edit, Plus, Package, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProdukterListPage() {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto cms-animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Produkter</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {items.length} st
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Hantera sortiment och artiklar för Mathörnet och Ahalna.</p>
        </div>
        <Link 
          href="/admin/content/products/new" 
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Lägg till ny produkt</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Produkt</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Varumärke</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Artikelnr</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skapad</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                let brand = 'mathornet';
                let artNr = item.artNr || '—';
                try {
                  const parsed = JSON.parse(item.productInfo || '{}');
                  if (parsed.brand) brand = parsed.brand;
                  if (parsed.packaging?.bag?.artNr) artNr = parsed.packaging.bag.artNr;
                } catch(e) {}

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.featuredImage ? (
                            <img
                              src={item.featuredImage.startsWith('http') ? item.featuredImage : `/${item.featuredImage}`}
                              alt={item.title}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link 
                            href={`/admin/content/products/${item.id}`} 
                            className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate block"
                          >
                            {item.title}
                          </Link>
                          <span className="text-xs text-slate-400 font-mono block truncate">
                            /{item.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {brand === 'ahalna' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                          Ahalna
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Mathörnet
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-600">
                      {artNr}
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
                        href={`/admin/content/products/${item.id}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Redigera</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">Inga produkter hittades</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Kom igång genom att lägga till din första produkt.</p>
                    <Link
                      href="/admin/content/products/new"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Lägg till produkt</span>
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

