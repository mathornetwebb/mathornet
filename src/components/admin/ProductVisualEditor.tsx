'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Image as ImageIcon, Box, Layers, Package, Plus, X } from 'lucide-react';
import Link from 'next/link';
import RichTextBlock from './RichTextBlock';
import ImageUpload from './ImageUpload';

export default function ProductVisualEditor({ 
  initialData, 
  isNew 
}: { 
  initialData: any; 
  isNew: boolean;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [artNr, setArtNr] = useState(initialData?.artNr || '');
  const [ean, setEan] = useState(initialData?.ean || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [storage, setStorage] = useState(initialData?.storage || '');

  // Parse JSON fields
  const parseJson = (str: string, fallback: any) => {
    if (!str) return fallback;
    try { 
      const parsed = JSON.parse(str);
      // Simple shallow merge is usually enough, but let's ensure nested objects exist
      if (parsed && typeof parsed === 'object') {
        const result = { ...fallback, ...parsed };
        result.brand = parsed.brand || 'mathornet';
        if (fallback.packaging) {
          result.packaging = {
            bag: { ...fallback.packaging.bag, ...(parsed.packaging?.bag || {}) },
            box: { ...fallback.packaging.box, ...(parsed.packaging?.box || {}) },
            pallet: { ...fallback.packaging.pallet, ...(parsed.packaging?.pallet || {}) },
          };
          if (!result.packaging.bag.artNr && initialData?.artNr) {
            result.packaging.bag.artNr = initialData.artNr;
          }
          if (!result.packaging.bag.ean && initialData?.ean) {
            result.packaging.bag.ean = initialData.ean;
          }
        }
        return result;
      }
      return parsed;
    } catch { return fallback; }
  };

  const [productInfo, setProductInfo] = useState(parseJson(initialData?.productInfo, {
    brand: 'mathornet',
    manufacturingCountry: 'Sverige',
    manufacturer: 'Mathörnet',
    properties: ['Färdiglagat.', 'Inga konserveringsmedel.', 'Förpackningen sorteras som plastförpackning.'],
    specialDiets: 'N/A',
    leadTime: '5 dagar',
    packaging: {
      bag: { count: initialData?.countPerBag || '', weight: initialData?.weightPerBag || '', artNr: initialData?.artNr || '', ean: initialData?.ean || '' },
      box: { count: '', weight: '', artNr: '', ean: '' },
      pallet: { count: '', weight: '', artNr: '', ean: '' }
    }
  }));

  const [nutrition, setNutrition] = useState(parseJson(initialData?.nutritionInfo, {
    energy: '', fat: '', saturatedFat: '', carbs: '', sugar: '', protein: '', salt: ''
  }));

  const [ingredients, setIngredients] = useState(parseJson(initialData?.ingredients, {
    dough: '', filling: '', allergens: ''
  }));

  const [cooking, setCooking] = useState(parseJson(initialData?.cookingInstructions, {
    general: 'Tillaga från djupfryst, vänd efter halva tiden.', oven: '', airfryer: '', pan: ''
  }));

  // Auto-generate slug from title if new
  useEffect(() => {
    if (isNew && title) {
      let newSlug = title
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      if (!newSlug) newSlug = 'ny-produkt-' + Date.now();
      setSlug(newSlug);
    }
  }, [title, isNew]);

  // Handlers for deep state updates
  const updateProductInfo = (key: string, value: any) => setProductInfo({ ...productInfo, [key]: value });
  const updatePackaging = (type: 'bag'|'box'|'pallet', field: 'count'|'weight'|'artNr'|'ean', value: string) => {
    setProductInfo((prev: any) => ({
      ...prev,
      packaging: { 
        ...prev.packaging, 
        [type]: { 
          ...(prev.packaging?.[type] || {}), 
          [field]: value 
        } 
      }
    }));
    if (type === 'bag') {
      if (field === 'artNr') setArtNr(value);
      if (field === 'ean') setEan(value);
    }
  };
  const updateNutrition = (key: string, value: string) => setNutrition({ ...nutrition, [key]: value });
  const updateIngredients = (key: string, value: string) => setIngredients({ ...ingredients, [key]: value });
  const updateCooking = (key: string, value: string) => setCooking({ ...cooking, [key]: value });

  const addProperty = () => updateProductInfo('properties', [...productInfo.properties, '']);
  const updateProperty = (index: number, value: string) => {
    const newProps = [...productInfo.properties];
    newProps[index] = value;
    updateProductInfo('properties', newProps);
  };
  const removeProperty = (index: number) => {
    updateProductInfo('properties', productInfo.properties.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 p-4 sm:p-6 -m-4 sm:-m-6 rounded-2xl pb-20 cms-animate-fade-in">
      {/* Hidden inputs for Form */}
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="artNr" value={productInfo.packaging?.bag?.artNr || artNr} />
      <input type="hidden" name="ean" value={productInfo.packaging?.bag?.ean || ean} />
      <input type="hidden" name="featuredImage" value={featuredImage} />
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="storage" value={storage} />
      <input type="hidden" name="productInfo" value={JSON.stringify(productInfo)} />
      <input type="hidden" name="nutritionInfo" value={JSON.stringify(nutrition)} />
      <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
      <input type="hidden" name="cookingInstructions" value={JSON.stringify(cooking)} />

      {/* HEADER */}
      <div className="sticky top-4 z-20 flex justify-between items-center bg-slate-900/90 backdrop-blur-md text-white rounded-2xl px-6 py-3.5 mb-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/admin/content/products" className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-outfit tracking-tight">{isNew ? 'Skapa ny produkt' : 'Redigera produkt'}</h1>
            <p className="text-xs text-slate-400">{title || 'Namnlös produkt'}</p>
          </div>
        </div>
        <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer">
          <Save className="w-4 h-4" /> Spara Produkt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto w-full">
        
        {/* LEFT COLUMN - MAIN INFO & IMAGE */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <ImageUpload 
                value={featuredImage} 
                onChange={setFeaturedImage} 
                label="Produktbild" 
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Varumärke / Sortiment *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateProductInfo('brand', 'mathornet')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                      (productInfo.brand || 'mathornet') === 'mathornet'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Mathörnet
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProductInfo('brand', 'ahalna')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                      productInfo.brand === 'ahalna'
                        ? 'border-rose-700 bg-rose-50 text-rose-950 shadow-xs ring-2 ring-rose-700/20'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-700"></span>
                    Ahalna
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Benämning *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="T.ex. Kubbe Mosel..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">URL-slug</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="T.ex. kubbe-mosel" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2 border-b border-slate-100 pb-3">
              <Package className="w-5 h-5 text-orange-400" /> Förpackningsinformation (Typ)
            </h3>
            
            {/* PÅSE */}
            <div className="space-y-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 font-bold text-orange-900 mb-2"><Package className="w-4 h-4"/> Påse</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Antal / Påse</label>
                  <input type="text" value={productInfo.packaging?.bag?.count || ''} onChange={e => updatePackaging('bag', 'count', e.target.value)} placeholder="T.ex. 10 st á 50 g" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-orange-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vikt / Påse</label>
                  <input type="text" value={productInfo.packaging?.bag?.weight || ''} onChange={e => updatePackaging('bag', 'weight', e.target.value)} placeholder="T.ex. 500 g" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-orange-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Art. nr (Påse)</label>
                  <input type="text" value={productInfo.packaging?.bag?.artNr || ''} onChange={e => updatePackaging('bag', 'artNr', e.target.value)} placeholder="T.ex. 140438" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-orange-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">EAN (Påse)</label>
                  <input type="text" value={productInfo.packaging?.bag?.ean || ''} onChange={e => updatePackaging('bag', 'ean', e.target.value)} placeholder="T.ex. 7350171380438" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-orange-400 shadow-sm" />
                </div>
              </div>
            </div>

            {/* KARTONG */}
            <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 font-bold text-blue-900 mb-2"><Box className="w-4 h-4"/> Kartong</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Antal / Kartong</label>
                  <input type="text" value={productInfo.packaging?.box?.count || ''} onChange={e => updatePackaging('box', 'count', e.target.value)} placeholder="T.ex. 12 st á 500g" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-blue-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vikt / Kartong</label>
                  <input type="text" value={productInfo.packaging?.box?.weight || ''} onChange={e => updatePackaging('box', 'weight', e.target.value)} placeholder="T.ex. 6,0 kg" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-blue-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Art. nr (Kartong)</label>
                  <input type="text" value={productInfo.packaging?.box?.artNr || ''} onChange={e => updatePackaging('box', 'artNr', e.target.value)} placeholder="T.ex. 140438-K" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-blue-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">EAN (Kartong)</label>
                  <input type="text" value={productInfo.packaging?.box?.ean || ''} onChange={e => updatePackaging('box', 'ean', e.target.value)} placeholder="T.ex. 7350171380439" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-blue-400 shadow-sm" />
                </div>
              </div>
            </div>

            {/* PALL */}
            <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-2"><Layers className="w-4 h-4"/> Pall</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Antal / Pall</label>
                  <input type="text" value={productInfo.packaging?.pallet?.count || ''} onChange={e => updatePackaging('pallet', 'count', e.target.value)} placeholder="T.ex. 48 st á 6,0 kg" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-emerald-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vikt / Pall</label>
                  <input type="text" value={productInfo.packaging?.pallet?.weight || ''} onChange={e => updatePackaging('pallet', 'weight', e.target.value)} placeholder="T.ex. 288 kg" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-emerald-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Art. nr (Pall)</label>
                  <input type="text" value={productInfo.packaging?.pallet?.artNr || ''} onChange={e => updatePackaging('pallet', 'artNr', e.target.value)} placeholder="T.ex. 140438-P" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-emerald-400 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">EAN (Pall)</label>
                  <input type="text" value={productInfo.packaging?.pallet?.ean || ''} onChange={e => updatePackaging('pallet', 'ean', e.target.value)} placeholder="T.ex. 7350171380440" className="w-full rounded-lg border border-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-emerald-400 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ACCORDION DATA */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">Beskrivning</h3>
            <RichTextBlock type="text" initialContent={description} onChange={setDescription} onRemove={() => {}} />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">Produktinformation</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tillverkningsland</label>
                <input type="text" value={productInfo.manufacturingCountry} onChange={e => updateProductInfo('manufacturingCountry', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tillagas av</label>
                <input type="text" value={productInfo.manufacturer} onChange={e => updateProductInfo('manufacturer', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Specialanpassningar</label>
                <input type="text" value={productInfo.specialDiets} onChange={e => updateProductInfo('specialDiets', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ledtid</label>
                <input type="text" value={productInfo.leadTime} onChange={e => updateProductInfo('leadTime', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="pt-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Egenskaper (Fritext rader)</label>
              <div className="space-y-2">
                {productInfo.properties.map((prop: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={prop} onChange={e => updateProperty(i, e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
                    <button type="button" onClick={() => removeProperty(i)} className="p-2 text-slate-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                  </div>
                ))}
                <button type="button" onClick={addProperty} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus className="w-3 h-3"/> Lägg till egenskap</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">Näringsvärde</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { key: 'energy', label: 'Energi, 100g' },
                { key: 'fat', label: 'Fett' },
                { key: 'saturatedFat', label: 'Varav mättat' },
                { key: 'carbs', label: 'Kolhydrat' },
                { key: 'sugar', label: 'Varav socker' },
                { key: 'protein', label: 'Protein' },
                { key: 'salt', label: 'Salt' },
              ].map(field => (
                <div key={field.key} className="flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase mb-1">{field.label}</label>
                  <input type="text" value={(nutrition as any)[field.key]} onChange={e => updateNutrition(field.key, e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">Innehållsförteckning</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Deg</label>
                <textarea value={ingredients.dough} onChange={e => updateIngredients('dough', e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Fyllning</label>
                <textarea value={ingredients.filling} onChange={e => updateIngredients('filling', e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Allergener</label>
                <input type="text" value={ingredients.allergens} onChange={e => updateIngredients('allergens', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">Förvaring</h3>
            <textarea value={storage} onChange={e => setStorage(e.target.value)} rows={3} placeholder="Djupfryst vara, förvaras i frys..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 bg-slate-50 focus:outline-none focus:border-blue-500 resize-y" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">Tillagningsanvisningar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Allmän text</label>
                <input type="text" value={cooking.general} onChange={e => updateCooking('general', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Varmluftsugn</label>
                  <textarea value={cooking.oven} onChange={e => updateCooking('oven', e.target.value)} placeholder="225°C, 7-9 min" rows={2} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Airfryer</label>
                  <textarea value={cooking.airfryer} onChange={e => updateCooking('airfryer', e.target.value)} placeholder="200°C, 9-10 min" rows={2} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Stekpanna</label>
                  <textarea value={cooking.pan} onChange={e => updateCooking('pan', e.target.value)} placeholder="8-10 min" rows={2} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
