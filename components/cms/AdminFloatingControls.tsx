'use client';

import { useState } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';

export default function AdminFloatingControls() {
  const { isAdmin, setIsAdmin } = useAdminMode();
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const onLogout = async () => {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAdmin(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <a
        href="/studio-x9"
        className="rounded-full bg-stone-100 text-stone-900 px-4 py-2 text-xs uppercase tracking-wider shadow-lg"
      >
        Dashboard
      </a>
      <button
        type="button"
        onClick={onLogout}
        disabled={loading}
        className="rounded-full bg-stone-800 border border-stone-600 text-stone-100 px-4 py-2 text-xs uppercase tracking-wider shadow-lg disabled:opacity-70"
      >
        {loading ? 'Déconnexion...' : 'Déconnexion'}
      </button>
    </div>
  );
}
