"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import RichTextBlock from "./RichTextBlock";
import ImageUpload from "./ImageUpload";

type RecipeEditorProps = {
  initialData?: any;
};

export default function RecipeEditor({ initialData }: RecipeEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    prepTime: initialData?.prepTime || "",
    portions: initialData?.portions || "",
    difficulty: initialData?.difficulty || "",
    featuredImage: initialData?.featuredImage || "",
    published: initialData?.published ?? true,
  });

  const [ingredientsBlocks, setIngredientsBlocks] = useState<any[]>(() => {
    if (!initialData?.ingredients) return [{ id: "1", type: "text", content: "" }];
    try {
      return JSON.parse(initialData.ingredients);
    } catch {
      return [{ id: "1", type: "text", content: initialData.ingredients }];
    }
  });

  const [instructionsBlocks, setInstructionsBlocks] = useState<any[]>(() => {
    if (!initialData?.instructions) return [{ id: "1", type: "text", content: "" }];
    try {
      return JSON.parse(initialData.instructions);
    } catch {
      return [{ id: "1", type: "text", content: initialData.instructions }];
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        ingredients: JSON.stringify(ingredientsBlocks),
        instructions: JSON.stringify(instructionsBlocks),
      };

      const url = initialData?.id ? `/api/recipes/${initialData.id}` : "/api/recipes";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Kunde inte spara receptet");

      // Trigger rebuild in background so UI responds instantly
      fetch('/api/rebuild', { method: 'POST' }).catch(() => {});

      if (typeof window !== 'undefined') (window as any).__isFormDirty = false;
      router.push("/admin/content/recipes");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod när receptet skulle sparas.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!window.confirm('Är du säker på att du vill radera detta recept? Det går inte att ångra.')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/recipes/${initialData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Kunde inte radera receptet");
      
      // Trigger rebuild in background
      fetch('/api/rebuild', { method: 'POST' }).catch(() => {});
      
      if (typeof window !== 'undefined') (window as any).__isFormDirty = false;
      router.replace("/admin/content/recipes");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod vid radering.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 relative cms-animate-fade-in">
      {/* Sticky Top Header Bar */}
      <div className="sticky top-4 z-20 flex items-center justify-between bg-slate-900/90 backdrop-blur-md text-white rounded-2xl px-6 py-3.5 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/content/recipes" 
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-outfit tracking-tight">
              {initialData ? "Redigera recept" : "Nytt recept"}
            </h1>
            <p className="text-xs text-slate-400">
              {formData.title || "Namnlöst recept"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !formData.title}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Sparar..." : "Spara recept"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 font-outfit tracking-tight">Grundinformation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: initialData ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
                    });
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-base font-bold text-slate-900 transition-all"
                  placeholder="T.ex. Krämig Hummus"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kort beskrivning (Visas på kortet)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm text-slate-800 transition-all"
                  placeholder="En kort och aptitretande beskrivning..."
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-outfit tracking-tight">Ingredienser</h2>
                <p className="text-xs text-slate-500 mt-0.5">Lägg till mängd och råvaror</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {ingredientsBlocks.length} st
              </span>
            </div>
            <div className="space-y-3">
              {ingredientsBlocks.map((block, index) => (
                <div key={block.id} className="flex items-center gap-3 p-2.5 px-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 group hover:border-slate-300 transition-all">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => {
                      const newBlocks = [...ingredientsBlocks];
                      newBlocks[index].content = e.target.value;
                      newBlocks[index].type = 'text';
                      setIngredientsBlocks(newBlocks);
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-sm font-medium"
                    placeholder="T.ex. 800 g kycklingfilé..."
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (index === 0) return;
                        const newBlocks = [...ingredientsBlocks];
                        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
                        setIngredientsBlocks(newBlocks);
                      }} 
                      className="p-1 text-slate-400 hover:text-slate-800 rounded text-xs font-bold"
                      title="Flytta upp"
                    >
                      ↑
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (index === ingredientsBlocks.length - 1) return;
                        const newBlocks = [...ingredientsBlocks];
                        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                        setIngredientsBlocks(newBlocks);
                      }} 
                      className="p-1 text-slate-400 hover:text-slate-800 rounded text-xs font-bold"
                      title="Flytta ner"
                    >
                      ↓
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIngredientsBlocks(ingredientsBlocks.filter(b => b.id !== block.id))} 
                      className="p-1 text-slate-400 hover:text-rose-600 rounded text-xs font-bold ml-1"
                      title="Ta bort"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setIngredientsBlocks([...ingredientsBlocks, { id: Math.random().toString(), type: 'text', content: '' }])} 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                + Lägg till ingrediens
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-outfit tracking-tight">Gör så här</h2>
                <p className="text-xs text-slate-500 mt-0.5">Steg-för-steg instruktioner</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {instructionsBlocks.length} steg
              </span>
            </div>
            <div className="space-y-3.5">
              {instructionsBlocks.map((block, index) => (
                <div key={block.id} className="flex gap-3.5 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 group hover:border-slate-300 transition-all items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <textarea
                    value={block.content}
                    onChange={(e) => {
                      const newBlocks = [...instructionsBlocks];
                      newBlocks[index].content = e.target.value;
                      newBlocks[index].type = 'text';
                      setInstructionsBlocks(newBlocks);
                    }}
                    rows={2}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 resize-none text-sm font-medium leading-relaxed"
                    placeholder="T.ex. Skär kycklingen i jämna bitar..."
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 justify-center shrink-0">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (index === 0) return;
                        const newBlocks = [...instructionsBlocks];
                        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
                        setInstructionsBlocks(newBlocks);
                      }} 
                      className="p-1 text-slate-400 hover:text-slate-800 rounded text-xs font-bold"
                      title="Flytta upp"
                    >
                      ↑
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (index === instructionsBlocks.length - 1) return;
                        const newBlocks = [...instructionsBlocks];
                        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                        setInstructionsBlocks(newBlocks);
                      }} 
                      className="p-1 text-slate-400 hover:text-slate-800 rounded text-xs font-bold"
                      title="Flytta ner"
                    >
                      ↓
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setInstructionsBlocks(instructionsBlocks.filter(b => b.id !== block.id))} 
                      className="p-1 text-slate-400 hover:text-rose-600 rounded text-xs font-bold mt-1"
                      title="Ta bort"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setInstructionsBlocks([...instructionsBlocks, { id: Math.random().toString(), type: 'text', content: '' }])} 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                + Lägg till steg
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Details & Publishing */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Publicering</h3>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">URL-slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono text-xs text-slate-800 bg-slate-50"
              />
            </div>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer border border-slate-100 hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-xs font-bold text-slate-800">Publicerad på webbplatsen</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Receptdetaljer</h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tillagningstid</label>
                <input
                  type="text"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  placeholder="T.ex. 25 min"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Portioner</label>
                <input
                  type="text"
                  value={formData.portions || ""}
                  onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                  placeholder="T.ex. 4 portioner"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Svårighetsgrad</label>
                <input
                  type="text"
                  value={formData.difficulty || ""}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  placeholder="T.ex. Enkel / Medel"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <ImageUpload 
              value={formData.featuredImage} 
              onChange={(url) => setFormData({ ...formData, featuredImage: url })} 
              label="Omslagsbild" 
            />
          </div>
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
            Ta bort inlägg
          </button>
        </div>
      )}
    </div>
  );
}
