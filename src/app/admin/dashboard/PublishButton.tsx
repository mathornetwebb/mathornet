'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export function PublishButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePublish = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/rebuild', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('Sidan har publicerats!');
      } else {
        setMessage('Något gick fel vid publicering.');
      }
    } catch (e) {
      setMessage('Något gick fel vid publicering.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        onClick={handlePublish}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
      >
        <UploadCloud className="w-5 h-5" />
        {loading ? 'Publicerar...' : 'PUBLICERA TILL LIVE'}
      </button>
      {message && <span className="text-xs font-medium text-emerald-600">{message}</span>}
    </div>
  );
}
