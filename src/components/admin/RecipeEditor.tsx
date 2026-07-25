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

      // Trigger rebuild
      await fetch('/api/rebuild', { method: 'POST' }).catch(() => {});

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
    if (!window.confirm('Är du säker på att du vill radera detta inlägg? Det går inte att ångra.')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/recipes/${initialData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Kunde inte radera receptet");
      
      await fetch('/api/rebuild', { method: 'POST' }).catch(() => {});
      router.push("/admin/content/recipes");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod vid radering.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content/recipes" className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {initialData ? "Redigera recept" : "Nytt recept"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !formData.title}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Sparar..." : "Spara recept"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium text-slate-900"
                  placeholder="T.ex. Krämig Hummus"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kort beskrivning (Visas på kortet)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Ingredienser</h2>
            <div className="space-y-4">
              {ingredientsBlocks.map((block, index) => (
                <div key={block.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-gray-300 transition-colors">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex-shrink-0" />
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => {
                      const newBlocks = [...ingredientsBlocks];
                      newBlocks[index].content = e.target.value;
                      newBlocks[index].type = 'text';
                      setIngredientsBlocks(newBlocks);
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-gray-400 font-medium"
                    placeholder="T.ex. 800 g kycklingfilé..."
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button type="button" onClick={() => {
                      if (index === 0) return;
                      const newBlocks = [...ingredientsBlocks];
                      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
                      setIngredientsBlocks(newBlocks);
                    }} className="text-gray-400 hover:text-blue-500">↑</button>
                    <button type="button" onClick={() => {
                      if (index === ingredientsBlocks.length - 1) return;
                      const newBlocks = [...ingredientsBlocks];
                      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                      setIngredientsBlocks(newBlocks);
                    }} className="text-gray-400 hover:text-blue-500">↓</button>
                    <button type="button" onClick={() => setIngredientsBlocks(ingredientsBlocks.filter(b => b.id !== block.id))} className="text-gray-400 hover:text-red-500 ml-2">✕</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setIngredientsBlocks([...ingredientsBlocks, { id: Math.random().toString(), type: 'text', content: '' }])} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                + Lägg till ingrediens
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Gör så här</h2>
            <div className="space-y-4">
              {instructionsBlocks.map((block, index) => (
                <div key={block.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#f0f7e6] text-[#64b000] flex items-center justify-center font-bold text-xl flex-shrink-0">
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
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-gray-400 resize-none mt-2 font-medium"
                    placeholder="T.ex. Skär kycklingen i jämna bitar..."
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 justify-center">
                    <button type="button" onClick={() => {
                      if (index === 0) return;
                      const newBlocks = [...instructionsBlocks];
                      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
                      setInstructionsBlocks(newBlocks);
                    }} className="text-gray-400 hover:text-blue-500">↑</button>
                    <button type="button" onClick={() => {
                      if (index === instructionsBlocks.length - 1) return;
                      const newBlocks = [...instructionsBlocks];
                      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                      setInstructionsBlocks(newBlocks);
                    }} className="text-gray-400 hover:text-blue-500">↓</button>
                    <button type="button" onClick={() => setInstructionsBlocks(instructionsBlocks.filter(b => b.id !== block.id))} className="text-gray-400 hover:text-red-500 mt-1">✕</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setInstructionsBlocks([...instructionsBlocks, { id: Math.random().toString(), type: 'text', content: '' }])} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                + Lägg till steg
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-bold text-gray-900">Publicering</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL-slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-slate-900"
              />
            </div>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">Publicerad</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-bold text-gray-900">Receptdetaljer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tillagningstid (t.ex. 15 min)</label>
                <input
                  type="text"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portioner (t.ex. 4 portioner)</label>
                <input
                  type="text"
                  value={formData.portions || ""}
                  onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Svårighetsgrad (t.ex. Enkel)</label>
                <input
                  type="text"
                  value={formData.difficulty || ""}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
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
            className="flex items-center gap-2 bg-red-100 text-red-600 hover:text-red-700 hover:bg-red-200 font-medium px-4 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            Ta bort inlägg
          </button>
        </div>
      )}
    </div>
  );
}
