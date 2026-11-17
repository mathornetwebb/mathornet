"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

type StoreEditorProps = {
  initialData?: any;
};

const DEFAULT_HOURS = [
  { day: "Måndag", open: "08:00", close: "20:00", isClosed: false },
  { day: "Tisdag", open: "08:00", close: "20:00", isClosed: false },
  { day: "Onsdag", open: "08:00", close: "20:00", isClosed: false },
  { day: "Torsdag", open: "08:00", close: "20:00", isClosed: false },
  { day: "Fredag", open: "08:00", close: "20:00", isClosed: false },
  { day: "Lördag", open: "10:00", close: "18:00", isClosed: false },
  { day: "Söndag", open: "10:00", close: "18:00", isClosed: true },
];

export default function StoreEditor({ initialData }: StoreEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    lat: initialData?.lat || "",
    lng: initialData?.lng || "",
    published: initialData?.published ?? true,
  });

  const [openingHours, setOpeningHours] = useState(() => {
    try {
      if (initialData?.openingHours) {
        const parsed = JSON.parse(initialData.openingHours);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed;
      }
    } catch(e) {}
    return DEFAULT_HOURS;
  });

  const handleDayChange = (index: number, field: string, value: any) => {
    const newHours = [...openingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setOpeningHours(newHours);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = initialData?.id ? `/api/stores/${initialData.id}` : "/api/stores";
      const method = initialData?.id ? "PUT" : "POST";

      const dataToSave = {
        ...formData,
        openingHours: JSON.stringify(openingHours)
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!res.ok) throw new Error("Kunde inte spara butiken");

      // Trigger rebuild in background so UI responds instantly
      fetch('/api/rebuild', { method: 'POST' }).catch(() => {});

      if (typeof window !== 'undefined') (window as any).__isFormDirty = false;
      router.push("/admin/content/stores");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod när butiken skulle sparas.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!window.confirm('Är du säker på att du vill radera denna butik? Det går inte att ångra.')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/stores/${initialData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Kunde inte radera butiken");
      
      // Trigger rebuild in background
      fetch('/api/rebuild', { method: 'POST' }).catch(() => {});
      
      if (typeof window !== 'undefined') (window as any).__isFormDirty = false;
      router.replace("/admin/content/stores");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod vid radering.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 relative cms-animate-fade-in">
      {/* Sticky Top Header Bar */}
      <div className="sticky top-4 z-20 flex items-center justify-between bg-slate-900/90 backdrop-blur-md text-white rounded-2xl px-6 py-3.5 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/content/stores" 
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-outfit tracking-tight">
              {initialData ? "Redigera butik" : "Ny butik"}
            </h1>
            <p className="text-xs text-slate-400">
              {formData.name || "Namnlös butik"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !formData.name || !formData.lat || !formData.lng}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Sparar..." : "Spara butik"}
        </button>
      </div>

      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Namn på butik / återförsäljare *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-base text-slate-900 transition-all"
            placeholder="T.ex. ICA Maxi Erikslund"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Adress
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm text-slate-900 transition-all"
            placeholder="T.ex. Stora gatan 1, 123 45 Stad"
          />
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Öppettider
          </label>
          <div className="space-y-2.5">
            {openingHours.map((dayData: any, index: number) => (
              <div 
                key={dayData.day} 
                className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70"
              >
                <div className="w-24 text-xs font-bold text-slate-800">{dayData.day}</div>
                
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dayData.isClosed}
                    onChange={(e) => handleDayChange(index, "isClosed", e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="text-xs font-semibold text-slate-600">Stängt</span>
                </label>

                {!dayData.isClosed ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      value={dayData.open}
                      onChange={(e) => handleDayChange(index, "open", e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-900 font-semibold bg-white"
                    />
                    <span className="text-slate-400 text-xs font-bold">-</span>
                    <input
                      type="time"
                      value={dayData.close}
                      onChange={(e) => handleDayChange(index, "close", e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-900 font-semibold bg-white"
                    />
                  </div>
                ) : (
                  <div className="ml-auto text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60">
                    Stängt hela dagen
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Latitud *
            </label>
            <input
              type="number"
              step="any"
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs font-mono text-slate-900 bg-slate-50/50"
              placeholder="T.ex. 59.3293"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Longitud *
            </label>
            <input
              type="number"
              step="any"
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs font-mono text-slate-900 bg-slate-50/50"
              placeholder="T.ex. 18.0686"
            />
          </div>
        </div>
        
        <p className="text-[11px] text-slate-400 leading-relaxed">
          * Du hittar koordinater via Google Maps: högerklicka på butikens plats på kartan och klicka på siffrorna (koordinaterna) högst upp i menyn för att kopiera dem.
        </p>

        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl cursor-pointer w-fit border border-slate-200/60 hover:bg-slate-100/60 transition-colors">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
            />
            <span className="text-xs font-bold text-slate-800">Publicerad på kartan</span>
          </label>
        </div>
      </div>
      
      {initialData?.id && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={handleDelete}
            disabled={isSaving}
            className="flex items-center gap-2 bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Ta bort butik
          </button>
        </div>
      )}
    </div>
  );
}
