'use client';

import { Trash2 } from 'lucide-react';

export default function DeleteButton({ action }: { action: string | ((formData: FormData) => void) }) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm('Är du säker på att du vill radera detta inlägg? Det går inte att ångra.')) {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        formAction={action} 
        onClick={handleClick}
        className="flex items-center gap-2 bg-red-100 text-red-600 hover:text-red-700 hover:bg-red-200 font-medium px-4 py-3 rounded-xl transition-colors shadow-sm"
      >
        <Trash2 className="w-5 h-5" />
        Ta bort inlägg
      </button>
    </div>
  );
}
