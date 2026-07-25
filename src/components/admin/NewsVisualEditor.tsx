'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Image as ImageIcon, Plus, GripVertical, Settings2, Eye, Type, Heading2, Heading3, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import RichTextBlock from './RichTextBlock';
import ImageUpload from './ImageUpload';

export type Block = {
  id: string;
  type: 'h2' | 'h3' | 'text' | 'image';
  content: string;
};

export default function NewsVisualEditor({ 
  initialData, 
  isNew 
}: { 
  initialData: any; 
  isNew: boolean;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  
  // Parse blocks from initialData.content if it's JSON, otherwise just create a text block.
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      if (initialData?.content) {
        const parsed = JSON.parse(initialData.content);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // Not JSON, just normal text
      if (initialData?.content) {
        return [{ id: '1', type: 'text', content: initialData.content }];
      }
    }
    return [{ id: '1', type: 'text', content: '' }];
  });

  const addBlock = (type: Block['type']) => {
    setBlocks([...blocks, { id: Math.random().toString(36).substr(2, 9), type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    setBlocks(newBlocks);
  };

  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    setBlocks(newBlocks);
  };

  // Auto-generate slug from title if new
  useEffect(() => {
    if (isNew && title) {
      let newSlug = title
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      if (!newSlug) newSlug = 'nyhet-' + Date.now();
      setSlug(newSlug);
    }
  }, [title, isNew]);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-screen bg-slate-50 p-6 -m-6 rounded-2xl">
      {/* Hidden inputs for Server Action Form submission */}
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="excerpt" value={excerpt} />
      <input type="hidden" name="featuredImage" value={featuredImage} />
      <input type="hidden" name="seoTitle" value={seoTitle} />
      <input type="hidden" name="metaDescription" value={metaDescription} />
      <input type="hidden" name="content" value={JSON.stringify(blocks)} />

      {/* LEFT SIDEBAR - SETTINGS */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/content/news" className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-lg transition-colors border border-slate-200 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Editor</span>
          </div>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Innehåll</h3>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Huvudtitel *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="T.ex. Ny produktlansering..." 
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Introtext (Ingress)</label>
            <textarea 
              value={excerpt} 
              onChange={e => setExcerpt(e.target.value)} 
              placeholder="En kort och säljande introtext som visas under rubriken..." 
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">URL-Slug</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
            />
          </div>

          <div className="mb-4">
            <ImageUpload 
              value={featuredImage} 
              onChange={setFeaturedImage} 
              label="Huvudbild (Omslag)" 
            />
          </div>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1"><Settings2 className="w-3 h-3"/> SEO Inställningar</h3>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Meta Titel</label>
            <input 
              type="text" 
              value={seoTitle} 
              onChange={e => setSeoTitle(e.target.value)} 
              placeholder="Titel för Google..." 
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Meta Beskrivning</label>
            <textarea 
              value={metaDescription} 
              onChange={e => setMetaDescription(e.target.value)} 
              placeholder="Kort beskrivning för sökresultat..." 
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col">
        {/* Top Action Bar */}
        <div className="sticky top-4 z-50 flex justify-between items-center bg-slate-900 text-white rounded-2xl px-2 py-2 mb-6 shadow-xl shadow-slate-900/10">
          <div className="flex items-center gap-1 px-2">
            <button type="button" onClick={() => addBlock('h2')} className="flex items-center gap-1 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Heading2 className="w-4 h-4 text-slate-400" /> H2 Rubrik
            </button>
            <button type="button" onClick={() => addBlock('h3')} className="flex items-center gap-1 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Heading3 className="w-4 h-4 text-slate-400" /> H3 Rubrik
            </button>
            <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-1 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Type className="w-4 h-4 text-slate-400" /> Text
            </button>
            <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-1 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Bild
            </button>
          </div>
          
          <div className="flex items-center gap-2 pr-2">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-1.5 rounded-lg text-sm font-bold transition-colors">
              <Save className="w-4 h-4" /> Spara Inlägg
            </button>
          </div>
        </div>

        {/* Hero Preview */}
        <div className="relative bg-slate-200 rounded-3xl overflow-hidden mb-12 shadow-2xl aspect-[2/1] flex flex-col justify-center items-center text-center p-12">
          {featuredImage && (
            <img src={featuredImage} alt="Omslag" className="absolute inset-0 w-full h-full object-cover" />
          )}
          
          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white font-outfit mb-4 leading-tight drop-shadow-lg">
              {title || 'Din Huvudtitel'}
            </h1>
            <div className="flex items-center justify-center gap-3 text-white/90 font-medium mb-4 drop-shadow-md">
               <span className="uppercase tracking-wider text-sm">Nyhet</span>
               <span className="text-white/50">|</span>
               <span>{new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow-md">
              {excerpt || 'Din ingress/introtext kommer att visas här med snygg vit färg över bakgrundsbilden.'}
            </p>
          </div>
        </div>

        {/* Blocks Editor */}
        <div className="max-w-3xl mx-auto w-full space-y-6 pb-20">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 ml-2">Innehållsblock</div>
          
          {blocks.map((block, index) => (
            <div key={block.id} className="w-full">
              {block.type === 'image' ? (
                <div className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <div className="absolute -top-3 left-4 flex items-center bg-white border border-slate-200 rounded-lg shadow-sm px-1 py-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">image</span>
                    <div className="w-px h-3 bg-slate-200 mx-1"></div>
                    {index > 0 && (
                      <button type="button" onClick={() => moveBlockUp(index)} className="p-1 text-slate-400 hover:text-blue-600 rounded" title="Flytta upp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                      </button>
                    )}
                    {index < blocks.length - 1 && (
                      <button type="button" onClick={() => moveBlockDown(index)} className="p-1 text-slate-400 hover:text-blue-600 rounded" title="Flytta ner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                    )}
                    <button type="button" onClick={() => removeBlock(block.id)} className="p-1 text-slate-400 hover:text-red-500 rounded ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-4 pt-5">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Bild-URL (https://...)"
                        className="w-full text-sm font-mono text-blue-600 focus:outline-none bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
                      />
                      {block.content && (
                        <div className="relative rounded-xl overflow-hidden mt-2 bg-slate-100 border border-slate-200">
                          <img src={block.content} alt="Block image" className="w-full h-auto max-h-96 object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <RichTextBlock 
                  type={block.type as any} 
                  initialContent={block.content} 
                  onChange={(content) => updateBlock(block.id, content)} 
                  onRemove={() => removeBlock(block.id)} 
                  onMoveUp={index > 0 ? () => moveBlockUp(index) : undefined}
                  onMoveDown={index < blocks.length - 1 ? () => moveBlockDown(index) : undefined}
                />
              )}
            </div>
          ))}

          <button 
            type="button" 
            onClick={() => addBlock('text')}
            className="w-full py-4 mt-8 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-colors border-dashed"
          >
            <Plus className="w-4 h-4" /> Lägg till nytt innehållsblock
          </button>
        </div>
      </div>
    </div>
  );
}
