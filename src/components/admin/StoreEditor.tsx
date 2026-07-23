"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
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

      // Trigger rebuild
      await fetch('/api/rebuild', { method: 'POST' }).catch(() => {});

      router.push("/admin/content/stores");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod när butiken skulle sparas.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content/stores" className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {initialData ? "Redigera butik" : "Ny butik"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !formData.name || !formData.lat || !formData.lng}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Sparar..." : "Spara butik"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Namn på butik / återförsäljare *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg text-slate-900"
            placeholder="T.ex. ICA Maxi Erikslund"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adress</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            placeholder="T.ex. Stora gatan 1, 123 45 Stad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Öppettider</label>
          <div className="space-y-3">
            {openingHours.map((dayData: any, index: number) => (
              <div key={dayData.day} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="w-24 font-medium text-gray-800">{dayData.day}</div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayData.isClosed}
                    onChange={(e) => handleDayChange(index, "isClosed", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Stängt</span>
                </label>

                {!dayData.isClosed ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      value={dayData.open}
                      onChange={(e) => handleDayChange(index, "open", e.target.value)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 font-medium"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={dayData.close}
                      onChange={(e) => handleDayChange(index, "close", e.target.value)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 font-medium"
                    />
                  </div>
                ) : (
                  <div className="ml-auto text-sm font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                    Stängt hela dagen
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitud *</label>
            <input
              type="number"
              step="any"
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              placeholder="T.ex. 59.3293"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitud *</label>
            <input
              type="number"
              step="any"
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              placeholder="T.ex. 18.0686"
            />
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          * Du hittar koordinater via Google Maps: högerklicka på en plats på kartan och klicka på koordinaterna (högst upp i listan) för att kopiera dem.
        </p>

        <div className="pt-4 border-t border-gray-100">
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer w-fit border border-gray-100">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Publicerad på kartan</span>
          </label>
        </div>
      </div>
    </div>
  );
}
