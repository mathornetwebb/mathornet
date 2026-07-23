'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ value, onChange, label = "Huvudbild" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vänligen välj en giltig bildfil.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'Något gick fel vid uppladdningen.');
      }
    } catch (error) {
      console.error(error);
      alert('Ett oväntat fel uppstod vid uppladdningen.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{label}</label>
      
      {value ? (
        <div className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 aspect-video max-h-64 flex items-center justify-center">
          <img 
            src={value.startsWith('http') ? value : `/${value}`} 
            alt="Uppladdad bild" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Byt bild
            </button>
            <button
              onClick={() => onChange('')}
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Ta bort
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-blue-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium">Laddar upp...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-500">
              <div className="w-12 h-12 mb-3 rounded-full bg-white shadow-sm flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-bold text-slate-700 mb-1">Klicka eller dra och släpp en bild här</span>
              <span className="text-xs text-slate-400">PNG, JPG, WEBP, GIF (Max 5MB)</span>
            </div>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && e.target.files[0] && handleUpload(e.target.files[0])} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
