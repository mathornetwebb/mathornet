'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function PublishButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handlePublish = async () => {
    setLoading(true);
    setStatus('idle');
    setMessage('');
    try {
      const res = await fetch('/api/rebuild', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage('Webbplatsen har publicerats och är uppdaterad live!');
      } else {
        setStatus('error');
        setMessage('Något gick fel vid publicering.');
      }
    } catch (e) {
      setStatus('error');
      setMessage('Nätverksfel vid publicering.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      <button
        onClick={handlePublish}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-emerald-900/10 hover:shadow-lg hover:shadow-emerald-900/15 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>BYGGER & PUBLICERAR...</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-5 h-5" />
            <span>PUBLICERA TILL LIVE</span>
          </>
        )}
      </button>

      {message && (
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg w-full justify-center cms-animate-fade-in ${
            status === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

